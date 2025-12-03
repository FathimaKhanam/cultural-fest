package com.culturalfest.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
    
    @Column(nullable = false)
    private String message;
    
    private String email;  // ← ADDED
    
    private String mobile;  // ← ADDED
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    
    private Boolean isRead = false;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public Notification() {}
    
    public Notification(User user, String message, NotificationType type) {
        this.user = user;
        this.message = message;
        this.type = type;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getEmail() { return email; }  // ← ADDED
    public void setEmail(String email) { this.email = email; }  // ← ADDED
    
    public String getMobile() { return mobile; }  // ← ADDED
    public void setMobile(String mobile) { this.mobile = mobile; }  // ← ADDED
    
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum NotificationType {
        REGISTRATION_SUCCESS, EVENT_UPDATE, WINNER_ANNOUNCEMENT, GENERAL
    }
}