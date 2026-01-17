package com.culturalfest.controller;

import java.util.Optional;
import com.culturalfest.model.Judge;
import com.culturalfest.model.User;
import com.culturalfest.model.Event;
import com.culturalfest.service.JudgeService;
import com.culturalfest.service.UserService;
import com.culturalfest.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;

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

    @Autowired
    private UserService userService;

    @Autowired
    private EventService eventService;

    // Get all judges
    @GetMapping
    public ResponseEntity<List<Judge>> getAllJudges() {
        return ResponseEntity.ok(judgeService.getAllJudges());
    }

    // Get judge by ID
    @GetMapping("/{id}")
    public ResponseEntity<Judge> getJudgeById(@PathVariable Long id) {
        Judge judge = judgeService.getJudgeById(id);
        if (judge == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(judge);
    }

    // Assign judge to event
    @PostMapping("/assign")
public ResponseEntity<?> assignJudgeToEvent(@RequestBody Map<String, Long> request) {
    try {
        Long judgeUserId = request.get("judgeUserId");
        Long eventId = request.get("eventId");

        if (judgeUserId == null || eventId == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "judgeUserId and eventId are required"));
        }

        // Check if already assigned
        if (judgeService.isJudgeAssignedToEvent(judgeUserId, eventId)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Judge already assigned to this event"));
        }

        // Get user and event
        Optional<User> userOpt = userService.getUserById(judgeUserId);
        Optional<Event> eventOpt = eventService.getEventById(eventId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Judge user not found"));
        }

        if (eventOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Event not found"));
        }

        User user = userOpt.get();
        Event event = eventOpt.get();

        if (!"JUDGE".equals(user.getRole())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "User is not a judge"));
        }

        // Create assignment
        Judge judge = new Judge();
        judge.setUser(user);
        judge.setEvent(event);

        Judge savedJudge = judgeService.createJudge(judge);
        return ResponseEntity.ok(savedJudge);

    } catch (Exception e) {
        return ResponseEntity.internalServerError()
            .body(Map.of("error", "Failed to assign judge: " + e.getMessage()));
    }
}

    // Get all judges assigned to an event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getJudgesByEvent(@PathVariable Long eventId) {
        try {
            List<Judge> judges = judgeService.getJudgesByEventId(eventId);
            return ResponseEntity.ok(judges);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to get judges: " + e.getMessage()));
        }
    }

    // Get all events assigned to a judge (by user ID)
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAssignedEvents(@PathVariable Long userId) {
        try {
            List<Judge> assignments = judgeService.getJudgesByUserId(userId);
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to get assignments: " + e.getMessage()));
        }
    }

    // Delete judge assignment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJudgeAssignment(@PathVariable Long id) {
        try {
            judgeService.deleteJudge(id);
            return ResponseEntity.ok(Map.of("message", "Assignment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to delete assignment: " + e.getMessage()));
        }
    }
}
