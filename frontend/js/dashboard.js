/**
 * AutoVault — Dashboard Page Logic
 * Statistics cards, Chart.js charts, and recent sales table
 */

let monthlySalesChart = null;
let brandChart = null;
let inventoryChart = null;

function renderDashboard() {
    const container = document.getElementById('page-content');
    container.innerHTML = `
        <div class="stats-grid grid-4">
            <div class="stat-card glass-card">
                <div class="stat-icon icon-blue"><i class="fas fa-car"></i></div>
                <div class="stat-details">
                    <div class="stat-value" id="stat-total-cars">0</div>
                    <div class="stat-label">Total Cars</div>
                </div>
            </div>
            <div class="stat-card glass-card">
                <div class="stat-icon icon-green"><i class="fas fa-check-circle"></i></div>
                <div class="stat-details">
                    <div class="stat-value" id="stat-available-cars">0</div>
                    <div class="stat-label">Available Vehicles</div>
                </div>
            </div>
            <div class="stat-card glass-card">
                <div class="stat-icon icon-amber"><i class="fas fa-handshake"></i></div>
                <div class="stat-details">
                    <div class="stat-value" id="stat-sold-cars">0</div>
                    <div class="stat-label">Sold Vehicles</div>
                </div>
            </div>
            <div class="stat-card glass-card">
                <div class="stat-icon icon-purple"><i class="fas fa-wallet"></i></div>
                <div class="stat-details">
                    <div class="stat-value" id="stat-revenue">₹0</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
            </div>
        </div>

        <div class="stats-grid grid-2 mt-4">
            <div class="stat-card glass-card">
                <div class="stat-icon icon-cyan"><i class="fas fa-users"></i></div>
                <div class="stat-details">
                    <div class="stat-value" id="stat-customers">0</div>
                    <div class="stat-label">Registered Customers</div>
                </div>
            </div>
            <div class="stat-card glass-card">
                <div class="stat-icon icon-rose"><i class="fas fa-user-tie"></i></div>
                <div class="stat-details">
                    <div class="stat-value" id="stat-staff">0</div>
                    <div class="stat-label">Staff Members</div>
                </div>
            </div>
        </div>

        <div class="charts-grid mt-4">
            <div class="chart-card glass-card">
                <div class="chart-header">
                    <h3><i class="fas fa-chart-bar text-accent"></i> Monthly Sales Trend</h3>
                </div>
                <div class="chart-wrapper">
                    <canvas id="monthlySalesChart"></canvas>
                </div>
            </div>
            <div class="chart-card glass-card">
                <div class="chart-header">
                    <h3><i class="fas fa-chart-pie text-accent"></i> Brand Distribution</h3>
                </div>
                <div class="chart-wrapper">
                    <canvas id="brandChart"></canvas>
                </div>
            </div>
        </div>

        <div class="chart-card glass-card mt-4">
            <div class="chart-header">
                <h3><i class="fas fa-boxes text-accent"></i> Inventory Stock Status</h3>
            </div>
            <div class="chart-wrapper">
                <canvas id="inventoryChart"></canvas>
            </div>
        </div>

        <div class="table-card glass-card mt-4">
            <div class="table-header">
                <h3><i class="fas fa-history text-accent"></i> Recent Transactions</h3>
                <a href="#sales" class="btn btn-ghost btn-sm">View All Sales →</a>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vehicle</th>
                            <th>Customer</th>
                            <th>Sales Rep</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="recent-sales-body">
                        <tr><td colspan="6" class="text-center text-muted" style="padding:30px;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    initDashboard();
}

async function initDashboard() {
    await loadDashboardStats();
    await loadCharts();
    await loadRecentSales();
}

async function loadDashboardStats() {
    try {
        const stats = await api.dashboard.getStatistics();
        if (!stats) return;
        document.getElementById('stat-total-cars').textContent = stats.totalCars || 0;
        document.getElementById('stat-available-cars').textContent = stats.availableCars || 0;
        document.getElementById('stat-sold-cars').textContent = stats.soldCars || 0;
        document.getElementById('stat-customers').textContent = stats.totalCustomers || 0;
        document.getElementById('stat-staff').textContent = stats.totalStaff || 0;
        document.getElementById('stat-revenue').textContent = formatPrice(stats.totalRevenue || 0);
    } catch (error) {
        console.warn('Dashboard stats backend notice:', error);
    }
}

async function loadCharts() {
    try {
        const [monthlyData, brandData, inventoryData] = await Promise.all([
            api.dashboard.getMonthlySales().catch(() => []),
            api.dashboard.getBrandStatistics().catch(() => []),
            api.dashboard.getInventoryStatistics().catch(() => []),
        ]);

        renderMonthlySalesChart(monthlyData);
        renderBrandChart(brandData);
        renderInventoryChart(inventoryData);
    } catch (error) {
        console.error('Failed to load charts:', error);
    }
}

function renderMonthlySalesChart(data = []) {
    const ctx = document.getElementById('monthlySalesChart');
    if (!ctx) return;
    if (monthlySalesChart) monthlySalesChart.destroy();

    monthlySalesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.length ? data.map(d => d.month) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales Volume',
                data: data.length ? data.map(d => d.count) : [3, 5, 2, 8, 6, 9],
                backgroundColor: '#1E3A5F',
                borderColor: '#1E3A5F',
                borderWidth: 1,
                borderRadius: 4,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: '#E5E7EB' }, ticks: { color: '#4B5563', font: { family: 'Inter' } } },
                y: { grid: { color: '#E5E7EB' }, ticks: { color: '#4B5563', font: { family: 'Inter' } }, beginAtZero: true }
            }
        }
    });
}

function renderBrandChart(data = []) {
    const ctx = document.getElementById('brandChart');
    if (!ctx) return;
    if (brandChart) brandChart.destroy();

    const colors = ['#1E3A5F', '#C9A227', '#2563EB', '#059669', '#7C3AED', '#D97706'];
    brandChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.length ? data.map(d => d.brand) : ['Toyota', 'BMW', 'Mercedes', 'Honda', 'Audi'],
            datasets: [{
                data: data.length ? data.map(d => d.count) : [12, 8, 5, 10, 6],
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#FFFFFF',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { 
                    position: 'bottom', 
                    labels: { color: '#374151', font: { family: 'Inter', weight: 500 }, padding: 14 } 
                } 
            }
        }
    });
}

function renderInventoryChart(data = []) {
    const ctx = document.getElementById('inventoryChart');
    if (!ctx) return;
    if (inventoryChart) inventoryChart.destroy();

    inventoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.length ? data.map(d => d.brand) : ['Toyota', 'BMW', 'Mercedes', 'Honda', 'Tata'],
            datasets: [
                {
                    label: 'Total Stock',
                    data: data.length ? data.map(d => d.total) : [15, 10, 8, 12, 20],
                    backgroundColor: '#1E3A5F',
                    borderRadius: 4,
                },
                {
                    label: 'Available',
                    data: data.length ? data.map(d => d.available) : [10, 6, 5, 9, 15],
                    backgroundColor: '#C9A227',
                    borderRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { 
                    labels: { color: '#374151', font: { family: 'Inter', weight: 500 } } 
                } 
            },
            scales: {
                x: { grid: { color: '#E5E7EB' }, ticks: { color: '#4B5563', font: { family: 'Inter' } } },
                y: { grid: { color: '#E5E7EB' }, ticks: { color: '#4B5563', font: { family: 'Inter' } }, beginAtZero: true }
            }
        }
    });
}

async function loadRecentSales() {
    try {
        const sales = await api.sales.getAll();
        const tbody = document.getElementById('recent-sales-body');
        if (!tbody) return;

        if (!sales || sales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:32px;">No sales recorded yet</td></tr>';
            return;
        }

        const recent = sales.slice(-5).reverse();
        tbody.innerHTML = recent.map(sale => `
            <tr>
                <td>#${sale.id}</td>
                <td><strong>${sale.car ? sale.car.brand + ' ' + sale.car.model : 'Vehicle'}</strong></td>
                <td>${sale.customer ? sale.customer.name : 'Customer'}</td>
                <td>${sale.staff ? sale.staff.name : 'Sales Rep'}</td>
                <td class="text-accent"><strong>${formatPrice(sale.sellingPrice)}</strong></td>
                <td><span class="badge badge-success">${sale.paymentStatus || 'COMPLETED'}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        console.warn('Recent sales notice:', error);
    }
}
