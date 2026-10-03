package com.example.showroom.service;

import com.example.showroom.dto.ApiResponse;
import com.example.showroom.dto.LoginRequest;
import com.example.showroom.dto.RegisterRequest;
import com.example.showroom.entity.User;
import com.example.showroom.exception.BadRequestException;
import com.example.showroom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    /**
     * Register a new user (email not yet verified).
     */
    public ApiResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent() && existingUser.get().isEmailVerified()) {
                throw new BadRequestException("Email is already registered. Please sign in.");
            }
            // If user exists but not verified, allow re-registration
            User user = existingUser.get();
            user.setName(request.getName().trim());
            user.setPassword(hashPassword(request.getPassword()));
            userRepository.save(user);
        } else {
            // Create new user
            User user = new User();
            user.setName(request.getName().trim());
            user.setEmail(email);
            user.setPassword(hashPassword(request.getPassword()));
            user.setRole("USER");
            user.setEmailVerified(false);
            userRepository.save(user);
        }

        // Generate and send OTP to submitted email
        String otp = otpService.generateOtp(email);
        emailService.sendVerificationOtp(email, otp);

        Map<String, Object> data = new HashMap<>();
        data.put("email", email);
        return new ApiResponse("Registration successful. Verification code sent to " + email, true, data);
    }

    /**
     * Send OTP to an email address.
     */
    public ApiResponse sendOtp(String email) {
        String cleanEmail = email.trim().toLowerCase();
        String otp = otpService.generateOtp(cleanEmail);
        emailService.sendVerificationOtp(cleanEmail, otp);
        Map<String, Object> data = new HashMap<>();
        data.put("email", cleanEmail);
        return new ApiResponse("Verification code sent to " + cleanEmail, true, data);
    }

    /**
     * Verify OTP and mark user's email as verified.
     */
    public ApiResponse verifyOtp(String email, String otp) {
        String cleanEmail = email.trim().toLowerCase();
        boolean valid = otpService.verifyOtp(cleanEmail, otp.trim());
        if (valid) {
            Optional<User> userOpt = userRepository.findByEmail(cleanEmail);
            Map<String, Object> data = new HashMap<>();
            data.put("verified", true);
            data.put("email", cleanEmail);

            User user;
            if (userOpt.isPresent()) {
                user = userOpt.get();
                user.setEmailVerified(true);
                user = userRepository.save(user);
            } else {
                // If user registered or signed in via OTP without pre-existing user record
                user = new User();
                user.setEmail(cleanEmail);
                String defaultName = cleanEmail.contains("@") ? cleanEmail.substring(0, cleanEmail.indexOf('@')) : cleanEmail;
                user.setName(defaultName.substring(0, 1).toUpperCase() + (defaultName.length() > 1 ? defaultName.substring(1) : ""));
                user.setPassword(hashPassword(java.util.UUID.randomUUID().toString()));
                user.setRole("USER");
                user.setEmailVerified(true);
                user = userRepository.save(user);
            }

            data.put("userId", user.getId());
            data.put("id", user.getId());
            data.put("name", user.getName());
            data.put("role", user.getRole());

            // Send welcome email asynchronously so it doesn't block or timeout the HTTP request
            final String recipientEmail = cleanEmail;
            final String recipientName = user.getName();
            java.util.concurrent.CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendWelcomeEmail(recipientEmail, recipientName);
                } catch (Exception ignored) {
                }
            });

            return new ApiResponse("Email verified successfully", true, data);
        }
        throw new BadRequestException("Invalid verification code");
    }

    /**
     * Resend OTP (with cooldown enforced by OtpService).
     */
    public ApiResponse resendOtp(String email) {
        String cleanEmail = email.trim().toLowerCase();
        String otp = otpService.generateOtp(cleanEmail);
        emailService.sendVerificationOtp(cleanEmail, otp);
        Map<String, Object> data = new HashMap<>();
        data.put("email", cleanEmail);
        return new ApiResponse("Verification code resent to " + cleanEmail, true, data);
    }

    /**
     * Login with email and password.
     */
    public ApiResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(cleanEmail);

        if (userOpt.isEmpty()) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userOpt.get();

        // Check password first
        if (!hashPassword(request.getPassword()).equals(user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        // Check email verification - if not verified, generate & send fresh OTP to submitted email!
        if (!user.isEmailVerified()) {
            String otp = otpService.generateOtp(cleanEmail);
            emailService.sendVerificationOtp(cleanEmail, otp);
            Map<String, Object> data = new HashMap<>();
            data.put("verified", false);
            data.put("email", cleanEmail);
            return new ApiResponse("Please verify your email before logging in. A new verification code has been sent to " + cleanEmail, false, data);
        }

        // Login successful
        Map<String, Object> data = new HashMap<>();
        data.put("userId", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        return new ApiResponse("Login successful", true, data);
    }

    /**
     * Admin login with strict ADMIN role enforcement.
     */
    public ApiResponse adminLogin(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userOpt.get();

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new BadRequestException("Access denied. Admin privileges required.");
        }

        if (!hashPassword(request.getPassword()).equals(user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("userId", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        return new ApiResponse("Admin login successful", true, data);
    }

    /**
     * Hash password using SHA-256.
     * Note: For a production app, use BCrypt. SHA-256 is simpler for a Sem 3 project.
     */
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
