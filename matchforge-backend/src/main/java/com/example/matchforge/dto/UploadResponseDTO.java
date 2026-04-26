package com.example.matchforge.dto;

import lombok.Data;
import java.util.List;

@Data
public class UploadResponseDTO {
    private String id;
    private String fileName;
    private List<String> extractedSkills;
    private String message;
}