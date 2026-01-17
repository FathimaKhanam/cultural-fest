package com.culturalfest.service;

import com.culturalfest.model.Event;

import com.culturalfest.repository.EventRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")  // ← ADD THIS
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Transactional
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    


    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategory(category);
    }
    
    public List<Event> getNewEvents() {
        return eventRepository.findByIsNewTrue();
    }
    
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setName(eventDetails.getName());
        event.setDescription(eventDetails.getDescription());
        event.setCategory(eventDetails.getCategory());
        event.setType(eventDetails.getType());
        event.setMaxParticipants(eventDetails.getMaxParticipants());
        event.setMaxRegistrations(eventDetails.getMaxRegistrations());
        event.setRegistrationFee(eventDetails.getRegistrationFee());
        event.setEventDate(eventDetails.getEventDate());
        event.setEventStartTime(eventDetails.getEventStartTime());
        event.setVenue(eventDetails.getVenue());
        event.setStatus(eventDetails.getStatus());
        
        return eventRepository.save(event);
    }
    

    
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
    
    public Event incrementRegistrations(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setCurrentRegistrations(event.getCurrentRegistrations() + 1);
        return eventRepository.save(event);
    }
    
    public Event decrementRegistrations(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setCurrentRegistrations(Math.max(0, event.getCurrentRegistrations() - 1));
        return eventRepository.save(event);
    }
}