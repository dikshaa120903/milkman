import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Customer = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', email: '', phone: '', address: '', password: '' });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2500);
    };

    const loadItems = async () => {
        try {
            setError(null);
            const res = await api.get('/customer/customer/');
            setItems(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Error loading customers');
        }
    };

    useEffect(() => { loadItems(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const addItem = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            await api.post('/customer/customer/', newItem);
            setNewItem({ name: '', email: '', phone: '', address: '', password: '' });
            showToast('Customer added successfully');
            loadItems();
        } catch (err) {
            setError(err.response?.data?.detail || err.response?.data || 'Error adding customer');
        }
    };

    const deleteItem = async (id) => {
        try {
            await api.delete(`/customer/customer/${id}/`);
            showToast('Customer removed', 'danger');
            loadItems();
        } catch (err) {
            setError(err.response?.data?.detail || 'Error deleting customer');
        }
    };

    const inputStyle = { padding: '10px 12px', border: '1.5px solid var(--border-light)', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'var(--font-family)', outline: 'none', width: '100%', background: 'var(--bg-input)', transition: 'border-color 150ms ease' };
    const labelStyle = { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {toast && (
                <div className={`toast-premium ${toast.type}`}>
                    {toast.type === 'success' ? '✅' : '🗑'} {toast.msg}
                </div>
            )}
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="page-header-icon">🛍️</div>
                    <div>
                        <h1 className="section-title">Customer Management</h1>
                        <p className="section-subtitle">{items.length} customer{items.length !== 1 ? 's' : ''} registered</p>
                    </div>
                </div>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#991b1b', borderLeft: '3px solid #ef4444', borderRadius: 8, padding: '12px 16px', fontSize: '0.875rem', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚠️ {typeof error === 'string' ? error : JSON.stringify(error)}</span>
                    <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}>✕</button>
                </div>
            )}

            <div className="form-section-card">
                <div className="form-section-title"><span>➕</span> Add New Customer</div>
                <form onSubmit={addItem}>
                    <div className="row g-3">
                        {[
                            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Smith' },
                            { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com' },
                            { name: 'phone', label: 'Phone', type: 'text', placeholder: '+91 00000 00000' },
                            { name: 'address', label: 'Address', type: 'text', placeholder: 'City, State' },
                            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                        ].map(f => (
                            <div className="col-md-4" key={f.name}>
                                <label style={labelStyle}>{f.label}</label>
                                <input style={inputStyle} type={f.type} name={f.name} placeholder={f.placeholder}
                                    value={newItem[f.name]} onChange={handleChange} required
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                                />
                            </div>
                        ))}
                        <div className="col-12">
                            <button type="submit" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>
                                + Add Customer
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table-premium" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                {['NAME', 'EMAIL', 'PHONE', 'ADDRESS', 'ACTIONS'].map(h => <th key={h}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No customers found</td></tr>
                            ) : items.map(i => (
                                <tr key={i.id}>
                                    <td style={{ fontWeight: 600 }}>{i.name}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{i.email}</td>
                                    <td>{i.phone}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{i.address}</td>
                                    <td>
                                        <button onClick={() => deleteItem(i.id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-family)' }}>
                                            🗑 Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Customer;
