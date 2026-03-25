/* ============================================
   leaderboard.js — Leaderboard with Mock Traders
   ============================================ */

const MOCK_TRADERS = [
    { id: 'mock-1', name: 'Priya Sharma', roi: 34.7, portfolioValue: 13470, trades: 47 },
    { id: 'mock-2', name: 'Arjun Mehta', roi: 28.2, portfolioValue: 12820, trades: 62 },
    { id: 'mock-3', name: 'Sneha Reddy', roi: 22.5, portfolioValue: 12250, trades: 35 },
    { id: 'mock-4', name: 'Vikram Singh', roi: 18.9, portfolioValue: 11890, trades: 51 },
    { id: 'mock-5', name: 'Ananya Patel', roi: 14.3, portfolioValue: 11430, trades: 28 },
    { id: 'mock-6', name: 'Rohit Gupta', roi: 9.8, portfolioValue: 10980, trades: 41 },
    { id: 'mock-7', name: 'Kavya Nair', roi: 5.2, portfolioValue: 10520, trades: 19 },
    { id: 'mock-8', name: 'Amit Joshi', roi: -2.1, portfolioValue: 9790, trades: 33 }
];

function calculateUserROI() {
    const user = getCurrentUser();
    if (!user) return null;
    const markets = getMarkets();
    let currentValue = 0;
    (user.positions || []).forEach(pos => {
        const market = markets.find(m => m.id === pos.marketId);
        if (!market) return;
        const cp = pos.side === 'yes' ? market.yesPrice : (1 - market.yesPrice);
        currentValue += pos.shares * cp;
    });
    const totalPortfolio = user.wallet + currentValue;
    const roi = ((totalPortfolio - 10000) / 10000) * 100;
    return { name: user.name, roi: Math.round(roi * 10) / 10, portfolioValue: Math.round(totalPortfolio), trades: (user.trades || []).length, isCurrentUser: true };
}

function getLeaderboard() {
    const traders = [...MOCK_TRADERS];
    const userEntry = calculateUserROI();
    if (userEntry) traders.push(userEntry);
    traders.sort((a, b) => b.roi - a.roi);
    return traders;
}

function renderLeaderboardPage() {
    const lb = getLeaderboard();
    const top3 = lb.slice(0, 3);
    const rankEmojis = ['🥇', '🥈', '🥉'];

    let podiumHtml = top3.map((t, i) => {
        const cls = i === 0 ? 'first' : i === 1 ? 'second' : 'third';
        const initials = t.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        return `<div class="podium-item ${cls} ${t.isCurrentUser ? 'current-user' : ''} fade-in stagger-${i+1}">
            <div class="podium-rank">${rankEmojis[i]}</div>
            <div class="podium-avatar">${initials}</div>
            <div class="podium-name">${t.name}${t.isCurrentUser ? ' (You)' : ''}</div>
            <div class="podium-roi" style="color:${t.roi >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">
                ${t.roi >= 0 ? '+' : ''}${t.roi}%</div>
        </div>`;
    }).join('');

    let rowsHtml = lb.map((t, i) => {
        const initials = t.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const rank = i + 1;
        return `<div class="leaderboard-row ${t.isCurrentUser ? 'current-user' : ''}">
            <div class="leaderboard-rank ${rank <= 3 ? 'top' : ''}">${rank <= 3 ? rankEmojis[rank-1] : '#'+rank}</div>
            <div class="leaderboard-user">
                <div class="leaderboard-avatar" ${t.isCurrentUser ? 'style="background:var(--gradient-orange);"' : ''}>${initials}</div>
                <div class="leaderboard-name">${t.name}${t.isCurrentUser ? ' (You)' : ''}</div>
            </div>
            <div class="leaderboard-stats">
                <div class="leaderboard-stat"><div class="stat-label-sm">ROI</div>
                    <div class="stat-value-sm" style="color:${t.roi >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">${t.roi >= 0 ? '+' : ''}${t.roi}%</div></div>
                <div class="leaderboard-stat"><div class="stat-label-sm">Portfolio</div>
                    <div class="stat-value-sm">₹${Number(t.portfolioValue).toLocaleString('en-IN')}</div></div>
                <div class="leaderboard-stat"><div class="stat-label-sm">Trades</div>
                    <div class="stat-value-sm">${t.trades}</div></div>
            </div>
        </div>`;
    }).join('');

    return `<div class="page fade-in" id="leaderboardPage">
        <div class="page-header" style="text-align:center;">
            <h1 class="page-title">🏆 Leaderboard</h1>
            <p class="page-subtitle">Top traders ranked by Return on Investment</p>
        </div>
        <div class="leaderboard-podium">${podiumHtml}</div>
        <div class="leaderboard-table-wrapper fade-in stagger-4">${rowsHtml}</div>
    </div>`;
}
