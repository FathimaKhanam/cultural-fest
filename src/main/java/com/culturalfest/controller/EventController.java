package com.culturalfest.controller;

import com.culturalfest.model.Event;
import com.culturalfest.model.User;
import com.culturalfest.service.EventService;
import com.culturalfest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event, @RequestParam Long createdById) {
        try {
            User creator = userService.getUserById(createdById)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Event created = eventService.createEvent(event, creator);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Event created successfully!",
                "event", created
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<?> getEventByCode(@PathVariable String code) {
        return eventService.getEventByCode(code)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Event>> getEventsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(eventService.getEventsByStatus(status));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Event>> getEventsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(eventService.getEventsByCategory(category));
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        try {
            Event updated = eventService.updateEvent(id, event);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Event updated successfully!",
                "event", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateEventStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Event updated = eventService.updateEventStatus(id, status);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Event status updated!",
                "event", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Event deleted successfully!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getEventStats() {
        return ResponseEntity.ok(Map.of(
            "totalEvents", eventService.getTotalEvents(),
            "upcomingEvents", eventService.getUpcomingEvents().size(),
            "openEvents", eventService.getEventsByStatus("OPEN").size()
        ));
    }
}