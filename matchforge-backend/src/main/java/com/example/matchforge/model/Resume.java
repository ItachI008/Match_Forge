package com.example.matchforge.model;

import lombok.Data;
import java.util.List;

@Data
public class Resume {
    private String id;
    private String fileName;
    private String rawText;
    private List<String> skills;
    private List<String> experienceHighlights;
}