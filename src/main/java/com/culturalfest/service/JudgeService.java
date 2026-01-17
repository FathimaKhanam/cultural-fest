package com.culturalfest.service;

import com.culturalfest.model.Judge;
import com.culturalfest.repository.JudgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class JudgeService {

    @Autowired
    private JudgeRepository judgeRepository;

    // Get all judges
    public List<Judge> getAllJudges() {
        return judgeRepository.findAll();
    }

    // Get judge by ID
    public Judge getJudgeById(Long id) {
        return judgeRepository.findById(id).orElse(null);
    }

    // Create new judge assignment
    public Judge createJudge(Judge judge) {
        return judgeRepository.save(judge);
    }

    // Update judge assignment
    public Judge updateJudge(Long id, Judge judge) {
        if (judgeRepository.existsById(id)) {
            judge.setId(id);
            return judgeRepository.save(judge);
        }
        return null;
    }

    // Delete judge assignment
    public void deleteJudge(Long id) {
        judgeRepository.deleteById(id);
    }

    // Get all judges assigned to a specific event
    public List<Judge> getJudgesByEventId(Long eventId) {
        return judgeRepository.findByEventId(eventId);
    }

    // Get all events assigned to a specific judge
    public List<Judge> getJudgesByUserId(Long userId) {
        return judgeRepository.findByUserId(userId);
    }

    // Check if a judge is already assigned to an event
    public boolean isJudgeAssignedToEvent(Long userId, Long eventId) {
        return judgeRepository.existsByUserIdAndEventId(userId, eventId);
    }

    // Get specific assignment
    public Judge getAssignment(Long userId, Long eventId) {
        return judgeRepository.findByUserIdAndEventId(userId, eventId);
    }
}