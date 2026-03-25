/* ============================================
   auth.js — Authentication System
   ============================================ */

function getUsers() {
    const saved = localStorage.getItem('bharatx_users');
    return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
    localStorage.setItem('bharatx_users', JSON.stringify(users));
}

function getCurrentUser() {
    const saved = localStorage.getItem('bharatx_current_user');
    return saved ? JSON.parse(saved) : null;
}

function saveCurrentUser(user) {
    localStorage.setItem('bharatx_current_user', JSON.stringify(user));
}

function generateId() {
    return 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

// Initialize demo user if not exists
function ensureDemoUser() {
    let users = getUsers();
    if (!users.find(u => u.email === 'demo')) {
        users.push({
            id: generateId(),
            name: 'Demo Trader',
            email: 'demo',
            password: 'demo123',
            wallet: 10000,
            positions: [],
            trades: [],
            createdAt: new Date().toISOString()
        });
        saveUsers(users);
    }
}

// Open auth modal
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    modal.classList.add('open');
    renderAuthForm(mode);
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('open');
}

function renderAuthForm(mode) {
    const title = document.getElementById('authModalTitle');
    const subtitle = document.getElementById('authModalSubtitle');
    const body = document.getElementById('authModalBody');

    if (mode === 'login') {
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Login to start trading';
        body.innerHTML = `
            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label class="form-label">Email / Username</label>
                    <input type="text" class="form-input" id="loginEmail" placeholder="Enter email or username" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-input" id="loginPassword" placeholder="Enter password" required>
                </div>
                <div class="form-error" id="loginError"></div>
                <button type="submit" class="btn btn-primary">Login</button>
                <button type="button" class="btn btn-demo" onclick="demoLogin()">
                    ⚡ Quick Demo Login
                </button>
                <div class="auth-divider">or</div>
                <div class="auth-switch">
                    Don't have an account? <a onclick="renderAuthForm('signup')">Sign Up</a>
                </div>
            </form>`;
    } else {
        title.textContent = 'Create Account';
        subtitle.textContent = 'Start with ₹10,000 free paper money';
        body.innerHTML = `
            <form onsubmit="handleSignup(event)">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="signupName" placeholder="Enter your name" required minlength="2">
                </div>
                <div class="form-group">
                    <label class="form-label">Email / Phone</label>
                    <input type="text" class="form-input" id="signupEmail" placeholder="Enter email or phone" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-input" id="signupPassword" placeholder="Min 6 characters" required minlength="6">
                </div>
                <div class="form-error" id="signupError"></div>
                <button type="submit" class="btn btn-primary">Create Account</button>
                <button type="button" class="btn btn-demo" onclick="demoLogin()">
                    ⚡ Quick Demo Login
                </button>
                <div class="auth-divider">or</div>
                <div class="auth-switch">
                    Already have an account? <a onclick="renderAuthForm('login')">Login</a>
                </div>
            </form>`;
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginError');

    if (!email || !password) {
        errEl.textContent = 'Please fill in all fields';
        errEl.classList.add('visible');
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        errEl.textContent = 'Invalid email or password. Try demo / demo123';
        errEl.classList.add('visible');
        return;
    }

    saveCurrentUser(user);
    closeAuthModal();
    updateNavForUser();
    showToast('Welcome back, ' + user.name + '! 🎉', 'success');
    navigateTo('markets');
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const errEl = document.getElementById('signupError');

    if (!name || !email || !password) {
        errEl.textContent = 'Please fill in all fields';
        errEl.classList.add('visible');
        return;
    }

    if (password.length < 6) {
        errEl.textContent = 'Password must be at least 6 characters';
        errEl.classList.add('visible');
        return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        errEl.textContent = 'An account with this email already exists';
        errEl.classList.add('visible');
        return;
    }

    const newUser = {
        id: generateId(),
        name: name,
        email: email,
        password: password,
        wallet: 10000,
        positions: [],
        trades: [],
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    saveCurrentUser(newUser);
    closeAuthModal();
    updateNavForUser();
    showToast('Account created! You got ₹10,000 paper money 💰', 'success');
    navigateTo('markets');
}

function demoLogin() {
    ensureDemoUser();
    const users = getUsers();
    const demo = users.find(u => u.email === 'demo');
    saveCurrentUser(demo);
    closeAuthModal();
    updateNavForUser();
    showToast('Demo mode activated! ₹10,000 ready to trade ⚡', 'success');
    navigateTo('markets');
}

function logout() {
    localStorage.removeItem('bharatx_current_user');
    updateNavForUser();
    showToast('Logged out successfully', 'info');
    navigateTo('markets');
    closeUserDropdown();
}

// Sync current user data back to users array
function syncUserData() {
    const current = getCurrentUser();
    if (!current) return;
    let users = getUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx >= 0) {
        users[idx] = current;
        saveUsers(users);
    }
}

// Update nav based on auth state
function updateNavForUser() {
    const navRight = document.getElementById('navRight');
    const user = getCurrentUser();

    if (user) {
        const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        navRight.innerHTML = `
            <div class="wallet-badge" id="walletBadge">
                💰 ₹${Number(user.wallet).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div class="user-menu">
                <button class="user-menu-btn" onclick="toggleUserDropdown()">
                    <div class="user-avatar">${initials}</div>
                    <span class="user-name-nav">${user.name.split(' ')[0]}</span>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <button class="user-dropdown-item" onclick="navigateTo('portfolio'); closeUserDropdown();">💼 Portfolio</button>
                    <button class="user-dropdown-item" onclick="navigateTo('leaderboard'); closeUserDropdown();">🏆 Leaderboard</button>
                    <button class="user-dropdown-item danger" onclick="logout()">🚪 Logout</button>
                </div>
            </div>`;
    } else {
        navRight.innerHTML = `
            <button class="nav-login-btn" onclick="openAuthModal('login')">Login</button>`;
    }
}

function toggleUserDropdown() {
    const dd = document.getElementById('userDropdown');
    dd.classList.toggle('open');

    // Close on outside click
    if (dd.classList.contains('open')) {
        setTimeout(() => {
            document.addEventListener('click', closeDropdownOutside);
        }, 0);
    }
}

function closeUserDropdown() {
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.remove('open');
    document.removeEventListener('click', closeDropdownOutside);
}

function closeDropdownOutside(e) {
    const menu = document.querySelector('.user-menu');
    if (menu && !menu.contains(e.target)) {
        closeUserDropdown();
    }
}

function updateWalletDisplay() {
    const user = getCurrentUser();
    if (!user) return;
    const badge = document.getElementById('walletBadge');
    if (badge) {
        badge.innerHTML = `💰 ₹${Number(user.wallet).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
}
