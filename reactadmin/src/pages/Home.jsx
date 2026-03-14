import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const previewCategories = ['🥛 Milk', '🧈 Butter & Spreads', '🧀 Cheese', '🍶 Yogurt', '🍫 Flavored Dairy'];

const features = [
    { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day delivery available' },
    { icon: '🥛', title: 'Premium Quality', desc: '100% fresh and pure milk' },
    { icon: '💳', title: 'Easy Payment', desc: 'Multiple payment options' },
];

const Home = () => (
    <div className="home-page">
        <div className="container-fluid h-100" style={{ position: 'relative', zIndex: 1 }}>
            <div className="row align-items-center">
                {/* Hero Left */}
                <div className="col-lg-8 home-content" style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <div className="home-hero-eyebrow">
                        ✨ Fresh · Pure · Delivered Daily
                    </div>

                    <h1 className="home-title">
                        Fresh Dairy,<br />
                        <span className="home-title-accent">Right to Your Door</span>
                    </h1>

                    <p className="home-subtitle">
                        Get premium quality milk and dairy products delivered to your doorstep every morning.
                        Subscribe once, enjoy every day.
                    </p>

                    <div className="cta-buttons">
                        <Link to="/user/login" className="cta-primary">
                            🛒 Shop Now
                        </Link>
                        <Link to="/user/register" className="cta-secondary">
                            Create Account →
                        </Link>
                    </div>

                    <div className="features">
                        {features.map(f => (
                            <div key={f.title} className="feature-item">
                                <h5>{f.icon} {f.title}</h5>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Login Section Right */}
                <div className="col-lg-4 login-section">
                    <div className="login-container">
                        <h2 className="login-title">Get Started</h2>
                        <p className="login-subtitle">Sign in to browse and order</p>

                        <div className="login-options">
                            <Link to="/user/login" className="login-card customer-login">
                                <div className="login-card-inner">
                                    <div className="login-icon">🛒</div>
                                    <div>
                                        <h4>Customer</h4>
                                        <p>Order milk & subscribe to plans</p>
                                    </div>
                                    <span className="login-card-arrow">→</span>
                                </div>
                            </Link>

                            <Link to="/login" className="login-card staff-login">
                                <div className="login-card-inner">
                                    <div className="login-icon">👤</div>
                                    <div>
                                        <h4>Staff</h4>
                                        <p>Access admin management panel</p>
                                    </div>
                                    <span className="login-card-arrow">→</span>
                                </div>
                            </Link>
                        </div>

                        <div className="register-section">
                            <p>Don't have an account?</p>
                            <Link to="/user/register" className="btn-register">
                                Sign Up — It's Free
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Home;
