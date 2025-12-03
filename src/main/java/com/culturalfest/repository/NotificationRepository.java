package com.culturalfest.repository;

import com.culturalfest.model.Notification;
import com.culturalfest.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByEvent(Event event);
    List<Notification> findByEmail(String email);  // ← ADD THIS
}