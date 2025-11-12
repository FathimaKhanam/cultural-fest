package com.culturalfest.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "events")
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String eventName;
    
    @Column(unique = true)
    private String eventCode;
    
    @Column(columnDefinition = "TEXT")
    private String eventDescription;
    
    @Column(nullable = false)
    private String eventCategory; // DANCE, MUSIC, DRAMA, LITERARY, etc.
    
    @Column(nullable = false)
    private String eventType; // SOLO, DUET, GROUP, TEAM
    
    private Integer maxParticipants = 1;
    private Integer minParticipants = 1;
    private Integer maxRegistrations;
    private Integer currentRegistrations = 0;
    
    private BigDecimal registrationFee = BigDecimal.ZERO;
    private Boolean isPaidEvent = false;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate eventDate;
    
    @NotNull
    @Column(nullable = false)
    private LocalTime eventStartTime;
    
    private LocalTime eventEndTime;
    private Integer durationMinutes;
    
    @NotNull
    @Column(nullable = false)
    private String venue;
    
    private Integer venueCapacity;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate registrationStartDate;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate registrationEndDate;
    
    private String status = "DRAFT"; // DRAFT, OPEN, CLOSED, LIVE, COMPLETED
    
    @Column(columnDefinition = "TEXT")
    private String rules;
    
    private String coordinatorName;
    private String coordinatorMobile;
    private String coordinatorEmail;
    
    private BigDecimal firstPrize;
    private BigDecimal secondPrize;
    private BigDecimal thirdPrize;
    
    private Long viewCount = 0L;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (eventCode == null) {
            eventCode = "CF2025-" + System.currentTimeMillis() % 100000;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Event() {}
    
    // Business Methods
    public boolean isRegistrationOpen() {
        LocalDate today = LocalDate.now();
        return "OPEN".equals(status) &&
               !today.isBefore(registrationStartDate) &&
               !today.isAfter(registrationEndDate) &&
               (maxRegistrations == null || currentRegistrations < maxRegistrations);
    }
    
    public int getRemainingSlots() {
        if (maxRegistrations == null) return Integer.MAX_VALUE;
        return Math.max(0, maxRegistrations - currentRegistrations);
    }
    
    public void incrementRegistrationCount() {
        this.currentRegistrations = (this.currentRegistrations == null ? 0 : this.currentRegistrations) + 1;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }
    
    public String getEventCode() { return eventCode; }
    public void setEventCode(String eventCode) { this.eventCode = eventCode; }
    
    public String getEventDescription() { return eventDescription; }
    public void setEventDescription(String eventDescription) { 
        this.eventDescription = eventDescription; 
    }
    
    public String getEventCategory() { return eventCategory; }
    public void setEventCategory(String eventCategory) { 
        this.eventCategory = eventCategory; 
    }
    
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { 
        this.maxParticipants = maxParticipants; 
    }
    
    public Integer getMinParticipants() { return minParticipants; }
    public void setMinParticipants(Integer minParticipants) { 
        this.minParticipants = minParticipants; 
    }
    
    public Integer getCurrentRegistrations() { return currentRegistrations; }
    public void setCurrentRegistrations(Integer currentRegistrations) { 
        this.currentRegistrations = currentRegistrations; 
    }
    
    public Integer getMaxRegistrations() { return maxRegistrations; }
    public void setMaxRegistrations(Integer maxRegistrations) { 
        this.maxRegistrations = maxRegistrations; 
    }
    
    public BigDecimal getRegistrationFee() { return registrationFee; }
    public void setRegistrationFee(BigDecimal registrationFee) { 
        this.registrationFee = registrationFee; 
    }
    
    public Boolean getIsPaidEvent() { return isPaidEvent; }
    public void setIsPaidEvent(Boolean isPaidEvent) { 
        this.isPaidEvent = isPaidEvent; 
    }
    
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    
    public LocalTime getEventStartTime() { return eventStartTime; }
    public void setEventStartTime(LocalTime eventStartTime) { 
        this.eventStartTime = eventStartTime; 
    }
    
    public LocalTime getEventEndTime() { return eventEndTime; }
    public void setEventEndTime(LocalTime eventEndTime) { 
        this.eventEndTime = eventEndTime; 
    }
    
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { 
        this.durationMinutes = durationMinutes; 
    }
    
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    
    public Integer getVenueCapacity() { return venueCapacity; }
    public void setVenueCapacity(Integer venueCapacity) { 
        this.venueCapacity = venueCapacity; 
    }
    
    public LocalDate getRegistrationStartDate() { return registrationStartDate; }
    public void setRegistrationStartDate(LocalDate registrationStartDate) { 
        this.registrationStartDate = registrationStartDate; 
    }
    
    public LocalDate getRegistrationEndDate() { return registrationEndDate; }
    public void setRegistrationEndDate(LocalDate registrationEndDate) { 
        this.registrationEndDate = registrationEndDate; 
    }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getRules() { return rules; }
    public void setRules(String rules) { this.rules = rules; }
    
    public String getCoordinatorName() { return coordinatorName; }
    public void setCoordinatorName(String coordinatorName) { 
        this.coordinatorName = coordinatorName; 
    }
    
    public String getCoordinatorMobile() { return coordinatorMobile; }
    public void setCoordinatorMobile(String coordinatorMobile) { 
        this.coordinatorMobile = coordinatorMobile; 
    }
    
    public String getCoordinatorEmail() { return coordinatorEmail; }
    public void setCoordinatorEmail(String coordinatorEmail) { 
        this.coordinatorEmail = coordinatorEmail; 
    }
    
    public BigDecimal getFirstPrize() { return firstPrize; }
    public void setFirstPrize(BigDecimal firstPrize) { 
        this.firstPrize = firstPrize; 
    }
    
    public BigDecimal getSecondPrize() { return secondPrize; }
    public void setSecondPrize(BigDecimal secondPrize) { 
        this.secondPrize = secondPrize; 
    }
    
    public BigDecimal getThirdPrize() { return thirdPrize; }
    public void setThirdPrize(BigDecimal thirdPrize) { 
        this.thirdPrize = thirdPrize; 
    }
    
    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }
    
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}