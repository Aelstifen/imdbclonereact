import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [confirmError, setConfirmError] = useState(false);

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(password);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setPasswordError(false);
        setConfirmError(false);

        if (!validatePassword(password)) {
            setMessage('❌ Password must be at least 6 characters long, contain at least one uppercase letter and one number.');
            setPasswordError(true);
            return;
        }

        if (password !== confirmPassword) {
            setMessage('❌ Passwords do not match');
            setConfirmError(true);
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            const response = await axios.post('/api/auth/signup', {
                email,
                password
            });

            setMessage('✅ Signup successful!');
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Signup failed:', error);
            setMessage(
                error.response?.data?.message ||
                '❌ Signup failed. Try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="login-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
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
                            className={`auth-input ${passwordError ? 'input-error' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className={`auth-input ${confirmError ? 'input-error' : ''}`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>

                    {message && <p className="auth-message">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignupPage;