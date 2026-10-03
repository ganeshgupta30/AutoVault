/**
 * AutoVault — Admin Portal Module
 * Renders Admin Sign-in, Admin Dashboard, Vehicle Mgmt, Customer Mgmt, Booking Mgmt, Enquiry Mgmt
 */

function isAdminLoggedIn() {
    const session = getSession();
    return session && (session.role === 'ADMIN' || session.role === 'ADMINISTRATOR');
}

// ==========================================
// 1. ADMIN LOGIN PAGE
// ==========================================
function renderAdminLoginPage() {
    const container = document.getElementById('auth-content');
    container.innerHTML = `
        <div class="auth-card admin-auth-card">
            <div class="auth-logo">
                <i class="fas fa-user-shield accent-icon"></i>
                <h2>Admin <span class="accent">Portal</span></h2>
                <p>System Administrator Login</p>
            </div>
            <form id="admin-login-form">
                <div class="form-group">
                    <label class="form-label">Admin Email</label>
                    <input type="email" id="admin-email" class="form-control" value="admin@showroom.com" placeholder="admin@showroom.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Master Password</label>
                    <input type="password" id="admin-password" class="form-control" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg" id="admin-login-btn">
                    <i class="fas fa-lock"></i> AUTHENTICATE ADMIN
                </button>
            </form>
            <div class="auth-footer">
                <a href="#login">← Return to User Portal</a>
            </div>
        </div>
    `;

    document.getElementById('admin-login-form').addEventListener('submit', handleAdminLogin);
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const btn = document.getElementById('admin-login-btn');

    if (!email || !password) {
        showToast('Please enter admin credentials', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

    try {
        const response = await api.auth.adminLogin(email, password);
        const userData = response.data || { name: 'Admin', email: email, role: 'ADMIN' };
        userData.role = 'ADMIN';
        saveSession(userData);
        showToast('Admin authentication successful!', 'success');
        setTimeout(() => navigate('admin-dashboard'), 600);
    } catch (error) {
        showToast(error.message || 'Admin login failed', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-lock"></i> AUTHENTICATE ADMIN';
    }
}

// ==========================================
// 2. ADMIN DASHBOARD
// ==========================================
async function renderAdminDashboard() {
    const content = document.getElementById('page-content');
    content.innerHTML = `<div class="text-center p-5"><i class="fas fa-spinner fa-spin fa-2x"></i> Loading Admin Dashboard...</div>`;

    try {
        const stats = await api.request('/dashboard/statistics');

        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card glass-card">
                    <div class="stat-icon car-bg"><i class="fas fa-car"></i></div>
                    <div class="stat-data">
                        <span class="stat-label">Total Vehicles</span>
                        <h3 class="stat-value">${stats.totalCars || 0}</h3>
                    </div>
                </div>

                <div class="stat-card glass-card">
                    <div class="stat-icon available-bg"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-data">
                        <span class="stat-label">Available Vehicles</span>
                        <h3 class="stat-value">${stats.availableCars || 0}</h3>
                    </div>
                </div>

                <div class="stat-card glass-card">
                    <div class="stat-icon sold-bg"><i class="fas fa-handshake"></i></div>
                    <div class="stat-data">
                        <span class="stat-label">Sold Vehicles</span>
                        <h3 class="stat-value">${stats.soldCars || 0}</h3>
                    </div>
                </div>

                <div class="stat-card glass-card">
                    <div class="stat-icon users-bg"><i class="fas fa-users"></i></div>
                    <div class="stat-data">
                        <span class="stat-label">Total Customers</span>
                        <h3 class="stat-value">${stats.totalCustomers || 0}</h3>
                    </div>
                </div>

                <div class="stat-card glass-card">
                    <div class="stat-icon booking-bg"><i class="fas fa-calendar-check"></i></div>
                    <div class="stat-data">
                        <span class="stat-label">Total Bookings</span>
                        <h3 class="stat-value">${stats.totalBookings || 0}</h3>
                    </div>
                </div>

                <div class="stat-card glass-card">
                    <div class="stat-icon enquiry-bg"><i class="fas fa-question-circle"></i></div>
                    <div class="stat-data">
                        <span class="stat-label">Pending Enquiries</span>
                        <h3 class="stat-value">${stats.pendingEnquiries || 0}</h3>
                    </div>
                </div>
            </div>

            <div class="admin-quick-actions mt-4 glass-card p-4">
                <h3 class="section-title"><i class="fas fa-bolt"></i> Admin Quick Navigation</h3>
                <div class="action-buttons-flex mt-3">
                    <button class="btn btn-primary" onclick="navigate('admin-vehicles')"><i class="fas fa-car"></i> Vehicle Management</button>
                    <button class="btn btn-secondary" onclick="navigate('admin-customers')"><i class="fas fa-users"></i> Customer Management</button>
                    <button class="btn btn-secondary" onclick="navigate('admin-bookings')"><i class="fas fa-calendar-alt"></i> Booking Management</button>
                    <button class="btn btn-secondary" onclick="navigate('admin-enquiries')"><i class="fas fa-envelope-open"></i> Enquiry Management</button>
                </div>
            </div>
        `;
    } catch (err) {
        content.innerHTML = `<div class="alert alert-error">Failed to load admin stats: ${err.message}</div>`;
    }
}

// ==========================================
// 3. ADMIN VEHICLES MANAGEMENT
// ==========================================
async function renderAdminVehicles() {
    const content = document.getElementById('page-content');
    content.innerHTML = `<div class="text-center p-5"><i class="fas fa-spinner fa-spin fa-2x"></i> Loading Vehicles...</div>`;

    try {
        const cars = await api.cars.getAll();
        content.innerHTML = `
            <div class="page-header-actions mb-4">
                <h2><i class="fas fa-car"></i> Vehicle Management</h2>
                <button class="btn btn-primary" id="admin-add-car-btn"><i class="fas fa-plus"></i> Add New Vehicle</button>
            </div>

            <div class="table-card glass-card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vehicle</th>
                            <th>Year</th>
                            <th>Price</th>
                            <th>Fuel / Transmission</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cars.map(c => `
                            <tr>
                                <td>#${c.id}</td>
                                <td><strong>${c.brand} ${c.model}</strong> <br><small class="text-secondary">${c.variant || ''}</small></td>
                                <td>${c.year || '2024'}</td>
                                <td>${formatPrice(c.price)}</td>
                                <td><span class="badge badge-subtle">${c.fuelType || 'Petrol'}</span> / <small>${c.transmission || 'Automatic'}</small></td>
                                <td>
                                    <span class="status-pill ${c.status === 'AVAILABLE' || c.availability ? 'status-available' : 'status-sold'}">
                                        ${c.status || (c.availability ? 'AVAILABLE' : 'UNAVAILABLE')}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-ghost" onclick="handleEditCarModal(${c.id})" title="Edit"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm btn-ghost text-danger" onclick="handleDeleteCar(${c.id})" title="Delete"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('admin-add-car-btn').addEventListener('click', handleAddCarModal);
    } catch (err) {
        content.innerHTML = `<div class="alert alert-error">Failed to load vehicles: ${err.message}</div>`;
    }
}

function handleAddCarModal() {
    const modalHTML = `
        <form id="car-form" class="modal-form">
            <div class="form-grid">
                <div class="form-group"><label>Brand</label><input type="text" id="car-brand" class="form-control" placeholder="BMW" required></div>
                <div class="form-group"><label>Model</label><input type="text" id="car-model" class="form-control" placeholder="M3 Competition" required></div>
                <div class="form-group"><label>Variant</label><input type="text" id="car-variant" class="form-control" placeholder="xDrive Sedan"></div>
                <div class="form-group"><label>Year</label><input type="number" id="car-year" class="form-control" value="2024" required></div>
                <div class="form-group"><label>Price (₹)</label><input type="number" id="car-price" class="form-control" placeholder="13000000" required></div>
                <div class="form-group"><label>VIN</label><input type="text" id="car-vin" class="form-control" placeholder="WBS33AY080FP12345"></div>
                <div class="form-group"><label>Fuel Type</label>
                    <select id="car-fuel" class="form-control">
                        <option value="PETROL">Petrol</option>
                        <option value="DIESEL">Diesel</option>
                        <option value="ELECTRIC">Electric</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                </div>
                <div class="form-group"><label>Transmission</label>
                    <select id="car-trans" class="form-control">
                        <option value="AUTOMATIC">Automatic</option>
                        <option value="MANUAL">Manual</option>
                    </select>
                </div>
                <div class="form-group"><label>Status</label>
                    <select id="car-status" class="form-control">
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="SOLD">SOLD</option>
                    </select>
                </div>
            </div>
            <div class="modal-actions mt-4">
                <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Vehicle</button>
            </div>
        </form>
    `;
    openModal('Add New Vehicle', modalHTML);

    document.getElementById('car-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newCar = {
            brand: document.getElementById('car-brand').value,
            model: document.getElementById('car-model').value,
            variant: document.getElementById('car-variant').value,
            year: parseInt(document.getElementById('car-year').value),
            price: parseFloat(document.getElementById('car-price').value),
            vin: document.getElementById('car-vin').value,
            fuelType: document.getElementById('car-fuel').value,
            transmission: document.getElementById('car-trans').value,
            status: document.getElementById('car-status').value,
            availability: document.getElementById('car-status').value === 'AVAILABLE'
        };

        try {
            await api.cars.create(newCar);
            showToast('Vehicle added successfully!', 'success');
            closeModal();
            renderAdminVehicles();
        } catch (err) {
            showToast(err.message || 'Failed to create vehicle', 'error');
        }
    });
}

async function handleDeleteCar(id) {
    const ok = await showConfirm('Delete Vehicle', 'Are you sure you want to delete this vehicle?');
    if (!ok) return;
    try {
        await api.cars.delete(id);
        showToast('Vehicle deleted successfully', 'success');
        renderAdminVehicles();
    } catch (err) {
        showToast(err.message || 'Failed to delete vehicle', 'error');
    }
}

// ==========================================
// 4. ADMIN CUSTOMER MANAGEMENT
// ==========================================
async function renderAdminCustomers() {
    const content = document.getElementById('page-content');
    content.innerHTML = `<div class="text-center p-5"><i class="fas fa-spinner fa-spin fa-2x"></i> Loading Customers...</div>`;

    try {
        const customers = await api.customers.getAll();
        content.innerHTML = `
            <div class="page-header-actions mb-4">
                <h2><i class="fas fa-users"></i> Customer Management</h2>
            </div>

            <div class="table-card glass-card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Email Address</th>
                            <th>Phone</th>
                            <th>City</th>
                            <th>Email Verification Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${customers.map(c => `
                            <tr>
                                <td>#${c.id}</td>
                                <td><strong>${c.name}</strong></td>
                                <td>${c.email}</td>
                                <td>${c.phone || 'N/A'}</td>
                                <td>${c.city || 'N/A'}</td>
                                <td>
                                    <span class="badge ${c.emailVerified !== false ? 'badge-success' : 'badge-warning'}">
                                        <i class="fas ${c.emailVerified !== false ? 'fa-check-circle' : 'fa-clock'}"></i>
                                        ${c.emailVerified !== false ? 'Verified' : 'Pending Verification'}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        content.innerHTML = `<div class="alert alert-error">Failed to load customers: ${err.message}</div>`;
    }
}

// ==========================================
// 5. ADMIN BOOKING MANAGEMENT
// ==========================================
async function renderAdminBookings() {
    const content = document.getElementById('page-content');
    content.innerHTML = `<div class="text-center p-5"><i class="fas fa-spinner fa-spin fa-2x"></i> Loading Bookings...</div>`;

    try {
        const bookings = await api.bookings.getAll();
        content.innerHTML = `
            <div class="page-header-actions mb-4">
                <h2><i class="fas fa-calendar-check"></i> Booking Management</h2>
            </div>

            <div class="table-card glass-card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Vehicle</th>
                            <th>Deposit Amount</th>
                            <th>Booking Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(b => `
                            <tr>
                                <td>#${b.id}</td>
                                <td><strong>${b.customerName}</strong><br><small class="text-secondary">${b.customerEmail}</small></td>
                                <td>${b.car ? `${b.car.brand} ${b.car.model}` : 'Vehicle Reserved'}</td>
                                <td>${formatPrice(b.bookingAmount || 50000)}</td>
                                <td>
                                    <span class="badge ${b.status === 'CONFIRMED' ? 'badge-success' : b.status === 'COMPLETED' ? 'badge-info' : 'badge-warning'}">
                                        ${b.status || 'PENDING'}
                                    </span>
                                </td>
                                <td>
                                    <select class="form-control form-control-sm" onchange="handleUpdateBookingStatus(${b.id}, this.value)">
                                        <option value="PENDING" ${b.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                                        <option value="CONFIRMED" ${b.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
                                        <option value="CANCELLED" ${b.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                                        <option value="COMPLETED" ${b.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                                    </select>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        content.innerHTML = `<div class="alert alert-error">Failed to load bookings: ${err.message}</div>`;
    }
}

async function handleUpdateBookingStatus(id, newStatus) {
    try {
        await api.bookings.updateStatus(id, newStatus);
        showToast(`Booking #${id} status updated to ${newStatus}`, 'success');
    } catch (err) {
        showToast(err.message || 'Failed to update booking status', 'error');
    }
}

// ==========================================
// 6. ADMIN ENQUIRY MANAGEMENT
// ==========================================
async function renderAdminEnquiries() {
    const content = document.getElementById('page-content');
    content.innerHTML = `<div class="text-center p-5"><i class="fas fa-spinner fa-spin fa-2x"></i> Loading Enquiries...</div>`;

    try {
        const enquiries = await api.enquiries.getAll();
        content.innerHTML = `
            <div class="page-header-actions mb-4">
                <h2><i class="fas fa-envelope-open-text"></i> Customer Enquiry Management</h2>
            </div>

            <div class="table-card glass-card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Target Vehicle</th>
                            <th>Subject / Message</th>
                            <th>Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${enquiries.map(e => `
                            <tr>
                                <td>#${e.id}</td>
                                <td><strong>${e.name}</strong><br><small class="text-secondary">${e.email}</small></td>
                                <td><span class="badge badge-subtle">${e.carModel || 'General'}</span></td>
                                <td>
                                    <strong>${e.subject || 'Inquiry'}</strong><br>
                                    <small class="text-secondary">${e.message || ''}</small>
                                </td>
                                <td>
                                    <span class="badge ${e.status === 'RESOLVED' ? 'badge-success' : e.status === 'IN_PROGRESS' ? 'badge-info' : 'badge-warning'}">
                                        ${e.status || 'PENDING'}
                                    </span>
                                </td>
                                <td>
                                    <select class="form-control form-control-sm" onchange="handleUpdateEnquiryStatus(${e.id}, this.value)">
                                        <option value="PENDING" ${e.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                                        <option value="IN_PROGRESS" ${e.status === 'IN_PROGRESS' ? 'selected' : ''}>IN_PROGRESS</option>
                                        <option value="RESOLVED" ${e.status === 'RESOLVED' ? 'selected' : ''}>RESOLVED</option>
                                        <option value="CLOSED" ${e.status === 'CLOSED' ? 'selected' : ''}>CLOSED</option>
                                    </select>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        content.innerHTML = `<div class="alert alert-error">Failed to load enquiries: ${err.message}</div>`;
    }
}

async function handleUpdateEnquiryStatus(id, newStatus) {
    try {
        await api.enquiries.updateStatus(id, newStatus);
        showToast(`Enquiry #${id} status updated to ${newStatus}`, 'success');
    } catch (err) {
        showToast(err.message || 'Failed to update enquiry status', 'error');
    }
}
