package com.culturalfest.service;

import com.culturalfest.model.Registration;
import com.culturalfest.model.User;
import com.culturalfest.model.Event;

import com.culturalfest.repository.RegistrationRepository;
import com.culturalfest.repository.UserRepository;
import com.culturalfest.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


@Service
@SuppressWarnings("null")  // ← ADD THIS
public class RegistrationService {
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventService eventService;
    
    @Transactional
    public Registration registerForEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (registrationRepository.existsByUserAndEvent(user, event)) {
            throw new RuntimeException("Already registered for this event");
        }
        
        if (event.getCurrentRegistrations() >= event.getMaxRegistrations()) {
            throw new RuntimeException("Event is full");
        }
        
        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setParticipantName(user.getName());
        registration.setStatus(Registration.RegistrationStatus.REGISTERED);
        
        eventService.incrementRegistrations(eventId);
        
        return registrationRepository.save(registration);
    }
    
    @Transactional
    public void cancelRegistration(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registration.setStatus(Registration.RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);
        
        eventService.decrementRegistrations(registration.getEvent().getId());
    }
    
    public List<Registration> getUserRegistrations(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return registrationRepository.findByUser(user);
    }
    
    public List<Registration> getEventRegistrations(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        return registrationRepository.findByEvent(event);
    }
    
    public Registration updateScore(Long registrationId, Double score) {
        Registration registration = registrationRepository.findById(registrationId)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registration.setScore(score);
        return registrationRepository.save(registration);
    }
    
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }
}