package com.example.showroom.service;

import com.example.showroom.entity.Car;
import com.example.showroom.exception.ResourceNotFoundException;
import com.example.showroom.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
    }

    public Car createCar(Car car) {
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car updated) {
        Car car = getCarById(id);
        car.setBrand(updated.getBrand());
        car.setModel(updated.getModel());
        car.setVariant(updated.getVariant());
        car.setYear(updated.getYear());
        car.setPrice(updated.getPrice());
        car.setFuelType(updated.getFuelType());
        car.setTransmission(updated.getTransmission());
        car.setColor(updated.getColor());
        car.setMileage(updated.getMileage());
        car.setEngineCapacity(updated.getEngineCapacity());
        car.setSeatingCapacity(updated.getSeatingCapacity());
        car.setStock(updated.getStock());
        car.setAvailability(updated.isAvailability());
        car.setImageUrl(updated.getImageUrl());
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        Car car = getCarById(id);
        carRepository.delete(car);
    }

    public List<Car> searchCars(String keyword) {
        return carRepository.searchByKeyword(keyword);
    }

    public List<Car> filterCars(String brand, String fuelType, String transmission,
                                 Integer year, Double minPrice, Double maxPrice,
                                 Boolean availability) {
        return carRepository.filterCars(brand, fuelType, transmission, year,
                                         minPrice, maxPrice, availability);
    }

    public List<String> getAllBrands() {
        return carRepository.findDistinctBrands();
    }
}
