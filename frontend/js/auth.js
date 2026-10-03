/**
 * AutoVault — Auth Pages (Login, Register, OTP Verification)
 * Renders into #auth-content using SPA hash routing
 */

// ==========================================
// LOGIN PAGE
// ==========================================
function renderLoginPage() {
    const container = document.getElementById('auth-content');
    container.innerHTML = `
        <div class="auth-card">
            <div class="auth-logo">
                <i class="fas fa-car-side"></i>
                <h2>Welcome <span class="accent">Back</span></h2>
                <p>Sign in to your showroom dashboard</p>
            </div>
            <form id="login-form">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" id="login-email" class="form-control" placeholder="you@gmail.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-btn">
                    <i class="fas fa-sign-in-alt"></i> LOGIN WITH PASSWORD
                </button>
                <div style="margin-top: 16px; text-align: center;">
                    <span style="color: #6B7280; font-size: 0.8rem; display: block; margin-bottom: 8px;">— OR —</span>
                    <button type="button" class="btn btn-secondary btn-block" id="login-otp-btn">
                        <i class="fas fa-paper-plane" style="color: var(--accent2);"></i> SIGN IN WITH EMAIL OTP
                    </button>
                </div>
            </form>
            <div class="auth-footer">
                Don't have an account? <a href="#register">Create one</a> | <a href="#admin-login" style="color: #1E3A5F; font-weight: 600;"><i class="fas fa-user-shield" style="color: var(--accent2);"></i> Admin Portal</a>
            </div>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', handleLogin);

    document.getElementById('login-otp-btn')?.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value.trim();
        if (!email) {
            showToast('Please enter your email address to receive an OTP', 'warning');
            document.getElementById('login-email').focus();
            return;
        }
        const btn = document.getElementById('login-otp-btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...';
        try {
            await api.auth.sendOtp(email);
            sessionStorage.setItem('otp_email', email);
            showToast(`Verification OTP sent to ${email}`, 'success');
            setTimeout(() => navigate('verify-otp'), 600);
        } catch (error) {
            showToast(error.message || 'Could not send OTP', 'error');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> SIGN IN WITH EMAIL OTP';
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try {
        const response = await api.auth.login(email, password);

        // Check if email not verified
        if (!response.success && response.data && response.data.verified === false) {
            showToast(response.message || 'Please verify your email before logging in.', 'warning');
            sessionStorage.setItem('otp_email', email);
            setTimeout(() => navigate('verify-otp'), 1000);
            return;
        }

        // Save session & go to dashboard
        saveSession(response.data);
        showToast('Login successful!', 'success');
        setTimeout(() => navigate('dashboard'), 600);
    } catch (error) {
        showToast(error.message || 'Login failed', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> LOGIN WITH PASSWORD';
    }
}

// ==========================================
// REGISTER PAGE
// ==========================================
function renderRegisterPage() {
    const container = document.getElementById('auth-content');
    container.innerHTML = `
        <div class="auth-card">
            <div class="auth-logo">
                <i class="fas fa-user-plus"></i>
                <h2>Create <span class="accent">Account</span></h2>
                <p>Join AutoVault to manage your showroom</p>
            </div>
            <form id="register-form">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" id="reg-name" class="form-control" placeholder="John Doe" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" id="reg-email" class="form-control" placeholder="you@gmail.com" required>
                    <small style="color: #6B7280; font-size: 0.78rem; display: block; margin-top: 4px;">
                        <i class="fas fa-envelope" style="color: var(--accent2);"></i> Each user receives a unique 6-digit OTP code at their entered email address.
                    </small>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" id="reg-password" class="form-control" placeholder="Min 6 characters" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" id="reg-confirm-password" class="form-control" placeholder="Re-enter password" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg" id="register-btn">
                    <i class="fas fa-user-plus"></i> CREATE ACCOUNT
                </button>
            </form>
            <div class="auth-footer">
                Already have an account? <a href="#login">Sign in</a>
            </div>
        </div>
    `;

    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const btn = document.getElementById('register-btn');

    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account & Sending OTP...';

    try {
        await api.auth.register(name, email, password);
        sessionStorage.setItem('otp_email', email);
        showToast(`Registration successful! Verification code sent to ${email}`, 'success');
        setTimeout(() => navigate('verify-otp'), 800);
    } catch (error) {
        showToast(error.message || 'Registration failed', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-user-plus"></i> CREATE ACCOUNT';
    }
}

// ==========================================
// OTP VERIFICATION PAGE
// ==========================================
let otpResendTimer = null;
let otpCountdown = 0;

function renderOtpPage() {
    const email = sessionStorage.getItem('otp_email');
    if (!email) {
        showToast('Please enter your email to proceed with verification', 'warning');
        navigate('login');
        return;
    }

    const container = document.getElementById('auth-content');
    container.innerHTML = `
        <div class="auth-card">
            <div class="auth-logo">
                <i class="fas fa-envelope-open-text"></i>
                <h2>Verify <span class="accent">Email</span></h2>
                <p>We've sent a 6-digit code to your email</p>
            </div>

            <div id="otp-form">
                <div class="otp-info">
                    <p>Enter the code sent to <span class="email-highlight" id="otp-email-display">${email}</span></p>
                    <p class="demo-otp-note">
                        <i class="fas fa-paper-plane"></i> <strong>Live Resend Email Delivery:</strong> A verification code has been dispatched to your inbox.
                    </p>
                </div>

                <div class="otp-container">
                    <input type="text" maxlength="1" class="otp-input" inputmode="numeric" autocomplete="one-time-code">
                    <input type="text" maxlength="1" class="otp-input" inputmode="numeric">
                    <input type="text" maxlength="1" class="otp-input" inputmode="numeric">
                    <input type="text" maxlength="1" class="otp-input" inputmode="numeric">
                    <input type="text" maxlength="1" class="otp-input" inputmode="numeric">
                    <input type="text" maxlength="1" class="otp-input" inputmode="numeric">
                </div>

                <button type="button" class="btn btn-primary btn-block btn-lg" id="verify-btn">
                    <i class="fas fa-check-circle"></i> VERIFY EMAIL
                </button>

                <div class="resend-area">
                    <button type="button" id="resend-btn" disabled>Resend Code</button>
                    <span class="resend-timer" id="resend-timer"></span>
                </div>
            </div>

            <div id="otp-success" class="otp-success hidden">
                <i class="fas fa-check-circle"></i>
                <h3>Email Verified!</h3>
                <p>Redirecting you to dashboard...</p>
            </div>

            <div class="auth-footer">
                <a href="#login">← Back to Login</a>
            </div>
        </div>
    `;

    setupOtpInputs();
    startResendCooldown(45);

    document.getElementById('verify-btn').addEventListener('click', handleVerifyOtp);
    document.getElementById('resend-btn').addEventListener('click', handleResendOtp);
}

function setupOtpInputs() {
    const inputs = document.querySelectorAll('.otp-input');

    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val;
            if (val.length === 1) {
                input.classList.add('filled');
                if (index < inputs.length - 1) inputs[index + 1].focus();
            } else {
                input.classList.remove('filled');
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                inputs[index - 1].focus();
                inputs[index - 1].value = '';
                inputs[index - 1].classList.remove('filled');
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            pasted.split('').forEach((c, i) => {
                if (inputs[i]) {
                    inputs[i].value = c;
                    inputs[i].classList.add('filled');
                }
            });
            if (inputs[pasted.length - 1]) inputs[pasted.length - 1].focus();
        });

        input.addEventListener('keypress', (e) => {
            if (!/\d/.test(e.key)) e.preventDefault();
        });
    });

    if (inputs[0]) inputs[0].focus();
}

function getOtpValue() {
    return Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');
}

async function handleVerifyOtp() {
    const email = sessionStorage.getItem('otp_email');
    const otp = getOtpValue();
    const btn = document.getElementById('verify-btn');

    if (otp.length !== 6) {
        showToast('Please enter the complete 6-digit code', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

    try {
        const response = await api.auth.verifyOtp(email, otp);
        document.getElementById('otp-form').classList.add('hidden');
        document.getElementById('otp-success').classList.remove('hidden');
        showToast('Email verified successfully!', 'success');
        sessionStorage.removeItem('otp_email');

        // Extract or construct verified session user
        const userData = {
            id: response?.data?.userId || response?.data?.id || 1,
            userId: response?.data?.userId || response?.data?.id || 1,
            name: response?.data?.name || (email ? email.split('@')[0] : 'User'),
            email: response?.data?.email || email || 'user@autovault.com',
            role: response?.data?.role || 'USER',
            verified: true
        };

        // Save session so user is authenticated
        saveSession(userData);

        // Redirect to home/dashboard
        const targetPage = (userData.role === 'ADMIN' || userData.role === 'ADMINISTRATOR') ? 'admin-dashboard' : 'dashboard';
        setTimeout(() => navigate(targetPage), 1000);
    } catch (error) {
        showToast(error.message || 'Verification failed', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle"></i> VERIFY EMAIL';
        document.querySelectorAll('.otp-input').forEach(i => {
            i.value = '';
            i.classList.remove('filled');
        });
        document.querySelector('.otp-input')?.focus();
    }
}

async function handleResendOtp() {
    const email = sessionStorage.getItem('otp_email');
    if (!email) {
        showToast('Session expired. Please enter your email again.', 'error');
        navigate('login');
        return;
    }

    const btn = document.getElementById('resend-btn');
    btn.disabled = true;

    try {
        await api.auth.resendOtp(email);
        showToast(`Verification code resent to ${email}!`, 'success');
        startResendCooldown(45);
    } catch (error) {
        showToast(error.message || 'Could not resend OTP', 'error');
        btn.disabled = false;
    }
}

function startResendCooldown(seconds) {
    const btn = document.getElementById('resend-btn');
    const timer = document.getElementById('resend-timer');
    if (!btn) return;

    otpCountdown = seconds;
    btn.disabled = true;

    if (otpResendTimer) clearInterval(otpResendTimer);

    otpResendTimer = setInterval(() => {
        otpCountdown--;
        if (timer) timer.textContent = `Resend code in ${otpCountdown}s`;

        if (otpCountdown <= 0) {
            clearInterval(otpResendTimer);
            btn.disabled = false;
            if (timer) timer.textContent = '';
        }
    }, 1000);
}
