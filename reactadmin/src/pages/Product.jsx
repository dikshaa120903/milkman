import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Product = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', description: '' });

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };
    const loadItems = async () => {
        try { setError(null); const r = await api.get('/product/product/'); setItems(r.data); }
        catch (err) { setError(err.response?.data?.detail || err.message || 'Error loading products'); }
    };
    useEffect(() => { loadItems(); }, []);

    const handleChange = (e) => { const { name, value } = e.target; setNewItem(p => ({ ...p, [name]: value })); };

    const addItem = async (e) => {
        e.preventDefault();
        try { setError(null); await api.post('/product/product/', newItem); setNewItem({ name:'', price:'', category:'', description:'' }); showToast('Product added'); loadItems(); }
        catch (err) { setError(err.response?.data?.detail || err.response?.data || 'Error adding product'); }
    };

    const deleteItem = async (id) => {
        try { await api.delete(`/product/product/${id}/`); showToast('Product removed', 'danger'); loadItems(); }
        catch (err) { setError(err.response?.data?.detail || 'Error deleting product'); }
    };

    const inputStyle = { padding: '10px 12px', border: '1.5px solid var(--border-light)', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'var(--font-family)', outline: 'none', width: '100%', background: 'var(--bg-input)', transition: 'border-color 150ms ease' };
    const labelStyle = { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {toast && <div className={`toast-premium ${toast.type}`}>{toast.type === 'success' ? '✅' : '🗑'} {toast.msg}</div>}

            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="page-header-icon">📦</div>
                    <div>
                        <h1 className="section-title">Product Management</h1>
                        <p className="section-subtitle">{items.length} product{items.length !== 1 ? 's' : ''} in catalogue</p>
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
                <div className="form-section-title"><span>➕</span> Add New Product</div>
                <form onSubmit={addItem}>
                    <div className="row g-3">
                        {[
                            { name: 'name', label: 'Product Name', type: 'text', placeholder: 'e.g. Full Cream Milk' },
                            { name: 'price', label: 'Price (₹)', type: 'number', placeholder: '0.00', step: '0.01' },
                            { name: 'category', label: 'Category ID', type: 'number', placeholder: '1' },
                            { name: 'description', label: 'Description', type: 'text', placeholder: 'Brief description' },
                        ].map(f => (
                            <div className="col-md-3" key={f.name}>
                                <label style={labelStyle}>{f.label}</label>
                                <input style={inputStyle} type={f.type} name={f.name} placeholder={f.placeholder}
                                    step={f.step} value={newItem[f.name]} onChange={handleChange}
                                    required={f.name !== 'description'}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                                />
                            </div>
                        ))}
                        <div className="col-12">
                            <button type="submit" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>
                                + Add Product
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table-premium" style={{ width: '100%' }}>
                        <thead>
                            <tr>{['NAME', 'PRICE', 'CATEGORY', 'DESCRIPTION', 'ACTIONS'].map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No products yet</td></tr>
                            ) : items.map(i => (
                                <tr key={i.id}>
                                    <td style={{ fontWeight: 600 }}>{i.name}</td>
                                    <td>
                                        <span style={{ background: 'var(--brand-50)', color: 'var(--primary-dark)', borderRadius: 6, padding: '3px 10px', fontSize: '0.82rem', fontWeight: 700 }}>
                                            ₹{parseFloat(i.price).toFixed(2)}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{i.category}</td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{i.description}</td>
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

export default Product;
