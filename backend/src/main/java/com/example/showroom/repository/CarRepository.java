package com.example.showroom.repository;

import com.example.showroom.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    // Search by keyword (brand, model, or variant)
    @Query("SELECT c FROM Car c WHERE LOWER(c.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.model) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.variant) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Car> searchByKeyword(@Param("keyword") String keyword);

    // Filter methods
    List<Car> findByBrandIgnoreCase(String brand);

    List<Car> findByFuelTypeIgnoreCase(String fuelType);

    List<Car> findByTransmissionIgnoreCase(String transmission);

    List<Car> findByAvailability(boolean availability);

    List<Car> findByYear(int year);

    List<Car> findByPriceBetween(double minPrice, double maxPrice);

    // Complex filter
    @Query("SELECT c FROM Car c WHERE " +
           "(:brand IS NULL OR LOWER(c.brand) = LOWER(:brand)) AND " +
           "(:fuelType IS NULL OR LOWER(c.fuelType) = LOWER(:fuelType)) AND " +
           "(:transmission IS NULL OR LOWER(c.transmission) = LOWER(:transmission)) AND " +
           "(:year IS NULL OR c.year = :year) AND " +
           "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
           "(:availability IS NULL OR c.availability = :availability)")
    List<Car> filterCars(@Param("brand") String brand,
                         @Param("fuelType") String fuelType,
                         @Param("transmission") String transmission,
                         @Param("year") Integer year,
                         @Param("minPrice") Double minPrice,
                         @Param("maxPrice") Double maxPrice,
                         @Param("availability") Boolean availability);

    // Count methods for dashboard
    long countByAvailability(boolean availability);

    // Get distinct brands
    @Query("SELECT DISTINCT c.brand FROM Car c ORDER BY c.brand")
    List<String> findDistinctBrands();
}
