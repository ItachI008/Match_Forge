package com.example.matchforge.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private SendGridEmailService emailService;

    @Value("${otp.expiry}")
    private long expiryMillis;

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    private static class OtpData {
        String otp;
        Instant expiry;

        OtpData(String otp, Instant expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }

    public String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    @Async
    public void sendOtpEmail(String email, String otp) {
        String subject = "MatchForge AI - Email Verification OTP";
        String body = "Your OTP for registration is: " + otp +
                      "\n\nIt will expire in 5 minutes.";
        emailService.sendEmail(email, subject, body);
    }

    public void storeOtp(String email, String otp) {
        otpStore.put(email, new OtpData(otp, Instant.now().plusMillis(expiryMillis)));
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData data = otpStore.get(email);
        if (data == null) return false;
        if (Instant.now().isAfter(data.expiry)) {
            otpStore.remove(email);
            return false;
        }
        boolean valid = data.otp.equals(otp);
        if (valid) {
            otpStore.remove(email); // one-time use
        }
        return valid;
    }

    // Clean up expired OTPs every 10 minutes
    @Scheduled(fixedRate = 600000)
    public void cleanExpiredOtps() {
        otpStore.entrySet().removeIf(entry ->
            Instant.now().isAfter(entry.getValue().expiry));
    }
}