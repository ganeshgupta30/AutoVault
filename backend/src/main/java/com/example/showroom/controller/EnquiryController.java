package com.example.showroom.controller;

import com.example.showroom.dto.ApiResponse;
import com.example.showroom.entity.Enquiry;
import com.example.showroom.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    @Autowired
    private EnquiryService enquiryService;

    @GetMapping
    public ResponseEntity<List<Enquiry>> getAllEnquiries() {
        return ResponseEntity.ok(enquiryService.getAllEnquiries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enquiry> getEnquiryById(@PathVariable Long id) {
        return ResponseEntity.ok(enquiryService.getEnquiryById(id));
    }

    @PostMapping
    public ResponseEntity<Enquiry> createEnquiry(@Valid @RequestBody Enquiry enquiry) {
        return ResponseEntity.ok(enquiryService.createEnquiry(enquiry));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Enquiry> updateEnquiryStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "PENDING");
        return ResponseEntity.ok(enquiryService.updateEnquiryStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteEnquiry(@PathVariable Long id) {
        enquiryService.deleteEnquiry(id);
        return ResponseEntity.ok(new ApiResponse("Enquiry deleted successfully", true));
    }
}
