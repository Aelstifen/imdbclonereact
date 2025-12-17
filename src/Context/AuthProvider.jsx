import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AuthContext } from './AuthContext.js';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        email: null,
        roles: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const logoutTimer = useRef(null);

    const logout = useCallback(() => {
        clearTimeout(logoutTimer.current);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiry');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        setAuthState({ token: null, email: null, roles: null });
    }, []);

    useEffect(() => {
        try {
            const token = localStorage.getItem('authToken');
            const expiry = parseInt(localStorage.getItem('authTokenExpiry'));
            const email = localStorage.getItem('userEmail');
            const roles = JSON.parse(localStorage.getItem('userRole'));
            const now = Date.now();

            if (token && email && roles && expiry && now < expiry) {
                setAuthState({ token, email, roles });
                const timeRemaining = expiry - now;
                logoutTimer.current = setTimeout(logout, timeRemaining);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Error loading auth state", error);
            logout();
        } finally {
            setIsLoading(false);
        }

        return () => {
            clearTimeout(logoutTimer.current);
        };
    }, [logout]);

    const login = (token, email) => {
        clearTimeout(logoutTimer.current);
        const expiry = Date.now() + 15 * 60 * 1000;
        let roles = [];

        try {
            const decodedToken = jwtDecode(token);
            roles = decodedToken.roles || [];
        } catch (error) {
            console.error("Failed to decode token on login:", error);
        }

        localStorage.setItem('authToken', token);
        localStorage.setItem('authTokenExpiry', expiry.toString());
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', JSON.stringify(roles));
        setAuthState({ token, email, roles });

        const timeRemaining = expiry - Date.now();
        logoutTimer.current = setTimeout(logout, timeRemaining);
    };

    const isLoggedIn = !!authState.token;

    return (
        <AuthContext.Provider
            value={{
                authToken: authState.token,
                email: authState.email,
                userRole: authState.roles,
                login,
                logout,
                isLoggedIn,
                isLoading
            }}
        >
            {!isLoading && children}
        </AuthContext.Provider>
    );
};