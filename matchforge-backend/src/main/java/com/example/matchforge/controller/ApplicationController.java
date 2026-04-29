package com.example.matchforge.controller;

import com.example.matchforge.dto.ApplicationResponseDTO;
import com.example.matchforge.model.JobApplication;
import com.example.matchforge.model.User;
import com.example.matchforge.repository.ApplicationRepository;
import com.example.matchforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository appRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping
    public List<ApplicationResponseDTO> getUserApplications(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByEmail(userDetails.getUsername());
        return appRepo.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<JobApplication> addApplication(@RequestBody JobApplication app,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByEmail(userDetails.getUsername());
        app.setUser(user);
        JobApplication saved = appRepo.save(app);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplication> updateStatus(@PathVariable Long id,
                                                       @RequestParam String status,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        JobApplication app = appRepo.findById(id).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();
        if (!app.getUser().getEmail().equals(userDetails.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        app.setStatus(status);
        return ResponseEntity.ok(appRepo.save(app));
    }

    @PutMapping("/{id}/notes")
    public ResponseEntity<JobApplication> updateNotes(@PathVariable Long id,
                                                      @RequestBody Map<String, String> payload,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        JobApplication app = appRepo.findById(id).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();
        if (!app.getUser().getEmail().equals(userDetails.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        app.setNotes(payload.get("notes"));
        return ResponseEntity.ok(appRepo.save(app));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        JobApplication app = appRepo.findById(id).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();
        if (!app.getUser().getEmail().equals(userDetails.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized"));
        }
        appRepo.deleteById(id);
        return ResponseEntity.ok().body(Map.of("message", "Deleted successfully"));
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