import React, { useMemo } from 'react';
import { MOCK_TRADERS } from '../utils/mockData';
import { Trophy, TrendingUp, User } from 'lucide-react';

const Leaderboard = () => {
    const leaderboardData = useMemo(() => {
        // Sort by ROI descending
        return [...MOCK_TRADERS].sort((a, b) => b.roi - a.roi);
    }, []);

    const topThree = leaderboardData.slice(0, 3);
    const rest = leaderboardData.slice(3);

    return (
        <div className="leaderboard-page fade-in">
            <header className="page-header" style={{ textAlign: 'center' }}>
                <h1 className="page-title">Elite Traders</h1>
                <p className="page-subtitle">Ranked by overall Return on Investment (ROI)</p>
            </header>

            <div className="leaderboard-podium">
                <div className="podium-item second">
                    <div className="podium-rank">2</div>
                    <div className="podium-avatar">{topThree[1].name[0]}</div>
                    <div className="podium-name">{topThree[1].name}</div>
                    <div className="podium-roi">+{topThree[1].roi}%</div>
                </div>
                <div className="podium-item first">
                    <div className="podium-crown">👑</div>
                    <div className="podium-avatar highlight">{topThree[0].name[0]}</div>
                    <div className="podium-name">{topThree[0].name}</div>
                    <div className="podium-roi">+{topThree[0].roi}%</div>
                </div>
                <div className="podium-item third">
                    <div className="podium-rank">3</div>
                    <div className="podium-avatar">{topThree[2].name[0]}</div>
                    <div className="podium-name">{topThree[2].name}</div>
                    <div className="podium-roi">+{topThree[2].roi}%</div>
                </div>
            </div>

            <div className="leaderboard-list-card">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Trader</th>
                                <th>ROI</th>
                                <th>Total Profit</th>
                                <th>Trades</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardData.map((trader, idx) => (
                                <tr key={trader.id} className={`${idx < 3 ? 'top-rank' : ''} ${idx === 0 ? 'rank-1' : ''}`}>
                                    <td className="rank-cell">
                                        {idx + 1 === 1 ? '🥇' : idx + 1 === 2 ? '🥈' : idx + 1 === 3 ? '🥉' : idx + 1}
                                    </td>
                                    <td className="user-cell">
                                        <div className="user-info">
                                            <div className="small-avatar">{trader.name[0]}</div>
                                            <span>{trader.name}</span>
                                        </div>
                                    </td>
                                    <td className={trader.roi >= 0 ? 'green' : 'red'}>{trader.roi > 0 ? '+' : ''}{trader.roi}%</td>
                                    <td>₹{trader.portfolioValue.toLocaleString()}</td>
                                    <td>{trader.trades}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
