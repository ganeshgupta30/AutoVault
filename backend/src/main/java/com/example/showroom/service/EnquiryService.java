package com.example.showroom.service;

import com.example.showroom.entity.Enquiry;
import com.example.showroom.exception.ResourceNotFoundException;
import com.example.showroom.repository.EnquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EnquiryService {

    @Autowired
    private EnquiryRepository enquiryRepository;

    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll();
    }

    public Enquiry getEnquiryById(Long id) {
        return enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));
    }

    public Enquiry createEnquiry(Enquiry enquiry) {
        if (enquiry.getStatus() == null) {
            enquiry.setStatus("PENDING");
        }
        return enquiryRepository.save(enquiry);
    }

    public Enquiry updateEnquiryStatus(Long id, String status) {
        Enquiry enquiry = getEnquiryById(id);
        enquiry.setStatus(status.toUpperCase());
        return enquiryRepository.save(enquiry);
    }

    public void deleteEnquiry(Long id) {
        Enquiry enquiry = getEnquiryById(id);
        enquiryRepository.delete(enquiry);
    }

    public long getPendingEnquiriesCount() {
        return enquiryRepository.countByStatus("PENDING");
    }
}
