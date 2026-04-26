package com.example.matchforge.model;

import lombok.Data;
import java.util.List;

@Data
public class JobDescription {
    private String id;
    private String title;
    private String company;
    private String rawText;
    private List<String> requiredSkills;
    private List<String> niceToHaveSkills;
}