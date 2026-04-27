package com.example.matchforge.controller;

import com.example.matchforge.service.GroqService;
import com.example.matchforge.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
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

    // Endpoint for follow‑up questions
    @PostMapping("/advice")
    public Map<String, String> getAdvice(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String advice = groqService.chat(prompt);
        return Map.of("advice", advice);
    }

    // Endpoint for initial suggestions
    @PostMapping("/suggestions")
    public Map<String, String> getResumeSuggestions(
            @RequestParam("resume") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescription) throws Exception {

        String resumeText = resumeService.parseResume(resumeFile).getRawText();
        String prompt = buildImprovementPrompt(resumeText, jobDescription);
        String advice = groqService.chat(prompt);
        return Map.of("advice", advice);
    }

    private String buildImprovementPrompt(String resumeText, String jobDescription) {
        return """
You are an expert resume coach. Based on the job description below and the user's resume, give specific, actionable advice to improve their resume.

Job Description:
""" + jobDescription + """

User's Resume:
""" + (resumeText.length() > 4000 ? resumeText.substring(0, 4000) : resumeText) + """

Output 3-5 bullet points that tell the user exactly what to change in their resume. Focus on:
- Missing keywords or skills
- Weak phrasing that could be stronger
- Missing quantifiable achievements
- ATS optimization

Keep each bullet concise and practical.
""";
    }
}