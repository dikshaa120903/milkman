import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/milk.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('staffToken')) navigate('/staff');
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await api.post('/staff/login/', { email, password });
            const { token, staff_id } = response.data;
            localStorage.setItem('staffToken', token);
            localStorage.setItem('staffUser', JSON.stringify({ email, id: staff_id }));
            navigate('/staff');
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
                <div className="brand-logo">🥛</div>
                <h1>Milkman Admin</h1>
                <p>Manage your dairy business with ease. Full control over staff, products and subscriptions.</p>
                <ul className="auth-features-list">
                    <li>Staff & Customer Management</li>
                    <li>Product Catalogue Control</li>
                    <li>Subscription Oversight</li>
                    <li>Real-time Order Tracking</li>
                </ul>
            </div>

            {/* Right form panel */}
            <div className="auth-panel-right">
                <div className="auth-form-card">
                    <p className="auth-form-title">Staff Login</p>
                    <p className="auth-form-subtitle">Sign in to access the admin dashboard</p>

                    {error && <div className="auth-error">⚠️ {error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="input-group-premium">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="staff@milkman.com"
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
                        Not a staff member? <Link to="/">Go to Home</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
