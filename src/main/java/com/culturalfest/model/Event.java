package com.culturalfest.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String category;
    
    private String type;  // ← ADDED (e.g., "Solo", "Group", "Team")
    
    private LocalDate eventDate;
    
    private LocalTime eventStartTime;
    
    private String venue;
    
    private Integer maxParticipants;  // ← ADDED
    
    private Integer maxRegistrations;
    
    private Integer currentRegistrations = 0;
    
    private Double registrationFee;  // ← ADDED
    
    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.UPCOMING;
    
    private String image;
    
    private Boolean isNew = false;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public Event() {}
    
    public Event(String name, String category, LocalDate eventDate, String venue) {
        this.name = name;
        this.category = category;
        this.eventDate = eventDate;
        this.venue = venue;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getType() { return type; }  // ← ADDED
    public void setType(String type) { this.type = type; }  // ← ADDED
    
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    
    public LocalTime getEventStartTime() { return eventStartTime; }
    public void setEventStartTime(LocalTime eventStartTime) { this.eventStartTime = eventStartTime; }
    
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    
    public Integer getMaxParticipants() { return maxParticipants; }  // ← ADDED
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }  // ← ADDED
    
    public Integer getMaxRegistrations() { return maxRegistrations; }
    public void setMaxRegistrations(Integer maxRegistrations) { this.maxRegistrations = maxRegistrations; }
    
    public Integer getCurrentRegistrations() { return currentRegistrations; }
    public void setCurrentRegistrations(Integer currentRegistrations) { this.currentRegistrations = currentRegistrations; }
    
    public Double getRegistrationFee() { return registrationFee; }  // ← ADDED
    public void setRegistrationFee(Double registrationFee) { this.registrationFee = registrationFee; }  // ← ADDED
    
    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public Boolean getIsNew() { return isNew; }
    public void setIsNew(Boolean isNew) { this.isNew = isNew; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum EventStatus {
        UPCOMING, ONGOING, COMPLETED, CANCELLED
    }
}