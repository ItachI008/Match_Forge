package com.example.matchforge.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ApplicationResponseDTO {
    private Long id;
    private String company;
    private String role;
    private int score;
    private String status;
    private LocalDate appliedDate;
    private String notes;
}