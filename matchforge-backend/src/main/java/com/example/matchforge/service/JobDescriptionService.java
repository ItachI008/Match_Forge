package com.example.matchforge.service;

import com.example.matchforge.model.JobDescription;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class JobDescriptionService {

    public JobDescription parseJobDescription(String rawText) {
        JobDescription jd = new JobDescription();
        jd.setId(UUID.randomUUID().toString());
        jd.setRawText(rawText);
        jd.setTitle("Senior Software Engineer");
        jd.setCompany("Stripe");
        jd.setRequiredSkills(Arrays.asList("Kafka", "Kubernetes", "Python", "Microservices", "PostgreSQL"));
        jd.setNiceToHaveSkills(Arrays.asList("gRPC", "Terraform"));
        return jd;
    }
}