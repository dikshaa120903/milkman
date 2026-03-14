import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    }, []);

    const save = (updated) => {
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const removeItem  = (id) => save(cart.filter(i => i.id !== id));
    const increaseQty = (id) => save(cart.map(i => i.id === id ? { ...i, quantity: Number(i.quantity) + 1 } : i));
    const decreaseQty = (id) => save(cart.map(i => i.id === id ? { ...i, quantity: Number(i.quantity) - 1 } : i).filter(i => i.quantity > 0));
    const getTotal = () => cart.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);

    const s = { // shared styles
        card: { background: '#fff', border: '1px solid var(--border-light)', borderRadius: 16, boxShadow: 'var(--shadow-sm)', padding: '28px' },
        label: { fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' },
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {/* Header */}
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="page-header-icon">🛍️</div>
                    <div>
                        <h1 className="section-title">Your Cart</h1>
                        <p className="section-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>

            {cart.length === 0 ? (
                <div style={{ ...s.card, textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛒</div>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Your cart is empty</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Add some fresh dairy products to get started.</p>
                    <button onClick={() => navigate('/categories')} style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px',
                        fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--font-family)',
                    }}>
                        Browse Products →
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    {/* Cart Items */}
                    <div className="col-lg-8">
                        <div style={s.card}>
                            <p style={s.label}>Cart Items</p>
                            <div style={{ marginTop: 16 }}>
                                {cart.map((item, idx) => (
                                    <div key={item.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        padding: '16px 0',
                                        borderBottom: idx < cart.length - 1 ? '1px solid var(--border-light)' : 'none',
                                    }}>
                                        <div style={{
                                            width: 52, height: 52, borderRadius: 12,
                                            background: 'var(--brand-50)', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.6rem', flexShrink: 0,
                                        }}>🥛</div>

                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px', fontSize: '0.9rem' }}>{item.name}</p>
                                            <p style={{ color: 'var(--primary)', fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>₹{Number(item.price).toFixed(2)}</p>
                                        </div>

                                        {/* Qty controls */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <button onClick={() => decreaseQty(item.id)} style={{
                                                width: 30, height: 30, borderRadius: 8,
                                                border: '1px solid var(--border-light)', background: 'var(--bg-subtle)',
                                                cursor: 'pointer', fontWeight: 700, fontSize: '1rem', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>−</button>
                                            <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => increaseQty(item.id)} style={{
                                                width: 30, height: 30, borderRadius: 8,
                                                border: '1px solid var(--border-light)', background: 'var(--bg-subtle)',
                                                cursor: 'pointer', fontWeight: 700, fontSize: '1rem', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>+</button>
                                        </div>

                                        <div style={{ minWidth: 70, textAlign: 'right' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>

                                        <button onClick={() => removeItem(item.id)} style={{
                                            background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                                            borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                                            fontFamily: 'var(--font-family)', transition: 'all 150ms ease',
                                        }}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-4">
                        <div style={{ ...s.card, position: 'sticky', top: 80 }}>
                            <p style={s.label}>Order Summary</p>
                            <div style={{ margin: '16px 0', borderBottom: '1px solid var(--border-light)', paddingBottom: 16 }}>
                                {cart.map(i => (
                                    <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{i.name} × {i.quantity}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>₹{(i.price * i.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>₹{getTotal().toFixed(2)}</span>
                            </div>
                            <button onClick={() => navigate('/checkout')} style={{
                                width: '100%', padding: '13px',
                                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                color: '#fff', border: 'none', borderRadius: 10,
                                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                                fontFamily: 'var(--font-family)',
                                boxShadow: '0 4px 16px rgba(22,163,74,0.3)',
                                transition: 'all 200ms ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(22,163,74,0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(22,163,74,0.3)'; }}
                            >
                                Proceed to Checkout →
                            </button>
                            <button onClick={() => navigate('/categories')} style={{
                                width: '100%', marginTop: 10, padding: '11px',
                                background: 'var(--bg-subtle)', color: 'var(--text-secondary)',
                                border: '1px solid var(--border-light)', borderRadius: 10,
                                fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-family)',
                            }}>
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
