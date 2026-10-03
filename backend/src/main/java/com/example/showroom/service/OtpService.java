package com.example.showroom.service;

import com.example.showroom.entity.EmailOtp;
import com.example.showroom.exception.OtpException;
import com.example.showroom.repository.EmailOtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    @Autowired
    private EmailOtpRepository otpRepository;

    @Value("${app.otp.expiry-minutes:5}")
    private int expiryMinutes;

    @Value("${app.otp.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.otp.resend-cooldown-seconds:45}")
    private int resendCooldownSeconds;

    @Value("${app.otp.max-daily-requests:10}")
    private int maxDailyRequests;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generate a 6-digit OTP, hash it, store in DB, return the plain OTP
     * (so it can be emailed). Never return OTP in API response.
     */
    public String generateOtp(String email) {
        // Rate limiting: check daily limit
        long recentCount = otpRepository.countRecentOtpsByEmail(
                email, LocalDateTime.now().minusHours(24));
        if (recentCount >= maxDailyRequests) {
            throw new OtpException("Too many OTP requests. Please try again later.");
        }

        // Cooldown check
        Optional<EmailOtp> lastOtp = otpRepository
                .findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email);
        if (lastOtp.isPresent()) {
            LocalDateTime cooldownEnd = lastOtp.get().getCreatedAt()
                    .plusSeconds(resendCooldownSeconds);
            if (LocalDateTime.now().isBefore(cooldownEnd)) {
                throw new OtpException("Please wait before requesting another code.");
            }
            // Mark old OTP as used
            EmailOtp old = lastOtp.get();
            old.setUsed(true);
            otpRepository.save(old);
        }

        // Generate secure 6-digit OTP
        String otp = String.format("%06d", secureRandom.nextInt(1000000));

        // Store hashed OTP in database
        EmailOtp emailOtp = new EmailOtp();
        emailOtp.setEmail(email);
        emailOtp.setOtpHash(hashOtp(otp));
        emailOtp.setCreatedAt(LocalDateTime.now());
        emailOtp.setExpiresAt(LocalDateTime.now().plusMinutes(expiryMinutes));
        emailOtp.setAttemptCount(0);
        emailOtp.setVerified(false);
        emailOtp.setUsed(false);
        otpRepository.save(emailOtp);

        return otp; // Return plain OTP only for email sending
    }

    /**
     * Verify an OTP entered by the user.
     */
    public boolean verifyOtp(String email, String inputOtp) {
        Optional<EmailOtp> optionalOtp = otpRepository
                .findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email);

        if (optionalOtp.isEmpty()) {
            throw new OtpException("No verification code found. Please request a new one.");
        }

        EmailOtp emailOtp = optionalOtp.get();

        // Check if expired
        if (LocalDateTime.now().isAfter(emailOtp.getExpiresAt())) {
            emailOtp.setUsed(true);
            otpRepository.save(emailOtp);
            throw new OtpException("Verification code has expired. Please request a new one.");
        }

        // Check attempt limit
        if (emailOtp.getAttemptCount() >= maxAttempts) {
            emailOtp.setUsed(true);
            otpRepository.save(emailOtp);
            throw new OtpException("Too many failed attempts. Please request a new code.");
        }

        // Increment attempt count
        emailOtp.setAttemptCount(emailOtp.getAttemptCount() + 1);

        // Verify hash
        if (hashOtp(inputOtp).equals(emailOtp.getOtpHash())) {
            emailOtp.setVerified(true);
            emailOtp.setUsed(true);
            otpRepository.save(emailOtp);
            return true;
        }

        otpRepository.save(emailOtp);
        return false;
    }

    /**
     * Hash OTP using SHA-256 for secure storage.
     */
    private String hashOtp(String otp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otp.getBytes(StandardCharsets.UTF_8));
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
