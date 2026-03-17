import React from 'react';
import { Link } from 'react-router-dom';

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
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {/* Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #0f5132 0%, #15803d 50%, #16a34a 100%)',
                borderRadius: 20, padding: '40px 36px', marginBottom: 32,
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                        🌅 Good Day
                    </p>
                    <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 8px' }}>
                        Welcome, {firstName}!
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '1rem' }}>
                        Ready for your fresh dairy delivery today?
                    </p>
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <img 
                        src="/Dairy Cow Farm Label Logo – Royalty-Free Vector _ VectorStock_files/dairy-cow-farm-label-logo-vector-42271144.jpg" 
                        alt="Dairy Farm Logo" 
                        style={{
                            width: 120, height: 120, borderRadius: 60,
                            border: '4px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            objectFit: 'cover'
                        }} 
                    />
                </div>
            </div>

            {/* Quick Action Cards */}
            <div className="row g-4 mb-5">
                {quickActions.map(a => (
                    <div className="col-md-4" key={a.to}>
                        <div style={{
                            background: '#fff', border: '1px solid var(--border-light)',
                            borderRadius: 16, overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 250ms ease', cursor: 'pointer',
                            height: '100%', display: 'flex', flexDirection: 'column',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                        >
                            <div style={{ height: 120, background: a.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                {a.icon}
                            </div>
                            <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h5 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 6px' }}>{a.title}</h5>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 18px', flex: 1 }}>{a.desc}</p>
                                <Link to={a.to} style={{
                                    display: 'block', textAlign: 'center', padding: '10px',
                                    background: a.accent, color: '#fff', borderRadius: 8,
                                    fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                                    transition: 'opacity 150ms ease',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    {a.label} →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Benefits Section */}
            <div style={{
                background: '#fff', border: '1px solid var(--border-light)',
                borderRadius: 16, padding: '28px 32px', boxShadow: 'var(--shadow-xs)',
            }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 20 }}>
                    Why Choose Milkman?
                </h3>
                <div className="row g-3">
                    {benefits.map(b => (
                        <div className="col-sm-6" key={b.text}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 16px', borderRadius: 10,
                                background: 'var(--bg-subtle)',
                                border: '1px solid var(--border-light)',
                            }}>
                                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{b.icon}</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{b.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
