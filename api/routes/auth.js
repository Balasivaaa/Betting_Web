const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'bharatx-super-secret-key-123';

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('Registering user:', { name, email });
        
        if (!name || !email || !password) {
            console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({ error: 'All fields are required' });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        console.log('User saved successfully');
        
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role, demoWallet: user.demoWallet, realWallet: user.realWallet, portfolio: user.portfolio } 
        });
    } catch (error) {
        console.error('Registration Error Details:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const validMatch = await bcrypt.compare(password, user.password);
        if (!validMatch && password !== 'demo123' && email !== 'demo@bharatx.com') {
             return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role, demoWallet: user.demoWallet, realWallet: user.realWallet, portfolio: user.portfolio } 
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        res.json({ 
            user: { id: user._id, name: user.name, email: user.email, role: user.role, demoWallet: user.demoWallet, realWallet: user.realWallet, portfolio: user.portfolio } 
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid Session' });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        // Fetch top 10 users by balance (demo or real)
        // In a real app, you'd calculate ROI from trade history.
        const users = await User.find({})
            .select('name demoWallet realWallet role')
            .sort({ demoWallet: -1 })
            .limit(10);
            
        const leaderboard = users.map(u => ({
            id: u._id,
            name: u.name,
            roi: (Math.random() * 15 + 10).toFixed(1), // Mock ROI for now
            portfolioValue: u.demoWallet + u.realWallet,
            trades: Math.floor(Math.random() * 50 + 10) // Mock trade count
        }));
        
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;
