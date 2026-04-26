package com.example.matchforge.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class MatchResult {
    private int overallScore;
    private Map<String, Integer> categoryScores;
    private List<String> matchedSkills;
    private Map<String, List<String>> missingSkills;
    private List<Suggestion> suggestions;
}