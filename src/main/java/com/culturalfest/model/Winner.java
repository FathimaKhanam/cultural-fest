package com.culturalfest.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "winners")
public class Winner {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Position position;
    
    private Double finalScore;  // ← ADDED
    
    private String prize;
    
    @Column(updatable = false)
    private LocalDateTime announcedAt;
    
    // Constructors
    public Winner() {}
    
    public Winner(Event event, Registration registration, Position position) {
        this.event = event;
        this.registration = registration;
        this.position = position;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    
    public Registration getRegistration() { return registration; }
    public void setRegistration(Registration registration) { this.registration = registration; }
    
    public Position getPosition() { return position; }
    public void setPosition(Position position) { this.position = position; }
    
    public Double getFinalScore() { return finalScore; }  // ← ADDED
    public void setFinalScore(Double finalScore) { this.finalScore = finalScore; }  // ← ADDED
    
    public String getPrize() { return prize; }
    public void setPrize(String prize) { this.prize = prize; }
    
    public LocalDateTime getAnnouncedAt() { return announcedAt; }
    public void setAnnouncedAt(LocalDateTime announcedAt) { this.announcedAt = announcedAt; }
    
    @PrePersist
    protected void onCreate() {
        announcedAt = LocalDateTime.now();
    }
    
    public enum Position {
        FIRST, SECOND, THIRD
    }
}