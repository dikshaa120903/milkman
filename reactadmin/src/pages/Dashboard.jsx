import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import './Dashboard.css';

const quickActions = [
    {
        icon: '🥛',
        title: 'Browse Products',
        desc: 'Explore fresh dairy products — milk, butter, cheese & more',
        to: '/categories',
        label: 'Shop Now',
        gradient: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
        accent: '#16a34a',
    },
    {
        icon: '🛍️',
        title: 'My Cart',
        desc: 'Review items in your cart and proceed to checkout',
        to: '/cart',
        label: 'View Cart',
        gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        accent: '#2563eb',
    },
    {
        icon: '📋',
        title: 'Subscriptions',
        desc: 'Manage your active dairy delivery subscriptions',
        to: '/subscriptions',
        label: 'My Plans',
        gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        accent: '#d97706',
    },
];

const benefits = [
    { icon: '✅', text: 'Fresh dairy products delivered daily' },
    { icon: '🔔', text: 'Easy subscription management' },
    { icon: '🔒', text: 'Secure checkout process' },
    { icon: '⭐', text: 'Premium quality assurance' },
];

const Dashboard = () => {
    const customerUser = JSON.parse(localStorage.getItem('customerUser') || '{}');
    const firstName = customerUser.email?.split('@')[0] || 'there';

    return (
        <div className="dashboard-container">
            {/* Welcome Banner */}
            <Card className="welcome-banner" shadow="lg" padding="xl">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <p className="welcome-greeting">🌅 Good Day</p>
                        <h1 className="welcome-title">Welcome, {firstName}!</h1>
                        <p className="welcome-subtitle">Ready for your fresh dairy delivery today?</p>
                    </div>
                    <div className="welcome-image">
                        <img
                            src="/Dairy Cow Farm Label Logo – Royalty-Free Vector _ VectorStock_files/dairy-cow-farm-label-logo-vector-42271144.jpg"
                            alt="Dairy Farm Logo"
                            className="logo-image"
                        />
                    </div>
                </div>
            </Card>

            {/* Quick Action Cards */}
            <div className="quick-actions-grid">
                {quickActions.map(a => (
                    <Card key={a.to} className="action-card" hover shadow="md">
                        <Link to={a.to} className="action-link">
                            <div className="action-header" style={{ background: a.gradient }}>
                                <span className="action-icon">{a.icon}</span>
                            </div>
                            <div className="action-content">
                                <h5 className="action-title">{a.title}</h5>
                                <p className="action-desc">{a.desc}</p>
                                <Button variant="primary" size="sm" className="action-button">
                                    {a.label} →
                                </Button>
                            </div>
                        </Link>
                    </Card>
                ))}
            </div>

            {/* Benefits Section */}
            <Card className="benefits-section" shadow="sm" padding="lg">
                <h3 className="benefits-title">Why Choose Milkman?</h3>
                <div className="benefits-grid">
                    {benefits.map(b => (
                        <div key={b.text} className="benefit-item">
                            <span className="benefit-icon">{b.icon}</span>
                            <span className="benefit-text">{b.text}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
