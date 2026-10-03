/**
 * AutoVault — Staff Management Module
 */

let allStaff = [];
let editingStaffId = null;

function renderStaff() {
    const container = document.getElementById('page-content');
    container.innerHTML = `
        <div class="action-bar glass-card">
            <div class="action-inputs">
                <div class="search-input-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" id="search-staff" class="form-control" placeholder="Search staff member by name, role, email..." onkeyup="searchStaff()">
                </div>
            </div>
            <button class="btn btn-primary" onclick="showAddStaffModal()">
                <i class="fas fa-user-shield"></i> Add Staff Member
            </button>
        </div>

        <div class="table-card glass-card mt-4">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Staff Name</th>
                            <th>Role / Designation</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="staff-tbody">
                        <tr><td colspan="6" class="text-center text-muted" style="padding:40px;"><i class="fas fa-spinner fa-spin"></i> Loading staff members...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    initStaffPage();
}

async function initStaffPage() {
    await loadStaff();
}

async function loadStaff() {
    try {
        allStaff = await api.staff.getAll();
        renderStaffTable(allStaff);
    } catch (error) {
        showToast('Failed to load staff list', 'error');
    }
}

function renderStaffTable(staffList) {
    const tbody = document.getElementById('staff-tbody');
    if (!tbody) return;

    if (!staffList || staffList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:40px;">No staff members found</td></tr>';
        return;
    }

    tbody.innerHTML = staffList.map(s => `
        <tr>
            <td>
                <div class="d-flex align-center gap-2">
                    <div class="user-avatar-sm">${(s.name || 'S').charAt(0).toUpperCase()}</div>
                    <strong class="text-heading">${s.name}</strong>
                </div>
            </td>
            <td><span class="badge badge-info">${s.role || 'Sales Representative'}</span></td>
            <td>${s.email || '—'}</td>
            <td>${s.phone || '—'}</td>
            <td class="text-accent font-bold">${s.salary ? formatPrice(s.salary) : '—'}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-ghost btn-sm" onclick="editStaff(${s.id})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-ghost btn-sm text-danger" onclick="deleteStaff(${s.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchStaff() {
    const keyword = (document.getElementById('search-staff')?.value || '').toLowerCase();
    const filtered = allStaff.filter(s =>
        `${s.name} ${s.role || ''} ${s.email || ''} ${s.phone || ''}`.toLowerCase().includes(keyword)
    );
    renderStaffTable(filtered);
}

function showAddStaffModal() {
    editingStaffId = null;
    openModal('Add New Staff Member', `
        <form id="staff-form" onsubmit="handleStaffSubmit(event)">
            <div class="form-grid">
                <div class="form-group full-width">
                    <label class="form-label">Full Name *</label>
                    <input type="text" id="staff-name" class="form-control" placeholder="e.g. Vikram Verma" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Role / Position *</label>
                    <select id="staff-role" class="form-control" required>
                        <option value="Sales Representative">Sales Representative</option>
                        <option value="Showroom Manager">Showroom Manager</option>
                        <option value="Service Advisor">Service Advisor</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input type="email" id="staff-email" class="form-control" placeholder="vikram@autoshowroom.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input type="tel" id="staff-phone" class="form-control" placeholder="+91 98765 11223" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Salary (₹)</label>
                    <input type="number" id="staff-salary" class="form-control" placeholder="e.g. 45000">
                </div>
            </div>
            <div class="modal-actions mt-4">
                <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Staff Member</button>
            </div>
        </form>
    `);
}

function editStaff(id) {
    const staff = allStaff.find(s => s.id === id);
    if (!staff) return;
    editingStaffId = id;

    openModal('Edit Staff Member Details', `
        <form id="staff-form" onsubmit="handleStaffSubmit(event)">
            <div class="form-grid">
                <div class="form-group full-width">
                    <label class="form-label">Full Name *</label>
                    <input type="text" id="staff-name" class="form-control" value="${staff.name}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Role / Position *</label>
                    <select id="staff-role" class="form-control" required>
                        <option value="Sales Representative" ${staff.role === 'Sales Representative' ? 'selected' : ''}>Sales Representative</option>
                        <option value="Showroom Manager" ${staff.role === 'Showroom Manager' ? 'selected' : ''}>Showroom Manager</option>
                        <option value="Service Advisor" ${staff.role === 'Service Advisor' ? 'selected' : ''}>Service Advisor</option>
                        <option value="Inventory Manager" ${staff.role === 'Inventory Manager' ? 'selected' : ''}>Inventory Manager</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input type="email" id="staff-email" class="form-control" value="${staff.email || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input type="tel" id="staff-phone" class="form-control" value="${staff.phone || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Salary (₹)</label>
                    <input type="number" id="staff-salary" class="form-control" value="${staff.salary || ''}">
                </div>
            </div>
            <div class="modal-actions mt-4">
                <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Staff</button>
            </div>
        </form>
    `);
}

async function handleStaffSubmit(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('staff-name').value.trim(),
        role: document.getElementById('staff-role').value,
        email: document.getElementById('staff-email').value.trim(),
        phone: document.getElementById('staff-phone').value.trim(),
        salary: parseFloat(document.getElementById('staff-salary').value) || 0,
    };

    try {
        if (editingStaffId) {
            await api.staff.update(editingStaffId, data);
            showToast('Staff member updated', 'success');
        } else {
            await api.staff.create(data);
            showToast('New staff member added', 'success');
        }
        closeModal();
        await loadStaff();
    } catch (error) {
        showToast(error.message || 'Operation failed', 'error');
    }
}

async function deleteStaff(id) {
    const ok = await showConfirm('Delete Staff Member', 'Are you sure you want to delete this staff record?');
    if (!ok) return;

    try {
        await api.staff.delete(id);
        showToast('Staff record removed', 'success');
        await loadStaff();
    } catch (error) {
        showToast(error.message || 'Failed to delete staff member', 'error');
    }
}
