package com.culturalfest.service;

import com.culturalfest.model.Announcement;
import com.culturalfest.model.Event;
import com.culturalfest.repository.AnnouncementRepository;
import com.culturalfest.repository.EventRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")  // ← ADD THIS
public class AnnouncementService {
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Transactional
    public Announcement createAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }
    
    public Announcement createAnnouncementForEvent(Long eventId, String title, String content,Announcement.AnnouncementType type) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        Announcement announcement = new Announcement();
        announcement.setTitle(title);
        announcement.setContent(content);
        announcement.setType(type);
        announcement.setEvent(event);
        
        return announcementRepository.save(announcement);
    }
    
    public List<Announcement> getAllActiveAnnouncements() {
        return announcementRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }
    
    public List<Announcement> getAnnouncementsByType(Announcement.AnnouncementType type) {
        return announcementRepository.findByTypeOrderByCreatedAtDesc(type);
    }
    
    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }
    
    public Announcement updateAnnouncement(Long id, Announcement announcementDetails) {
        Announcement announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        announcement.setTitle(announcementDetails.getTitle());
        announcement.setContent(announcementDetails.getContent());
        announcement.setType(announcementDetails.getType());
        announcement.setIsActive(announcementDetails.getIsActive());
        
        return announcementRepository.save(announcement);
    }
    
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
    
    public Announcement deactivateAnnouncement(Long id) {
        Announcement announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        announcement.setIsActive(false);
        return announcementRepository.save(announcement);
    }
}