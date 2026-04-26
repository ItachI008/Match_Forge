package com.example.matchforge.service;

import com.example.matchforge.model.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class MatchService {

    @Autowired
    private GroqService groqService;

    public MatchResult calculateMatch(Resume resume, JobDescription jobDesc) {
        String prompt = buildPrompt(resume, jobDesc);
        String aiResponse = groqService.chat(prompt);
        return parseAiResponse(aiResponse);
    }

    private String buildPrompt(Resume resume, JobDescription jobDesc) {
        return """
                You are an expert resume–job matcher. Analyze the following resume and job description.

                Resume text:
                """ + resume.getRawText() + """
                
                Job description:
                """ + jobDesc.getRawText() + """
                
                Output **only** a valid JSON object with this exact structure, no extra text, no markdown formatting:
                {
                  "overallScore": <0-100>,
                  "categoryScores": { "skills": <0-100>, "experience": <0-100>, "keywords": <0-100>, "projects": <0-100> },
                  "matchedSkills": ["skill1", "skill2"],
                  "missingSkills": { "critical": ["skill"], "niceToHave": ["skill"], "bonus": ["skill"] },
                  "suggestions": [
                    { "id": "1", "title": "...", "description": "...", "priority": "critical|high|recommended" }
                  ]
                }
                """;
    }

    private MatchResult parseAiResponse(String rawResponse) {
        try {
            // Clean the response: remove markdown code fences (```json ... ```)
            String cleaned = rawResponse.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7); // remove ```json
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3); // remove ```
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(cleaned);

            MatchResult result = new MatchResult();
            result.setOverallScore(root.path("overallScore").asInt());

            Map<String, Integer> categoryScores = new HashMap<>();
            JsonNode cat = root.path("categoryScores");
            categoryScores.put("skills", cat.path("skills").asInt());
            categoryScores.put("experience", cat.path("experience").asInt());
            categoryScores.put("keywords", cat.path("keywords").asInt());
            categoryScores.put("projects", cat.path("projects").asInt());
            result.setCategoryScores(categoryScores);

            List<String> matched = new ArrayList<>();
            root.path("matchedSkills").forEach(node -> matched.add(node.asText()));
            result.setMatchedSkills(matched);

            Map<String, List<String>> missing = new HashMap<>();
            missing.put("critical", listFromJson(root.path("missingSkills").path("critical")));
            missing.put("niceToHave", listFromJson(root.path("missingSkills").path("niceToHave")));
            missing.put("bonus", listFromJson(root.path("missingSkills").path("bonus")));
            result.setMissingSkills(missing);

            List<Suggestion> suggestions = new ArrayList<>();
            root.path("suggestions").forEach(node -> {
                Suggestion s = new Suggestion();
                s.setId(node.path("id").asText());
                s.setTitle(node.path("title").asText());
                s.setDescription(node.path("description").asText());
                s.setPriority(node.path("priority").asText());
                suggestions.add(s);
            });
            result.setSuggestions(suggestions);

            return result;
        } catch (Exception e) {
            // Log the raw response for debugging
            System.err.println("Failed to parse AI response. Raw response: " + rawResponse);
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }

    private List<String> listFromJson(JsonNode node) {
        List<String> list = new ArrayList<>();
        node.forEach(n -> list.add(n.asText()));
        return list;
    }
}