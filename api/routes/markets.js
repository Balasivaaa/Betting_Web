const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Market = require('../models/Market');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'bharatx_secret_key_2026';

// Fetch all live markets
router.get('/', async (req, res) => {
    try {
        const markets = await Market.find({}).sort({ createdAt: -1 });
        res.json(markets);
    } catch (error) {
        console.error('Market Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch markets' });
    }
});

// Create Market (Admin Only)
router.post('/', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const market = new Market(req.body);
        await market.save();
        res.json(market);
    } catch (error) {
        console.error('Creation Error:', error);
        res.status(500).json({ error: 'Creation failed' });
    }
});

// Execute a Trade (Secure with JWT)
router.post('/trade', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const { marketId, side, amount, accountMode } = req.body;
        
        const user = await User.findById(decoded.id);
        const market = await Market.findById(marketId);
        
        if (!user || !market) return res.status(404).json({ error: 'User or Market not found' });

        const price = market.probability[side];
        if (!price) return res.status(400).json({ error: 'Invalid side' });

        const shares = amount / price;
        const totalCost = amount;
        
        // Deduct from wallet
        if (accountMode === 'demo') {
            if (user.demoWallet < totalCost) return res.status(400).json({ error: 'Insufficient Demo Wallet balance' });
            user.demoWallet -= totalCost;
        } else {
            if (user.realWallet < totalCost) return res.status(400).json({ error: 'Insufficient Real Wallet balance' });
            user.realWallet -= totalCost;
        }

        // Add to portfolio
        const newTrade = {
            marketId: market._id.toString(),
            question: market.question,
            side: side,
            shares: shares,
            avgPrice: price,
            totalInvested: totalCost
        };
        
        const existingIdx = user.portfolio.findIndex(p => p.marketId === marketId && p.side === side);
        if (existingIdx > -1) {
            const pos = user.portfolio[existingIdx];
            const newTotalInvested = pos.totalInvested + totalCost;
            const newTotalShares = pos.shares + shares;
            user.portfolio[existingIdx] = {
                ...pos,
                shares: newTotalShares,
                totalInvested: newTotalInvested,
                avgPrice: newTotalInvested / newTotalShares
            };
        } else {
            user.portfolio.push(newTrade);
        }

        await user.save();
        market.volume = (market.volume || 0) + totalCost;
        await market.save();

        res.json({ 
            message: 'Trade executed successfully', 
            user: { id: user._id, demoWallet: user.demoWallet, realWallet: user.realWallet, portfolio: user.portfolio } 
        });
    } catch (error) {
        console.error('Trade Execution Error:', error);
        res.status(500).json({ error: 'Trade failed. Please check your session.' });
    }
});

// Resolve a Market (Admin Only)
router.post('/resolve', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        const { marketId, outcome } = req.body;
        const market = await Market.findById(marketId);
        
        if (!market || market.resolved) {
            return res.status(400).json({ error: 'Market not found or already resolved' });
        }

        market.resolved = true;
        market.outcome = outcome;
        market.status = 'closed';
        await market.save();

        const users = await User.find({ "portfolio.marketId": marketId });
        for (let user of users) {
             const position = user.portfolio.find(p => p.marketId === marketId);
             if (position) {
                 if (position.side === outcome) {
                     user.demoWallet += position.shares; 
                 }
                 user.portfolio = user.portfolio.filter(p => p.marketId !== marketId);
                 await user.save();
             }
        }
        res.json({ message: `Market resolved as ${outcome.toUpperCase()}.` });
    } catch (error) {
        res.status(500).json({ error: 'Resolution failed' });
    }
});

module.exports = router;
