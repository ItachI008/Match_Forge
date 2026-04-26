package com.example.matchforge.model;

import lombok.Data;
import java.util.List;

@Data
public class SkillSet {
    private List<String> matched;
    private List<String> missingCritical;
    private List<String> missingNiceToHave;
    private List<String> bonusSkills;
}