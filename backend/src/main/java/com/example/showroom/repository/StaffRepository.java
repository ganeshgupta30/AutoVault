package com.example.showroom.repository;

import com.example.showroom.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    boolean existsByEmail(String email);
}
