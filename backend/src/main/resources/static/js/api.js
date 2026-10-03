/**
 * AutoVault — API Layer with Smart Fallback (Live Backend + Interactive Demo Mode)
 * Ensures 100% interactive operation even if Spring Boot server is not running!
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Demo Mock Data for Fallback Mode
const MOCK_DATA = {
    user: {
        id: 1,
        name: 'Admin User',
        email: 'admin@autovault.com',
        role: 'ADMINISTRATOR',
        verified: true
    },
    cars: [
        { id: 1, brand: 'BMW', model: 'M3 Competition', variant: 'xDrive Sedan', year: 2024, price: 13000000, vin: 'WBS33AY080FP12345', color: 'Isle of Man Green', fuelType: 'PETROL', transmission: 'AUTOMATIC', status: 'AVAILABLE', mileage: 10.2, imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=60' },
        { id: 2, brand: 'Mercedes-Benz', model: 'AMG GT 63 S', variant: '4-Door Coupe', year: 2024, price: 27000000, vin: 'W1K7Y8KB7MA987654', color: 'Obsidian Black', fuelType: 'PETROL', transmission: 'AUTOMATIC', status: 'AVAILABLE', mileage: 8.5, imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=60' },
        { id: 3, brand: 'Porsche', model: '911 Carrera S', variant: 'Coupe', year: 2023, price: 20000000, vin: 'WP0AA2A94LS234567', color: 'Guards Red', fuelType: 'PETROL', transmission: 'AUTOMATIC', status: 'RESERVED', mileage: 11.0, imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60' },
        { id: 4, brand: 'Audi', model: 'RS e-tron GT', variant: 'Quattro EV', year: 2024, price: 19500000, vin: 'WAUZZZFW8NA345678', color: 'Daytona Gray', fuelType: 'ELECTRIC', transmission: 'AUTOMATIC', status: 'AVAILABLE', mileage: 0, imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&auto=format&fit=crop&q=60' },
        { id: 5, brand: 'Toyota', model: 'Land Cruiser 300', variant: 'ZX V6 Diesel', year: 2023, price: 21000000, vin: 'JTE2A91D007012345', color: 'Pearl White', fuelType: 'DIESEL', transmission: 'AUTOMATIC', status: 'SOLD', mileage: 12.5, imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=60' },
        { id: 6, brand: 'Tata', model: 'Harrier Dark Edition', variant: 'Fearless+ AT', year: 2024, price: 2640000, vin: 'MAT612034R109876', color: 'Oberon Black', fuelType: 'DIESEL', transmission: 'AUTOMATIC', status: 'AVAILABLE', mileage: 16.8, imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60' }
    ],
    customers: [
        { id: 1, name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', phone: '+91 98200 12345', city: 'Mumbai', address: 'Bandra West', registrationDate: '2024-01-15' },
        { id: 2, name: 'Priya Sharma', email: 'priya.s@yahoo.com', phone: '+91 98199 87654', city: 'Delhi', address: 'Vasant Vihar', registrationDate: '2024-02-20' },
        { id: 3, name: 'Karan Patel', email: 'karan.patel@tech.in', phone: '+91 97000 55443', city: 'Ahmedabad', address: 'SG Highway', registrationDate: '2024-03-05' },
        { id: 4, name: 'Ananya Roy', email: 'ananya.roy@outlook.com', phone: '+91 99300 44321', city: 'Bengaluru', address: 'Indiranagar', registrationDate: '2024-04-10' }
    ],
    staff: [
        { id: 1, name: 'Vikram Malhotra', role: 'Showroom Manager', email: 'vikram@autovault.com', phone: '+91 98765 00001', salary: 120000 },
        { id: 2, name: 'Rohan Deshmukh', role: 'Sales Representative', email: 'rohan@autovault.com', phone: '+91 98765 00002', salary: 65000 },
        { id: 3, name: 'Neha Gupta', role: 'Inventory Manager', email: 'neha@autovault.com', phone: '+91 98765 00003', salary: 75000 },
        { id: 4, name: 'Siddharth Rao', role: 'Sales Representative', email: 'siddharth@autovault.com', phone: '+91 98765 00004', salary: 60000 }
    ],
    sales: [
        { id: 101, saleDate: '2024-05-12', carId: 5, customerId: 1, staffId: 2, sellingPrice: 20500000, paymentStatus: 'COMPLETED', car: { brand: 'Toyota', model: 'Land Cruiser 300', vin: 'JTE2A91D007012345' }, customer: { name: 'Arjun Mehta' }, staff: { name: 'Rohan Deshmukh' } },
        { id: 102, saleDate: '2024-06-01', carId: 3, customerId: 2, staffId: 1, sellingPrice: 19800000, paymentStatus: 'PARTIAL', car: { brand: 'Porsche', model: '911 Carrera S', vin: 'WP0AA2A94LS234567' }, customer: { name: 'Priya Sharma' }, staff: { name: 'Vikram Malhotra' } }
    ],
    bookings: [
        { id: 1, customerName: 'Arjun Mehta', customerEmail: 'arjun.mehta@gmail.com', customerPhone: '+91 98200 12345', bookingAmount: 50000, status: 'CONFIRMED', bookingDate: '2024-06-10', car: { brand: 'BMW', model: 'M3 Competition' }, notes: 'Test drive completed.' },
        { id: 2, customerName: 'Priya Sharma', customerEmail: 'priya.s@yahoo.com', customerPhone: '+91 98199 87654', bookingAmount: 100000, status: 'PENDING', bookingDate: '2024-06-15', car: { brand: 'Mercedes-Benz', model: 'AMG GT 63 S' }, notes: 'Awaiting finance approval.' },
        { id: 3, customerName: 'Karan Patel', customerEmail: 'karan.patel@tech.in', customerPhone: '+91 97000 55443', bookingAmount: 100000, status: 'COMPLETED', bookingDate: '2024-06-20', car: { brand: 'Porsche', model: '911 Carrera S' }, notes: 'Full payment received.' }
    ],
    enquiries: [
        { id: 1, name: 'Ananya Roy', email: 'ananya.roy@outlook.com', phone: '+91 99300 44321', carModel: 'Audi RS e-tron GT', subject: 'On-road price inquiry', message: 'Would like to know the waiting period and charging installation details.', status: 'PENDING', createdAt: '2024-06-18' },
        { id: 2, name: 'Siddharth Rao', email: 'sid.rao@email.com', phone: '+91 99887 76659', carModel: 'BMW 3 Series', subject: 'Test Drive Request', message: 'Requesting test drive for tomorrow afternoon at Mumbai showroom.', status: 'IN_PROGRESS', createdAt: '2024-06-19' },
        { id: 3, name: 'Meera Nair', email: 'meera.n@email.com', phone: '+91 99887 76660', carModel: 'Mercedes-Benz C-Class', subject: 'Exchange Value Enquiry', message: 'Looking to trade in 2021 Honda City.', status: 'RESOLVED', createdAt: '2024-06-21' }
    ]
};

const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options
        };

        try {
            const controller = new AbortController();
            // Allow up to 15 seconds for backend requests (especially SMTP email sending)
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            config.signal = controller.signal;

            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                const apiErr = new Error(data.message || `Request failed with status ${response.status}`);
                apiErr.status = response.status;
                apiErr.isApiError = true;
                apiErr.data = data;
                throw apiErr;
            }
            return data;
        } catch (error) {
            // Re-throw legitimate API error responses (400 Bad Request, 429 Too Many Requests, etc.)
            if (error.isApiError) {
                throw error;
            }
            // Graceful Fallback to Mock Data only if backend is unreachable / network failed
            console.warn(`[AutoVault API] Backend unreachable at ${endpoint}. Using interactive demo data.`);
            window.isDemoMode = true;
            return this.getMockResponse(endpoint, options);
        }
    },

    getMockResponse(endpoint, options) {
        const method = options.method || 'GET';

        // Auth Mocking
        if (endpoint.includes('/auth/admin-login') || endpoint.includes('/auth/login')) {
            return Promise.resolve({ success: true, message: 'Login successful (Demo Mode)', data: MOCK_DATA.user });
        }
        if (endpoint.includes('/auth/register')) {
            return Promise.resolve({ success: true, message: 'Registration successful! (Demo Mode)' });
        }
        if (endpoint.includes('/auth/send-otp') || endpoint.includes('/auth/resend-otp')) {
            return Promise.resolve({ success: true, message: 'OTP sent: 123456 (Demo Mode)' });
        }
        if (endpoint.includes('/auth/verify-otp')) {
            const body = options.body ? JSON.parse(options.body) : {};
            if (body.otp && body.otp.length === 6) {
                const userEmail = body.email || 'user@autovault.com';
                const userName = userEmail.split('@')[0];
                return Promise.resolve({
                    success: true,
                    message: 'Email verified successfully! (Demo Mode)',
                    data: {
                        userId: 1,
                        id: 1,
                        name: userName.charAt(0).toUpperCase() + userName.slice(1),
                        email: userEmail,
                        role: 'USER',
                        verified: true
                    }
                });
            } else {
                return Promise.reject(new Error('Invalid 6-digit OTP code'));
            }
        }

        // Cars Mocking
        if (endpoint === '/cars') {
            if (method === 'POST') {
                const newCar = JSON.parse(options.body);
                newCar.id = MOCK_DATA.cars.length + 1;
                MOCK_DATA.cars.unshift(newCar);
                return Promise.resolve(newCar);
            }
            return Promise.resolve(MOCK_DATA.cars);
        }
        if (endpoint.startsWith('/cars/')) {
            const id = parseInt(endpoint.split('/')[2]);
            if (method === 'PUT') {
                const updated = JSON.parse(options.body);
                const idx = MOCK_DATA.cars.findIndex(c => c.id === id);
                if (idx !== -1) MOCK_DATA.cars[idx] = { ...MOCK_DATA.cars[idx], ...updated };
                return Promise.resolve(MOCK_DATA.cars[idx]);
            }
            if (method === 'DELETE') {
                MOCK_DATA.cars = MOCK_DATA.cars.filter(c => c.id !== id);
                return Promise.resolve({ success: true });
            }
            return Promise.resolve(MOCK_DATA.cars.find(c => c.id === id) || MOCK_DATA.cars[0]);
        }
        if (endpoint.includes('/cars/brands')) {
            return Promise.resolve(['BMW', 'Mercedes-Benz', 'Porsche', 'Audi', 'Toyota', 'Tata']);
        }

        // Customers Mocking
        if (endpoint === '/customers') {
            if (method === 'POST') {
                const newCust = JSON.parse(options.body);
                newCust.id = MOCK_DATA.customers.length + 1;
                newCust.registrationDate = new Date().toISOString().split('T')[0];
                MOCK_DATA.customers.unshift(newCust);
                return Promise.resolve(newCust);
            }
            return Promise.resolve(MOCK_DATA.customers);
        }
        if (endpoint.startsWith('/customers/')) {
            const id = parseInt(endpoint.split('/')[2]);
            if (method === 'PUT') {
                const updated = JSON.parse(options.body);
                const idx = MOCK_DATA.customers.findIndex(c => c.id === id);
                if (idx !== -1) MOCK_DATA.customers[idx] = { ...MOCK_DATA.customers[idx], ...updated };
                return Promise.resolve(MOCK_DATA.customers[idx]);
            }
            if (method === 'DELETE') {
                MOCK_DATA.customers = MOCK_DATA.customers.filter(c => c.id !== id);
                return Promise.resolve({ success: true });
            }
        }

        // Staff Mocking
        if (endpoint === '/staff') {
            if (method === 'POST') {
                const newStaff = JSON.parse(options.body);
                newStaff.id = MOCK_DATA.staff.length + 1;
                MOCK_DATA.staff.unshift(newStaff);
                return Promise.resolve(newStaff);
            }
            return Promise.resolve(MOCK_DATA.staff);
        }
        if (endpoint.startsWith('/staff/')) {
            const id = parseInt(endpoint.split('/')[2]);
            if (method === 'PUT') {
                const updated = JSON.parse(options.body);
                const idx = MOCK_DATA.staff.findIndex(s => s.id === id);
                if (idx !== -1) MOCK_DATA.staff[idx] = { ...MOCK_DATA.staff[idx], ...updated };
                return Promise.resolve(MOCK_DATA.staff[idx]);
            }
            if (method === 'DELETE') {
                MOCK_DATA.staff = MOCK_DATA.staff.filter(s => s.id !== id);
                return Promise.resolve({ success: true });
            }
        }

        // Sales Mocking
        if (endpoint === '/sales') {
            if (method === 'POST') {
                const newSale = JSON.parse(options.body);
                newSale.id = 100 + MOCK_DATA.sales.length + 1;
                const car = MOCK_DATA.cars.find(c => c.id === newSale.carId);
                const cust = MOCK_DATA.customers.find(c => c.id === newSale.customerId);
                const stf = MOCK_DATA.staff.find(s => s.id === newSale.staffId);

                if (car) car.status = 'SOLD';
                newSale.car = car;
                newSale.customer = cust;
                newSale.staff = stf;

                MOCK_DATA.sales.unshift(newSale);
                return Promise.resolve(newSale);
            }
            return Promise.resolve(MOCK_DATA.sales);
        }
        if (endpoint.startsWith('/sales/') && method === 'DELETE') {
            const id = parseInt(endpoint.split('/')[2]);
            MOCK_DATA.sales = MOCK_DATA.sales.filter(s => s.id !== id);
            return Promise.resolve({ success: true });
        }

        // Bookings Mocking
        if (endpoint === '/bookings' || endpoint.startsWith('/bookings?')) {
            if (method === 'POST') {
                const newB = JSON.parse(options.body);
                newB.id = MOCK_DATA.bookings.length + 1;
                MOCK_DATA.bookings.unshift(newB);
                return Promise.resolve(newB);
            }
            return Promise.resolve(MOCK_DATA.bookings);
        }
        if (endpoint.includes('/bookings/') && endpoint.endsWith('/status')) {
            const parts = endpoint.split('/');
            const id = parseInt(parts[2]);
            const payload = JSON.parse(options.body);
            const b = MOCK_DATA.bookings.find(item => item.id === id);
            if (b) b.status = payload.status;
            return Promise.resolve(b || MOCK_DATA.bookings[0]);
        }
        if (endpoint.startsWith('/bookings/') && method === 'DELETE') {
            const id = parseInt(endpoint.split('/')[2]);
            MOCK_DATA.bookings = MOCK_DATA.bookings.filter(b => b.id !== id);
            return Promise.resolve({ success: true });
        }
        if (endpoint.startsWith('/bookings/')) {
            const id = parseInt(endpoint.split('/')[2]);
            return Promise.resolve(MOCK_DATA.bookings.find(b => b.id === id) || MOCK_DATA.bookings[0]);
        }

        // Enquiries Mocking
        if (endpoint === '/enquiries') {
            if (method === 'POST') {
                const newE = JSON.parse(options.body);
                newE.id = MOCK_DATA.enquiries.length + 1;
                MOCK_DATA.enquiries.unshift(newE);
                return Promise.resolve(newE);
            }
            return Promise.resolve(MOCK_DATA.enquiries);
        }
        if (endpoint.includes('/enquiries/') && endpoint.endsWith('/status')) {
            const parts = endpoint.split('/');
            const id = parseInt(parts[2]);
            const payload = JSON.parse(options.body);
            const e = MOCK_DATA.enquiries.find(item => item.id === id);
            if (e) e.status = payload.status;
            return Promise.resolve(e || MOCK_DATA.enquiries[0]);
        }
        if (endpoint.startsWith('/enquiries/') && method === 'DELETE') {
            const id = parseInt(endpoint.split('/')[2]);
            MOCK_DATA.enquiries = MOCK_DATA.enquiries.filter(en => en.id !== id);
            return Promise.resolve({ success: true });
        }
        if (endpoint.startsWith('/enquiries/')) {
            const id = parseInt(endpoint.split('/')[2]);
            return Promise.resolve(MOCK_DATA.enquiries.find(en => en.id === id) || MOCK_DATA.enquiries[0]);
        }

        // Dashboard Statistics Mocking
        if (endpoint.includes('/dashboard/statistics')) {
            const available = MOCK_DATA.cars.filter(c => c.status === 'AVAILABLE' || c.availability === true).length;
            const sold = MOCK_DATA.cars.filter(c => c.status === 'SOLD').length;
            const revenue = MOCK_DATA.sales.reduce((acc, s) => acc + (s.sellingPrice || 0), 0);
            return Promise.resolve({
                totalCars: MOCK_DATA.cars.length,
                availableCars: available,
                soldCars: sold,
                totalCustomers: MOCK_DATA.customers.length,
                totalStaff: MOCK_DATA.staff.length,
                totalRevenue: revenue || 40300000,
                totalBookings: MOCK_DATA.bookings.length,
                pendingEnquiries: MOCK_DATA.enquiries.filter(e => e.status === 'PENDING').length
            });
        }
        if (endpoint.includes('/dashboard/monthly-sales')) {
            return Promise.resolve([
                { month: 'Jan', count: 4 },
                { month: 'Feb', count: 7 },
                { month: 'Mar', count: 5 },
                { month: 'Apr', count: 9 },
                { month: 'May', count: 12 },
                { month: 'Jun', count: 8 }
            ]);
        }
        if (endpoint.includes('/dashboard/brand-statistics')) {
            return Promise.resolve([
                { brand: 'BMW', count: 5 },
                { brand: 'Mercedes-Benz', count: 4 },
                { brand: 'Porsche', count: 3 },
                { brand: 'Audi', count: 4 },
                { brand: 'Toyota', count: 6 }
            ]);
        }
        if (endpoint.includes('/dashboard/inventory-statistics')) {
            return Promise.resolve([
                { brand: 'BMW', total: 6, available: 4 },
                { brand: 'Mercedes', total: 5, available: 3 },
                { brand: 'Porsche', total: 4, available: 2 },
                { brand: 'Audi', total: 4, available: 3 },
                { brand: 'Tata', total: 8, available: 6 }
            ]);
        }

        return Promise.resolve([]);
    },

    auth: {
        register(name, email, password) {
            return api.request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
        },
        sendOtp(email) {
            return api.request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) });
        },
        verifyOtp(email, otp) {
            return api.request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) });
        },
        resendOtp(email) {
            return api.request('/auth/resend-otp', { method: 'POST', body: JSON.stringify({ email }) });
        },
        login(email, password) {
            return api.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        },
        adminLogin(email, password) {
            return api.request('/auth/admin-login', { method: 'POST', body: JSON.stringify({ email, password }) });
        }
    },
    cars: {
        getAll() { return api.request('/cars'); },
        getById(id) { return api.request(`/cars/${id}`); },
        create(car) { return api.request('/cars', { method: 'POST', body: JSON.stringify(car) }); },
        update(id, car) { return api.request(`/cars/${id}`, { method: 'PUT', body: JSON.stringify(car) }); },
        delete(id) { return api.request(`/cars/${id}`, { method: 'DELETE' }); },
        getBrands() { return api.request('/cars/brands'); }
    },
    staff: {
        getAll() { return api.request('/staff'); },
        getById(id) { return api.request(`/staff/${id}`); },
        create(staff) { return api.request('/staff', { method: 'POST', body: JSON.stringify(staff) }); },
        update(id, staff) { return api.request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(staff) }); },
        delete(id) { return api.request(`/staff/${id}`, { method: 'DELETE' }); }
    },
    customers: {
        getAll() { return api.request('/customers'); },
        getById(id) { return api.request(`/customers/${id}`); },
        create(customer) { return api.request('/customers', { method: 'POST', body: JSON.stringify(customer) }); },
        update(id, customer) { return api.request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(customer) }); },
        delete(id) { return api.request(`/customers/${id}`, { method: 'DELETE' }); }
    },
    bookings: {
        getAll() { return api.request('/bookings'); },
        getById(id) { return api.request(`/bookings/${id}`); },
        create(booking, carId) { return api.request(`/bookings?carId=${carId}`, { method: 'POST', body: JSON.stringify(booking) }); },
        updateStatus(id, status) { return api.request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }); },
        delete(id) { return api.request(`/bookings/${id}`, { method: 'DELETE' }); }
    },
    enquiries: {
        getAll() { return api.request('/enquiries'); },
        getById(id) { return api.request(`/enquiries/${id}`); },
        create(enquiry) { return api.request('/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }); },
        updateStatus(id, status) { return api.request(`/enquiries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }); },
        delete(id) { return api.request(`/enquiries/${id}`, { method: 'DELETE' }); }
    },
    sales: {
        getAll() { return api.request('/sales'); },
        getById(id) { return api.request(`/sales/${id}`); },
        create(saleData) { return api.request('/sales', { method: 'POST', body: JSON.stringify(saleData) }); },
        delete(id) { return api.request(`/sales/${id}`, { method: 'DELETE' }); }
    },
    dashboard: {
        getStatistics() { return api.request('/dashboard/statistics'); },
        getMonthlySales() { return api.request('/dashboard/monthly-sales'); },
        getBrandStatistics() { return api.request('/dashboard/brand-statistics'); },
        getInventoryStatistics() { return api.request('/dashboard/inventory-statistics'); }
    }
};
