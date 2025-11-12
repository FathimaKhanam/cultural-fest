package com.culturalfest.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "registrations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "participant_id"})
})
public class Registration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String registrationNumber;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false)
    private User participant;
    
    private String teamName;
    
    private String registrationStatus = "PENDING"; // PENDING, APPROVED, REJECTED
    
    private LocalDateTime registrationDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    private LocalDateTime approvalDate;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    // Payment
    private String paymentStatus = "PENDING"; // PENDING, COMPLETED, FAILED
    private BigDecimal paymentAmount;
    private String transactionId;
    private LocalDateTime paymentDate;
    
    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactNumber;
    
    // Check-in
    private Boolean checkedIn = false;
    private LocalDateTime checkInTime;
    
    @PrePersist
    protected void onCreate() {
        registrationDate = LocalDateTime.now();
        if (registrationNumber == null) {
            registrationNumber = "CF2025-REG-" + System.currentTimeMillis() % 1000000;
        }
    }
    
    // Constructors
    public Registration() {}
    
    public Registration(Event event, User participant) {
        this.event = event;
        this.participant = participant;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { 
        this.registrationNumber = registrationNumber; 
    }
    
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    
    public User getParticipant() { return participant; }
    public void setParticipant(User participant) { this.participant = participant; }
    
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    
    public String getRegistrationStatus() { return registrationStatus; }
    public void setRegistrationStatus(String registrationStatus) { 
        this.registrationStatus = registrationStatus; 
    }
    
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    
    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { 
        this.approvalDate = approvalDate; 
    }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    // Payment Getters and Setters - ADDED THESE
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { 
        this.paymentStatus = paymentStatus; 
    }
    
    public BigDecimal getPaymentAmount() { return paymentAmount; }
    public void setPaymentAmount(BigDecimal paymentAmount) { 
        this.paymentAmount = paymentAmount; 
    }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { 
        this.transactionId = transactionId; 
    }
    
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { 
        this.paymentDate = paymentDate; 
    }
    
    // Check-in Getters and Setters
    public Boolean getCheckedIn() { return checkedIn; }
    public void setCheckedIn(Boolean checkedIn) { this.checkedIn = checkedIn; }
    
    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { 
        this.checkInTime = checkInTime; 
    }
    
    // Emergency Contact Getters and Setters
    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { 
        this.emergencyContactName = emergencyContactName; 
    }
    
    public String getEmergencyContactNumber() { return emergencyContactNumber; }
    public void setEmergencyContactNumber(String emergencyContactNumber) { 
        this.emergencyContactNumber = emergencyContactNumber; 
    }
}