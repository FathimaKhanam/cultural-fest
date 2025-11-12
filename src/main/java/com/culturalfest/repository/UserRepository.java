package com.culturalfest.repository;

import com.culturalfest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByUserRole(String userRole);
    boolean existsByEmail(String email);
    List<User> findByIsActiveTrue();
}