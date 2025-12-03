package com.culturalfest.controller;

import com.culturalfest.model.Registration;
import com.culturalfest.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    public ResponseEntity<?> registerForEvent(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long eventId = request.get("eventId");
            Registration registration = registrationService.registerForEvent(userId, eventId);
            return ResponseEntity.status(HttpStatus.CREATED).body(registration);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Registration>> getUserRegistrations(@PathVariable Long userId) {
        return ResponseEntity.ok(registrationService.getUserRegistrations(userId));
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Registration>> getEventRegistrations(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getEventRegistrations(eventId));
    }
    
    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }
    
    @PutMapping("/{id}/score")
    public ResponseEntity<?> updateScore(@PathVariable Long id, @RequestBody Map<String, Double> request) {
        try {
            Double score = request.get("score");
            Registration updated = registrationService.updateScore(id, score);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long id) {
        try {
            registrationService.cancelRegistration(id);
            return ResponseEntity.ok(Map.of("message", "Registration cancelled"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
}