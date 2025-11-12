package com.culturalfest.controller;

import com.culturalfest.model.Registration;
import com.culturalfest.model.Event;
import com.culturalfest.model.User;
import com.culturalfest.service.RegistrationService;
import com.culturalfest.service.EventService;
import com.culturalfest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {
    
    @Autowired
    private RegistrationService registrationService;
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> registerForEvent(
            @RequestParam Long eventId,
            @RequestParam Long participantId,
            @RequestBody Registration registration) {
        try {
            Event event = eventService.getEventById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
            User participant = userService.getUserById(participantId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Registration created = registrationService.registerForEvent(event, participant, registration);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Registration successful!",
                "registration", created
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getRegistrationById(@PathVariable Long id) {
        return registrationService.getRegistrationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getRegistrationsByEvent(@PathVariable Long eventId) {
        Event event = eventService.getEventById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        return ResponseEntity.ok(registrationService.getRegistrationsByEvent(event));
    }
    
    @GetMapping("/participant/{participantId}")
    public ResponseEntity<?> getRegistrationsByParticipant(@PathVariable Long participantId) {
        User participant = userService.getUserById(participantId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(registrationService.getRegistrationsByParticipant(participant));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Registration>> getRegistrationsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(registrationService.getRegistrationsByStatus(status));
    }
    
    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveRegistration(@PathVariable Long id, @RequestParam Long approverId) {
        try {
            User approver = userService.getUserById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));
            
            Registration approved = registrationService.approveRegistration(id, approver);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Registration approved!",
                "registration", approved
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectRegistration(@PathVariable Long id, @RequestParam String reason) {
        try {
            Registration rejected = registrationService.rejectRegistration(id, reason);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Registration rejected!",
                "registration", rejected
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @PatchMapping("/{id}/checkin")
    public ResponseEntity<?> checkInParticipant(@PathVariable Long id) {
        try {
            Registration checkedIn = registrationService.checkInParticipant(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Participant checked in!",
                "registration", checkedIn
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getRegistrationStats() {
        return ResponseEntity.ok(Map.of(
            "totalRegistrations", registrationService.getTotalRegistrations(),
            "approvedRegistrations", registrationService.getApprovedRegistrationsCount(),
            "pendingRegistrations", registrationService.getRegistrationsByStatus("PENDING").size()
        ));
    }
}