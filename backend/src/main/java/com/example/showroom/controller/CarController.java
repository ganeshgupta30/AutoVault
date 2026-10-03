package com.example.showroom.controller;

import com.example.showroom.dto.ApiResponse;
import com.example.showroom.entity.Car;
import com.example.showroom.service.CarService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @PostMapping
    public ResponseEntity<Car> createCar(@Valid @RequestBody Car car) {
        return ResponseEntity.ok(carService.createCar(car));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @Valid @RequestBody Car car) {
        return ResponseEntity.ok(carService.updateCar(id, car));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(new ApiResponse("Car deleted successfully", true));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Car>> searchCars(@RequestParam String keyword) {
        return ResponseEntity.ok(carService.searchCars(keyword));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Car>> filterCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean availability) {
        return ResponseEntity.ok(carService.filterCars(brand, fuelType, transmission,
                year, minPrice, maxPrice, availability));
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        return ResponseEntity.ok(carService.getAllBrands());
    }
}
