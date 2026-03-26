import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, TrendingUp, Wallet, Loader2 } from 'lucide-react';

const TradeModal = ({ isOpen, onClose, market, initialSide }) => {
    const { user, accountMode, updateUser } = useAuth();
    const [side, setSide] = useState(initialSide || 'yes');
    const [amount, setAmount] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!market) return null;

    const price = side === 'yes' ? (market.probability?.yes || 0.5) : (market.probability?.no || 0.5);
    const shares = amount / price;
    const potentialReturn = shares * 1;
    const potentialProfit = potentialReturn - amount;
    const currentBalance = user ? (accountMode === 'demo' ? user.demoWallet : user.realWallet) : 0;
    const canAfford = currentBalance >= amount;

    const handleConfirm = async () => {
        if (!user || !canAfford || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('bharatx_token');
            const res = await fetch('/api/markets/trade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    marketId: market._id,
                    side: side,
                    amount: amount,
                    accountMode: accountMode
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Trade failed');

            // Update local user state with new balances/portfolio from server
            updateUser(data.user);
            
            // Show success toast (assuming there's a global method or just close)
            const toast = document.createElement('div');
            toast.className = 'toast success';
            toast.innerText = 'Trade Successful! 🚀';
            document.getElementById('toastContainer')?.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);

            onClose();
        } catch (err) {
            console.error('Trade Submission Error:', err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
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
                    YES ₹{(market.probability?.yes || 0.5).toFixed(2)}
                </button>
                <button 
                    className={`trade-side-btn no-side ${side === 'no' ? 'selected' : ''}`}
                    onClick={() => setSide('no')}
                >
                    NO ₹{(market.probability?.no || 0.5).toFixed(2)}
                </button>
            </div>

            <div className="trade-input-section">
                <div className="input-label-row">
                    <span>Investment Amount (₹)</span>
                    <span className="balance-label">
                        <Wallet size={12} /> ₹{currentBalance.toLocaleString()}
                    </span>
                </div>
                <div className="shares-input-container">
                    <button className="shares-btn" onClick={() => setAmount(Math.max(1, amount - 10))}>-</button>
                    <input 
                        type="number" 
                        className="shares-input" 
                        value={amount} 
                        onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    />
                    <button className="shares-btn" onClick={() => setAmount(amount + 10)}>+</button>
                </div>
                <div className="quick-amounts" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    {[50, 100, 500, 1000].map(amt => (
                        <button key={amt} className="amt-chip" onClick={() => setAmount(amt)} style={{ flex: 1, padding: '6px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'transparent', color: 'var(--text-color)', fontSize: '0.8rem', cursor: 'pointer' }}>
                            ₹{amt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="trade-summary">
                <div className="trade-detail-row">
                    <span className="label">Entry Price</span>
                    <span className="value">₹{price.toFixed(2)}</span>
                </div>
                <div className="trade-detail-row">
                    <span className="label">Shares to Receive</span>
                    <span className="value">{shares.toFixed(2)}</span>
                </div>
                <div className="trade-detail-row highlighted">
                    <span className="label">Potential Payout</span>
                    <span className="value green">₹{potentialReturn.toFixed(2)}</span>
                </div>
                <div className="trade-detail-row">
                    <span className="label">Potential Profit</span>
                    <span className="value green">₹{potentialProfit.toFixed(2)} ({((potentialProfit/amount)*100).toFixed(1)}%)</span>
                </div>
            </div>

            {error && (
                <div className="trade-error visible" style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertTriangle size={14} /> {error}
                </div>
            )}

            {!canAfford && !error && (
                <div className="trade-warning visible">
                    <AlertTriangle size={14} /> Insufficient balance
                </div>
            )}

            <button 
                className={`btn btn-primary btn-block ${(!canAfford || isSubmitting) ? 'disabled' : ''}`} 
                disabled={!canAfford || isSubmitting}
                onClick={handleConfirm}
                style={{ marginTop: '20px', fontWeight: '800', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Submit Trade'}
            </button>
        </Modal>
    );
};

export default TradeModal;
