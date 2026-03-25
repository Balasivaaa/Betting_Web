/* ============================================
   trading.js — Paper Trading Engine
   ============================================ */

let currentTradeMarketId = null;
let currentTradeSide = 'yes';
let currentTradeShares = 10;

function openTradeModal(marketId, side = 'yes') {
    const user = getCurrentUser();
    if (!user) {
        openAuthModal('login');
        showToast('Please login to trade', 'info');
        return;
    }

    currentTradeMarketId = marketId;
    currentTradeSide = side;
    currentTradeShares = 10;

    const market = getMarketById(marketId);
    if (!market) return;

    renderTradeModal(market);
    document.getElementById('tradeModal').classList.add('open');
}

function closeTradeModal() {
    document.getElementById('tradeModal').classList.remove('open');
}

function renderTradeModal(market) {
    const body = document.getElementById('tradeModalBody');
    const yesPrice = market.yesPrice;
    const noPrice = (1 - market.yesPrice);
    const price = currentTradeSide === 'yes' ? yesPrice : noPrice;
    const total = (currentTradeShares * price).toFixed(2);
    const user = getCurrentUser();

    // Check for existing position
    const existingPos = user.positions.find(p => p.marketId === market.id && p.side === currentTradeSide);
    const existingInfo = existingPos
        ? `<div class="trade-detail-row">
            <span class="label">Existing Position</span>
            <span class="value">${existingPos.shares} shares @ ₹${existingPos.avgPrice.toFixed(2)}</span>
           </div>`
        : '';

    const mode = getAccountMode();
    const balance = mode === 'real' ? (user.realWallet || 0) : user.wallet;
    const insufficientFunds = parseFloat(total) > balance;

    body.innerHTML = `
        <div class="trade-market-title">${market.question}</div>
        <div class="trade-market-category">
            <span class="market-category-tag ${market.category}">${market.categoryEmoji} ${market.category}</span>
        </div>

        <div class="trade-side-selector">
            <button class="trade-side-btn yes-side ${currentTradeSide === 'yes' ? 'selected' : ''}"
                    onclick="selectTradeSide('yes', '${market.id}')">
                YES ₹${yesPrice.toFixed(2)}
            </button>
            <button class="trade-side-btn no-side ${currentTradeSide === 'no' ? 'selected' : ''}"
                    onclick="selectTradeSide('no', '${market.id}')">
                NO ₹${noPrice.toFixed(2)}
            </button>
        </div>

        <div class="shares-input-group">
            <label>Number of Shares</label>
            <div class="shares-input-row">
                <button class="shares-btn" onclick="adjustShares(-1, '${market.id}')">−</button>
                <input type="number" class="shares-input" id="sharesInput" value="${currentTradeShares}" 
                       min="1" max="9999" onchange="setShares(this.value, '${market.id}')">
                <button class="shares-btn" onclick="adjustShares(1, '${market.id}')">+</button>
            </div>
            <div class="quick-amounts">
                <button class="quick-amount-btn" onclick="setShares(5, '${market.id}')">5</button>
                <button class="quick-amount-btn" onclick="setShares(10, '${market.id}')">10</button>
                <button class="quick-amount-btn" onclick="setShares(25, '${market.id}')">25</button>
                <button class="quick-amount-btn" onclick="setShares(50, '${market.id}')">50</button>
                <button class="quick-amount-btn" onclick="setShares(100, '${market.id}')">100</button>
            </div>
        </div>

        <div class="trade-details">
            <div class="trade-detail-row">
                <span class="label">Price per share</span>
                <span class="value ${currentTradeSide === 'yes' ? 'green' : 'red'}">₹${price.toFixed(2)}</span>
            </div>
            <div class="trade-detail-row">
                <span class="label">Implied probability</span>
                <span class="value">${Math.round(price * 100)}%</span>
            </div>
            <div class="trade-detail-row">
                <span class="label">Potential payout (per share)</span>
                <span class="value green">₹1.00</span>
            </div>
            <div class="trade-detail-row">
                <span class="label">Potential profit (per share)</span>
                <span class="value green">₹${(1 - price).toFixed(2)}</span>
            </div>
            ${existingInfo}
            <div class="trade-detail-row">
                <span class="label">${mode === 'real' ? 'Real' : 'Paper'} wallet balance</span>
                <span class="value">₹${Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
        </div>

        <div class="trade-total">
            <div class="total-label">Total Cost</div>
            <div class="total-value ${insufficientFunds ? 'red' : ''}">₹${Number(total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>

        <div class="trade-warning ${insufficientFunds ? 'visible' : ''}" id="tradeWarning">
            ⚠️ Insufficient funds. Reduce shares or add money.
        </div>

        <button class="btn ${currentTradeSide === 'yes' ? 'btn-yes' : 'btn-no'} btn-primary" 
                onclick="executeTrade('${market.id}')"
                ${insufficientFunds ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
            Buy ${currentTradeSide.toUpperCase()} — ₹${total}
        </button>
    `;
}

function selectTradeSide(side, marketId) {
    currentTradeSide = side;
    const market = getMarketById(marketId);
    renderTradeModal(market);
}

function adjustShares(delta, marketId) {
    currentTradeShares = Math.max(1, currentTradeShares + delta);
    const market = getMarketById(marketId);
    renderTradeModal(market);
}

function setShares(val, marketId) {
    currentTradeShares = Math.max(1, Math.min(9999, parseInt(val) || 1));
    const market = getMarketById(marketId);
    renderTradeModal(market);
}

function executeTrade(marketId) {
    const user = getCurrentUser();
    if (!user) return;

    const market = getMarketById(marketId);
    if (!market) return;

    const mode = getAccountMode();
    const balance = mode === 'real' ? (user.realWallet || 0) : user.wallet;

    if (total > balance) {
        showToast('Insufficient funds!', 'error');
        return;
    }

    // Deduct from appropriate wallet
    if (mode === 'real') {
        user.realWallet -= total;
        user.realWallet = Math.round(user.realWallet * 100) / 100;
    } else {
        user.wallet -= total;
        user.wallet = Math.round(user.wallet * 100) / 100;
    }

    // Check for existing position
    const existingIdx = user.positions.findIndex(p => p.marketId === marketId && p.side === currentTradeSide);

    if (existingIdx >= 0) {
        // Position averaging
        const existing = user.positions[existingIdx];
        const totalShares = existing.shares + currentTradeShares;
        const totalCost = (existing.shares * existing.avgPrice) + (currentTradeShares * price);
        existing.avgPrice = Math.round((totalCost / totalShares) * 10000) / 10000;
        existing.shares = totalShares;
    } else {
        // New position
        user.positions.push({
            marketId: marketId,
            side: currentTradeSide,
            shares: currentTradeShares,
            avgPrice: price,
            openedAt: new Date().toISOString()
        });
    }

    // Record trade
    user.trades.push({
        id: 't_' + Date.now(),
        marketId: marketId,
        side: currentTradeSide,
        shares: currentTradeShares,
        price: price,
        total: total,
        timestamp: new Date().toISOString()
    });

    // Update volume on market
    const markets = getMarkets();
    const mktIdx = markets.findIndex(m => m.id === marketId);
    if (mktIdx >= 0) {
        markets[mktIdx].volume += Math.round(total);
        saveMarkets(markets);
    }

    // Save user
    saveCurrentUser(user);
    syncUserData();

    closeTradeModal();
    updateWalletDisplay();
    showToast(`Bought ${currentTradeShares} ${currentTradeSide.toUpperCase()} shares! 🎯`, 'success');

    // Refresh current page if on portfolio
    if (window.currentPage === 'portfolio') {
        navigateTo('portfolio');
    }
    if (window.currentPage === 'markets') {
        navigateTo('markets');
    }
}
