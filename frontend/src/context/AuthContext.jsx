import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accountMode, setAccountMode] = useState('paper'); // 'paper' | 'real'
    const [theme, setTheme] = useState('dark');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on init
        const savedUser = localStorage.getItem('bharatx_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        
        const savedMode = localStorage.getItem('bharatx_mode');
        if (savedMode) {
            setAccountMode(savedMode);
        }

        const savedTheme = localStorage.getItem('bharatx_theme') || 'dark';
        setTheme(savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        
        setLoading(false);
    }, []);

    const login = (userData) => {
        const fullUser = {
            ...userData,
            paperWallet: userData.paperWallet || 10000,
            realWallet: userData.realWallet || 0,
            joinedDate: userData.joinedDate || new Date().toISOString()
        };
        setUser(fullUser);
        localStorage.setItem('bharatx_user', JSON.stringify(fullUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('bharatx_user');
    };

    const toggleAccountMode = () => {
        const newMode = accountMode === 'paper' ? 'real' : 'paper';
        setAccountMode(newMode);
        localStorage.setItem('bharatx_mode', newMode);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('bharatx_theme', newTheme);
    };

    const updateUser = (updates) => {
        setUser(prev => {
            const newUser = { ...prev, ...updates };
            localStorage.setItem('bharatx_user', JSON.stringify(newUser));
            return newUser;
        });
    };

    const value = {
        user,
        accountMode,
        theme,
        loading,
        login,
        logout,
        toggleAccountMode,
        toggleTheme,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
