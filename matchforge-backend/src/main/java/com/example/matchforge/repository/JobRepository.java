package com.example.matchforge.repository;

import com.example.matchforge.model.JobDescription;
import org.springframework.stereotype.Repository;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class JobRepository {
    private final ConcurrentHashMap<String, JobDescription> storage = new ConcurrentHashMap<>();

    public void save(JobDescription job) {
        storage.put(job.getId(), job);
    }

    public JobDescription findById(String id) {
        return storage.get(id);
    }

    public void deleteById(String id) {
        storage.remove(id);
    }
}