/* ============================================
   portfolio.js — Portfolio & P&L
   ============================================ */

let portfolioTab = 'positions';

function renderPortfolioPage() {
    const user = getCurrentUser();
    if (!user) {
        return `
        <div class="page fade-in">
            <div class="empty-state">
                <div class="empty-state-icon">🔒</div>
                <h3>Login Required</h3>
                <p>Please login to view your portfolio and trading history.</p>
                <button class="btn btn-primary" style="max-width:200px;margin:0 auto;" onclick="openAuthModal('login')">Login</button>
            </div>
        </div>`;
    }

    const positions = user.positions || [];
    const trades = user.trades || [];
    const markets = getMarkets();

    // Calculate portfolio stats
    let totalInvested = 0;
    let currentValue = 0;

    positions.forEach(pos => {
        const market = markets.find(m => m.id === pos.marketId);
        if (!market) return;
        const currentPrice = pos.side === 'yes' ? market.yesPrice : (1 - market.yesPrice);
        const costBasis = pos.shares * pos.avgPrice;
        const mktValue = pos.shares * currentPrice;
        totalInvested += costBasis;
        currentValue += mktValue;
    });

    const unrealisedPnL = currentValue - totalInvested;
    const pnlPct = totalInvested > 0 ? (unrealisedPnL / totalInvested * 100) : 0;

    // Win rate (for resolved trades)
    const resolvedTrades = trades.filter(t => {
        const market = markets.find(m => m.id === t.marketId);
        return market && market.resolved;
    });
    const winningTrades = resolvedTrades.filter(t => {
        const market = markets.find(m => m.id === t.marketId);
        return market && ((t.side === 'yes' && market.outcome === true) || (t.side === 'no' && market.outcome === false));
    });
    const winRate = resolvedTrades.length > 0 ? Math.round(winningTrades.length / resolvedTrades.length * 100) : 0;

    return `
    <div class="page fade-in" id="portfolioPage">
        <div class="page-header">
            <h1 class="page-title">Portfolio</h1>
            <p class="page-subtitle">Track your positions, P&L, and trading history</p>
        </div>

        <div class="portfolio-stats">
            <div class="portfolio-stat-card fade-in stagger-1">
                <div class="portfolio-stat-label">Wallet Balance</div>
                <div class="portfolio-stat-value">₹${Number(user.wallet).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="portfolio-stat-card fade-in stagger-2">
                <div class="portfolio-stat-label">Total Invested</div>
                <div class="portfolio-stat-value">₹${totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="portfolio-stat-card fade-in stagger-3">
                <div class="portfolio-stat-label">Current Value</div>
                <div class="portfolio-stat-value">₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="portfolio-stat-card fade-in stagger-4">
                <div class="portfolio-stat-label">Unrealised P&L</div>
                <div class="portfolio-stat-value ${unrealisedPnL >= 0 ? 'green' : 'red'}">
                    ${unrealisedPnL >= 0 ? '+' : ''}₹${unrealisedPnL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div class="portfolio-stat-change ${pnlPct >= 0 ? 'positive' : 'negative'}">
                    ${pnlPct >= 0 ? '▲' : '▼'} ${Math.abs(pnlPct).toFixed(1)}%
                </div>
            </div>
            <div class="portfolio-stat-card fade-in stagger-5">
                <div class="portfolio-stat-label">Win Rate</div>
                <div class="portfolio-stat-value">${winRate}%</div>
                <div class="portfolio-stat-change" style="color: var(--text-muted);">${resolvedTrades.length} resolved</div>
            </div>
            <div class="portfolio-stat-card fade-in stagger-6">
                <div class="portfolio-stat-label">Total Trades</div>
                <div class="portfolio-stat-value">${trades.length}</div>
            </div>
        </div>

        <div class="section-tabs">
            <button class="section-tab ${portfolioTab === 'positions' ? 'active' : ''}" onclick="switchPortfolioTab('positions')">
                Open Positions (${positions.length})
            </button>
            <button class="section-tab ${portfolioTab === 'history' ? 'active' : ''}" onclick="switchPortfolioTab('history')">
                Trade History (${trades.length})
            </button>
        </div>

        <div id="portfolioTabContent">
            ${portfolioTab === 'positions' ? renderPositionsTable(positions, markets) : renderTradeHistory(trades, markets)}
        </div>
    </div>`;
}

function switchPortfolioTab(tab) {
    portfolioTab = tab;
    navigateTo('portfolio');
}

function renderPositionsTable(positions, markets) {
    if (positions.length === 0) {
        return `
        <div class="empty-state">
            <div class="empty-state-icon">📊</div>
            <h3>No Open Positions</h3>
            <p>Start trading to see your positions here. Buy YES or NO shares on any market.</p>
            <button class="btn btn-primary" style="max-width:200px;margin:0 auto;" onclick="navigateTo('markets')">
                Explore Markets
            </button>
        </div>`;
    }

    const rows = positions.map(pos => {
        const market = markets.find(m => m.id === pos.marketId);
        if (!market) return '';
        const currentPrice = pos.side === 'yes' ? market.yesPrice : (1 - market.yesPrice);
        const costBasis = pos.shares * pos.avgPrice;
        const mktValue = pos.shares * currentPrice;
        const pnl = mktValue - costBasis;
        const pnlPct = costBasis > 0 ? (pnl / costBasis * 100) : 0;

        return `
        <tr>
            <td style="max-width:250px;white-space:normal;line-height:1.3;font-weight:500;">
                ${market.question}
            </td>
            <td><span class="badge ${pos.side}">${pos.side.toUpperCase()}</span></td>
            <td>${pos.shares}</td>
            <td>₹${pos.avgPrice.toFixed(2)}</td>
            <td>₹${currentPrice.toFixed(2)}</td>
            <td>₹${costBasis.toFixed(2)}</td>
            <td>₹${mktValue.toFixed(2)}</td>
            <td style="color: ${pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}; font-weight: 600;">
                ${pnl >= 0 ? '+' : ''}₹${pnl.toFixed(2)}
                <br><small style="font-weight:400;">${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(1)}%</small>
            </td>
        </tr>`;
    }).join('');

    return `
    <div class="data-table-wrapper">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Market</th>
                    <th>Side</th>
                    <th>Shares</th>
                    <th>Avg Price</th>
                    <th>Current</th>
                    <th>Cost Basis</th>
                    <th>Mkt Value</th>
                    <th>P&L</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`;
}

function renderTradeHistory(trades, markets) {
    if (trades.length === 0) {
        return `
        <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <h3>No Trade History</h3>
            <p>Your trade history will appear here once you make your first trade.</p>
        </div>`;
    }

    const rows = [...trades].reverse().map(t => {
        const market = markets.find(m => m.id === t.marketId);
        const question = market ? market.question : 'Unknown Market';
        const status = market && market.resolved
            ? ((t.side === 'yes' && market.outcome === true) || (t.side === 'no' && market.outcome === false))
                ? '<span class="badge won">Won</span>'
                : '<span class="badge lost">Lost</span>'
            : '<span class="badge pending">Pending</span>';

        const time = new Date(t.timestamp);
        const timeStr = time.toLocaleString('en-IN', {
            day: 'numeric', month: 'short',
            hour: '2-digit', minute: '2-digit'
        });

        return `
        <tr>
            <td style="max-width:250px;white-space:normal;line-height:1.3;font-weight:500;">
                ${question}
            </td>
            <td><span class="badge ${t.side}">${t.side.toUpperCase()}</span></td>
            <td>${t.shares}</td>
            <td>₹${t.price.toFixed(2)}</td>
            <td>₹${t.total.toFixed(2)}</td>
            <td>${status}</td>
            <td style="color:var(--text-muted);font-size:0.8rem;">${timeStr}</td>
        </tr>`;
    }).join('');

    return `
    <div class="data-table-wrapper">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Market</th>
                    <th>Side</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`;
}
