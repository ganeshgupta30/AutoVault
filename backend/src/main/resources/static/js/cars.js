/**
 * AutoVault — Cars Management Module
 */
let allCars = [];
let editingCarId = null;

function renderCars() {
    const container = document.getElementById('page-content');
    container.innerHTML = `
        <div class="action-bar glass-card">
            <div class="action-inputs">
                <div class="search-input-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" id="search-cars" class="form-control" placeholder="Search brand, model, VIN..." onkeyup="filterCars()">
                </div>
                <select id="filter-brand" class="form-control" onchange="filterCars()">
                    <option value="">All Brands</option>
                </select>
                <select id="filter-status" class="form-control" onchange="filterCars()">
                    <option value="">All Statuses</option>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="SOLD">SOLD</option>
                    <option value="RESERVED">RESERVED</option>
                </select>
            </div>
            <button class="btn btn-primary" onclick="showAddCarModal()">
                <i class="fas fa-plus"></i> Add New Car
            </button>
        </div>

        <div class="table-card glass-card mt-4">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Car Info</th>
                            <th>Year / Color</th>
                            <th>VIN</th>
                            <th>Price</th>
                            <th>Fuel & Trans.</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="cars-tbody">
                        <tr><td colspan="7" class="text-center text-muted" style="padding:40px;"><i class="fas fa-spinner fa-spin"></i> Loading cars...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    initCarsPage();
}

async function initCarsPage() {
    await loadCars();
    await loadBrandFilter();
}

async function loadCars() {
    try {
        allCars = await api.cars.getAll();
        renderCarsTable(allCars);
    } catch (error) {
        showToast('Failed to load cars', 'error');
    }
}

async function loadBrandFilter() {
    try {
        const brands = await api.cars.getBrands();
        const select = document.getElementById('filter-brand');
        if (select && Array.isArray(brands)) {
            brands.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b;
                opt.textContent = b;
                select.appendChild(opt);
            });
        }
    } catch (e) {}
}

function renderCarsTable(cars) {
    const tbody = document.getElementById('cars-tbody');
    if (!tbody) return;

    if (!cars || cars.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:40px;">No vehicles found</td></tr>';
        return;
    }

    tbody.innerHTML = cars.map(car => `
        <tr>
            <td>
                <div class="d-flex align-center gap-3">
                    <img class="car-thumb" src="${car.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&auto=format&fit=crop&q=60'}" alt="${car.brand}" onerror="this.src='https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=120&auto=format&fit=crop&q=60'">
                    <div>
                        <div class="font-bold text-heading">${car.brand} ${car.model}</div>
                        <div class="text-muted text-xs">${car.variant || 'Standard'}</div>
                    </div>
                </div>
            </td>
            <td>
                <div>${car.year}</div>
                <div class="text-muted text-xs">${car.color || 'N/A'}</div>
            </td>
            <td class="font-mono text-xs">${car.vin || 'N/A'}</td>
            <td class="text-accent font-bold">${formatPrice(car.price)}</td>
            <td>
                <div class="text-xs">${car.fuelType || 'Petrol'} &bull; ${car.transmission || 'Automatic'}</div>
            </td>
            <td>
                <span class="badge ${car.status === 'AVAILABLE' ? 'badge-success' : car.status === 'SOLD' ? 'badge-danger' : 'badge-warning'}">
                    ${car.status || 'AVAILABLE'}
                </span>
            </td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-ghost btn-sm" onclick="editCar(${car.id})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-ghost btn-sm text-danger" onclick="deleteCar(${car.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterCars() {
    const search = (document.getElementById('search-cars')?.value || '').toLowerCase();
    const brand = document.getElementById('filter-brand')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';

    const filtered = allCars.filter(c => {
        const matchSearch = `${c.brand} ${c.model} ${c.vin || ''}`.toLowerCase().includes(search);
        const matchBrand = !brand || c.brand === brand;
        const matchStatus = !status || c.status === status;
        return matchSearch && matchBrand && matchStatus;
    });

    renderCarsTable(filtered);
}

function showAddCarModal() {
    editingCarId = null;
    openModal('Add New Vehicle', `
        <form id="car-form" onsubmit="handleCarSubmit(event)">
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Brand / Make *</label>
                    <input type="text" id="car-brand" class="form-control" placeholder="e.g. BMW" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Model *</label>
                    <input type="text" id="car-model" class="form-control" placeholder="e.g. M3 Competition" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Variant</label>
                    <input type="text" id="car-variant" class="form-control" placeholder="e.g. xDrive">
                </div>
                <div class="form-group">
                    <label class="form-label">Year *</label>
                    <input type="number" id="car-year" class="form-control" value="2024" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Price (₹) *</label>
                    <input type="number" id="car-price" class="form-control" placeholder="e.g. 13000000" required>
                </div>
                <div class="form-group">
                    <label class="form-label">VIN</label>
                    <input type="text" id="car-vin" class="form-control" placeholder="17-digit VIN">
                </div>
                <div class="form-group">
                    <label class="form-label">Color</label>
                    <input type="text" id="car-color" class="form-control" placeholder="e.g. Black">
                </div>
                <div class="form-group">
                    <label class="form-label">Fuel Type</label>
                    <select id="car-fuel" class="form-control">
                        <option value="PETROL">PETROL</option>
                        <option value="DIESEL">DIESEL</option>
                        <option value="ELECTRIC">ELECTRIC</option>
                        <option value="HYBRID">HYBRID</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Transmission</label>
                    <select id="car-trans" class="form-control">
                        <option value="AUTOMATIC">AUTOMATIC</option>
                        <option value="MANUAL">MANUAL</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
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
    `);
}

function editCar(id) {
    const car = allCars.find(c => c.id === id);
    if (!car) return;
    editingCarId = id;

    openModal('Edit Vehicle Details', `
        <form id="car-form" onsubmit="handleCarSubmit(event)">
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Brand / Make *</label>
                    <input type="text" id="car-brand" class="form-control" value="${car.brand}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Model *</label>
                    <input type="text" id="car-model" class="form-control" value="${car.model}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Year *</label>
                    <input type="number" id="car-year" class="form-control" value="${car.year}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Price (₹) *</label>
                    <input type="number" id="car-price" class="form-control" value="${car.price}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select id="car-status" class="form-control">
                        <option value="AVAILABLE" ${car.status === 'AVAILABLE' ? 'selected' : ''}>AVAILABLE</option>
                        <option value="RESERVED" ${car.status === 'RESERVED' ? 'selected' : ''}>RESERVED</option>
                        <option value="SOLD" ${car.status === 'SOLD' ? 'selected' : ''}>SOLD</option>
                    </select>
                </div>
            </div>
            <div class="modal-actions mt-4">
                <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Vehicle</button>
            </div>
        </form>
    `);
}

async function handleCarSubmit(e) {
    e.preventDefault();
    const data = {
        brand: document.getElementById('car-brand').value.trim(),
        model: document.getElementById('car-model').value.trim(),
        year: parseInt(document.getElementById('car-year').value),
        price: parseFloat(document.getElementById('car-price').value),
        status: document.getElementById('car-status').value
    };

    try {
        if (editingCarId) {
            await api.cars.update(editingCarId, data);
            showToast('Vehicle updated', 'success');
        } else {
            await api.cars.create(data);
            showToast('Vehicle added', 'success');
        }
        closeModal();
        await loadCars();
    } catch (err) {
        showToast(err.message || 'Operation failed', 'error');
    }
}

async function deleteCar(id) {
    const ok = await showConfirm('Delete Vehicle', 'Are you sure you want to delete this car?');
    if (!ok) return;

    try {
        await api.cars.delete(id);
        showToast('Vehicle deleted', 'success');
        await loadCars();
    } catch (err) {
        showToast(err.message || 'Failed to delete car', 'error');
    }
}
