package com.culturalfest.service;

import com.culturalfest.model.Registration;
import com.culturalfest.model.Event;
import com.culturalfest.model.User;
import com.culturalfest.repository.RegistrationRepository;
import com.culturalfest.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class RegistrationService {
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Transactional
    public Registration registerForEvent(Event event, User participant, Registration registration) {
        // Check if already registered
        Optional<Registration> existing = registrationRepository.findByEventAndParticipant(event, participant);
        if (existing.isPresent()) {
            throw new RuntimeException("Already registered for this event!");
        }
        
        // Check if event is open for registration
        if (!event.isRegistrationOpen()) {
            throw new RuntimeException("Registration is not open for this event!");
        }
        
        // Check if event is full
        if (event.getRemainingSlots() <= 0) {
            throw new RuntimeException("Event is full!");
        }
        
        registration.setEvent(event);
        registration.setParticipant(participant);
        registration.setPaymentAmount(event.getRegistrationFee());
        
        // Save registration
        Registration saved = registrationRepository.save(registration);
        
        // Increment event registration count
        event.incrementRegistrationCount();
        eventRepository.save(event);
        
        return saved;
    }
    
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }
    
    public Optional<Registration> getRegistrationById(Long id) {
        return registrationRepository.findById(id);
    }
    
    public List<Registration> getRegistrationsByEvent(Event event) {
        return registrationRepository.findByEvent(event);
    }
    
    public List<Registration> getRegistrationsByParticipant(User participant) {
        return registrationRepository.findByParticipant(participant);
    }
    
    public List<Registration> getRegistrationsByStatus(String status) {
        return registrationRepository.findByRegistrationStatus(status);
    }
    
    @Transactional
    public Registration approveRegistration(Long id, User approver) {
        Registration registration = registrationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registration.setRegistrationStatus("APPROVED");
        registration.setApprovedBy(approver);
        registration.setApprovalDate(LocalDateTime.now());
        
        return registrationRepository.save(registration);
    }
    
    @Transactional
    public Registration rejectRegistration(Long id, String reason) {
        Registration registration = registrationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registration.setRegistrationStatus("REJECTED");
        registration.setNotes(reason);
        
        // Decrement event count
        Event event = registration.getEvent();
        event.setCurrentRegistrations(event.getCurrentRegistrations() - 1);
        eventRepository.save(event);
        
        return registrationRepository.save(registration);
    }
    
    @Transactional
    public Registration checkInParticipant(Long id) {
        Registration registration = registrationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registration.setCheckedIn(true);
        registration.setCheckInTime(LocalDateTime.now());
        
        return registrationRepository.save(registration);
    }
    
    public long getTotalRegistrations() {
        return registrationRepository.count();
    }
    
    public long getApprovedRegistrationsCount() {
        return registrationRepository.findByRegistrationStatus("APPROVED").size();
    }
}