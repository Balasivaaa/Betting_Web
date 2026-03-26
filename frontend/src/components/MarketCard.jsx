import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { formatVolume, formatDate } from '../utils/mockData';

const MarketCard = ({ market, onTrade }) => {
    const yesPrice = market.yesPrice;
    const noPrice = 1 - yesPrice;

    return (
        <div className="market-card fade-in">
            <div className="market-card-header">
                <span className={`category-tag ${market.category}`}>{market.categoryEmoji} {market.category}</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className="live-badge">Live</span>
                    <span className="volume-tag">{formatVolume(market.volume)}</span>
                </div>
            </div>
            
            <h3 className="market-question">{market.question}</h3>
            
            <div className="market-prices">
                <div className="market-price-box yes" onClick={() => onTrade(market.id, 'yes')}>
                    <span className="price-label">YES</span>
                    <span className="price-value">₹{yesPrice.toFixed(2)}</span>
                </div>
                <div className="market-price-box no" onClick={() => onTrade(market.id, 'no')}>
                    <span className="price-label">NO</span>
                    <span className="price-value">₹{noPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="market-card-footer">
                <span className="end-date">Ends {formatDate(market.endDate)}</span>
                <button className="trade-btn" onClick={() => onTrade(market.id, 'yes')}>
                    Trade
                </button>
            </div>
        </div>
    );
};

export default MarketCard;
