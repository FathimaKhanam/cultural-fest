package com.culturalfest.repository;

import com.culturalfest.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByEventCode(String eventCode);
    List<Event> findByStatus(String status);
    List<Event> findByEventCategory(String eventCategory);
    List<Event> findByEventDateBetween(LocalDate startDate, LocalDate endDate);
    List<Event> findByStatusAndEventDateAfter(String status, LocalDate date);
    List<Event> findAllByOrderByEventDateAsc();
}