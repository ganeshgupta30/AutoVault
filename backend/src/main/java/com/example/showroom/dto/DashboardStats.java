package com.example.showroom.dto;

public class DashboardStats {
    private long totalCars;
    private long availableCars;
    private long soldCars;
    private long totalStaff;
    private long totalCustomers;
    private long totalSales;
    private double totalRevenue;
    private long totalBookings;
    private long pendingEnquiries;

    // Getters and Setters
    public long getTotalCars() { return totalCars; }
    public void setTotalCars(long totalCars) { this.totalCars = totalCars; }

    public long getAvailableCars() { return availableCars; }
    public void setAvailableCars(long availableCars) { this.availableCars = availableCars; }

    public long getSoldCars() { return soldCars; }
    public void setSoldCars(long soldCars) { this.soldCars = soldCars; }

    public long getTotalStaff() { return totalStaff; }
    public void setTotalStaff(long totalStaff) { this.totalStaff = totalStaff; }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalSales() { return totalSales; }
    public void setTotalSales(long totalSales) { this.totalSales = totalSales; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public long getPendingEnquiries() { return pendingEnquiries; }
    public void setPendingEnquiries(long pendingEnquiries) { this.pendingEnquiries = pendingEnquiries; }
}
