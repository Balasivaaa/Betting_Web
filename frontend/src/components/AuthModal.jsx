import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, ChevronRight } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            if (formData.email === 'demo@bharatx.com' && formData.password === 'demo123') {
                login({ name: 'Bharat Trader', email: formData.email });
                onClose();
            } else {
                setError('Invalid credentials. Hint: demo@bharatx.com / demo123');
            }
        } else {
            login({ name: formData.name, email: formData.email });
            onClose();
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isLogin ? "Welcome Back" : "Create Account"}
            subtitle={isLogin ? "Sign in to continue trading" : "Step into the future of prediction markets"}
        >
            <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-group">
                            <User className="input-icon" size={18} />
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Enter your name" 
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required 
                            />
                        </div>
                    </div>
                )}
                
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                        <Mail className="input-icon" size={18} />
                        <input 
                            type="email" 
                            className="form-input" 
                            placeholder="your@email.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                        <Lock className="input-icon" size={18} />
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="Minimum 6 characters" 
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required 
                        />
                    </div>
                </div>

                {error && <div className="form-error visible">{error}</div>}

                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '12px', fontWeight: '800' }}>
                    Submit
                    <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                </button>

                <div className="auth-switch">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button type="button" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
                
                <div className="demo-hint" onClick={() => setFormData({ email: 'demo@bharatx.com', password: 'demo123' })} style={{ cursor: 'pointer', marginTop: '15px', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                    Click here to use Demo Account
                </div>
            </form>
        </Modal>
    );
};

export default AuthModal;
