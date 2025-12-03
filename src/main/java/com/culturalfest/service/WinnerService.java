package com.culturalfest.service;

import com.culturalfest.model.Winner;
import com.culturalfest.model.Event;
import com.culturalfest.model.Registration;
import com.culturalfest.repository.WinnerRepository;
import com.culturalfest.repository.EventRepository;
import com.culturalfest.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@SuppressWarnings("null")  // ← ADD THIS
public class WinnerService {
    
    @Autowired
    private WinnerRepository winnerRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Transactional
    public Winner declareWinner(Long eventId, Long registrationId, Winner.Position position, String prize) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        Registration registration = registrationRepository.findById(registrationId)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        Winner winner = new Winner();
        winner.setEvent(event);
        winner.setRegistration(registration);
        winner.setPosition(position);
        winner.setFinalScore(registration.getScore());
        winner.setPrize(prize);
        
        return winnerRepository.save(winner);
    }
    
    public List<Winner> getWinnersForEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        return winnerRepository.findByEventOrderByPositionAsc(event);
    }
    
    public List<Winner> getAllWinners() {
        return winnerRepository.findAll();
    }
}
