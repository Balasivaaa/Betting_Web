import React, { useState, useMemo } from 'react';
import MarketCard from './MarketCard';
import { MARKETS_DATA, CATEGORIES } from '../utils/mockData';
import { Search } from 'lucide-react';

const MarketsGrid = ({ onTrade }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMarkets = useMemo(() => {
        return MARKETS_DATA.filter(market => {
            const matchesCategory = activeCategory === 'all' || market.category === activeCategory;
            const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

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
                            key={market.id} 
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
