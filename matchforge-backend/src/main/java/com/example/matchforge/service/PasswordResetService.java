package com.example.matchforge.service;

import com.example.matchforge.model.PasswordResetToken;
import com.example.matchforge.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepo;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${reset.token.expiry:3600000}") // 1 hour default
    private long expiryMillis;

    public String generateToken() {
        return UUID.randomUUID().toString();
    }

    public void storeToken(String email, String token) {
        // remove any old tokens for this email
        tokenRepo.deleteByEmail(email);
        tokenRepo.save(new PasswordResetToken(token, email, Instant.now().plusMillis(expiryMillis)));
    }

    public boolean isValidToken(String token) {
        return tokenRepo.findByToken(token)
                .map(t -> Instant.now().isBefore(t.getExpiry()))
                .orElse(false);
    }

    public String getEmailByToken(String token) {
        return tokenRepo.findByToken(token).map(PasswordResetToken::getEmail).orElse(null);
    }

    public void deleteToken(String token) {
        tokenRepo.findByToken(token).ifPresent(tokenRepo::delete);
    }

    @Async
    public void sendResetEmail(String email, String token) {
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setFrom(fromEmail);
        message.setSubject("MatchForge AI - Password Reset");
        message.setText("To reset your password, click the link below:\n" + resetUrl + "\n\nThis link expires in 1 hour.");
        mailSender.send(message);
    }
}