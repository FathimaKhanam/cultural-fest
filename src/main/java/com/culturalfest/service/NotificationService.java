package com.culturalfest.service;

import com.culturalfest.model.Notification;
import com.culturalfest.model.Event;
import com.culturalfest.repository.NotificationRepository;
import com.culturalfest.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@SuppressWarnings("null")  // ← ADD THIS
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    public Notification createNotification(Long eventId, String email, String mobile) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        Notification notification = new Notification();
        notification.setEvent(event);
        notification.setEmail(email);
        notification.setMobile(mobile);
        
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getNotificationsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        return notificationRepository.findByEvent(event);
    }
    
    public List<Notification> getNotificationsByEmail(String email) {
        return notificationRepository.findByEmail(email);
    }
    
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}