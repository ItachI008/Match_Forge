package com.example.matchforge.controller;

import com.example.matchforge.dto.ApplicationResponseDTO;
import com.example.matchforge.model.JobApplication;
import com.example.matchforge.model.User;
import com.example.matchforge.repository.ApplicationRepository;
import com.example.matchforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationRepository appRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping
    public List<ApplicationResponseDTO> getUserApplications(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByEmail(userDetails.getUsername());
        List<JobApplication> apps = appRepo.findByUser(user);
        return apps.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public JobApplication addApplication(@RequestBody JobApplication app,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByEmail(userDetails.getUsername());
        app.setUser(user);
        return appRepo.save(app);
    }

    @PutMapping("/{id}")
    public JobApplication updateStatus(@PathVariable Long id,
                                       @RequestParam String status) {
        JobApplication app = appRepo.findById(id).orElseThrow();
        app.setStatus(status);
        return appRepo.save(app);
    }

    @PutMapping("/{id}/notes")
    public JobApplication updateNotes(@PathVariable Long id,
                                      @RequestBody Map<String, String> payload) {
        JobApplication app = appRepo.findById(id).orElseThrow();
        app.setNotes(payload.get("notes"));
        return appRepo.save(app);
    }

    private ApplicationResponseDTO convertToDTO(JobApplication app) {
        ApplicationResponseDTO dto = new ApplicationResponseDTO();
        dto.setId(app.getId());
        dto.setCompany(app.getCompany());
        dto.setRole(app.getRole());
        dto.setScore(app.getScore());
        dto.setStatus(app.getStatus());
        dto.setAppliedDate(app.getAppliedDate());
        dto.setNotes(app.getNotes());
        return dto;
    }
}