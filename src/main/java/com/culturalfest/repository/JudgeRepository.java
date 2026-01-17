package com.culturalfest.repository;

import com.culturalfest.model.Judge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JudgeRepository extends JpaRepository<Judge, Long> {
    
    // Find all judges assigned to a specific event
    List<Judge> findByEventId(Long eventId);
    
    // Find all events assigned to a specific judge (by user ID)
    List<Judge> findByUserId(Long userId);
    
    // Check if a judge is already assigned to an event
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    
    // Find assignment by user and event
    Judge findByUserIdAndEventId(Long userId, Long eventId);
}