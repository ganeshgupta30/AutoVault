package com.example.showroom.service;

import com.example.showroom.entity.Booking;
import com.example.showroom.entity.Car;
import com.example.showroom.exception.ResourceNotFoundException;
import com.example.showroom.repository.BookingRepository;
import com.example.showroom.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public Booking createBooking(Booking booking, Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + carId));
        booking.setCar(car);
        if (booking.getStatus() == null) {
            booking.setStatus("PENDING");
        }
        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status.toUpperCase());
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }

    public long getTotalBookingsCount() {
        return bookingRepository.count();
    }
}
