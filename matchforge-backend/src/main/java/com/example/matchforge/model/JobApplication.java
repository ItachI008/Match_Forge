package com.example.matchforge.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String company;
    private String role;
    private int score;
    private String status;
    private LocalDate appliedDate;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}