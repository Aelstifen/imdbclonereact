import React, { useState } from 'react';
import './Auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Add logic for authentication here
        console.log('Logging in with:', { email, password });
    };

    return (
        <div className="auth-container">
            <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="auth-input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="auth-input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Login</button>
            </form>
            </div>
        </div>
    );
};

export default LoginPage;
