package com.example.matchforge.controller;

import com.example.matchforge.service.GroqService;
import com.example.matchforge.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private GroqService groqService;

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/advice")
    public ResponseEntity<Map<String, String>> getAdvice(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        if (prompt == null || prompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }
        try {
            String advice = groqService.chat(prompt);
            return ResponseEntity.ok(Map.of("advice", advice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "AI service unavailable"));
        }
    }

    @PostMapping("/suggestions")
    public ResponseEntity<Map<String, String>> getResumeSuggestions(
            @RequestParam("resume") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescription) {
        if (resumeFile.isEmpty() || jobDescription.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Resume file and job description are required"));
        }
        try {
            String resumeText = resumeService.parseResume(resumeFile).getRawText();
            String prompt = buildImprovementPrompt(resumeText, jobDescription);
            String advice = groqService.chat(prompt);
            return ResponseEntity.ok(Map.of("advice", advice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate suggestions"));
        }
    }

    private String buildImprovementPrompt(String resumeText, String jobDescription) {
        return """
You are an expert resume coach. Based on the job description below and the user's resume, give specific, actionable advice to improve their resume.

Job Description:
""" + jobDescription + """

User's Resume:
""" + (resumeText.length() > 4000 ? resumeText.substring(0, 4000) : resumeText) + """

Output 3-5 bullet points as plain text lines, each starting with a dash "- " (no asterisks, no markdown). Focus on:
- Missing keywords or skills
- Weak phrasing that could be stronger
- Missing quantifiable achievements
- ATS optimization

Keep each bullet concise and practical.
""";
    }
}