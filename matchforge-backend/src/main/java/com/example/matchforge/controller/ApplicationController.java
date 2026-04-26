package com.example.matchforge.controller;

import com.example.matchforge.model.JobApplication;
import com.example.matchforge.model.User;
import com.example.matchforge.repository.ApplicationRepository;
import com.example.matchforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin
public class ApplicationController {
    @Autowired private ApplicationRepository appRepo;
    @Autowired private UserRepository userRepo;

    @GetMapping
    public List<JobApplication> getUserApplications(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByEmail(userDetails.getUsername());
        return appRepo.findByUser(user);
    }

    @PostMapping
    public JobApplication addApplication(@RequestBody JobApplication app, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByEmail(userDetails.getUsername());
        app.setUser(user);
        return appRepo.save(app);
    }

    @PutMapping("/{id}")
    public JobApplication updateStatus(@PathVariable Long id, @RequestParam String status) {
        JobApplication app = appRepo.findById(id).orElseThrow();
        app.setStatus(status);
        return appRepo.save(app);
    }
}