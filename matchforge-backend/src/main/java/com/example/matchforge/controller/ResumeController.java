package com.example.matchforge.controller;

import com.example.matchforge.dto.UploadResponseDTO;
import com.example.matchforge.model.Resume;
import com.example.matchforge.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:3000")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponseDTO> uploadResume(@RequestParam("file") MultipartFile file) throws Exception {
        Resume resume = resumeService.parseResume(file);
        UploadResponseDTO response = new UploadResponseDTO();
        response.setId(resume.getId());
        response.setFileName(resume.getFileName());
        response.setExtractedSkills(resume.getSkills());
        response.setMessage("Resume uploaded and parsed successfully");
        return ResponseEntity.ok(response);
    }
}