import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils/mockData';
import { Plus, CheckCircle, AlertCircle, Users, BarChart2, Calendar, Tag, Info, Loader2 } from 'lucide-react';

const AdminPanel = () => {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newMarket, setNewMarket] = useState({
        question: '',
        category: 'Politics',
        endDate: '',
        probability: { yes: 0.5, no: 0.5 }
    });
    const [message, setMessage] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/markets');
            const data = await res.json();
            setMarkets(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleResolve = async (marketId, outcome) => {
        try {
            const token = localStorage.getItem('bharatx_token');
            const res = await fetch('/api/markets/resolve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ marketId, outcome })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                fetchData();
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Operation failed' });
        }
    };

    const handleCreateMarket = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('bharatx_token');
            const res = await fetch('/api/markets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMarket)
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Market created successfully!' });
                fetchData();
                setShowCreateForm(false);
                setNewMarket({ question: '', category: 'Politics', endDate: '', probability: { yes: 0.5, no: 0.5 } });
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Creation failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Creation failed' });
        }
    };

    if (loading && markets.length === 0) return <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>;

    const stats = {
        totalMarkets: markets.length,
        activeMarkets: markets.filter(m => !m.resolved).length,
        resolvedMarkets: markets.filter(m => m.resolved).length,
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
                    <div className="stat-info">
                        <span className="stat-label">Total Markets</span>
                        <span className="stat-value">{stats.totalMarkets}</span>
                    </div>
                </div>
                <div className="portfolio-stat-card purple">
                    <div className="stat-icon-wrapper"><Calendar size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Active</span>
                        <span className="stat-value">{stats.activeMarkets}</span>
                    </div>
                </div>
                <div className="portfolio-stat-card green">
                    <div className="stat-icon-wrapper"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Resolved</span>
                        <span className="stat-value">{stats.resolvedMarkets}</span>
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
                                <tr key={market._id}>
                                    <td className="market-cell">{market.question}</td>
                                    <td>
                                        <span className={`category-tag ${market.category?.toLowerCase() || 'general'}`}>
                                            {market.category}
                                        </span>
                                    </td>
                                    <td>₹{(market.volume || 0).toLocaleString()}</td>
                                    <td>
                                        {market.resolved ? (
                                            <span className="status-badge resolved">Resolved ({market.outcome?.toUpperCase()})</span>
                                        ) : (
                                            <span className="status-badge active">Active</span>
                                        )}
                                    </td>
                                    <td>
                                        {!market.resolved && (
                                            <div className="admin-actions">
                                                <button className="action-btn yes" onClick={() => handleResolve(market._id, 'yes')}>Yes</button>
                                                <button className="action-btn no" onClick={() => handleResolve(market._id, 'no')}>No</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateForm && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '500px' }}>
                        <button className="modal-close" onClick={() => setShowCreateForm(false)}>×</button>
                        <header className="modal-header">
                            <h2 className="modal-title">Create Market</h2>
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
