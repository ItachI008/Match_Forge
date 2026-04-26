package com.example.matchforge.service;

import com.example.matchforge.model.Resume;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private final Tika tika = new Tika();

    public Resume parseResume(MultipartFile file) throws IOException, TikaException {
        String text = tika.parseToString(file.getInputStream());
        List<String> skills = extractSkills(text);
        Resume resume = new Resume();
        resume.setId(UUID.randomUUID().toString());
        resume.setFileName(file.getOriginalFilename());
        resume.setRawText(text);
        resume.setSkills(skills);
        resume.setExperienceHighlights(List.of("Built microservices", "Optimized database queries"));
        return resume;
    }

    private List<String> extractSkills(String text) {
        String lower = text.toLowerCase();
        List<String> allSkills = Arrays.asList("python", "java", "spring boot", "react", "aws", "docker", "kubernetes", "kafka", "postgresql", "rest api");
        return allSkills.stream()
                .filter(skill -> lower.contains(skill.toLowerCase()))
                .toList();
    }
}