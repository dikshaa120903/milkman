import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Toast from '../components/Toast';
import './Category.css';

const Category = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadItems = async () => {
        try {
            setError(null);
            const res = await api.get('/category/category/');
            setItems(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Error loading categories');
        }
    };

    useEffect(() => { loadItems(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const addItem = async (e) => {
        e.preventDefault();
        if (!newItem.name.trim() || !newItem.description.trim()) return;

        setLoading(true);
        try {
            setError(null);
            await api.post('/category/category/', newItem);
            setNewItem({ name: '', description: '' });
            showToast('Category added successfully');
            loadItems();
        } catch (err) {
            setError(err.response?.data?.detail || err.response?.data || 'Error adding category');
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await api.delete(`/category/category/${id}/`);
            showToast('Category removed', 'danger');
            loadItems();
        } catch (err) {
            setError(err.response?.data?.detail || 'Error deleting category');
        }
    };

    return (
        <div className="category-container">
            {toast && (
                <Toast
                    message={toast.msg}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-header-icon">📁</div>
                    <div>
                        <h1 className="page-title">Category Management</h1>
                        <p className="page-subtitle">{items.length} categor{items.length !== 1 ? 'ies' : 'y'}</p>
                    </div>
                </div>
            </div>

            {error && (
                <Card className="error-alert" shadow="sm">
                    <div className="error-content">
                        <span className="error-icon">⚠️</span>
                        <span className="error-message">
                            {typeof error === 'string' ? error : JSON.stringify(error)}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setError(null)}
                            className="error-close"
                        >
                            ✕
                        </Button>
                    </div>
                </Card>
            )}

            <Card className="form-section" shadow="md" padding="lg">
                <div className="form-header">
                    <span className="form-icon">➕</span>
                    <h3 className="form-title">Add New Category</h3>
                </div>
                <form onSubmit={addItem} className="category-form">
                    <div className="form-grid">
                        <Input
                            label="Category Name"
                            type="text"
                            name="name"
                            placeholder="e.g. Organic Milk"
                            value={newItem.name}
                            onChange={handleChange}
                            required
                            icon="📁"
                        />
                        <Input
                            label="Description"
                            type="text"
                            name="description"
                            placeholder="Brief description"
                            value={newItem.description}
                            onChange={handleChange}
                            required
                            icon="📝"
                        />
                        <div className="form-actions">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                fullWidth
                            >
                                {loading ? 'Adding...' : '+ Add Category'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>

            <Card className="categories-table" shadow="sm">
                <div className="table-responsive">
                    <table className="category-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="empty-state">
                                        <div className="empty-content">
                                            <span className="empty-icon">📂</span>
                                            <p>No categories yet</p>
                                            <small>Add your first category above</small>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.map(i => (
                                <tr key={i.id}>
                                    <td>
                                        <div className="category-name">
                                            <span className="category-badge">📁</span>
                                            {i.name}
                                        </div>
                                    </td>
                                    <td className="category-description">{i.description}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => deleteItem(i.id)}
                                            className="delete-button"
                                        >
                                            🗑 Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Category;
