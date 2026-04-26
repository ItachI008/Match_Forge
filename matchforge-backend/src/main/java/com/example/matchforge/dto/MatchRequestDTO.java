package com.example.matchforge.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class MatchRequestDTO {
    private MultipartFile resume;
    private String jobDescription;
}