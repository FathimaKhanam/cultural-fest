package com.culturalfest.repository;

import com.culturalfest.model.Registration;
import com.culturalfest.model.Event;
import com.culturalfest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEvent(Event event);
    List<Registration> findByParticipant(User participant);
    Optional<Registration> findByEventAndParticipant(Event event, User participant);
    List<Registration> findByRegistrationStatus(String status);
    Optional<Registration> findByRegistrationNumber(String registrationNumber);
    long countByEvent(Event event);
    List<Registration> findByEventAndRegistrationStatus(Event event, String status);
}