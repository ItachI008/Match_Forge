package com.example.matchforge.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    
    @Column(length = 2000)
    private String notes;               // <-- new field
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore                         // <-- break recursion
    private User user;
}