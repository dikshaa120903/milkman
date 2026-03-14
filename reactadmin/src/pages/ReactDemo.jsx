import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import CATEGORY_DATA from './_category_data';
import './ReactDemo.css';

const ReactDemo = () => {
    // React Hooks Demo
    const [selectedCategory, setSelectedCategory] = useState('Milk');
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState(new Set());
    const [sortBy, setSortBy] = useState('name'); // 'name' or 'price'
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const categories = Object.keys(CATEGORY_DATA);

    // useMemo for expensive calculations
    const filteredAndSortedProducts = useMemo(() => {
        let products = CATEGORY_DATA[selectedCategory] || [];

        // Filter by search term
        if (searchTerm) {
            products = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter favorites if needed
        if (showFavoritesOnly) {
            products = products.filter(product => favorites.has(product.name));
        }

        // Sort products
        products.sort((a, b) => {
            if (sortBy === 'price') {
                return a.price - b.price;
            }
            return a.name.localeCompare(b.name);
        });

        return products;
    }, [selectedCategory, searchTerm, sortBy, showFavoritesOnly, favorites]);

    // useEffect for side effects
    useEffect(() => {
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            setFavorites(new Set(JSON.parse(savedFavorites)));
        }
    }, []);

    useEffect(() => {
        // Save favorites to localStorage
        localStorage.setItem('favorites', JSON.stringify([...favorites]));
    }, [favorites]);

    // Event handlers
    const toggleFavorite = (productName) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productName)) {
                newFavorites.delete(productName);
            } else {
                newFavorites.add(productName);
            }
            return newFavorites;
        });
    };

    const clearSearch = () => setSearchTerm('');
    const toggleSort = () => setSortBy(prev => prev === 'name' ? 'price' : 'name');

    return (
        <div className="react-demo">
            <Card className="demo-header" shadow="lg" padding="xl">
                <h1 className="demo-title">⚛️ React Concepts Demo</h1>
                <p className="demo-subtitle">
                    Using React hooks, state management, and modern patterns with your dairy data
                </p>
            </Card>

            {/* Controls */}
            <Card className="controls-section" shadow="md" padding="lg">
                <div className="controls-grid">
                    {/* Category Selection */}
                    <div className="control-group">
                        <label className="control-label">📂 Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="control-select"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <div className="control-group">
                        <label className="control-label">🔍 Search</label>
                        <div className="search-container">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                className="control-input"
                            />
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearSearch}
                                    className="clear-search"
                                >
                                    ✕
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="control-group">
                        <label className="control-label">🔄 Sort by</label>
                        <Button
                            variant={sortBy === 'name' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={toggleSort}
                        >
                            {sortBy === 'name' ? '📝 Name' : '💰 Price'}
                        </Button>
                    </div>

                    {/* Favorites Filter */}
                    <div className="control-group">
                        <label className="control-label">❤️ Favorites</label>
                        <Button
                            variant={showFavoritesOnly ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        >
                            {showFavoritesOnly ? '⭐ Showing Favorites' : '☆ Show All'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Stats */}
            <div className="stats-grid">
                <Card className="stat-card" shadow="sm">
                    <div className="stat-number">{filteredAndSortedProducts.length}</div>
                    <div className="stat-label">Products Found</div>
                </Card>
                <Card className="stat-card" shadow="sm">
                    <div className="stat-number">{favorites.size}</div>
                    <div className="stat-label">Favorites</div>
                </Card>
                <Card className="stat-card" shadow="sm">
                    <div className="stat-number">
                        ₹{filteredAndSortedProducts.reduce((sum, p) => sum + p.price, 0)}
                    </div>
                    <div className="stat-label">Total Value</div>
                </Card>
            </div>

            {/* Products */}
            <div className="products-section">
                <h2 className="section-title">
                    {selectedCategory} Products
                    {searchTerm && <span className="search-indicator"> (filtered by "{searchTerm}")</span>}
                </h2>

                {filteredAndSortedProducts.length === 0 ? (
                    <Card className="empty-state" shadow="sm" padding="xl">
                        <div className="empty-content">
                            <span className="empty-icon">🔍</span>
                            <h3>No products found</h3>
                            <p>Try adjusting your search or category selection</p>
                            <Button variant="primary" onClick={() => {
                                setSearchTerm('');
                                setShowFavoritesOnly(false);
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="products-grid">
                        {filteredAndSortedProducts.map((product, index) => (
                            <Card key={index} className="product-card" hover shadow="md">
                                <div className="product-header">
                                    <h3 className="product-name">{product.name}</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleFavorite(product.name)}
                                        className={`favorite-btn ${favorites.has(product.name) ? 'favorited' : ''}`}
                                    >
                                        {favorites.has(product.name) ? '❤️' : '🤍'}
                                    </Button>
                                </div>

                                <div className="product-image-container">
                                    <img
                                        src={product.img}
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => {
                                            e.target.src = '/images/placeholder.png';
                                        }}
                                    />
                                </div>

                                <div className="product-footer">
                                    <div className="product-price">₹{product.price}</div>
                                    <Button variant="primary" size="sm">
                                        Add to Cart
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReactDemo;