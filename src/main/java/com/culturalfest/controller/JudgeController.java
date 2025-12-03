package com.culturalfest.controller;

import com.culturalfest.model.Judge;
import com.culturalfest.service.JudgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/judges")
@CrossOrigin(origins = "*")
public class JudgeController {
    
    @Autowired
    private JudgeService judgeService;
    
    @PostMapping("/assign")
    public ResponseEntity<?> assignJudge(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long eventId = Long.valueOf(request.get("eventId").toString());
            String specialization = (String) request.get("specialization");
            
            Judge judge = judgeService.assignJudgeToEvent(userId, eventId, specialization);
            return ResponseEntity.status(HttpStatus.CREATED).body(judge);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Judge>> getJudgesForEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(judgeService.getJudgesForEvent(eventId));
    }
    
    @GetMapping
    public ResponseEntity<List<Judge>> getAllJudges() {
        return ResponseEntity.ok(judgeService.getAllJudges());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeJudge(@PathVariable Long id) {
        try {
            judgeService.removeJudge(id);
            return ResponseEntity.ok(Map.of("message", "Judge removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
