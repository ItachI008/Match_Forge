package com.example.matchforge.repository;

import com.example.matchforge.model.JobApplication;
import com.example.matchforge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUser(User user);
}