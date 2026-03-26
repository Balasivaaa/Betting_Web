import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import MarketsGrid from './components/MarketsGrid';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';
import AuthModal from './components/AuthModal';
import TradeModal from './components/TradeModal';
import DepositModal from './components/DepositModal';
import Chatbot from './components/Chatbot';
import AdminPanel from './components/AdminPanel';
import { MessageSquare } from 'lucide-react';

const AppContent = () => {
    const { user, login } = useAuth();
    const [currentPage, setCurrentPage] = useState('markets');
    
    const isAdmin = user && user.email === 'admin@bharatx.com';
    
    // Modal states
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState(null);
    const [selectedTradeSide, setSelectedTradeSide] = useState('yes');

    const handleNavigate = (page) => {
        if (page === 'login') setIsAuthModalOpen(true);
        else if (page === 'deposit') {
            if (!user) setIsAuthModalOpen(true);
            else setIsDepositModalOpen(true);
        }
        else setCurrentPage(page);
    };

    // Safely handle logout in AppContent
    React.useEffect(() => {
        if (!user && (currentPage === 'portfolio' || currentPage === 'deposit' || currentPage === 'admin')) {
            setCurrentPage('markets');
        }
    }, [user, currentPage]);

    const handleTrade = (market, side) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setSelectedMarket(market);
        setSelectedTradeSide(side);
        setIsTradeModalOpen(true);
    };

    return (
        <div className="app-container">
            <Navbar 
                currentPage={currentPage} 
                onNavigate={handleNavigate} 
            />
            
            <main className="main-content">
                {currentPage === 'markets' && <MarketsGrid onTrade={handleTrade} />}
                
                {currentPage === 'portfolio' && (
                    <Portfolio />
                )}
                
                {currentPage === 'leaderboard' && (
                    <Leaderboard />
                )}

                {currentPage === 'admin' && isAdmin && (
                    <AdminPanel />
                )}
            </main>

            <Chatbot />
            
            <div className="toast-container" id="toastContainer"></div>

            {/* Modals */}
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
            />
            
            <TradeModal 
                isOpen={isTradeModalOpen} 
                onClose={() => setIsTradeModalOpen(false)} 
                market={selectedMarket}
                initialSide={selectedTradeSide}
            />

            <DepositModal 
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
            />
        </div>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;
