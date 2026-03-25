/* ============================================
   chatbot.js — AI Chatbot (Simulated)
   ============================================ */

let chatHistory = [];
let isChatOpen = false;

function toggleChat() {
    const win = document.getElementById('chatWindow');
    isChatOpen = !isChatOpen;
    win.classList.toggle('open', isChatOpen);
    if (isChatOpen && chatHistory.length === 0) {
        addBotMessage("Hey! 👋 I'm Bharat AI. I know your portfolio, wallet & all 18 live markets. Ask me anything — market analysis, trading tips, IPL predictions, risk management!");
    }
}

function addBotMessage(text) {
    chatHistory.push({ role: 'bot', text });
    renderChatMessages();
}

function addUserMessage(text) {
    chatHistory.push({ role: 'user', text });
    renderChatMessages();
}

function renderChatMessages() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = chatHistory.map(m =>
        `<div class="chat-msg ${m.role}">${m.text}</div>`
    ).join('');
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    const container = document.getElementById('chatMessages');
    container.innerHTML += `<div class="chat-msg bot typing" id="typingIndicator">
        <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>`;
    container.scrollTop = container.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

function sendChat() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addUserMessage(text);
    showTyping();
    setTimeout(() => {
        removeTyping();
        const response = generateResponse(text);
        addBotMessage(response);
    }, 800 + Math.random() * 700);
}

function generateResponse(query) {
    const q = query.toLowerCase();
    const user = getCurrentUser();
    const markets = getMarkets();

    // Portfolio-related
    if (q.includes('portfolio') || q.includes('position') || q.includes('my trade') || q.includes('holdings')) {
        if (!user) return "You're not logged in yet! Login or use the demo account to start trading. 🔐";
        const pos = user.positions || [];
        if (pos.length === 0) return "You don't have any positions yet. Head to Markets and buy some YES or NO shares to get started! 📊";
        let summary = `📊 **Your Portfolio:**\n\n`;
        let totalVal = 0;
        pos.forEach(p => {
            const mkt = markets.find(m => m.id === p.marketId);
            if (!mkt) return;
            const cp = p.side === 'yes' ? mkt.yesPrice : (1 - mkt.yesPrice);
            const val = p.shares * cp;
            totalVal += val;
            summary += `• ${p.shares} ${p.side.toUpperCase()} shares on "${mkt.question.slice(0, 50)}..." — Current value: ₹${val.toFixed(2)}\n`;
        });
        summary += `\n💰 Total position value: ₹${totalVal.toFixed(2)} | Wallet: ₹${user.wallet.toFixed(2)}`;
        return summary;
    }

    // Wallet/balance
    if (q.includes('wallet') || q.includes('balance') || q.includes('money') || q.includes('funds')) {
        if (!user) return "Login first to check your balance! Use demo / demo123 for quick access. ⚡";
        return `💰 Your wallet balance is **₹${Number(user.wallet).toLocaleString('en-IN', {minimumFractionDigits: 2})}**. You started with ₹10,000. ${user.wallet >= 10000 ? "You're doing great! 🚀" : "Keep trading smart! 📈"}`;
    }

    // IPL / Cricket
    if (q.includes('ipl') || q.includes('rcb') || q.includes('cricket') || q.includes('kohli') || q.includes('champions trophy')) {
        const cktMarkets = markets.filter(m => m.category === 'cricket');
        let resp = "🏏 **Cricket Markets:**\n\n";
        cktMarkets.forEach(m => {
            resp += `• "${m.question}" — YES at ₹${m.yesPrice.toFixed(2)} (${Math.round(m.yesPrice*100)}% implied probability)\n`;
        });
        resp += "\n💡 **Tip:** RCB at 18% is a long shot but high reward. Kohli at 74% is a safer bet!";
        return resp;
    }

    // Politics
    if (q.includes('politic') || q.includes('bjp') || q.includes('election') || q.includes('modi') || q.includes('ucc')) {
        const polMarkets = markets.filter(m => m.category === 'politics');
        let resp = "🏛️ **Political Markets:**\n\n";
        polMarkets.forEach(m => {
            resp += `• "${m.question}" — YES at ₹${m.yesPrice.toFixed(2)}\n`;
        });
        resp += "\n💡 These markets are volatile and can shift quickly based on news events!";
        return resp;
    }

    // Economy
    if (q.includes('sensex') || q.includes('economy') || q.includes('rupee') || q.includes('rbi') || q.includes('market crash')) {
        const ecoMarkets = markets.filter(m => m.category === 'economy');
        let resp = "📈 **Economy Markets:**\n\n";
        ecoMarkets.forEach(m => {
            resp += `• "${m.question}" — YES at ₹${m.yesPrice.toFixed(2)} (${Math.round(m.yesPrice*100)}%)\n`;
        });
        resp += "\n💡 Sensex at 67% probability of crossing 1L is bullish. Consider diversifying across sectors!";
        return resp;
    }

    // Bollywood
    if (q.includes('bollywood') || q.includes('pushpa') || q.includes('srk') || q.includes('shah rukh') || q.includes('cannes')) {
        return "🎬 Bollywood markets are fun! Pushpa 3 crossing ₹1000Cr is at 71% — pretty likely. SRK announcing a new film is at 83%. Cannes win at just 9% is a wild card — high risk, high reward! 🍿";
    }

    // Tips / Strategy
    if (q.includes('tip') || q.includes('strategy') || q.includes('how to') || q.includes('advice') || q.includes('help')) {
        return "📋 **Trading Tips:**\n\n1. **Diversify** — Don't put all ₹10K in one market\n2. **Probability = Price** — ₹0.30 YES means 30% chance. Buy if you think it's higher!\n3. **Position sizing** — Start with 5-10 shares per trade\n4. **Follow news** — Political & cricket markets move on breaking news\n5. **Average down** — If you're confident, buy more when prices dip\n\n🎯 Start with high-conviction bets like Kohli's 10K runs (74%) or Sensex 1L (67%)!";
    }

    // Risk
    if (q.includes('risk') || q.includes('safe') || q.includes('danger') || q.includes('lose')) {
        return "⚠️ **Risk Management:**\n\n• This is paper money — no real financial risk!\n• But practice good habits: never bet more than 20% of your wallet on one market\n• Higher probability = lower reward. ₹0.83 YES pays only ₹0.17 profit per share\n• Lower probability = higher reward but more likely to lose\n• Diversify across 4-5 markets for best results! 🎯";
    }

    // What markets / What to buy
    if (q.includes('what should') || q.includes('recommend') || q.includes('best') || q.includes('which market')) {
        return "🔥 **Hot Picks Right Now:**\n\n1. 🏏 Kohli 10K Test runs (YES @ ₹0.74) — Strong conviction play\n2. 📈 Sensex 1L (YES @ ₹0.67) — Bullish India story\n3. 🚀 UPI 20B txns (YES @ ₹0.69) — Digital India momentum\n4. 🎬 SRK new film (YES @ ₹0.83) — Almost a sure thing\n5. 🏏 RCB IPL win (YES @ ₹0.18) — High risk moonshot! 🌙\n\n⚡ Mix safe bets with moonshots for maximum fun!";
    }

    // Greetings
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q === 'yo') {
        return "Hey there! 👋 I'm Bharat AI, your trading assistant. I can help with:\n\n• 📊 Portfolio analysis\n• 💡 Market insights & predictions\n• 🎯 Trading tips & strategy\n• 🏏 Cricket / IPL analysis\n• 📈 Economy outlook\n\nWhat would you like to know?";
    }

    // Fallback
    const fallbacks = [
        "Great question! 🤔 Based on current market data, I'd suggest looking at the cricket and economy categories — they have the most trading volume. Want me to break down any specific market?",
        "Interesting! 💡 Try exploring the Markets page and look for prices between ₹0.30-0.70 — those are the most interesting bets with good risk/reward. Need specific advice?",
        "I'd love to help! 🎯 You can ask me about your portfolio, any specific market, trading strategies, or category-specific analysis. What interests you most?",
        "Let me think about that... 🧠 The key to prediction markets is finding where the crowd is wrong. Look for events where you have special knowledge or strong conviction. Want me to scan the markets for opportunities?"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
