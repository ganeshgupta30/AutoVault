package com.example.showroom.service;

import com.example.showroom.dto.DashboardStats;
import com.example.showroom.entity.Car;
import com.example.showroom.repository.CarRepository;
import com.example.showroom.repository.CustomerRepository;
import com.example.showroom.repository.SaleRepository;
import com.example.showroom.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private com.example.showroom.repository.BookingRepository bookingRepository;

    @Autowired
    private com.example.showroom.repository.EnquiryRepository enquiryRepository;

    /**
     * Get overall dashboard statistics.
     */
    public DashboardStats getStatistics() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalCars(carRepository.count());
        stats.setAvailableCars(carRepository.countByAvailability(true));
        stats.setTotalSales(saleRepository.count());
        stats.setSoldCars(saleRepository.count());
        stats.setTotalStaff(staffRepository.count());
        stats.setTotalCustomers(customerRepository.count());
        stats.setTotalRevenue(saleRepository.getTotalRevenue());
        stats.setTotalBookings(bookingRepository.count());
        stats.setPendingEnquiries(enquiryRepository.countByStatus("PENDING"));
        return stats;
    }

    /**
     * Get monthly sales data for the current year.
     * Returns list of {month, count, revenue}
     */
    public List<Map<String, Object>> getMonthlySales() {
        String[] monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        List<Object[]> data = saleRepository.getMonthlySales();
        List<Map<String, Object>> result = new ArrayList<>();

        // Initialize all 12 months
        for (int i = 0; i < 12; i++) {
            Map<String, Object> month = new HashMap<>();
            month.put("month", monthNames[i]);
            month.put("count", 0L);
            month.put("revenue", 0.0);
            result.add(month);
        }

        // Fill in actual data
        for (Object[] row : data) {
            int monthIndex = ((Number) row[0]).intValue() - 1;
            if (monthIndex >= 0 && monthIndex < 12) {
                result.get(monthIndex).put("count", row[1]);
                result.get(monthIndex).put("revenue", row[2]);
            }
        }

        return result;
    }

    /**
     * Get sales statistics grouped by brand.
     * Returns list of {brand, count, revenue}
     */
    public List<Map<String, Object>> getBrandStatistics() {
        List<Object[]> data = saleRepository.getBrandStatistics();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : data) {
            Map<String, Object> item = new HashMap<>();
            item.put("brand", row[0]);
            item.put("count", row[1]);
            item.put("revenue", row[2]);
            result.add(item);
        }

        return result;
    }

    /**
     * Get inventory statistics grouped by brand.
     * Returns list of {brand, total, available}
     */
    public List<Map<String, Object>> getInventoryStatistics() {
        List<Car> allCars = carRepository.findAll();
        Map<String, long[]> brandMap = new LinkedHashMap<>();

        for (var car : allCars) {
            String brand = car.getBrand();
            brandMap.putIfAbsent(brand, new long[]{0, 0});
            long[] counts = brandMap.get(brand);
            counts[0] += car.getStock(); // total stock
            if (car.isAvailability()) {
                counts[1] += car.getStock(); // available stock
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, long[]> entry : brandMap.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("brand", entry.getKey());
            item.put("total", entry.getValue()[0]);
            item.put("available", entry.getValue()[1]);
            result.add(item);
        }

        return result;
    }
}
