export const MARKETS_DATA = [
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

export const CATEGORIES = [
    { id: 'all', label: 'All Markets', emoji: '🔥' },
    { id: 'politics', label: 'Politics', emoji: '🏛️' },
    { id: 'cricket', label: 'Cricket', emoji: '🏏' },
    { id: 'economy', label: 'Economy', emoji: '📈' },
    { id: 'bollywood', label: 'Bollywood', emoji: '🎬' },
    { id: 'sports', label: 'Sports', emoji: '⚽' },
    { id: 'startups', label: 'Startups', emoji: '🚀' }
];

export const formatVolume = (v) => {
    if (v >= 10000000) return '₹' + (v / 10000000).toFixed(1) + 'Cr';
    if (v >= 100000) return '₹' + (v / 100000).toFixed(1) + 'L';
    if (v >= 1000) return '₹' + (v / 1000).toFixed(1) + 'K';
    return '₹' + v;
};

export const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const MOCK_TRADERS = [
    { id: 'mock-1', name: 'Priya Sharma', roi: 34.7, portfolioValue: 13470, trades: 47 },
    { id: 'mock-2', name: 'Arjun Mehta', roi: 28.2, portfolioValue: 12820, trades: 62 },
    { id: 'mock-3', name: 'Sneha Reddy', roi: 22.5, portfolioValue: 12250, trades: 35 },
    { id: 'mock-4', name: 'Vikram Singh', roi: 18.9, portfolioValue: 11890, trades: 51 },
    { id: 'mock-5', name: 'Ananya Patel', roi: 14.3, portfolioValue: 11430, trades: 28 },
    { id: 'mock-6', name: 'Rohit Gupta', roi: 9.8, portfolioValue: 10980, trades: 41 },
    { id: 'mock-7', name: 'Kavya Nair', roi: 5.2, portfolioValue: 10520, trades: 19 },
    { id: 'mock-8', name: 'Amit Joshi', roi: -2.1, portfolioValue: 9790, trades: 33 }
];

// Admin Helpers
export const resolveMarket = (marketId, outcome) => {
    const markets = JSON.parse(localStorage.getItem('bharatx_markets')) || MARKETS_DATA;
    const marketIndex = markets.findIndex(m => m.id === marketId);
    
    if (marketIndex === -1) return { success: false, message: 'Market not found' };
    if (markets[marketIndex].resolved) return { success: false, message: 'Market already resolved' };

    // Update market
    markets[marketIndex].resolved = true;
    markets[marketIndex].outcome = outcome;
    localStorage.setItem('bharatx_markets', JSON.stringify(markets));

    // Process payouts for all users (in a real app this would be server-side)
    const users = JSON.parse(localStorage.getItem('bharatx_users')) || [];
    const updatedUsers = users.map(user => {
        const positions = user.positions || [];
        const marketPosition = positions.find(p => p.marketId === marketId);
        
        if (marketPosition) {
            const isWinner = marketPosition.side === outcome;
            if (isWinner) {
                // Payout = Shares * 1 (Winning side settles at ₹1 per share)
                const payout = marketPosition.shares;
                if (user.accountMode === 'paper') user.paperWallet += payout;
                else user.realWallet += payout;
                
                // Add to transaction history
                user.transactions = [
                    {
                        id: 'payout-' + Date.now(),
                        type: 'payout',
                        amount: payout,
                        marketId: marketId,
                        date: new Date().toISOString()
                    },
                    ...(user.transactions || [])
                ];
            }
            // Remove the closed position
            user.positions = positions.filter(p => p.marketId !== marketId);
        }
        return user;
    });

    localStorage.setItem('bharatx_users', JSON.stringify(updatedUsers));
    return { success: true, message: `Market resolved as ${outcome.toUpperCase()}. Payouts processed.` };
};

export const createMarket = (market) => {
    const markets = JSON.parse(localStorage.getItem('bharatx_markets')) || MARKETS_DATA;
    const newMarket = {
        id: 'market-' + Date.now(),
        ...market,
        yesPrice: 0.5, // Default start price
        volume: 0,
        resolved: false,
        outcome: null
    };
    markets.unshift(newMarket);
    localStorage.setItem('bharatx_markets', JSON.stringify(markets));
    return { success: true, market: newMarket };
};
