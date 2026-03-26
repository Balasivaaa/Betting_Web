const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/markets');
const User = require('./models/User');

const app = express();
const router = express.Router();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bharatx';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Razorpay instance setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SVW7hT0apunCG2',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '65Cc7oDWxwnCYLJEpKT541Ft'
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

app.use(cors());
app.use(express.json());

// Mount Custom API Routes
router.use('/auth', authRoutes);
router.use('/markets', marketRoutes);

// Endpoint to create a Razorpay Order
router.post('/create-order', async (req, res) => {
    const { amount, currency } = req.body;

    const options = {
        amount: amount, 
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to verify Razorpay payment signature
router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '65Cc7oDWxwnCYLJEpKT541Ft')
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        try {
            const user = await User.findById(userId);
            if (user) {
                user.realWallet = (user.realWallet || 0) + (amount / 100);
                await user.save();
                return res.status(200).json({ status: 'success', message: 'Payment verified and wallet updated', user });
            }
            res.status(404).json({ status: 'failure', message: 'User not found' });
        } catch (err) {
            res.status(500).json({ status: 'failure', message: 'Database update failed' });
        }
    } else {
        res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
    }
});

// Endpoint to send a confirmation email
router.post('/send-confirmation-email', async (req, res) => {
    const { email, amount, customerName } = req.body;

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        return res.status(200).json({ message: 'Email credentials not configured' });
    }

    const mailOptions = {
        from: `BharatX Prediction Market <${process.env.GMAIL_USER}>`,
        to: email,
        subject: '💰 Deposit Successful - BharatX',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #4f7df7; text-align: center;">BharatX Receipt</h2>
                <p>Hello <strong>${customerName || 'Trader'}</strong>,</p>
                <p>Your deposit was successful! We've added the funds to your Real Account wallet.</p>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #eee;">
                    <p style="margin: 0;"><strong>Transaction Amount:</strong> ₹${amount}</p>
                    <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Completed ✅</p>
                </div>
                <p>You can now start placing trades in our real-money prediction markets.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 BharatX Prediction Market. All rights reserved.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: 'success', message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Support both /api/path and /path
app.use('/api', router);
app.use('/', router);

module.exports = app;
