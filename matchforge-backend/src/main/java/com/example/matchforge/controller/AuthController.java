package com.example.matchforge.controller;

import com.example.matchforge.model.User;
import com.example.matchforge.repository.UserRepository;
import com.example.matchforge.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    @Autowired private UserRepository userRepo;
    @Autowired private BCryptPasswordEncoder encoder;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        return Map.of("message", "User registered");
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        User existing = userRepo.findByEmail(user.getEmail());
        if (existing != null && encoder.matches(user.getPassword(), existing.getPassword())) {
            String token = jwtUtil.generateToken(existing.getEmail());
            return Map.of("token", token);
        }
        throw new RuntimeException("Invalid credentials");
    }
}