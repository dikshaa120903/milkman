import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/milk.css';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('customerToken')) navigate('/dashboard');
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await api.post('/customer/login/', { email, password });
            const { token, customer_id } = response.data;
            localStorage.setItem('customerToken', token);
            localStorage.setItem('customerUser', JSON.stringify({ email, id: customer_id }));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left decorative panel */}
            <div className="auth-panel-left">
                <div className="brand-logo">🛒</div>
                <h1>Welcome Back!</h1>
                <p>Fresh dairy products delivered straight to your door. Log in to browse and order.</p>
                <ul className="auth-features-list">
                    <li>Fresh dairy delivered daily</li>
                    <li>Easy subscription plans</li>
                    <li>Secure & fast checkout</li>
                    <li>Track your orders</li>
                </ul>
            </div>

            {/* Right form panel */}
            <div className="auth-panel-right">
                <div className="auth-form-card">
                    <p className="auth-form-title">Customer Login</p>
                    <p className="auth-form-subtitle">Sign in to shop fresh dairy products</p>

                    {error && <div className="auth-error">⚠️ {error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="input-group-premium">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="input-group-premium">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <button type="submit" className="btn-auth-submit" disabled={loading}>
                            {loading ? 'Signing in…' : '→ Sign In'}
                        </button>
                    </form>

                    <span className="auth-link">
                        New customer? <Link to="/user/register">Create an account</Link>
                    </span>
                    <span className="auth-link">
                        <Link to="/">← Back to Home</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
