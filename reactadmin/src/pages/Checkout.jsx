import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [form, setForm] = useState({ cardName:'', cardNumber:'', expiry:'', cvv:'', email:'', phone:'' });
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const c = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(c);
        setTotal(c.reduce((s, i) => s + i.price * i.quantity, 0));
        const user = JSON.parse(localStorage.getItem('customerUser') || '{}');
        setForm(prev => ({ ...prev, email: user.email || '' }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const formatCardNumber = (val) => val.replace(/\s/g,'').replace(/(\d{4})/g,'$1 ').trim();
    const formatExpiry = (val) => {
        const clean = val.replace(/\D/g, '').slice(0, 4);
        return clean.length >= 2 ? clean.slice(0,2)+'/'+clean.slice(2) : clean;
    };

    const validate = () => {
        if (!form.cardName.trim()) return 'Cardholder name required';
        if (!form.cardNumber || form.cardNumber.replace(/\s/g,'').length !== 16) return 'Valid 16-digit card number required';
        if (!form.expiry || !/^\d{2}\/\d{2}$/.test(form.expiry)) return 'Expiry in MM/YY format required';
        if (!form.cvv || form.cvv.length !== 3) return 'Valid 3-digit CVV required';
        if (!form.email) return 'Email required';
        return null;
    };

    const handlePay = () => {
        const err = validate();
        if (err) { setError(err); return; }
        setError(null);
        setProcessing(true);
        setTimeout(() => {
            localStorage.removeItem('cart');
            setSuccess(true);
            setTimeout(() => navigate('/categories'), 2500);
        }, 1800);
    };

    const inputStyle = {
        width:'100%', padding:'12px 14px',
        border:'1.5px solid var(--border-light)', borderRadius:8,
        background:'var(--bg-input)', fontSize:'0.9rem',
        color:'var(--text-primary)', fontFamily:'var(--font-family)',
        outline:'none', transition:'border-color 150ms ease, box-shadow 150ms ease',
    };
    const labelStyle = { display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--text-secondary)', marginBottom:6, letterSpacing:'0.04em' };
    const card = { background:'#fff', border:'1px solid var(--border-light)', borderRadius:16, padding:'28px 32px', boxShadow:'var(--shadow-sm)' };

    if (success) return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
            <div style={{ ...card, textAlign:'center', maxWidth:440, padding:'52px 40px' }}>
                <div style={{ fontSize:'4rem', marginBottom:16 }}>🎉</div>
                <h2 style={{ fontWeight:900, color:'var(--primary)', marginBottom:8 }}>Order Placed!</h2>
                <p style={{ color:'var(--text-muted)' }}>Your fresh dairy is on its way. Redirecting you to products…</p>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <div className="page-header">
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div className="page-header-icon">💳</div>
                    <div>
                        <h1 className="section-title">Checkout</h1>
                        <p className="section-subtitle">Complete your secure payment</p>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Payment Form */}
                <div className="col-lg-8">
                    <div style={card}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
                            <span style={{ fontSize:'1.2rem' }}>🔒</span>
                            <span style={{ fontWeight:700, color:'var(--text-primary)' }}>Secure Payment Details</span>
                        </div>

                        {error && (
                            <div style={{ background:'#fef2f2', color:'#991b1b', borderLeft:'3px solid #ef4444', borderRadius:8, padding:'11px 16px', fontSize:'0.875rem', fontWeight:500, marginBottom:20 }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <div style={{ marginBottom:18 }}>
                            <label style={labelStyle}>CARDHOLDER NAME</label>
                            <input style={inputStyle} type="text" name="cardName" value={form.cardName} onChange={handleChange} placeholder="John Doe"
                                onFocus={e => { e.target.style.borderColor='var(--primary)'; e.target.style.boxShadow='0 0 0 3px rgba(22,163,74,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor='var(--border-light)'; e.target.style.boxShadow='none'; }}
                            />
                        </div>
                        <div style={{ marginBottom:18 }}>
                            <label style={labelStyle}>CARD NUMBER</label>
                            <input style={inputStyle} type="text" maxLength="19" placeholder="1234 5678 9012 3456"
                                value={formatCardNumber(form.cardNumber)}
                                onChange={e => setForm(p => ({ ...p, cardNumber: e.target.value.replace(/\s/g,'') }))}
                                onFocus={e => { e.target.style.borderColor='var(--primary)'; e.target.style.boxShadow='0 0 0 3px rgba(22,163,74,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor='var(--border-light)'; e.target.style.boxShadow='none'; }}
                            />
                        </div>
                        <div className="row g-3" style={{ marginBottom:18 }}>
                            <div className="col-6">
                                <label style={labelStyle}>EXPIRY (MM/YY)</label>
                                <input style={inputStyle} type="text" maxLength="5" placeholder="12/25" name="expiry"
                                    value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                                    onFocus={e => { e.target.style.borderColor='var(--primary)'; e.target.style.boxShadow='0 0 0 3px rgba(22,163,74,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor='var(--border-light)'; e.target.style.boxShadow='none'; }}
                                />
                            </div>
                            <div className="col-6">
                                <label style={labelStyle}>CVV</label>
                                <input style={inputStyle} type="password" maxLength="3" placeholder="123" name="cvv"
                                    value={form.cvv} onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'').slice(0,3) }))}
                                    onFocus={e => { e.target.style.borderColor='var(--primary)'; e.target.style.boxShadow='0 0 0 3px rgba(22,163,74,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor='var(--border-light)'; e.target.style.boxShadow='none'; }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom:18 }}>
                            <label style={labelStyle}>EMAIL</label>
                            <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                                onFocus={e => { e.target.style.borderColor='var(--primary)'; e.target.style.boxShadow='0 0 0 3px rgba(22,163,74,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor='var(--border-light)'; e.target.style.boxShadow='none'; }}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>PHONE (OPTIONAL)</label>
                            <input style={inputStyle} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000"
                                onFocus={e => { e.target.style.borderColor='var(--primary)'; e.target.style.boxShadow='0 0 0 3px rgba(22,163,74,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor='var(--border-light)'; e.target.style.boxShadow='none'; }}
                            />
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                    <div style={{ ...card, position:'sticky', top:80 }}>
                        <p style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-muted)', marginBottom:16 }}>ORDER SUMMARY</p>
                        <div style={{ borderBottom:'1px solid var(--border-light)', paddingBottom:16, marginBottom:16 }}>
                            {cart.map(i => (
                                <div key={i.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                                    <span style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{i.name} × {i.quantity}</span>
                                    <span style={{ fontSize:'0.85rem', fontWeight:600 }}>₹{(i.price*i.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
                            <span style={{ fontWeight:700 }}>Total</span>
                            <span style={{ fontWeight:800, fontSize:'1.2rem', color:'var(--primary)' }}>₹{total.toFixed(2)}</span>
                        </div>
                        <button onClick={handlePay} disabled={processing} style={{
                            width:'100%', padding:'14px',
                            background: processing ? 'var(--bg-subtle)' : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                            color: processing ? 'var(--text-muted)' : '#fff',
                            border:'none', borderRadius:10, fontWeight:700, fontSize:'0.95rem',
                            cursor: processing ? 'not-allowed' : 'pointer', fontFamily:'var(--font-family)',
                            boxShadow: processing ? 'none' : '0 4px 16px rgba(22,163,74,0.3)',
                            transition:'all 200ms ease',
                        }}>
                            {processing ? '⏳ Processing…' : '🔒 Complete Payment'}
                        </button>
                        <p style={{ textAlign:'center', fontSize:'0.75rem', color:'var(--text-muted)', marginTop:12, marginBottom:0 }}>
                            Demo only — no real charge
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
