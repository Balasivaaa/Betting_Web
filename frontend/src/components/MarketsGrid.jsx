import React, { useState, useEffect, useMemo } from 'react';
import MarketCard from './MarketCard';
import { CATEGORIES } from '../utils/mockData';
import { Search, Loader2 } from 'lucide-react';

const MarketsGrid = ({ onTrade }) => {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const res = await fetch('/api/markets');
                if (!res.ok) throw new Error('Failed to fetch markets');
                const data = await res.json();
                setMarkets(data);
            } catch (err) {
                console.error('Error fetching markets:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkets();
        const interval = setInterval(fetchMarkets, 15000);
        return () => clearInterval(interval);
    }, []);

    const filteredMarkets = useMemo(() => {
        return markets.filter(market => {
            const matchesCategory = activeCategory === 'all' || 
                market.category?.toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = market.question?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery, markets]);

    if (loading) {
        return (
            <div className="markets-section fade-in">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div className="skeleton-line" style={{ width: '320px', height: '32px', margin: '0 auto' }}></div>
                    <div className="skeleton-line" style={{ width: '240px', height: '16px', margin: '12px auto 0' }}></div>
                </div>
                <div className="skeleton-line" style={{ width: '100%', height: '48px', borderRadius: '8px', marginBottom: '24px' }}></div>
                <div className="markets-grid">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="market-card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div className="skeleton-line" style={{ width: '70px', height: '20px' }}></div>
                                <div className="skeleton-line" style={{ width: '50px', height: '20px' }}></div>
                            </div>
                            <div className="skeleton-line" style={{ width: '100%', height: '18px', marginBottom: '8px' }}></div>
                            <div className="skeleton-line" style={{ width: '80%', height: '18px', marginBottom: '24px' }}></div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                <div className="skeleton-line" style={{ flex: 1, height: '52px' }}></div>
                                <div className="skeleton-line" style={{ flex: 1, height: '52px' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                <div className="skeleton-line" style={{ width: '90px', height: '14px' }}></div>
                                <div className="skeleton-line" style={{ width: '90px', height: '40px', borderRadius: '30px' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h3 style={{ color: '#ff4d4d' }}>Unable to load markets</h3>
                <p style={{ color: 'var(--text-muted)' }}>{error}</p>
                <button className="btn btn-secondary" onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="markets-section fade-in">
            <div className="markets-hero">
                <h1>Trade on Your <span className="text-gradient">Conviction</span></h1>
                <p>The prediction market for everything that matters in India</p>
            </div>

            <div className="controls-bar">
                <div className="categories-scroll">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span className="cat-icon">{cat.emoji}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="search-bar">
                    <Search className="search-icon" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search markets..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="markets-grid">
                {filteredMarkets.length > 0 ? (
                    filteredMarkets.map(market => (
                        <MarketCard 
                            key={market._id} 
                            market={market} 
                            onTrade={onTrade}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3>No markets found</h3>
                        <p>Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketsGrid;
