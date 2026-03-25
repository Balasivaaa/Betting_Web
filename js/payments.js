let razorpayInstance = null;

function openDepositModal() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to deposit', 'error');
        return;
    }

    const modalHTML = `
        <div class="trade-modal-header">
            <h3>🏦 Deposit Funds</h3>
            <p>Add money to your Real Account</p>
        </div>
        <div id="payment-status" class="payment-status"></div>
        <div id="payment-error" class="payment-error"></div>
        
        <div id="setup-step">
            <div class="form-group">
                <label class="form-label">Email Address (for Receipt)</label>
                <input type="email" id="depositEmail" class="form-input" placeholder="your@email.com" value="${user.email || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Deposit Amount (₹)</label>
                <input type="number" id="depositAmount" class="form-input" value="100" min="10" step="10">
            </div>
            <button id="nextButton" class="btn btn-primary btn-full" onclick="startRazorpayPayment()">
                ⚡ Proceed to Pay
            </button>
        </div>
        
        <div class="modal-footer" style="margin-top: 20px; text-align: center; opacity: 0.7; font-size: 12px;">
            <p>Secured by Razorpay • UPI, Cards, Netbanking</p>
        </div>
    `;

    const tradeModalBody = document.getElementById('tradeModalBody');
    tradeModalBody.innerHTML = modalHTML;
    document.getElementById('tradeModal').classList.add('open');
}

async function startRazorpayPayment() {
    const email = document.getElementById('depositEmail').value;
    const amount = document.getElementById('depositAmount').value;
    const btn = document.getElementById('nextButton');
    const status = document.getElementById('payment-status');
    const errorEl = document.getElementById('payment-error');

    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    if (amount < 10) {
        showToast('Minimum deposit is ₹10', 'error');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Processing...';
    status.textContent = 'Creating Order...';
    errorEl.classList.remove('visible');

    try {
        // 1. Create Order on Backend
        const response = await fetch('http://localhost:5001/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount * 100, // in paise
                currency: "INR"
            })
        });

        if (!response.ok) throw new Error('Order creation failed');
        const order = await response.json();

        // 2. Open Razorpay Checkout
        const options = {
            key: "rzp_test_SVW7hT0apunCG2", // Test Key ID
            amount: order.amount,
            currency: order.currency,
            name: "BharatX Prediction Market",
            description: "Wallet Deposit",
            image: "https://your-logo-url.com/logo.png",
            order_id: order.id,
            handler: function (response) {
                // This handler runs after successful payment
                verifyPayment(response, amount, email);
            },
            prefill: {
                name: getCurrentUser().name,
                email: email,
                contact: ""
            },
            notes: {
                address: "BharatX Corporate Office"
            },
            theme: {
                color: "#4f7df7"
            },
            modal: {
                ondismiss: function() {
                    btn.disabled = false;
                    btn.textContent = '⚡ Proceed to Pay';
                    status.textContent = '';
                }
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
                errorEl.textContent = response.error.description;
                errorEl.classList.add('visible');
                status.textContent = 'Payment Failed';
                btn.disabled = false;
                btn.textContent = '⚡ Try Again';
        });
        rzp1.open();

    } catch (err) {
        console.error(err);
        errorEl.textContent = err.message;
        errorEl.classList.add('visible');
        status.textContent = '';
        btn.disabled = false;
        btn.textContent = '⚡ Try Again';
    }
}

async function verifyPayment(rzpResponse, amount, email) {
    const status = document.getElementById('payment-status');
    status.textContent = 'Verifying Payment...';

    try {
        const response = await fetch('http://localhost:5001/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Update Wallet
            const user = getCurrentUser();
            if (user) {
                user.realWallet = (Number(user.realWallet) || 0) + Number(amount);
                saveCurrentUser(user);
                syncUserData();
                updateWalletDisplay();
            }

            // Send Confirmation Email
            fetch('http://localhost:5001/send-confirmation-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    amount: amount,
                    customerName: user.name
                })
            }).catch(e => console.error('Email send failed:', e));

            showToast(`Successfully deposited ₹${amount}! 💰`, 'success');
            document.getElementById('tradeModal').classList.remove('open');
            
            // Success Animation or Redirect could go here
        } else {
            throw new Error(result.message || 'Verification failed');
        }
    } catch (err) {
        showToast(err.message, 'error');
        status.textContent = 'Verification Failed';
    }
}
