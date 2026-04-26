package com.example.matchforge.repository;

import com.example.matchforge.model.Resume;
import org.springframework.stereotype.Repository;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class ResumeRepository {
    private final ConcurrentHashMap<String, Resume> storage = new ConcurrentHashMap<>();

    public void save(Resume resume) {
        storage.put(resume.getId(), resume);
    }

    public Resume findById(String id) {
        return storage.get(id);
    }

    public void deleteById(String id) {
        storage.remove(id);
    }
}