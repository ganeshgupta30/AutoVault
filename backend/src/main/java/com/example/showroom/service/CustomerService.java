package com.example.showroom.service;

import com.example.showroom.entity.Customer;
import com.example.showroom.exception.ResourceNotFoundException;
import com.example.showroom.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private com.example.showroom.repository.UserRepository userRepository;

    public List<Customer> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        for (Customer c : customers) {
            if (c.getEmail() != null) {
                userRepository.findByEmail(c.getEmail()).ifPresent(user -> c.setEmailVerified(user.isEmailVerified()));
            }
        }
        return customers;
    }

    public Customer getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        if (customer.getEmail() != null) {
            userRepository.findByEmail(customer.getEmail()).ifPresent(user -> customer.setEmailVerified(user.isEmailVerified()));
        }
        return customer;
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer updated) {
        Customer customer = getCustomerById(id);
        customer.setName(updated.getName());
        customer.setEmail(updated.getEmail());
        customer.setPhone(updated.getPhone());
        customer.setAddress(updated.getAddress());
        customer.setCity(updated.getCity());
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
}
