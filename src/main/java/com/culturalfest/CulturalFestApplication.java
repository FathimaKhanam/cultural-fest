package com.culturalfest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CulturalFestApplication {
    public static void main(String[] args) {
        SpringApplication.run(CulturalFestApplication.class, args);
        System.out.println("\n🎭 Cultural Fest Management System Started!");
        System.out.println("🌐 Open browser: http://localhost:8080");
        System.out.println("📊 API Docs: http://localhost:8080/api/test\n");
    }
} 