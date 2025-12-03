package com.culturalfest.repository;


import com.culturalfest.model.Winner;
import com.culturalfest.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WinnerRepository extends JpaRepository<Winner, Long> {
    List<Winner> findByEvent(Event event);
    List<Winner> findByEventOrderByPositionAsc(Event event);
}