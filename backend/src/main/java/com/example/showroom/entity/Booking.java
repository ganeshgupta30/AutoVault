package com.example.showroom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Customer name is required")
    @Column(nullable = false)
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false)
    private String customerEmail;

    @NotBlank(message = "Customer phone is required")
    @Column(nullable = false)
    private String customerPhone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @NotNull(message = "Booking amount is required")
    @Column(nullable = false)
    private Double bookingAmount;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, CONFIRMED, CANCELLED, COMPLETED

    private String notes;

    private LocalDateTime bookingDate;

    @PrePersist
    protected void onCreate() {
        if (this.bookingDate == null) {
            this.bookingDate = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Car getCar() { return car; }
    public void setCar(Car car) { this.car = car; }

    public Double getBookingAmount() { return bookingAmount; }
    public void setBookingAmount(Double bookingAmount) { this.bookingAmount = bookingAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
}
