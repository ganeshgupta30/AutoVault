package com.example.showroom.service;

import com.example.showroom.dto.SaleRequest;
import com.example.showroom.entity.Car;
import com.example.showroom.entity.Customer;
import com.example.showroom.entity.Sale;
import com.example.showroom.entity.Staff;
import com.example.showroom.exception.BadRequestException;
import com.example.showroom.exception.ResourceNotFoundException;
import com.example.showroom.repository.CarRepository;
import com.example.showroom.repository.CustomerRepository;
import com.example.showroom.repository.SaleRepository;
import com.example.showroom.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SalesService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private StaffRepository staffRepository;

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
    }

    /**
     * Create a sale with full validation chain:
     * 1. Verify customer exists
     * 2. Verify staff exists
     * 3. Verify car exists
     * 4. Verify car is available
     * 5. Create sale
     * 6. Update car stock
     * 7. Update availability if stock reaches 0
     */
    @Transactional
    public Sale createSale(SaleRequest request) {
        // 1. Verify customer exists
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found with id: " + request.getCustomerId()));

        // 2. Verify staff exists
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Staff not found with id: " + request.getStaffId()));

        // 3. Verify car exists
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Car not found with id: " + request.getCarId()));

        // 4. Verify car is available
        if (!car.isAvailability() || car.getStock() <= 0) {
            throw new BadRequestException("Car is not available for sale: " +
                    car.getBrand() + " " + car.getModel());
        }

        // 5. Create sale
        Sale sale = new Sale();
        sale.setCustomer(customer);
        sale.setCar(car);
        sale.setStaff(staff);
        sale.setSellingPrice(request.getSellingPrice());
        sale.setPaymentMethod(request.getPaymentMethod());
        sale.setPaymentStatus("Completed");

        // 6. Update car stock
        car.setStock(car.getStock() - 1);

        // 7. Update availability if stock reaches 0
        if (car.getStock() <= 0) {
            car.setAvailability(false);
        }
        carRepository.save(car);

        return saleRepository.save(sale);
    }
}
