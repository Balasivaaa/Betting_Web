import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, TrendingUp, History, Landmark } from 'lucide-react';
import WithdrawModal from './WithdrawModal';

const Portfolio = () => {
    const { user, accountMode, updateUser } = useAuth();
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const fetchLatestUser = async () => {
        const token = localStorage.getItem('PrediX_token');
        if (token) {
            try {
                const res = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    updateUser(data.user);
                }
            } catch (err) {
                console.error('Portfolio refresh failed:', err);
            }
        }
    };

    useEffect(() => {
        fetchLatestUser();
        const interval = setInterval(fetchLatestUser, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!user) return (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
            <h2>Please sign in to view your portfolio</h2>
        </div>
    );

    const portfolio = user.portfolio || [];
    const walletBalance = accountMode === 'demo' ? (user.demoWallet || 0) : (user.realWallet || 0);
    
    // Calculate stats from live portfolio data
    const totalInvested = portfolio.reduce((acc, pos) => acc + (pos.totalInvested || 0), 0);
    const currentValue = portfolio.reduce((acc, pos) => acc + (pos.shares * (pos.currentPrice || pos.avgPrice || 0)), 0);
    const totalPnL = currentValue - totalInvested;
    const roi = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
    const totalPortfolioValue = walletBalance + currentValue;

    const stats = [
        { label: 'Total Value', value: totalPortfolioValue, icon: <Wallet size={20} />, color: 'blue' },
        { label: 'Net P&L', value: totalPnL, icon: <TrendingUp size={20} />, color: totalPnL >= 0 ? 'green' : 'red' },
        { label: 'Active Positions', value: portfolio.length.toString(), icon: <History size={20} />, color: 'purple' },
        { label: 'Return (ROI)', value: `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`, icon: <TrendingUp size={20} />, color: 'cyan' }
    ];

    return (
        <div className="portfolio-page fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 className="page-title">My Portfolio <span className={`badge-mode ${accountMode}`}>{accountMode.toUpperCase()}</span></h1>
                    <p className="page-subtitle">Manage your trades and track performance</p>
                </div>
                {accountMode === 'real' && (
                    <button 
                        className="trade-btn" 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                        onClick={() => setShowWithdrawModal(true)}
                    >
                        <Landmark size={18} /> Withdraw Funds
                    </button>
                )}
            </header>

            <div className="portfolio-stats">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`portfolio-stat-card ${stat.color} stagger-${idx+1}`}>
                        <div className="stat-icon-wrapper">{stat.icon}</div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">
                                {typeof stat.value === 'number' ? `₹${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : stat.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="portfolio-content">
                <div className="content-card">
                    <div className="card-header">
                        <h3>Active Positions</h3>
                    </div>
                    
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Market</th>
                                    <th>Side</th>
                                    <th>Shares</th>
                                    <th>Avg Price</th>
                                    <th>Current</th>
                                    <th>P&L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.length > 0 ? portfolio.map((pos, idx) => {
                                    const currentPrice = pos.currentPrice || pos.avgPrice;
                                    const pnl = (pos.shares * currentPrice) - pos.totalInvested;
                                    return (
                                        <tr key={pos.marketId || idx}>
                                            <td className="market-cell">{pos.question || 'Prediction Market'}</td>
                                            <td><span className={`badge ${pos.side.toLowerCase()}`}>{pos.side.toUpperCase()}</span></td>
                                            <td>{pos.shares.toFixed(2)}</td>
                                            <td>₹{pos.avgPrice.toFixed(2)}</td>
                                            <td>₹{currentPrice.toFixed(2)}</td>
                                            <td className={pnl >= 0 ? 'green' : 'red'}>
                                                {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📈</div>
                                            <h3>No active positions</h3>
                                            <p>Your trades will appear here once you place them</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {user.withdrawals && user.withdrawals.length > 0 && (
                    <div className="content-card" style={{ marginTop: '32px' }}>
                        <div className="card-header">
                            <h3>Withdrawal History</h3>
                        </div>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.withdrawals.slice().reverse().map((w, idx) => (
                                        <tr key={w._id || idx}>
                                            <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                                            <td>₹{w.amount.toLocaleString()}</td>
                                            <td>{w.method}</td>
                                            <td>
                                                <span className={`status-badge ${w.status}`}>
                                                    {w.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <WithdrawModal 
                isOpen={showWithdrawModal} 
                onClose={() => setShowWithdrawModal(false)}
                onRefresh={fetchLatestUser}
            />
        </div>
    );
};

export default Portfolio;
