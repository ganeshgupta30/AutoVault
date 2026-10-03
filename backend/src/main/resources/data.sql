-- ============================================
-- Automobile Showroom - Sample Seed Data
-- ============================================

-- Sample Cars (15 cars across different brands)
INSERT INTO cars (brand, model, variant, year, price, fuel_type, transmission, color, mileage, engine_capacity, seating_capacity, stock, availability, image_url) VALUES
('Toyota', 'Fortuner', 'Legender 4x4', 2024, 4500000, 'Diesel', 'Automatic', 'Pearl White', 10, '2755 cc', 7, 3, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-19.jpeg'),
('Honda', 'City', 'ZX CVT', 2024, 1500000, 'Petrol', 'Automatic', 'Radiant Red', 18, '1498 cc', 5, 5, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg'),
('Hyundai', 'Creta', 'SX(O)', 2024, 1800000, 'Diesel', 'Automatic', 'Abyss Black', 21, '1493 cc', 5, 4, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-2.jpeg'),
('BMW', '3 Series', '330i M Sport', 2024, 5500000, 'Petrol', 'Automatic', 'Alpine White', 16, '1998 cc', 5, 2, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/153893/3-series-exterior-right-front-three-quarter-2.jpeg'),
('Mercedes-Benz', 'C-Class', 'C300d AMG Line', 2024, 6200000, 'Diesel', 'Automatic', 'Obsidian Black', 18, '1993 cc', 5, 2, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/112839/c-class-exterior-right-front-three-quarter-3.jpeg'),
('Maruti Suzuki', 'Swift', 'ZXi+ AMT', 2024, 850000, 'Petrol', 'Automatic', 'Sizzling Red', 25, '1197 cc', 5, 8, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/swift-exterior-right-front-three-quarter.jpeg'),
('Tata', 'Nexon', 'Creative+ Diesel', 2024, 1400000, 'Diesel', 'Manual', 'Daytona Grey', 24, '1497 cc', 5, 6, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-2.jpeg'),
('Mahindra', 'Thar', 'LX Hard Top Diesel AT', 2024, 1800000, 'Diesel', 'Automatic', 'Galaxy Grey', 15, '2184 cc', 4, 3, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg'),
('Kia', 'Seltos', 'HTX+ IVT', 2024, 1700000, 'Petrol', 'Automatic', 'Gravity Grey', 17, '1497 cc', 5, 4, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/174323/seltos-exterior-right-front-three-quarter.jpeg'),
('Audi', 'A4', 'Premium Plus', 2024, 4800000, 'Petrol', 'Automatic', 'Navarra Blue', 17, '1984 cc', 5, 1, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/51909/a4-exterior-right-front-three-quarter-2.jpeg'),
('Toyota', 'Innova Crysta', 'GX 2.4', 2024, 2100000, 'Diesel', 'Manual', 'Super White', 15, '2393 cc', 7, 3, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter.jpeg'),
('Honda', 'Amaze', 'VX CVT', 2024, 900000, 'Petrol', 'Automatic', 'Platinum White', 19, '1199 cc', 5, 5, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/186893/amaze-exterior-right-front-three-quarter-2.jpeg'),
('Hyundai', 'Verna', 'SX(O) Turbo DCT', 2024, 1700000, 'Petrol', 'Automatic', 'Fiery Red', 20, '1482 cc', 5, 3, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/verna-exterior-right-front-three-quarter.jpeg'),
('Tata', 'Harrier', 'Fearless+ AT', 2024, 2500000, 'Diesel', 'Automatic', 'Ash Grey', 14, '1956 cc', 5, 2, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139139/harrier-exterior-right-front-three-quarter-75.jpeg'),
('Maruti Suzuki', 'Baleno', 'Alpha AMT', 2024, 950000, 'Petrol', 'Automatic', 'Nexa Blue', 22, '1197 cc', 5, 7, true, 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159101/baleno-exterior-right-front-three-quarter.jpeg')
ON CONFLICT DO NOTHING;

-- Sample Staff (6 staff members)
INSERT INTO staff (name, email, phone, position, department, salary, joining_date, status) VALUES
('Rajesh Kumar', 'rajesh@showroom.com', '9876543210', 'Sales Manager', 'Sales', 85000, '2022-03-15', 'Active'),
('Priya Sharma', 'priya@showroom.com', '9876543211', 'Sales Executive', 'Sales', 45000, '2023-01-10', 'Active'),
('Amit Patel', 'amit@showroom.com', '9876543212', 'Finance Manager', 'Finance', 75000, '2021-06-20', 'Active'),
('Sneha Desai', 'sneha@showroom.com', '9876543213', 'Customer Relations', 'Service', 40000, '2023-07-01', 'Active'),
('Vikram Singh', 'vikram@showroom.com', '9876543214', 'Service Technician', 'Service', 35000, '2022-11-05', 'Active'),
('Neha Gupta', 'neha@showroom.com', '9876543215', 'Sales Executive', 'Sales', 42000, '2024-02-14', 'Active')
ON CONFLICT DO NOTHING;

-- Sample Customers (6 customers)
INSERT INTO customers (name, email, phone, address, city, registration_date) VALUES
('Arjun Mehta', 'arjun.mehta@email.com', '9988776655', '42 Marine Drive', 'Mumbai', '2024-01-15'),
('Kavita Joshi', 'kavita.j@email.com', '9988776656', '15 MG Road', 'Pune', '2024-02-20'),
('Rohan Deshmukh', 'rohan.d@email.com', '9988776657', '78 FC Road', 'Pune', '2024-03-10'),
('Ananya Kapoor', 'ananya.k@email.com', '9988776658', '23 Linking Road', 'Mumbai', '2024-04-05'),
('Siddharth Rao', 'sid.rao@email.com', '9988776659', '56 Brigade Road', 'Bangalore', '2024-05-18'),
('Meera Nair', 'meera.n@email.com', '9988776660', '90 Anna Salai', 'Chennai', '2024-06-22')
ON CONFLICT DO NOTHING;

-- Sample Admin User (password: admin123 - SHA-256 hashed)
INSERT INTO users (name, email, password, role, email_verified, created_at) VALUES
('Admin', 'admin@showroom.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'ADMIN', true, NOW())
ON CONFLICT DO NOTHING;

-- Sample Bookings (3 bookings)
INSERT INTO bookings (customer_name, customer_email, customer_phone, car_id, booking_amount, status, notes, booking_date) VALUES
('Arjun Mehta', 'arjun.mehta@email.com', '9988776655', 1, 50000, 'CONFIRMED', 'Test drive requested for Legender 4x4', NOW()),
('Kavita Joshi', 'kavita.j@email.com', '9988776656', 4, 100000, 'PENDING', 'Financing inquiry attached', NOW()),
('Rohan Deshmukh', 'rohan.d@email.com', '9988776657', 5, 100000, 'COMPLETED', 'Full payment received', NOW())
ON CONFLICT DO NOTHING;

-- Sample Enquiries (3 enquiries)
INSERT INTO enquiries (name, email, phone, car_model, subject, message, status, created_at) VALUES
('Ananya Kapoor', 'ananya.k@email.com', '9988776658', 'Toyota Fortuner', 'Inquiry for On-Road Price in Mumbai', 'Would like to know the exact waiting period and discounts on Fortuner ZX.', 'PENDING', NOW()),
('Siddharth Rao', 'sid.rao@email.com', '9988776659', 'BMW 3 Series', 'Test Drive Schedule Request', 'Can I schedule a test drive for tomorrow afternoon at your showroom?', 'IN_PROGRESS', NOW()),
('Meera Nair', 'meera.n@email.com', '9988776660', 'Mercedes-Benz C-Class', 'Exchange Offer Enquiry', 'I want to exchange my 2020 Honda City. Please calculate exchange value.', 'RESOLVED', NOW())
ON CONFLICT DO NOTHING;

