package com.example.showroom.controller;

import com.example.showroom.dto.ApiResponse;
import com.example.showroom.dto.LoginRequest;
import com.example.showroom.dto.OtpRequest;
import com.example.showroom.dto.RegisterRequest;
import com.example.showroom.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private com.example.showroom.service.EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        ApiResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> sendOtp(@Valid @RequestBody OtpRequest request) {
        ApiResponse response = authService.sendOtp(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@Valid @RequestBody OtpRequest request) {
        ApiResponse response = authService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse> resendOtp(@Valid @RequestBody OtpRequest request) {
        ApiResponse response = authService.resendOtp(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test-email")
    public ResponseEntity<ApiResponse> testEmail(@RequestParam("to") String to) {
        if (to == null || to.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Recipient email parameter 'to' is required", false));
        }
        String cleanTo = to.trim();
        String testOtp = String.valueOf((int) ((Math.random() * 900000) + 100000));
        boolean sent = emailService.sendViaResend(cleanTo, "AutoVault - Resend OTP Test",
                "<div style=\"font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #1a1a2e; color: #fff; border-radius: 12px; text-align: center;\">"
                + "<h1 style=\"color: #e2b714;\">AutoVault Showroom</h1>"
                + "<p style=\"color: #ccc;\">Resend Email API Live Test</p>"
                + "<div style=\"background: rgba(226, 183, 20, 0.15); border: 2px solid #e2b714; border-radius: 10px; padding: 15px; margin: 20px auto; display: inline-block;\">"
                + "<span style=\"color: #e2b714; font-size: 32px; letter-spacing: 8px; font-weight: bold;\">" + testOtp + "</span>"
                + "</div>"
                + "<p style=\"color: #aaa;\">If you received this message, the Resend Email API is configured and functioning 100%.</p>"
                + "</div>");

        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("to", cleanTo);
        data.put("otp", testOtp);
        data.put("provider", "Resend API");
        data.put("sent", sent);

        if (sent) {
            return ResponseEntity.ok(new ApiResponse("Email successfully delivered via Resend API to " + cleanTo, true, data));
        } else {
            return ResponseEntity.status(500).body(new ApiResponse("Resend API delivery failed for " + cleanTo + ". Ensure recipient is allowed or check server logs.", false, data));
        }
    }
}
