package com.example.showroom.repository;

import com.example.showroom.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    // Monthly sales: returns [month_number, count, total_revenue]
    @Query("SELECT MONTH(s.saleDate), COUNT(s), SUM(s.sellingPrice) " +
           "FROM Sale s WHERE YEAR(s.saleDate) = YEAR(CURRENT_DATE) " +
           "GROUP BY MONTH(s.saleDate) ORDER BY MONTH(s.saleDate)")
    List<Object[]> getMonthlySales();

    // Brand statistics: returns [brand, count, total_revenue]
    @Query("SELECT s.car.brand, COUNT(s), SUM(s.sellingPrice) " +
           "FROM Sale s GROUP BY s.car.brand ORDER BY COUNT(s) DESC")
    List<Object[]> getBrandStatistics();

    // Total revenue
    @Query("SELECT COALESCE(SUM(s.sellingPrice), 0) FROM Sale s")
    double getTotalRevenue();
}
