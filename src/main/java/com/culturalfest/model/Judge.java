package com.culturalfest.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "judges")

public class Judge {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    private String specialization;  // ← ADDED
    
    @Column(updatable = false)
    private LocalDateTime assignedAt;
    
    // Constructors
    public Judge() {}
    
    public Judge(User user, Event event) {
        this.user = user;
        this.event = event;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    
    public String getSpecialization() { return specialization; }  // ← ADDED
    public void setSpecialization(String specialization) { this.specialization = specialization; }  // ← ADDED
    
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    
    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
    }
}