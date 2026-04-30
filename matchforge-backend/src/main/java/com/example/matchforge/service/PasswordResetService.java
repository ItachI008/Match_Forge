package com.example.matchforge.service;

import com.example.matchforge.model.PasswordResetToken;
import com.example.matchforge.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepo;

    @Autowired
    private SendGridEmailService emailService;

    @Value("${reset.token.expiry:3600000}")
    private long expiryMillis;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public String generateToken() {
        return UUID.randomUUID().toString();
    }

    @Transactional
    public void storeToken(String email, String token) {
        // Remove any old tokens for this email
        tokenRepo.deleteByEmail(email);
        tokenRepo.save(new PasswordResetToken(token, email,
            Instant.now().plusMillis(expiryMillis)));
    }

    public boolean isValidToken(String token) {
        return tokenRepo.findByToken(token)
                .map(t -> Instant.now().isBefore(t.getExpiry()))
                .orElse(false);
    }

    public String getEmailByToken(String token) {
        return tokenRepo.findByToken(token)
                .map(PasswordResetToken::getEmail)
                .orElse(null);
    }

    @Transactional
    public void deleteToken(String token) {
        tokenRepo.findByToken(token).ifPresent(tokenRepo::delete);
    }

    @Async
    public void sendResetEmail(String email, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String subject = "MatchForge AI - Password Reset";
        String body = "To reset your password, click the link below:\n" +
                      resetUrl + "\n\nThis link expires in 1 hour.";
        emailService.sendEmail(email, subject, body);
    }
}