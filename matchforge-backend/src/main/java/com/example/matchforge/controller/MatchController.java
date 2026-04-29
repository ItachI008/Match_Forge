package com.example.matchforge.controller;

import com.example.matchforge.dto.MatchResponseDTO;
import com.example.matchforge.model.JobDescription;
import com.example.matchforge.model.MatchResult;
import com.example.matchforge.model.Resume;
import com.example.matchforge.service.JobDescriptionService;
import com.example.matchforge.service.MatchService;
import com.example.matchforge.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map; 

@RestController
@RequestMapping("/api/match")
public class MatchController {

    @Autowired
    private ResumeService resumeService;
    @Autowired
    private JobDescriptionService jobDescService;
    @Autowired
    private MatchService matchService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(
            @RequestParam("resume") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescriptionText) {
        if (resumeFile.isEmpty() || jobDescriptionText.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Resume file and job description are required"));
        }
        try {
            Resume resume = resumeService.parseResume(resumeFile);
            JobDescription jobDesc = jobDescService.parseJobDescription(jobDescriptionText);
            MatchResult matchResult = matchService.calculateMatch(resume, jobDesc);

            MatchResponseDTO response = new MatchResponseDTO();
            response.setScore(matchResult.getOverallScore());
            response.setBreakdown(matchResult.getCategoryScores());
            response.setMatchedSkills(matchResult.getMatchedSkills());
            response.setMissingSkills(matchResult.getMissingSkills());
            response.setSuggestions(matchResult.getSuggestions());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Analysis failed: " + e.getMessage()));
        }
    }
}