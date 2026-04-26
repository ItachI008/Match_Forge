package com.example.matchforge.service;

import com.example.matchforge.model.Resume;
import com.example.matchforge.model.JobDescription;
import com.example.matchforge.model.Suggestion;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AISuggestionsService {

    @Autowired
    private GroqService groqService;

    public List<Suggestion> generateSuggestions(Resume resume, JobDescription jobDesc) {
        String prompt = buildPrompt(resume, jobDesc);
        String aiResponse = groqService.chat(prompt);
        return parseSuggestions(aiResponse);
    }

    private String buildPrompt(Resume resume, JobDescription jobDesc) {
        return """
                You are an expert career coach. Based on the following resume and job description, generate 3-5 actionable suggestions to improve the resume's match.

                Resume:
                """ + resume.getRawText() + """
                
                Job Description:
                """ + jobDesc.getRawText() + """
                
                Output ONLY a valid JSON array with this exact structure, no extra text:
                [
                  {
                    "id": "1",
                    "title": "Short title",
                    "description": "Detailed suggestion",
                    "priority": "critical|high|recommended"
                  }
                ]
                """;
    }

    private List<Suggestion> parseSuggestions(String json) {
        List<Suggestion> suggestions = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);
            if (root.isArray()) {
                for (JsonNode node : root) {
                    Suggestion s = new Suggestion();
                    s.setId(node.path("id").asText());
                    s.setTitle(node.path("title").asText());
                    s.setDescription(node.path("description").asText());
                    s.setPriority(node.path("priority").asText());
                    suggestions.add(s);
                }
            }
        } catch (Exception e) {
            // Fallback to a safe default
            suggestions.add(createFallbackSuggestion());
        }
        return suggestions;
    }

    private Suggestion createFallbackSuggestion() {
        Suggestion s = new Suggestion();
        s.setId("fallback");
        s.setTitle("AI suggestion unavailable");
        s.setDescription("Could not generate AI suggestions. Check backend logs.");
        s.setPriority("recommended");
        return s;
    }
}