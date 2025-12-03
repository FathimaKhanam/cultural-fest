package com.culturalfest.controller;

import com.culturalfest.model.Winner;
import com.culturalfest.service.WinnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/winners")
@CrossOrigin(origins = "*")
public class WinnerController {
    
    @Autowired
    private WinnerService winnerService;
    
    @PostMapping
    public ResponseEntity<?> declareWinner(@RequestBody Map<String, Object> request) {
        try {
            Long eventId = Long.valueOf(request.get("eventId").toString());
            Long registrationId = Long.valueOf(request.get("registrationId").toString());
            Winner.Position position = Winner.Position.valueOf((String) request.get("position"));
            String prize = (String) request.get("prize");
            
            Winner winner = winnerService.declareWinner(eventId, registrationId, position, prize);
            return ResponseEntity.status(HttpStatus.CREATED).body(winner);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Winner>> getWinnersForEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(winnerService.getWinnersForEvent(eventId));
    }
    
    @GetMapping
    public ResponseEntity<List<Winner>> getAllWinners() {
        return ResponseEntity.ok(winnerService.getAllWinners());
    }
}