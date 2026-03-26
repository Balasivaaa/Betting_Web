import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, TrendingUp, History, User } from 'lucide-react';
import { formatVolume } from '../utils/mockData';

const Portfolio = () => {
    const { user, accountMode } = useAuth();

    if (!user) return null;

    const positions = user.positions || [];
    const walletBalance = accountMode === 'paper' ? user.paperWallet : user.realWallet;
    
    // Calculate Total Invested and Current Value
    const totalInvested = positions.reduce((acc, pos) => acc + (pos.shares * pos.avgPrice), 0);
    const currentValue = positions.reduce((acc, pos) => acc + (pos.shares * (pos.currentPrice || pos.avgPrice)), 0);
    const totalPnL = currentValue - totalInvested;
    const roi = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    const stats = [
        { label: 'Total Value', value: walletBalance + currentValue, icon: <Wallet size={20} />, color: 'blue' },
        { label: 'Net P&L', value: totalPnL, icon: <TrendingUp size={20} />, color: totalPnL >= 0 ? 'green' : 'red' },
        { label: 'Active Positions', value: positions.length.toString(), icon: <History size={20} />, color: 'purple' },
        { label: 'Return (ROI)', value: `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`, icon: <TrendingUp size={20} />, color: 'cyan' }
    ];

    return (
        <div className="portfolio-page fade-in">
            <header className="page-header">
                <h1 className="page-title">My Portfolio <span className={`badge-mode ${accountMode}`}>{accountMode.toUpperCase()}</span></h1>
                <p className="page-subtitle">Manage your trades and track performance</p>
            </header>

            <div className="portfolio-stats">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`portfolio-stat-card ${stat.color} stagger-${idx+1}`}>
                        <div className="stat-icon-wrapper">{stat.icon}</div>
                        {stat.label === 'Total Value' ? (
                            <div className="stat-card main">
                                <span className="stat-label">Total Portfolio Value</span>
                                <h2 className="portfolio-value">₹{totalValue.toLocaleString()}</h2>
                                <div className={`stat-change ${netPnL >= 0 ? 'positive' : 'negative'}`}>
                                    {netPnL >= 0 ? '+' : ''}₹{netPnL.toLocaleString()} ({netPnL >= 0 ? '+' : ''}{roi.toFixed(2)}%)
                                </div>
                            </div>
                        ) : (
                            <div className="stat-info">
                                <span className="stat-label">{stat.label}</span>
                                <span className="stat-value">{typeof stat.value === 'number' ? `₹${stat.value.toLocaleString()}` : stat.value}</span>
                            </div>
                        )}
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
                                {positions.length > 0 ? positions.map(pos => {
                                    const pnl = (pos.shares * (pos.currentPrice || pos.avgPrice)) - (pos.shares * pos.avgPrice);
                                    return (
                                        <tr key={pos.marketId}>
                                            <td className="market-cell">{pos.marketQuestion}</td>
                                            <td><span className={`badge ${pos.side.toLowerCase()}`}>{pos.side.toUpperCase()}</span></td>
                                            <td>{pos.shares}</td>
                                            <td>₹{pos.avgPrice.toFixed(2)}</td>
                                            <td>₹{(pos.currentPrice || pos.avgPrice).toFixed(2)}</td>
                                            <td className={pnl >= 0 ? 'green' : 'red'}>
                                                {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(1)}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            No active positions
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
