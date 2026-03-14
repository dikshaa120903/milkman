import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminTable = ({ columns, rows, onDelete }) => (
    <div style={{ overflowX: 'auto' }}>
        <table className="table-premium" style={{ width: '100%' }}>
            <thead>
                <tr>
                    {columns.map(c => <th key={c}>{c}</th>)}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 ? (
                    <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No records found</td></tr>
                ) : rows.map((row, i) => (
                    <tr key={i}>
                        {row.cells.map((cell, j) => <td key={j}>{cell}</td>)}
                        <td>
                            <button onClick={() => onDelete(row.id)} style={{
                                background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                                borderRadius: 6, padding: '5px 12px', cursor: 'pointer',
                                fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-family)',
                                transition: 'all 150ms ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; }}
                            >🗑 Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const Staff = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [newItem, setNewItem] = useState({ email: '', password: '', name: '', phone: '', address: '' });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2500);
    };

    const loadItems = async () => {
        try {
            setError(null);
            const res = await api.get('/staff/staff/');
            setItems(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error loading staff');
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
            await api.post('/staff/staff/', newItem);
            setNewItem({ email: '', password: '', name: '', phone: '', address: '' });
            showToast('Staff member added successfully');
            loadItems();
        } catch (err) {
            setError(err.response?.data?.detail || err.response?.data || 'Error adding staff');
        }
    };

    const deleteItem = async (id) => {
        try {
            await api.delete(`/staff/staff/${id}/`);
            showToast('Staff member removed', 'danger');
            loadItems();
        } catch (err) {
            setError(err.response?.data?.detail || 'Error deleting staff');
        }
    };

    const inputStyle = { padding: '10px 12px', border: '1.5px solid var(--border-light)', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'var(--font-family)', outline: 'none', width: '100%', background: 'var(--bg-input)', transition: 'border-color 150ms ease' };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {toast && (
                <div className={`toast-premium ${toast.type}`} style={{ top: 80 }}>
                    {toast.type === 'success' ? '✅' : '🗑'} {toast.msg}
                </div>
            )}

            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="page-header-icon">👥</div>
                    <div>
                        <h1 className="section-title">Staff Management</h1>
                        <p className="section-subtitle">{items.length} team member{items.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#991b1b', borderLeft: '3px solid #ef4444', borderRadius: 8, padding: '12px 16px', fontSize: '0.875rem', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚠️ {typeof error === 'string' ? error : JSON.stringify(error)}</span>
                    <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', fontSize: '1rem' }}>✕</button>
                </div>
            )}

            {/* Add Form */}
            <div className="form-section-card">
                <div className="form-section-title">
                    <span>➕</span> Add New Staff Member
                </div>
                <form onSubmit={addItem}>
                    <div className="row g-3">
                        {[
                            { name: 'email', label: 'Email', type: 'email', placeholder: 'staff@milkman.com' },
                            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                            { name: 'phone', label: 'Phone', type: 'text', placeholder: '+91 00000 00000' },
                            { name: 'address', label: 'Address', type: 'text', placeholder: 'City, State' },
                        ].map(f => (
                            <div className="col-md-4" key={f.name}>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{f.label}</label>
                                <input style={inputStyle} type={f.type} name={f.name} placeholder={f.placeholder}
                                    value={newItem[f.name]} onChange={handleChange} required={f.name !== 'address' && f.name !== 'phone'}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                                />
                            </div>
                        ))}
                        <div className="col-12">
                            <button type="submit" style={{
                                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px',
                                fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-family)',
                                boxShadow: 'var(--shadow-brand)',
                            }}>
                                + Add Staff Member
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid var(--border-light)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
                <AdminTable
                    columns={['EMAIL', 'NAME', 'PHONE', 'ADDRESS']}
                    rows={items.map(i => ({ id: i.id, cells: [i.email, i.name, i.phone, i.address] }))}
                    onDelete={deleteItem}
                />
            </div>
        </div>
    );
};

export default Staff;
