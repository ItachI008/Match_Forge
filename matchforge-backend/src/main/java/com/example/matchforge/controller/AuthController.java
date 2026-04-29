package com.example.matchforge.controller;

import com.example.matchforge.model.User;
import com.example.matchforge.repository.UserRepository;
import com.example.matchforge.service.OtpService;
import com.example.matchforge.service.PasswordResetService;
import com.example.matchforge.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private OtpService otpService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Valid email is required"));
        }
        if (userRepo.findByEmail(email) != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        String otp = otpService.generateOtp();
        otpService.storeOtp(email, otp);
        otpService.sendOtpEmail(email, otp);
        return ResponseEntity.ok(Map.of("message", "OTP sent to email"));
    }

    @PostMapping("/verify-register")
    public ResponseEntity<?> verifyAndRegister(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String otp = request.get("otp");

        if (email == null || password == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing fields"));
        }
        if (password.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
        }
        if (userRepo.findByEmail(email) != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        if (!otpService.verifyOtp(email, otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));
        }
        User user = userRepo.findByEmail(email);
        if (user == null || !encoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Valid email is required"));
        }
        User user = userRepo.findByEmail(email);
        if (user != null) {
            String token = passwordResetService.generateToken();
            passwordResetService.storeToken(email, token);
            passwordResetService.sendResetEmail(email, token);
        }
        return ResponseEntity.ok(Map.of("message", "If that email is registered, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        if (token == null || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token and a valid new password (min 6 chars) are required"));
        }
        if (!passwordResetService.isValidToken(token)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token"));
        }
        String email = passwordResetService.getEmailByToken(token);
        if (email == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token"));
        }
        User user = userRepo.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);
        passwordResetService.deleteToken(token);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully. Please login."));
    }
}