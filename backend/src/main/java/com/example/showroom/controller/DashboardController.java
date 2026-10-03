package com.example.showroom.controller;

import com.example.showroom.dto.DashboardStats;
import com.example.showroom.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/statistics")
    public ResponseEntity<DashboardStats> getStatistics() {
        return ResponseEntity.ok(dashboardService.getStatistics());
    }

    @GetMapping("/monthly-sales")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySales() {
        return ResponseEntity.ok(dashboardService.getMonthlySales());
    }

    @GetMapping("/brand-statistics")
    public ResponseEntity<List<Map<String, Object>>> getBrandStatistics() {
        return ResponseEntity.ok(dashboardService.getBrandStatistics());
    }

    @GetMapping("/inventory-statistics")
    public ResponseEntity<List<Map<String, Object>>> getInventoryStatistics() {
        return ResponseEntity.ok(dashboardService.getInventoryStatistics());
    }
}
