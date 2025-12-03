package com.culturalfest.controller;

import com.culturalfest.model.Notification;
import com.culturalfest.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody Map<String, Object> request) {
        try {
            Long eventId = Long.valueOf(request.get("eventId").toString());
            String email = (String) request.get("email");
            String mobile = (String) request.get("mobile");
            
            Notification notification = notificationService.createNotification(eventId, email, mobile);
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Notification>> getNotificationsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(notificationService.getNotificationsByEvent(eventId));
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<List<Notification>> getNotificationsByEmail(@PathVariable String email) {
        return ResponseEntity.ok(notificationService.getNotificationsByEmail(email));
    }
}