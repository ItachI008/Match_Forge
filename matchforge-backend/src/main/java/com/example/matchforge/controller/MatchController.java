package com.example.matchforge.controller;

import com.example.matchforge.dto.MatchResponseDTO;
import com.example.matchforge.model.JobDescription;
import com.example.matchforge.model.MatchResult;
import com.example.matchforge.model.Resume;
import com.example.matchforge.service.JobDescriptionService;
import com.example.matchforge.service.MatchService;
import com.example.matchforge.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "http://localhost:3000")
public class MatchController {

    @Autowired
    private ResumeService resumeService;
    @Autowired
    private JobDescriptionService jobDescService;
    @Autowired
    private MatchService matchService;

    @PostMapping("/analyze")
    public ResponseEntity<MatchResponseDTO> analyze(
            @RequestParam("resume") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescriptionText) throws Exception {

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
    }
}