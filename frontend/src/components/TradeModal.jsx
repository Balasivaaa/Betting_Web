import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { MARKETS_DATA } from '../utils/mockData';
import { AlertTriangle, TrendingUp, Wallet } from 'lucide-react';

const TradeModal = ({ isOpen, onClose, marketId, initialSide }) => {
    const { user, accountMode, updateUser } = useAuth();
    const [side, setSide] = useState(initialSide || 'yes');
    const [shares, setShares] = useState(10);
    const market = MARKETS_DATA.find(m => m.id === marketId);

    if (!market) return null;

    const price = side === 'yes' ? market.yesPrice : (1 - market.yesPrice);
    const totalCost = shares * price;
    const potentialReturn = shares * 1;
    const potentialProfit = potentialReturn - totalCost;
    const currentBalance = user ? (accountMode === 'paper' ? user.paperWallet : user.realWallet) : 0;
    const canAfford = currentBalance >= totalCost;

    const handleConfirm = () => {
        if (!user || !canAfford) return;

        const newPosition = {
            marketId: market.id,
            marketQuestion: market.question,
            side: side,
            shares: shares,
            avgPrice: price,
            currentPrice: price,
            timestamp: new Date().toISOString()
        };

        const newTransaction = {
            id: 'tr-' + Date.now(),
            type: 'trade',
            action: 'buy',
            marketId: market.id,
            marketQuestion: market.question,
            side: side,
            shares: shares,
            price: price,
            amount: totalCost,
            date: new Date().toISOString()
        };

        const updates = {
            positions: [newPosition, ...(user.positions || [])],
            transactions: [newTransaction, ...(user.transactions || [])]
        };

        if (accountMode === 'paper') {
            updates.paperWallet = user.paperWallet - totalCost;
        } else {
            updates.realWallet = user.realWallet - totalCost;
        }

        updateUser(updates);
        onClose();
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Place Your Trade"
            subtitle={market.question}
        >
            <div className="trade-side-selector">
                <button 
                    className={`trade-side-btn yes-side ${side === 'yes' ? 'selected' : ''}`}
                    onClick={() => setSide('yes')}
                >
                    YES ₹{market.yesPrice.toFixed(2)}
                </button>
                <button 
                    className={`trade-side-btn no-side ${side === 'no' ? 'selected' : ''}`}
                    onClick={() => setSide('no')}
                >
                    NO ₹{(1 - market.yesPrice).toFixed(2)}
                </button>
            </div>

            <div className="trade-input-section">
                <div className="input-label-row">
                    <span>Shares to buy</span>
                    <span className="balance-label">
                        <Wallet size={12} /> ₹{currentBalance.toLocaleString()}
                    </span>
                </div>
                <div className="shares-input-container">
                    <button className="shares-btn" onClick={() => setShares(Math.max(1, shares - 5))}>-</button>
                    <input 
                        type="number" 
                        className="shares-input" 
                        value={shares} 
                        onChange={(e) => setShares(parseInt(e.target.value) || 0)}
                    />
                    <button className="shares-btn" onClick={() => setShares(shares + 5)}>+</button>
                </div>
            </div>

            <div className="trade-summary">
                <div className="trade-detail-row">
                    <span className="label">Average Price</span>
                    <span className="value">₹{price.toFixed(2)}</span>
                </div>
                <div className="trade-detail-row">
                    <span className="label">Total Cost</span>
                    <span className="value">₹{totalCost.toFixed(2)}</span>
                </div>
                <div className="trade-detail-row">
                    <span className="label">Potential Return</span>
                    <span className="value green">₹{potentialReturn.toFixed(2)}</span>
                </div>
                <div className="trade-detail-row highlighted">
                    <span className="label">Potential Profit</span>
                    <span className="value green">₹{potentialProfit.toFixed(2)} ({((potentialProfit/totalCost)*100).toFixed(1)}%)</span>
                </div>
            </div>

            {!canAfford && (
                <div className="trade-warning visible">
                    <AlertTriangle size={14} /> Insufficient balance for this trade
                </div>
            )}

            <button 
                className={`btn btn-primary btn-block ${!canAfford ? 'disabled' : ''}`} 
                disabled={!canAfford}
                onClick={handleConfirm}
                style={{ marginTop: '20px', fontWeight: '800', letterSpacing: '0.05em' }}
            >
                Submit Trade
            </button>
        </Modal>
    );
};

export default TradeModal;
