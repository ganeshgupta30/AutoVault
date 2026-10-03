/**
 * AutoVault — Customers Module
 */
let allCustomers = [];
let editingCustomerId = null;

function renderCustomers() {
    const container = document.getElementById('page-content');
    container.innerHTML = `
        <div class="action-bar glass-card">
            <div class="action-inputs">
                <div class="search-input-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" id="search-customers" class="form-control" placeholder="Search customer name, email, phone..." onkeyup="searchCustomers()">
                </div>
            </div>
            <button class="btn btn-primary" onclick="showAddCustomerModal()">
                <i class="fas fa-user-plus"></i> Add New Customer
            </button>
        </div>

        <div class="table-card glass-card mt-4">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Email Address</th>
                            <th>Phone</th>
                            <th>City</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="customers-tbody">
                        <tr><td colspan="6" class="text-center text-muted" style="padding:40px;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    initCustomersPage();
}

async function initCustomersPage() {
    await loadCustomers();
}

async function loadCustomers() {
    try {
        allCustomers = await api.customers.getAll();
        renderCustomersTable(allCustomers);
    } catch (error) {
        showToast('Failed to load customers', 'error');
    }
}

function renderCustomersTable(customers) {
    const tbody = document.getElementById('customers-tbody');
    if (!tbody) return;

    if (!customers || customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:40px;">No customers found</td></tr>';
        return;
    }

    tbody.innerHTML = customers.map(c => `
        <tr>
            <td>
                <div class="d-flex align-center gap-2">
                    <div class="user-avatar-sm">${(c.name || 'C').charAt(0).toUpperCase()}</div>
                    <strong class="text-heading">${c.name}</strong>
                </div>
            </td>
            <td>${c.email || '—'}</td>
            <td>${c.phone || '—'}</td>
            <td>${c.city || '—'}</td>
            <td class="text-muted text-xs">${c.address || '—'}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-ghost btn-sm" onclick="editCustomer(${c.id})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-ghost btn-sm text-danger" onclick="deleteCustomer(${c.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchCustomers() {
    const keyword = (document.getElementById('search-customers')?.value || '').toLowerCase();
    const filtered = allCustomers.filter(c => `${c.name} ${c.email || ''} ${c.phone || ''} ${c.city || ''}`.toLowerCase().includes(keyword));
    renderCustomersTable(filtered);
}

function showAddCustomerModal() {
    editingCustomerId = null;
    openModal('Add New Customer', `
        <form id="customer-form" onsubmit="handleCustomerSubmit(event)">
            <div class="form-grid">
                <div class="form-group full-width">
                    <label class="form-label">Full Name *</label>
                    <input type="text" id="cust-name" class="form-control" placeholder="Rahul Sharma" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" id="cust-email" class="form-control" placeholder="rahul@example.com">
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input type="tel" id="cust-phone" class="form-control" placeholder="+91 98765 43210" required>
                </div>
                <div class="form-group">
                    <label class="form-label">City</label>
                    <input type="text" id="cust-city" class="form-control" placeholder="Mumbai">
                </div>
            </div>
            <div class="modal-actions mt-4">
                <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Customer</button>
            </div>
        </form>
    `);
}

function editCustomer(id) {
    const customer = allCustomers.find(c => c.id === id);
    if (!customer) return;
    editingCustomerId = id;

    openModal('Edit Customer Details', `
        <form id="customer-form" onsubmit="handleCustomerSubmit(event)">
            <div class="form-grid">
                <div class="form-group full-width">
                    <label class="form-label">Full Name *</label>
                    <input type="text" id="cust-name" class="form-control" value="${customer.name}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" id="cust-email" class="form-control" value="${customer.email || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input type="tel" id="cust-phone" class="form-control" value="${customer.phone || ''}" required>
                </div>
            </div>
            <div class="modal-actions mt-4">
                <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Customer</button>
            </div>
        </form>
    `);
}

async function handleCustomerSubmit(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('cust-name').value.trim(),
        email: document.getElementById('cust-email').value.trim(),
        phone: document.getElementById('cust-phone').value.trim(),
        city: document.getElementById('cust-city') ? document.getElementById('cust-city').value.trim() : ''
    };

    try {
        if (editingCustomerId) {
            await api.customers.update(editingCustomerId, data);
            showToast('Customer updated', 'success');
        } else {
            await api.customers.create(data);
            showToast('Customer added', 'success');
        }
        closeModal();
        await loadCustomers();
    } catch (error) {
        showToast(error.message || 'Operation failed', 'error');
    }
}

async function deleteCustomer(id) {
    const ok = await showConfirm('Delete Customer', 'Are you sure you want to delete this customer?');
    if (!ok) return;

    try {
        await api.customers.delete(id);
        showToast('Customer deleted', 'success');
        await loadCustomers();
    } catch (error) {
        showToast(error.message || 'Failed to delete customer', 'error');
    }
}
