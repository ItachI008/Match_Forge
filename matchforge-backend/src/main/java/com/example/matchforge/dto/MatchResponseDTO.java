package com.example.matchforge.dto;

import lombok.Data;
import com.example.matchforge.model.Suggestion;
import java.util.List;
import java.util.Map;

@Data
public class MatchResponseDTO {
    private int score;
    private Map<String, Integer> breakdown;
    private List<String> matchedSkills;
    private Map<String, List<String>> missingSkills;
    private List<Suggestion> suggestions;
}