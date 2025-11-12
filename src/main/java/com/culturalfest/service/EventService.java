package com.culturalfest.service;

import com.culturalfest.model.Event;
import com.culturalfest.model.User;
import com.culturalfest.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    public Event createEvent(Event event, User createdBy) {
        event.setCreatedBy(createdBy);
        return eventRepository.save(event);
    }
    
    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateAsc();
    }
    
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    
    public Optional<Event> getEventByCode(String eventCode) {
        return eventRepository.findByEventCode(eventCode);
    }
    
    public List<Event> getEventsByStatus(String status) {
        return eventRepository.findByStatus(status);
    }
    
    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByEventCategory(category);
    }
    
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByStatusAndEventDateAfter("OPEN", LocalDate.now());
    }
    
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setEventName(eventDetails.getEventName());
        event.setEventDescription(eventDetails.getEventDescription());
        event.setEventCategory(eventDetails.getEventCategory());
        event.setEventType(eventDetails.getEventType());
        event.setEventDate(eventDetails.getEventDate());
        event.setEventStartTime(eventDetails.getEventStartTime());
        event.setVenue(eventDetails.getVenue());
        event.setMaxRegistrations(eventDetails.getMaxRegistrations());
        event.setRegistrationFee(eventDetails.getRegistrationFee());
        event.setRules(eventDetails.getRules());
        event.setCoordinatorName(eventDetails.getCoordinatorName());
        
        return eventRepository.save(event);
    }
    
    public Event updateEventStatus(Long id, String status) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(status);
        return eventRepository.save(event);
    }
    
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
    
    public long getTotalEvents() {
        return eventRepository.count();
    }
}