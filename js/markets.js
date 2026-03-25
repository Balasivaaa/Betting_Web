/* ============================================
   markets.js — 18 Prediction Markets Data
   ============================================ */

const MARKETS_DATA = [
    // === POLITICS ===
    {
        id: 'pol-1',
        question: 'Will BJP win the 2027 UP Assembly Elections?',
        category: 'politics',
        categoryEmoji: '🏛️',
        yesPrice: 0.62,
        volume: 284500,
        endDate: '2027-03-15',
        resolved: false,
        outcome: null
    },
    {
        id: 'pol-2',
        question: 'Will India-Pakistan diplomatic talks resume by Dec 2026?',
        category: 'politics',
        categoryEmoji: '🏛️',
        yesPrice: 0.31,
        volume: 152300,
        endDate: '2026-12-31',
        resolved: false,
        outcome: null
    },
    {
        id: 'pol-3',
        question: 'Will Uniform Civil Code be implemented nationwide by 2027?',
        category: 'politics',
        categoryEmoji: '🏛️',
        yesPrice: 0.44,
        volume: 198700,
        endDate: '2027-06-30',
        resolved: false,
        outcome: null
    },

    // === CRICKET ===
    {
        id: 'cri-1',
        question: 'Will India win the ICC Champions Trophy 2026?',
        category: 'cricket',
        categoryEmoji: '🏏',
        yesPrice: 0.58,
        volume: 521000,
        endDate: '2026-07-15',
        resolved: false,
        outcome: null
    },
    {
        id: 'cri-2',
        question: 'Will Virat Kohli score 10,000 Test runs before retiring?',
        category: 'cricket',
        categoryEmoji: '🏏',
        yesPrice: 0.74,
        volume: 389200,
        endDate: '2027-12-31',
        resolved: false,
        outcome: null
    },
    {
        id: 'cri-3',
        question: 'Will RCB win IPL 2026?',
        category: 'cricket',
        categoryEmoji: '🏏',
        yesPrice: 0.18,
        volume: 673400,
        endDate: '2026-06-01',
        resolved: false,
        outcome: null
    },

    // === ECONOMY ===
    {
        id: 'eco-1',
        question: 'Will Sensex cross 1,00,000 by December 2026?',
        category: 'economy',
        categoryEmoji: '📈',
        yesPrice: 0.67,
        volume: 445600,
        endDate: '2026-12-31',
        resolved: false,
        outcome: null
    },
    {
        id: 'eco-2',
        question: 'Will RBI cut repo rate below 5% in 2026?',
        category: 'economy',
        categoryEmoji: '📈',
        yesPrice: 0.29,
        volume: 178900,
        endDate: '2026-12-31',
        resolved: false,
        outcome: null
    },
    {
        id: 'eco-3',
        question: 'Will Indian Rupee strengthen below ₹82/USD?',
        category: 'economy',
        categoryEmoji: '📈',
        yesPrice: 0.22,
        volume: 234100,
        endDate: '2026-12-31',
        resolved: false,
        outcome: null
    },

    // === BOLLYWOOD ===
    {
        id: 'bol-1',
        question: 'Will Pushpa 3 cross ₹1000 Crore worldwide?',
        category: 'bollywood',
        categoryEmoji: '🎬',
        yesPrice: 0.71,
        volume: 312800,
        endDate: '2027-06-30',
        resolved: false,
        outcome: null
    },
    {
        id: 'bol-2',
        question: 'Will Shah Rukh Khan announce a new film in 2026?',
        category: 'bollywood',
        categoryEmoji: '🎬',
        yesPrice: 0.83,
        volume: 267500,
        endDate: '2026-12-31',
        resolved: false,
        outcome: null
    },
    {
        id: 'bol-3',
        question: 'Will a Bollywood film win the Palme d\'Or at Cannes 2026?',
        category: 'bollywood',
        categoryEmoji: '🎬',
        yesPrice: 0.09,
        volume: 145200,
        endDate: '2026-06-01',
        resolved: false,
        outcome: null
    },

    // === SPORTS ===
    {
        id: 'spo-1',
        question: 'Will India win Gold in Hockey at 2028 LA Olympics?',
        category: 'sports',
        categoryEmoji: '⚽',
        yesPrice: 0.36,
        volume: 278100,
        endDate: '2028-08-15',
        resolved: false,
        outcome: null
    },
    {
        id: 'spo-2',
        question: 'Will Neeraj Chopra break the 90m javelin barrier?',
        category: 'sports',
        categoryEmoji: '⚽',
        yesPrice: 0.52,
        volume: 198700,
        endDate: '2028-08-15',
        resolved: false,
        outcome: null
    },
    {
        id: 'spo-3',
        question: 'Will India officially host the 2036 Olympics?',
        category: 'sports',
        categoryEmoji: '⚽',
        yesPrice: 0.41,
        volume: 356900,
        endDate: '2027-12-31',
        resolved: false,
        outcome: null
    },

    // === STARTUPS ===
    {
        id: 'sta-1',
        question: 'Will Flipkart IPO launch in 2026?',
        category: 'startups',
        categoryEmoji: '🚀',
        yesPrice: 0.47,
        volume: 423600,
        endDate: '2026-12-31',
        resolved: false,
        outcome: null
    },
    {
        id: 'sta-2',
        question: 'Will an Indian startup reach $100 Billion valuation?',
        category: 'startups',
        categoryEmoji: '🚀',
        yesPrice: 0.28,
        volume: 189400,
        endDate: '2027-12-31',
        resolved: false,
        outcome: null
    },
    {
        id: 'sta-3',
        question: 'Will UPI cross 20 Billion monthly transactions?',
        category: 'startups',
        categoryEmoji: '🚀',
        yesPrice: 0.69,
        volume: 301200,
        endDate: '2026-12-31',
        resolved: false,
        outcome: null
    }
];

const CATEGORIES = [
    { id: 'all', label: 'All Markets', emoji: '🔥' },
    { id: 'politics', label: 'Politics', emoji: '🏛️' },
    { id: 'cricket', label: 'Cricket', emoji: '🏏' },
    { id: 'economy', label: 'Economy', emoji: '📈' },
    { id: 'bollywood', label: 'Bollywood', emoji: '🎬' },
    { id: 'sports', label: 'Sports', emoji: '⚽' },
    { id: 'startups', label: 'Startups', emoji: '🚀' }
];

// Get markets (possibly from localStorage if prices were updated)
function getMarkets() {
    const saved = localStorage.getItem('bharatx_markets');
    if (saved) {
        return JSON.parse(saved);
    }
    // Save initial data
    localStorage.setItem('bharatx_markets', JSON.stringify(MARKETS_DATA));
    return [...MARKETS_DATA];
}

function saveMarkets(markets) {
    localStorage.setItem('bharatx_markets', JSON.stringify(markets));
}

function getMarketById(id) {
    const markets = getMarkets();
    return markets.find(m => m.id === id);
}

function formatVolume(v) {
    if (v >= 100000) return '₹' + (v / 100000).toFixed(1) + 'L';
    if (v >= 1000) return '₹' + (v / 1000).toFixed(1) + 'K';
    return '₹' + v;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderMarketsPage() {
    const markets = getMarkets();

    return `
    <div class="page fade-in" id="marketsPage">
        <div class="markets-hero">
            <h1>Predict. Trade. <span>Win.</span></h1>
            <p>Trade on India's biggest questions with ₹10,000 paper money. Zero risk, real insights.</p>
        </div>

        <div class="stats-bar">
            <div class="stat-item">
                <div class="stat-value">${markets.length}</div>
                <div class="stat-label">Live Markets</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${formatVolume(markets.reduce((s, m) => s + m.volume, 0))}</div>
                <div class="stat-label">Volume Traded</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">6</div>
                <div class="stat-label">Categories</div>
            </div>
        </div>

        <div class="category-filters" id="categoryFilters">
            ${CATEGORIES.map(c => `
                <button class="category-pill ${c.id === 'all' ? 'active' : ''}" 
                        data-category="${c.id}" onclick="filterMarkets('${c.id}')">
                    ${c.emoji} ${c.label}
                </button>
            `).join('')}
        </div>

        <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input type="text" id="marketSearch" placeholder="Search markets..." oninput="searchMarkets(this.value)">
        </div>

        <div class="markets-grid" id="marketsGrid">
            ${renderMarketCards(markets)}
        </div>
    </div>`;
}

function renderMarketCards(markets) {
    if (markets.length === 0) {
        return `<div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🔍</div>
            <h3>No markets found</h3>
            <p>Try adjusting your search or filters</p>
        </div>`;
    }

    return markets.map((m, i) => {
        const noPrice = (1 - m.yesPrice).toFixed(2);
        const yesPct = Math.round(m.yesPrice * 100);
        const noPct = 100 - yesPct;
        return `
        <div class="market-card fade-in stagger-${(i % 6) + 1}" data-id="${m.id}" data-category="${m.category}">
            <div class="market-card-header">
                <span class="market-category-tag ${m.category}">
                    ${m.categoryEmoji} ${m.category}
                </span>
                <span class="market-volume">Vol: ${formatVolume(m.volume)}</span>
            </div>
            <div class="market-question">${m.question}</div>
            <div class="probability-bar">
                <div class="probability-fill" style="width: ${yesPct}%"></div>
            </div>
            <div class="market-prices">
                <div class="market-price-box yes-box" onclick="openTradeModal('${m.id}', 'yes')">
                    <span class="price-label">Yes</span>
                    <span class="price-value">₹${m.yesPrice.toFixed(2)}</span>
                    <span class="price-prob">${yesPct}% chance</span>
                </div>
                <div class="market-price-box no-box" onclick="openTradeModal('${m.id}', 'no')">
                    <span class="price-label">No</span>
                    <span class="price-value">₹${noPrice}</span>
                    <span class="price-prob">${noPct}% chance</span>
                </div>
            </div>
            <div class="market-footer">
                <span class="market-end-date">📅 Ends ${formatDate(m.endDate)}</span>
                <div class="market-trade-btns">
                    <button class="btn btn-yes btn-sm" onclick="openTradeModal('${m.id}', 'yes')">Buy Yes</button>
                    <button class="btn btn-no btn-sm" onclick="openTradeModal('${m.id}', 'no')">Buy No</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

let currentCategory = 'all';
let currentSearch = '';

function filterMarkets(category) {
    currentCategory = category;
    document.querySelectorAll('.category-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.category === category);
    });
    applyFilters();
}

function searchMarkets(query) {
    currentSearch = query.toLowerCase().trim();
    applyFilters();
}

function applyFilters() {
    let markets = getMarkets();
    if (currentCategory !== 'all') {
        markets = markets.filter(m => m.category === currentCategory);
    }
    if (currentSearch) {
        markets = markets.filter(m =>
            m.question.toLowerCase().includes(currentSearch) ||
            m.category.toLowerCase().includes(currentSearch)
        );
    }
    const grid = document.getElementById('marketsGrid');
    if (grid) grid.innerHTML = renderMarketCards(markets);
}
