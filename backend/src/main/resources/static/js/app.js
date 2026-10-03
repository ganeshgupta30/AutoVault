/**
 * AutoVault — SPA Router & App Shell
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
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

function saveSession(userData) { localStorage.setItem('showroom_user', JSON.stringify(userData)); }
function getSession() { const d = localStorage.getItem('showroom_user'); return d ? JSON.parse(d) : null; }
function clearSession() { localStorage.removeItem('showroom_user'); }
function isLoggedIn() { return getSession() !== null; }
function formatPrice(price) { return '₹' + Number(price || 0).toLocaleString('en-IN'); }
function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function openModal(title, bodyHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.add('hidden');
    document.body.style.overflow = '';
}

document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
});

let confirmResolve = null;
function showConfirm(title, message) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    return new Promise((resolve) => { confirmResolve = resolve; });
}

document.getElementById('confirm-ok')?.addEventListener('click', () => {
    document.getElementById('confirm-overlay').classList.add('hidden');
    document.body.style.overflow = '';
    if (confirmResolve) confirmResolve(true);
});

document.getElementById('confirm-cancel')?.addEventListener('click', () => {
    document.getElementById('confirm-overlay').classList.add('hidden');
    document.body.style.overflow = '';
    if (confirmResolve) confirmResolve(false);
});

const AUTH_PAGES = ['login', 'register', 'verify-otp'];
const APP_PAGES = ['dashboard', 'cars', 'customers', 'staff', 'sales'];

const pageConfig = {
    dashboard:  { title: 'Dashboard',  subtitle: 'Welcome back! Here\'s your showroom overview.', render: renderDashboard },
    cars:       { title: 'Cars Inventory', subtitle: 'Manage your vehicle stock and details.', render: renderCars },
    customers:  { title: 'Customers',  subtitle: 'View and manage customer records.', render: renderCustomers },
    staff:      { title: 'Staff',      subtitle: 'Manage your team members.', render: renderStaff },
    sales:      { title: 'Sales',      subtitle: 'Track and record vehicle sales.', render: renderSales },
};

const authPageConfig = {
    login:       { render: renderLoginPage },
    register:    { render: renderRegisterPage },
    'verify-otp': { render: renderOtpPage },
};

function navigate(hash) { window.location.hash = hash; }
function getPage() { return (window.location.hash.replace('#', '') || 'login'); }

function route() {
    const page = getPage();
    if (AUTH_PAGES.includes(page)) {
        if (isLoggedIn()) { navigate('dashboard'); return; }
        document.getElementById('auth-container').style.display = '';
        document.getElementById('app-container').classList.add('hidden');
        if (authPageConfig[page]) authPageConfig[page].render();
        return;
    }

    if (APP_PAGES.includes(page)) {
        if (!isLoggedIn()) { navigate('login'); return; }
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').classList.remove('hidden');

        const config = pageConfig[page];
        document.getElementById('page-title').textContent = config.title;
        document.getElementById('page-subtitle').textContent = config.subtitle;

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        updateUserInfo();
        const searchBox = document.getElementById('global-search-box');
        if (searchBox) searchBox.style.display = page === 'cars' ? 'flex' : 'none';

        const content = document.getElementById('page-content');
        if (content) {
            content.style.animation = 'none';
            content.offsetHeight;
            content.style.animation = '';
        }

        config.render();
        return;
    }

    navigate(isLoggedIn() ? 'dashboard' : 'login');
}

function updateUserInfo() {
    const session = getSession();
    if (!session) return;
    const name = session.name || session.email || 'User';
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-role').textContent = session.role || 'Administrator';
    document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
}

document.getElementById('logout-btn')?.addEventListener('click', () => {
    clearSession();
    navigate('login');
});

const sidebarToggle = document.getElementById('sidebar-toggle');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', route);
