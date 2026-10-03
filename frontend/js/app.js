/**
 * AutoVault — SPA Router & App Shell
 * Hash-based routing, auth guard, toast, modal, confirm dialog
 */

// ==========================================
// Toast Notifications
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(80px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==========================================
// Session Management
// ==========================================
function saveSession(userData) {
    localStorage.setItem('showroom_user', JSON.stringify(userData));
}
function getSession() {
    const d = localStorage.getItem('showroom_user');
    return d ? JSON.parse(d) : null;
}
function clearSession() {
    localStorage.removeItem('showroom_user');
}
function isLoggedIn() {
    return getSession() !== null;
}

// ==========================================
// Format Helpers
// ==========================================
function formatPrice(price) {
    return '₹' + Number(price).toLocaleString('en-IN');
}
function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ==========================================
// Modal Helpers
// ==========================================
function openModal(title, bodyHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.body.style.overflow = '';
}

// Close on × or overlay click
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
});

// ==========================================
// Confirm Dialog
// ==========================================
let confirmResolve = null;

function showConfirm(title, message) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    return new Promise((resolve) => {
        confirmResolve = resolve;
    });
}

document.getElementById('confirm-ok').addEventListener('click', () => {
    document.getElementById('confirm-overlay').classList.add('hidden');
    document.body.style.overflow = '';
    if (confirmResolve) confirmResolve(true);
});

document.getElementById('confirm-cancel').addEventListener('click', () => {
    document.getElementById('confirm-overlay').classList.add('hidden');
    document.body.style.overflow = '';
    if (confirmResolve) confirmResolve(false);
});

document.getElementById('confirm-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'confirm-overlay') {
        document.getElementById('confirm-overlay').classList.add('hidden');
        document.body.style.overflow = '';
        if (confirmResolve) confirmResolve(false);
    }
});

// ==========================================
// SPA Router
// ==========================================
const AUTH_PAGES = ['login', 'register', 'verify-otp', 'admin-login'];
const APP_PAGES = ['dashboard', 'cars', 'customers', 'staff', 'sales', 'admin-dashboard', 'admin-vehicles', 'admin-customers', 'admin-bookings', 'admin-enquiries'];

const pageConfig = {
    dashboard:        { title: 'Dashboard',         subtitle: 'Welcome back! Here\'s your showroom overview.', render: renderDashboard },
    cars:             { title: 'Cars Inventory',    subtitle: 'Manage your vehicle stock and details.', render: renderCars },
    customers:        { title: 'Customers',         subtitle: 'View and manage customer records.', render: renderCustomers },
    staff:            { title: 'Staff',             subtitle: 'Manage your team members.', render: renderStaff },
    sales:            { title: 'Sales',             subtitle: 'Track and record vehicle sales.', render: renderSales },
    'admin-dashboard': { title: 'Admin Dashboard',   subtitle: 'Executive overview & vehicle management.', render: renderAdminDashboard },
    'admin-vehicles':  { title: 'Vehicle Management', subtitle: 'Add, edit, delete, and control stock status.', render: renderAdminVehicles },
    'admin-customers': { title: 'Customer Records', subtitle: 'View customer accounts & verification status.', render: renderAdminCustomers },
    'admin-bookings':  { title: 'Booking Requests', subtitle: 'Review and manage vehicle bookings.', render: renderAdminBookings },
    'admin-enquiries': { title: 'Customer Enquiries', subtitle: 'Respond to customer inquiries and test drives.', render: renderAdminEnquiries }
};

const authPageConfig = {
    login:          { render: renderLoginPage },
    register:       { render: renderRegisterPage },
    'verify-otp':   { render: renderOtpPage },
    'admin-login':  { render: renderAdminLoginPage }
};

function navigate(hash) {
    window.location.hash = hash;
}

function getPage() {
    const h = window.location.hash.replace('#', '') || '';
    if (h === 'admin/login') return 'admin-login';
    if (h === 'admin/dashboard') return 'admin-dashboard';
    return h || 'login';
}

function route() {
    const page = getPage();

    // Auth pages
    if (AUTH_PAGES.includes(page)) {
        if (page === 'admin-login' && isAdminLoggedIn()) {
            navigate('admin-dashboard');
            return;
        }
        if (page !== 'admin-login' && isLoggedIn()) {
            navigate(isAdminLoggedIn() ? 'admin-dashboard' : 'dashboard');
            return;
        }
        document.getElementById('auth-container').style.display = '';
        document.getElementById('app-container').classList.add('hidden');
        if (authPageConfig[page]) {
            authPageConfig[page].render();
        }
        return;
    }

    // App pages (requires auth)
    if (APP_PAGES.includes(page)) {
        if (!isLoggedIn()) {
            navigate(page.startsWith('admin-') ? 'admin-login' : 'login');
            return;
        }

        // Security check for admin pages
        if (page.startsWith('admin-') && !isAdminLoggedIn()) {
            showToast('Access denied: Admin privileges required', 'error');
            navigate('dashboard');
            return;
        }

        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').classList.remove('hidden');

        // Update top bar
        const config = pageConfig[page];
        document.getElementById('page-title').textContent = config.title;
        document.getElementById('page-subtitle').textContent = config.subtitle;

        // Update sidebar active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        // Update user info
        updateUserInfo();

        // Show search box only on cars page
        const searchBox = document.getElementById('global-search-box');
        searchBox.style.display = page === 'cars' ? 'flex' : 'none';

        // Re-key animation
        const content = document.getElementById('page-content');
        content.style.animation = 'none';
        content.offsetHeight; // trigger reflow
        content.style.animation = '';

        // Render page
        config.render();
        return;
    }

    // Default redirect
    navigate(isLoggedIn() ? 'dashboard' : 'login');
}

function updateUserInfo() {
    const session = getSession();
    if (!session) return;
    const name = session.name || session.email || 'User';
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-role').textContent = session.role || 'User';
    document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    clearSession();
    navigate('login');
});

// Sidebar toggle (mobile)
const sidebarToggle = document.getElementById('sidebar-toggle');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

// Listen for hash changes
window.addEventListener('hashchange', route);

// Init
document.addEventListener('DOMContentLoaded', () => {
    route();
});
