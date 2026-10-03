package com.example.showroom.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${resend.from.email:AutoVault <onboarding@resend.dev>}")
    private String resendFromEmail;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Autowired(required = false)
    private ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /**
     * Send OTP verification email.
     * Tries Resend API first (if configured), then SMTP, then console log fallback.
     */
    public void sendVerificationOtp(String toEmail, String otp) {
        String subject = "Automobile Showroom - Email Verification";
        String htmlContent = buildOtpEmailTemplate(otp);

        // Always log OTP to console in dev/test environment
        logOtpToConsole(toEmail, otp);

        // 1. Priority: Resend REST API
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            boolean sent = sendViaResend(toEmail, subject, htmlContent);
            if (sent) {
                logger.info("Verification OTP sent via Resend API to: {}", toEmail);
                return;
            } else {
                logger.warn("Resend API delivery failed for {}. Trying fallback.", toEmail);
            }
        }

        // 2. Fallback: SMTP JavaMailSender
        if (mailSender != null && fromEmail != null && !fromEmail.isBlank()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(message);
                logger.info("Verification OTP sent via SMTP to: {}", toEmail);
                return;
            } catch (Exception e) {
                logger.error("Failed to send email via SMTP to {}: {}", toEmail, e.getMessage(), e);
            }
        }

        // 3. Fallback: Console log (ensures dev testing is never blocked)
        logger.warn("Email service falling back to console logging for OTP.");
        logOtpToConsole(toEmail, otp);
    }

    /**
     * Send welcome email after successful verification.
     */
    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to Automobile Showroom!";
        String htmlContent = buildWelcomeEmailTemplate(name);

        if (resendApiKey != null && !resendApiKey.isBlank()) {
            boolean sent = sendViaResend(toEmail, subject, htmlContent);
            if (sent) {
                logger.info("Welcome email sent via Resend API to: {}", toEmail);
                return;
            }
        }

        if (mailSender != null && fromEmail != null && !fromEmail.isBlank()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(message);
                logger.info("Welcome email sent via SMTP to: {}", toEmail);
            } catch (Exception e) {
                logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage(), e);
            }
        }
    }

    /**
     * Sends an email via Resend's REST API.
     */
    public boolean sendViaResend(String toEmail, String subject, String htmlContent) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            logger.warn("Resend API key is not configured.");
            return false;
        }

        try {
            ObjectMapper mapper = (this.objectMapper != null) ? this.objectMapper : new ObjectMapper();
            Map<String, Object> payload = new HashMap<>();
            payload.put("from", resendFromEmail);
            payload.put("to", Collections.singletonList(toEmail));
            payload.put("subject", subject);
            payload.put("html", htmlContent);

            String jsonPayload = mapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("Resend API delivery success for {}! Status: {}, Response: {}",
                        toEmail, response.statusCode(), response.body());
                return true;
            } else {
                logger.error("Resend API failed for {} with status {}: {}",
                        toEmail, response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            logger.error("Exception calling Resend API for {}: {}", toEmail, e.getMessage(), e);
            return false;
        }
    }

    private void logOtpToConsole(String email, String otp) {
        logger.info("\n" +
                "=========================================================\n" +
                "  🔑 EMAIL VERIFICATION OTP (Development / Test Mode)\n" +
                "  To: {}\n" +
                "  OTP CODE: >>> {} <<<\n" +
                "  Expires in: 5 minutes\n" +
                "=========================================================", email, otp);
    }

    private String buildOtpEmailTemplate(String otp) {
        return """
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%%, #16213e 100%%); border-radius: 16px; padding: 40px; text-align: center;">
                    <h1 style="color: #e2b714; font-size: 24px; margin-bottom: 8px;">Automobile Showroom</h1>
                    <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">Email Verification</p>
                    <p style="color: #ffffff; font-size: 16px; margin-bottom: 24px;">Your verification code is:</p>
                    <div style="background: rgba(226, 183, 20, 0.1); border: 2px solid #e2b714; border-radius: 12px; padding: 20px; margin: 0 auto 24px; display: inline-block;">
                        <span style="color: #e2b714; font-size: 36px; font-weight: bold; letter-spacing: 12px;">%s</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">This code expires in <strong style="color: #ffffff;">5 minutes</strong>.</p>
                    <p style="color: #64748b; font-size: 12px; margin-top: 32px;">If you did not request this code, please ignore this email.</p>
                </div>
            </div>
            """.formatted(otp);
    }

    private String buildWelcomeEmailTemplate(String name) {
        return """
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%%, #16213e 100%%); border-radius: 16px; padding: 40px; text-align: center;">
                    <h1 style="color: #e2b714; font-size: 24px; margin-bottom: 8px;">Automobile Showroom</h1>
                    <p style="color: #ffffff; font-size: 18px; margin-bottom: 16px;">Welcome, %s!</p>
                    <p style="color: #94a3b8; font-size: 14px;">Your email has been verified successfully. You can now log in and explore our premium collection of vehicles.</p>
                </div>
            </div>
            """.formatted(name);
    }
}
