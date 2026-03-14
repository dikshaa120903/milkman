import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/milk.css';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await api.post('/customer/register/', form);
            navigate('/user/login');
        } catch (err) {
            setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left decorative panel */}
            <div className="auth-panel-left">
                <div className="brand-logo">🥛</div>
                <h1>Join Milkman</h1>
                <p>Create your account and start enjoying fresh dairy products delivered to your door every day.</p>
                <ul className="auth-features-list">
                    <li>Free delivery on first order</li>
                    <li>Flexible subscription plans</li>
                    <li>Premium quality guaranteed</li>
                    <li>24/7 customer support</li>
                </ul>
            </div>

            {/* Right form panel */}
            <div className="auth-panel-right">
                <div className="auth-form-card">
                    <p className="auth-form-title">Create Account</p>
                    <p className="auth-form-subtitle">Fill in the details below to get started</p>

                    {error && <div className="auth-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group-premium">
                            <label>Full Name</label>
                            <input type="text" name="name" placeholder="John Doe"
                                value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="input-group-premium">
                            <label>Email Address</label>
                            <input type="email" name="email" placeholder="you@example.com"
                                value={form.email} onChange={handleChange} required autoComplete="email" />
                        </div>
                        <div className="input-group-premium">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="Choose a strong password"
                                value={form.password} onChange={handleChange} required />
                        </div>
                        <div className="input-group-premium">
                            <label>Phone Number</label>
                            <input type="text" name="phone" placeholder="+91 00000 00000"
                                value={form.phone} onChange={handleChange} />
                        </div>
                        <div className="input-group-premium">
                            <label>Delivery Address</label>
                            <input type="text" name="address" placeholder="Your delivery address"
                                value={form.address} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn-auth-submit" disabled={loading}>
                            {loading ? 'Creating account…' : '→ Create Account'}
                        </button>
                    </form>

                    <span className="auth-link">
                        Already have an account? <Link to="/user/login">Sign In</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
