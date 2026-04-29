package com.example.matchforge.controller;

import com.example.matchforge.model.JobDescription;
import com.example.matchforge.service.JobDescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobDescriptionService jobDescriptionService;

    @PostMapping("/parse")
    public ResponseEntity<JobDescription> parseJobDescription(@RequestBody String rawText) {
        JobDescription jd = jobDescriptionService.parseJobDescription(rawText);
        return ResponseEntity.ok(jd);
    }
}