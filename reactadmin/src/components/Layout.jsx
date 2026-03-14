import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import './Layout.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const staffUser = JSON.parse(localStorage.getItem('staffUser') || '{}');
    const customerUser = JSON.parse(localStorage.getItem('customerUser') || '{}');
    const isStaff = !!localStorage.getItem('staffToken');
    const isCustomer = !!localStorage.getItem('customerToken') && !isStaff;

    const handleLogout = () => {
        localStorage.removeItem('staffToken');
        localStorage.removeItem('staffUser');
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerUser');
        navigate(isStaff ? '/login' : '/user/login');
    };

    if (!isStaff && !isCustomer) return <>{children}</>;

    const currentUser = isStaff ? staffUser : customerUser;
    const userInitial = (currentUser.email || 'U')[0].toUpperCase();
    const isActive = (path) => location.pathname === path;

    const staffNavLinks = [
        { to: '/staff', label: '👥 Staff' },
        { to: '/customer', label: '🛍️ Customers' },
        { to: '/category', label: '📁 Categories' },
        { to: '/product', label: '📦 Products' },
        { to: '/subscription', label: '🔔 Subscriptions' },
        { to: '/react-demo', label: '⚛️ React Demo' },
    ];

    const customerNavLinks = [
        { to: '/dashboard', label: '🏠 Home' },
        { to: '/categories', label: '🛒 Products' },
        { to: '/cart', label: '🛍️ Cart' },
        { to: '/subscriptions', label: '📋 My Subscriptions' },
    ];

    const navLinks = isStaff ? staffNavLinks : customerNavLinks;

    return (
        <div className="layout-wrapper">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Brand */}
                    <Link to={isStaff ? '/staff' : '/dashboard'} className="brand-link">
                        <img
                            src="/Dairy Cow Farm Label Logo – Royalty-Free Vector _ VectorStock_files/dairy-cow-farm-label-logo-vector-42271144.jpg"
                            alt="Logo"
                            className="brand-logo"
                        />
                        <div className="brand-text">
                            <span className="brand-name">Milkman</span>
                            <span className="brand-subtitle">
                                {isStaff ? 'Admin Panel' : 'Dairy Farm'}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="nav-links desktop-nav">
                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className={`nav-link ${isActive(to) ? 'active' : ''}`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right: user + logout */}
                    <div className="navbar-right">
                        <div className="user-info">
                            <div className="user-avatar">
                                {userInitial}
                            </div>
                            <span className="user-email">
                                {currentUser.email}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </Button>

                        {/* Hamburger */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className={`mobile-nav-link ${isActive(to) ? 'active' : ''}`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            )}

            {/* Page content */}
            <main className="main-content">
                <div className="content-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
