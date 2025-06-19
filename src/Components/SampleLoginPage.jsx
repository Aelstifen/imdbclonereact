import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password,
            });

            console.log('Login successful:', response.data);
            setLoginSuccess(true);

            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
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
                {loginSuccess && (
                    <div className="success-message" style={{ marginTop: '16px' }}>
                        ✅ Login successful!
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
