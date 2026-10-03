/**
 * AutoVault — Sales Module
 */
let allSales = [];

function renderSales() {
    const container = document.getElementById('page-content');
    container.innerHTML = `
        <div class="action-bar glass-card d-flex justify-between align-center">
            <div class="section-title-sm"><i class="fas fa-receipt text-accent"></i> Showroom Sales Registry</div>
            <button class="btn btn-primary" onclick="showRecordSaleModal()">
                <i class="fas fa-cart-plus"></i> Record New Sale
            </button>
        </div>

        <div class="table-card glass-card mt-4">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Sale #</th>
                            <th>Date</th>
                            <th>Vehicle Sold</th>
                            <th>Customer</th>
                            <th>Sales Rep</th>
                            <th>Selling Price</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="sales-tbody">
                        <tr><td colspan="8" class="text-center text-muted" style="padding:40px;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    initSalesPage();
}

async function initSalesPage() {
    await loadSales();
}

async function loadSales() {
    try {
        allSales = await api.sales.getAll();
        renderSalesTable(allSales);
    } catch (error) {
        showToast('Failed to load sales records', 'error');
    }
}

function renderSalesTable(sales) {
    const tbody = document.getElementById('sales-tbody');
    if (!tbody) return;

    if (!sales || sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted" style="padding:40px;">No sales recorded yet</td></tr>';
        return;
    }

    tbody.innerHTML = sales.map(s => `
        <tr>
            <td><strong>#${s.id}</strong></td>
            <td class="text-xs">${formatDate(s.saleDate)}</td>
            <td>
                <div class="font-bold text-heading">${s.car ? s.car.brand + ' ' + s.car.model : 'Car #' + s.carId}</div>
                <div class="text-muted text-xs">${s.car ? s.car.vin || '' : ''}</div>
            </td>
            <td>${s.customer ? s.customer.name : 'Customer #' + s.customerId}</td>
            <td>${s.staff ? s.staff.name : 'Staff #' + s.staffId}</td>
            <td class="text-accent font-bold">${formatPrice(s.sellingPrice)}</td>
            <td>
                <span class="badge ${s.paymentStatus === 'COMPLETED' ? 'badge-success' : 'badge-warning'}">
                    ${s.paymentStatus || 'COMPLETED'}
                </span>
            </td>
            <td>
                <button class="btn btn-ghost btn-sm text-danger" onclick="deleteSale(${s.id})" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

async function showRecordSaleModal() {
    try {
        const [cars, customers, staff] = await Promise.all([
            api.cars.getAll(),
            api.customers.getAll(),
            api.staff.getAll()
        ]);

        const availableCars = cars.filter(c => c.status === 'AVAILABLE');

        openModal('Record New Vehicle Sale', `
            <form id="sale-form" onsubmit="handleSaleSubmit(event)">
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label class="form-label">Select Vehicle *</label>
                        <select id="sale-car-id" class="form-control" required onchange="updateDefaultPrice(this)">
                            <option value="">-- Select Available Vehicle --</option>
                            ${availableCars.map(c => `
                                <option value="${c.id}" data-price="${c.price}">
                                    ${c.brand} ${c.model} (${c.year}) - ₹${c.price.toLocaleString('en-IN')}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Customer *</label>
                        <select id="sale-customer-id" class="form-control" required>
                            <option value="">-- Select Customer --</option>
                            ${customers.map(cust => `<option value="${cust.id}">${cust.name} (${cust.phone || cust.email})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Sales Representative *</label>
                        <select id="sale-staff-id" class="form-control" required>
                            <option value="">-- Select Staff --</option>
                            ${staff.map(st => `<option value="${st.id}">${st.name} (${st.role})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Agreed Selling Price (₹) *</label>
                        <input type="number" id="sale-price" class="form-control" placeholder="Selling price" required>
                    </div>
                </div>
                <div class="modal-actions mt-4">
                    <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> Complete Sale</button>
                </div>
            </form>
        `);
    } catch (err) {
        showToast('Failed to load form options', 'error');
    }
}

function updateDefaultPrice(selectElem) {
    const selected = selectElem.options[selectElem.selectedIndex];
    const price = selected.getAttribute('data-price');
    if (price) {
        document.getElementById('sale-price').value = price;
    }
}

async function handleSaleSubmit(e) {
    e.preventDefault();
    const data = {
        carId: parseInt(document.getElementById('sale-car-id').value),
        customerId: parseInt(document.getElementById('sale-customer-id').value),
        staffId: parseInt(document.getElementById('sale-staff-id').value),
        sellingPrice: parseFloat(document.getElementById('sale-price').value),
        paymentStatus: 'COMPLETED',
        saleDate: new Date().toISOString()
    };

    try {
        await api.sales.create(data);
        showToast('Sale recorded successfully!', 'success');
        closeModal();
        await loadSales();
    } catch (err) {
        showToast(err.message || 'Failed to record sale', 'error');
    }
}

async function deleteSale(id) {
    const ok = await showConfirm('Delete Transaction', 'Are you sure you want to delete this sale record?');
    if (!ok) return;

    try {
        await api.sales.delete(id);
        showToast('Sale record deleted', 'success');
        await loadSales();
    } catch (err) {
        showToast(err.message || 'Failed to delete sale', 'error');
    }
}
