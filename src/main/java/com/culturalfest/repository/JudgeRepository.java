package com.culturalfest.repository;

import com.culturalfest.model.Judge;
import com.culturalfest.model.Event;
import com.culturalfest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JudgeRepository extends JpaRepository<Judge, Long> {
    List<Judge> findByEvent(Event event);
    List<Judge> findByUser(User user);
    boolean existsByUserAndEvent(User user, Event event);  // ← ADD THIS
}