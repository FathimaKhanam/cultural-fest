package com.culturalfest.service;

import com.culturalfest.model.Judge;
import com.culturalfest.model.Event;
import com.culturalfest.model.User;
import com.culturalfest.repository.JudgeRepository;
import com.culturalfest.repository.EventRepository;
import com.culturalfest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@SuppressWarnings("null")  // ← ADD THIS
public class JudgeService {
    
    @Autowired
    private JudgeRepository judgeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    public Judge assignJudgeToEvent(Long userId, Long eventId, String specialization) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getRole().equals(User.Role.JUDGE)) {
            throw new RuntimeException("User is not a judge");
        }
        
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (judgeRepository.existsByUserAndEvent(user, event)) {
            throw new RuntimeException("Judge already assigned to this event");
        }
        
        Judge judge = new Judge();
        judge.setUser(user);
        judge.setEvent(event);
        judge.setSpecialization(specialization);
        
        return judgeRepository.save(judge);
    }
    
    public List<Judge> getJudgesForEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        return judgeRepository.findByEvent(event);
    }
    
    public List<Judge> getAllJudges() {
        return judgeRepository.findAll();
    }
    
    public void removeJudge(Long judgeId) {
        judgeRepository.deleteById(judgeId);
    }
}