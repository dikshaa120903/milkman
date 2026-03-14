import React from 'react';

const Products = () => {
    // legacy page – products have been renamed to categories
    return (
        <div className="mt-4">
            <h2>Section moved</h2>
            <p>The products section has been renamed to <strong>Categories</strong>.</p>
            <p>Please use the <a href="#/categories">Categories page</a> to browse items.</p>
        </div>
    );


    useEffect(() => {
        loadProducts();
    }, []);

    const addToCart = (prod) => {
        const existing = JSON.parse(localStorage.getItem('cart') || '[]');
        const idx = existing.findIndex(i => i.id === prod.id);
        if (idx !== -1) {
            existing[idx].quantity += 1;
        } else {
            existing.push({ ...prod, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(existing));
        alert('Added to cart');
    };

    const getProductIcon = (productName) => {
        const name = productName.toLowerCase();
        if (name.includes('milk')) return '🥛';
        if (name.includes('paneer')) return '🧀';
        if (name.includes('curd')) return '🍶';
        if (name.includes('butter')) return '🧈';
        if (name.includes('yogurt')) return '🥣';
        return '🥛';
    };

    const getProductColor = (productName) => {
        const name = productName.toLowerCase();
        if (name.includes('milk')) return { bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', border: '#1976d2' };
        if (name.includes('paneer')) return { bg: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', border: '#f57c00' };
        if (name.includes('curd')) return { bg: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', border: '#7b1fa2' };
        return { bg: 'linear-gradient(135deg, #f5f5dc 0%, #fffacd 100%)', border: '#bdb76b' };
    };

    return (
        <div className="mt-4">
            {/* Header Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #003d2d 0%, #00796b 100%)',
                color: 'white',
                padding: '40px 20px',
                borderRadius: '10px',
                marginBottom: '30px',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛒 Fresh Dairy Products</h1>
                <p style={{ fontSize: '1.1rem', marginBottom: '0' }}>Browse our collection of quality dairy items</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading products...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* No Products State */}
            {!loading && products.length === 0 && !error && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '1.2rem', color: '#666' }}>No products available</p>
                </div>
            )}

            <div className="row mt-3">
                {!loading && products.map(p => {
                    const colors = getProductColor(p.name);
                    return (
                        <div className="col-md-4 mb-4" key={p.id}>
                            <div className="card h-100 shadow-lg" style={{
                                border: `3px solid ${colors.border}`,
                                borderRadius: '15px',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer'
                            }} 
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                            }}>
                                {/* Product Image/Icon */}
                                <div style={{
                                    background: colors.bg,
                                    padding: '40px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '180px',
                                    fontSize: '5rem'
                                }}>
                                    {getProductIcon(p.name)}
                                </div>

                                {/* Product Details */}
                                <div className="card-body">
                                    <h5 className="card-title" style={{ color: colors.border, fontWeight: 'bold', fontSize: '1.3rem' }}>
                                        {p.name}
                                    </h5>
                                    <p className="card-text text-muted" style={{ minHeight: '60px' }}>
                                        {p.description || 'Premium quality dairy product'}
                                    </p>
                                    
                                    {/* Price */}
                                    <div style={{
                                        background: colors.bg,
                                        padding: '15px',
                                        borderRadius: '8px',
                                        marginBottom: '15px',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.border, margin: '0' }}>
                                            ₹{p.price}
                                        </p>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button 
                                        className="btn w-100" 
                                        style={{
                                            background: colors.border,
                                            color: 'white',
                                            fontWeight: 'bold',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            transition: 'opacity 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                                        onClick={() => addToCart(p)}
                                    >
                                        🛒 Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Products;
