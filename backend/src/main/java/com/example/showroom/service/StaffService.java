package com.example.showroom.service;

import com.example.showroom.entity.Staff;
import com.example.showroom.exception.ResourceNotFoundException;
import com.example.showroom.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
    }

    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff updated) {
        Staff staff = getStaffById(id);
        staff.setName(updated.getName());
        staff.setEmail(updated.getEmail());
        staff.setPhone(updated.getPhone());
        staff.setPosition(updated.getPosition());
        staff.setDepartment(updated.getDepartment());
        staff.setSalary(updated.getSalary());
        staff.setJoiningDate(updated.getJoiningDate());
        staff.setStatus(updated.getStatus());
        return staffRepository.save(staff);
    }

    public void deleteStaff(Long id) {
        Staff staff = getStaffById(id);
        staffRepository.delete(staff);
    }
}
