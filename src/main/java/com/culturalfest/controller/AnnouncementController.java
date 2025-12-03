package com.culturalfest.controller;

import com.culturalfest.model.Announcement;
import com.culturalfest.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/Announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {
    
    @Autowired
    private AnnouncementService announcementService;
    
    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
        try {
            Announcement created = announcementService.createAnnouncement(announcement);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/event/{eventId}")
    public ResponseEntity<?> createAnnouncementForEvent(@PathVariable Long eventId,@RequestBody Map<String, String> request) {
        try {
            String title = request.get("title");
            String content = request.get("content");
            Announcement.AnnouncementType type = 
                Announcement.AnnouncementType.valueOf(request.get("type"));
            
            Announcement announcement = announcementService.createAnnouncementForEvent(
                eventId, title, content, type);
            return ResponseEntity.status(HttpStatus.CREATED).body(announcement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Announcement>> getAllActiveAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllActiveAnnouncements());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getAnnouncementById(@PathVariable Long id) {
        return announcementService.getAnnouncementById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByType(@PathVariable String type) {
        Announcement.AnnouncementType announcementType = 
            Announcement.AnnouncementType.valueOf(type.toUpperCase());
        return ResponseEntity.ok(announcementService.getAnnouncementsByType(announcementType));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable Long id, 
                                                @RequestBody Announcement announcement) {
        try {
            Announcement updated = announcementService.updateAnnouncement(id, announcement);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateAnnouncement(@PathVariable Long id) {
        try {
            Announcement announcement = announcementService.deactivateAnnouncement(id);
            return ResponseEntity.ok(announcement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            return ResponseEntity.ok(Map.of("message", "Announcement deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
