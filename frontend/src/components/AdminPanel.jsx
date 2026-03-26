import React, { useState, useEffect } from 'react';
import { resolveMarket, createMarket, MARKETS_DATA, CATEGORIES } from '../utils/mockData';
import { Plus, CheckCircle, AlertCircle, Users, BarChart2, Calendar, Tag, Info } from 'lucide-react';

const AdminPanel = () => {
    const [markets, setMarkets] = useState([]);
    const [users, setUsers] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newMarket, setNewMarket] = useState({
        question: '',
        category: 'politics',
        categoryEmoji: '🏛️',
        endDate: ''
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Load data from localStorage
        const storedMarkets = JSON.parse(localStorage.getItem('bharatx_markets')) || MARKETS_DATA;
        const storedUsers = JSON.parse(localStorage.getItem('bharatx_users')) || [];
        setMarkets(storedMarkets);
        setUsers(storedUsers);
    }, []);

    const handleResolve = (marketId, outcome) => {
        const result = resolveMarket(marketId, outcome);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            // Refresh markets
            setMarkets(JSON.parse(localStorage.getItem('bharatx_markets')));
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const handleCreateMarket = (e) => {
        e.preventDefault();
        const emojiMap = {
            politics: '🏛️',
            cricket: '🏏',
            economy: '📈',
            bollywood: '🎬',
            sports: '⚽',
            startups: '🚀'
        };
        
        const result = createMarket({
            ...newMarket,
            categoryEmoji: emojiMap[newMarket.category] || '🎯'
        });

        if (result.success) {
            setMessage({ type: 'success', text: 'Market created successfully!' });
            setMarkets(JSON.parse(localStorage.getItem('bharatx_markets')));
            setShowCreateForm(false);
            setNewMarket({ question: '', category: 'politics', categoryEmoji: '🏛️', endDate: '' });
        }
    };

    const stats = {
        totalMarkets: markets.length,
        activeMarkets: markets.filter(m => !m.resolved).length,
        resolvedMarkets: markets.filter(m => m.resolved).length,
        totalUsers: users.length
    };

    return (
        <div className="admin-page fade-in">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Admin Dashboard</h1>
                    <p className="page-subtitle">Manage markets and platform health</p>
                </div>
                <button className="trade-btn" onClick={() => setShowCreateForm(true)}>
                    <Plus size={16} style={{ marginRight: '8px' }} /> New Market
                </button>
            </header>

            {message && (
                <div className={`notification ${message.type}`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="portfolio-stats">
                <div className="portfolio-stat-card blue">
                    <div className="stat-icon-wrapper"><BarChart2 size={24} /></div>
                    <div>
                        <span className="stat-label">Total Markets</span>
                        <span className="stat-value">{stats.totalMarkets}</span>
                    </div>
                </div>
                <div className="portfolio-stat-card purple">
                    <div className="stat-icon-wrapper"><Calendar size={24} /></div>
                    <div>
                        <span className="stat-label">Active</span>
                        <span className="stat-value">{stats.activeMarkets}</span>
                    </div>
                </div>
                <div className="portfolio-stat-card green">
                    <div className="stat-icon-wrapper"><CheckCircle size={24} /></div>
                    <div>
                        <span className="stat-label">Resolved</span>
                        <span className="stat-value">{stats.resolvedMarkets}</span>
                    </div>
                </div>
                <div className="portfolio-stat-card cyan">
                    <div className="stat-icon-wrapper"><Users size={24} /></div>
                    <div>
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{stats.totalUsers}</span>
                    </div>
                </div>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>Market Oversight</h3>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Market Details</th>
                                <th>Category</th>
                                <th>Volume</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {markets.map(market => (
                                <tr key={market.id}>
                                    <td className="market-cell">{market.question}</td>
                                    <td>
                                        <span className={`category-tag ${market.category}`}>
                                            {market.categoryEmoji} {market.category}
                                        </span>
                                    </td>
                                    <td>₹{market.volume.toLocaleString()}</td>
                                    <td>
                                        {market.resolved ? (
                                            <span className="status-badge resolved">Resolved ({market.outcome.toUpperCase()})</span>
                                        ) : (
                                            <span className="status-badge active">Active</span>
                                        )}
                                    </td>
                                    <td>
                                        {!market.resolved && (
                                            <div className="admin-actions">
                                                <button className="action-btn yes" onClick={() => handleResolve(market.id, 'yes')}>Yes</button>
                                                <button className="action-btn no" onClick={() => handleResolve(market.id, 'no')}>No</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Market Modal Overlay */}
            {showCreateForm && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '500px' }}>
                        <button className="modal-close" onClick={() => setShowCreateForm(false)}>×</button>
                        <header className="modal-header">
                            <h2 className="modal-title">Create Market</h2>
                            <p className="modal-subtitle">Add a new prediction event</p>
                        </header>
                        <form onSubmit={handleCreateMarket}>
                            <div className="form-group">
                                <label><Info size={14} /> Question</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Will India win the next match?"
                                    value={newMarket.question}
                                    onChange={(e) => setNewMarket({...newMarket, question: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label><Tag size={14} /> Category</label>
                                    <select 
                                        value={newMarket.category}
                                        onChange={(e) => setNewMarket({...newMarket, category: e.target.value})}
                                    >
                                        {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><Calendar size={14} /> End Date</label>
                                    <input 
                                        type="date" 
                                        value={newMarket.endDate}
                                        onChange={(e) => setNewMarket({...newMarket, endDate: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="trade-btn" style={{ width: '100%', marginTop: '20px', padding: '12px' }}>
                                Launch Market
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
