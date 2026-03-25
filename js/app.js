/* ============================================
   app.js — Router, Init, Utilities
   ============================================ */

window.currentPage = 'markets';

function navigateTo(page) {
    window.currentPage = page;
    const main = document.getElementById('mainContent');

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // Render page
    switch (page) {
        case 'markets':
            main.innerHTML = renderMarketsPage();
            break;
        case 'portfolio':
            main.innerHTML = renderPortfolioPage();
            break;
        case 'leaderboard':
            main.innerHTML = renderLeaderboardPage();
            break;
        default:
            main.innerHTML = renderMarketsPage();
    }

    // Close mobile menu
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `${icons[type] || ''} ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open', !isOpen);
    overlay.classList.toggle('open', !isOpen);

    if (!isOpen) {
        const menuLinks = document.getElementById('mobileMenuLinks');
        const user = getCurrentUser();
        menuLinks.innerHTML = `
            <a href="#" class="nav-link ${window.currentPage === 'markets' ? 'active' : ''}" onclick="navigateTo('markets');return false;">📊 Markets</a>
            <a href="#" class="nav-link ${window.currentPage === 'portfolio' ? 'active' : ''}" onclick="navigateTo('portfolio');return false;">💼 Portfolio</a>
            <a href="#" class="nav-link ${window.currentPage === 'leaderboard' ? 'active' : ''}" onclick="navigateTo('leaderboard');return false;">🏆 Leaderboard</a>
            ${user
                ? `<a href="#" class="nav-link" onclick="logout();return false;">🚪 Logout</a>`
                : `<a href="#" class="nav-link" onclick="openAuthModal('login');closeMobileMenu();return false;">🔑 Login</a>`
            }
        `;
    }
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('mobileMenuOverlay').classList.remove('open');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    ensureDemoUser();
    updateNavForUser();
    navigateTo('markets');
});
