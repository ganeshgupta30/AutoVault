package com.example.showroom.controller;

import com.example.showroom.dto.SaleRequest;
import com.example.showroom.entity.Sale;
import com.example.showroom.service.SalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    @Autowired
    private SalesService salesService;

    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {
        return ResponseEntity.ok(salesService.getAllSales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(salesService.getSaleById(id));
    }

    @PostMapping
    public ResponseEntity<Sale> createSale(@RequestBody SaleRequest request) {
        return ResponseEntity.ok(salesService.createSale(request));
    }
}
