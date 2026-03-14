import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SubscribeModal from '../components/SubscribeModal';

const CATEGORY_EMOJI = {
    'Milk': '🥛',
    'Butter': '🧈',
    'Cheese': '🧀',
    'Yogurt': '🍶',
    'Flavoured Milk': '🍫',
};

// Map product keywords to their static image path
export const getProductImage = (productName, productImageApiUrl = null) => {
    if (productImageApiUrl) {
        if (productImageApiUrl.startsWith('http')) return productImageApiUrl;
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${productImageApiUrl}`;
    }

    const name = productName.toLowerCase();
    
    // Milk
    if (name.includes('full cream')) return '/images/products/milk/full-cream-milk-carton-with-cow-face-vector-10436840.avif';
    if (name.includes('double toned')) return '/images/products/milk/doubletonnedmilk.png';
    if (name.includes('toned')) return '/images/products/milk/tonned.png';
    if (name.includes('skimmed')) return '/images/products/milk/skimmmedmilk.png';
    if (name.includes('buffalo')) return '/images/products/milk/buff_milk.png';
    if (name.includes('lactose')) return '/images/products/milk/lactose_free.png';
    if (name.includes('cow milk') || name === 'milk') return '/images/products/milk/cow_milk.png';

    // Butter  
    if (name.includes('unsalted')) return '/images/products/butter/unsalted.png';
    if (name.includes('salted')) return '/images/products/butter/salted.png';
    if (name.includes('white butter') || name.includes('makkhan')) return '/images/products/butter/white_butter.png';
    if (name.includes('ghee')) return '/images/products/butter/ghee.png';
    if (name.includes('flavor') && name.includes('butter')) return '/images/products/butter/flavored_butter.png';

    // Cheese
    if (name.includes('cheddar')) return '/images/products/cheese/cheddar.png';
    if (name.includes('mozzarella')) return '/images/products/cheese/mozerolla.png';
    if (name.includes('paneer')) return '/images/products/cheese/paneer.png';
    if (name.includes('slice')) return '/images/products/cheese/chesse_slice.png';
    if (name.includes('spread')) return '/images/products/cheese/chesse_spread.png';
    if (name.includes('processed')) return '/images/products/cheese/processed.png';

    // Yogurt
    if (name.includes('curd') || name.includes('dahi')) return '/images/products/yogurt/curd.png';
    if (name.includes('greek')) return '/images/products/yogurt/greek_yogurt.png';
    if (name.includes('flavor') && name.includes('yogurt')) return '/images/products/yogurt/flavoured_yogurt.png';
    if (name.includes('buttermilk') || name.includes('chaas')) return '/images/products/yogurt/buttermilk.png';
    if (name.includes('lassi')) return '/images/products/yogurt/lassi.png';
    if (name.includes('probiotic')) return '/images/products/yogurt/probiotic_milk.png';

    // Flavored Milk
    if (name.includes('chocolate')) return '/images/products/flavored_milk/chocolate_milk.png';
    if (name.includes('strawberry')) return '/images/products/flavored_milk/strawberry_milk.png';
    if (name.includes('protein')) return '/images/products/flavored_milk/protein_milk.png';
    if (name.includes('fortified')) return '/images/products/flavored_milk/fort_milk.png';
    if (name.includes('mango')) return '/images/products/flavored_milk/mango.png'; // Assuming user added this to public
    
    // Fallback based on main category keywords
    if (name.includes('butter')) return '/images/categories/butter.png';
    if (name.includes('cheese')) return '/images/categories/cheese.png';
    if (name.includes('yogurt')) return '/images/categories/yogurt.png';
    
    return '/images/products/milk/cow_milk.png'; // absolute default fallback
};

const CategoryDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    
    // Dynamic State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [toast, setToast] = useState(null);
    const [showSub, setShowSub] = useState(false);
    const [subProduct, setSubProduct] = useState(null);
    const [query, setQuery] = useState('');
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both products and categories to map names to IDs
                const [prodRes, catRes] = await Promise.all([
                    api.get('/product/product/'),
                    api.get('/category/category/')
                ]);
                setProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Could not load category details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addToCart = (item) => {
        const existing = JSON.parse(localStorage.getItem('cart') || '[]');
        const idx = existing.findIndex(i => i.id === item.name);
        if (idx !== -1) existing[idx].quantity += 1;
        else existing.push({ id: item.name, name: item.name, price: item.price, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(existing));
        setToast(`${item.name} added to cart`);
        setTimeout(()=>setToast(null), 1500);
    };

    const openSubscribe = (item) => {
        setSubProduct(item);
        setShowSub(true);
    };

    const onSaved = (sub) => {
        setToast('Subscription saved');
        setTimeout(()=>setToast(null), 1500);
    };

    const visibleItems = useMemo(() => {
        // Find the category ID matching the URL name
        const currentCategory = categories.find(c => c.name === name);
        if (!currentCategory) return [];

        // Filter products belonging to this category
        let filtered = products.filter(p => p.category === currentCategory.id);
        
        // Apply search query
        filtered = filtered.filter(i =>
            i.name.toLowerCase().includes(query.trim().toLowerCase())
        );
        
        // Apply sorting
        return filtered.sort((a,b) => sortAsc ? a.price - b.price : b.price - a.price);
    }, [products, categories, name, query, sortAsc]);

    if (loading) return <div className="text-center mt-5">Loading products...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <div className="mt-4">
            <div
                className="mb-4 p-4 p-md-5 shadow-sm"
                style={{
                    borderRadius: 12,
                    background:
                        'linear-gradient(135deg, rgba(224,247,250,0.9) 0%, rgba(200,230,201,0.6) 60%, rgba(255,255,255,0.85) 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" style={{ position: 'relative', zIndex: 2 }}>
                    <div>
                        <h2 style={{ color: '#004d40', fontWeight: 900, margin: 0 }}>
                            <span style={{ marginRight: 8 }}>{CATEGORY_EMOJI[name] || '🧀'}</span>
                            {name}
                        </h2>
                        <div className="text-muted mt-1">{visibleItems.length} items in this category</div>
                    </div>
                    <div className="d-flex gap-2" style={{ width: '100%', maxWidth: 520 }}>
                        <input
                            value={query}
                            onChange={(e)=>setQuery(e.target.value)}
                            className="form-control form-control-lg"
                            placeholder="Search products..."
                            aria-label="Search products"
                            style={{ borderRadius: 12 }}
                        />
                        <button
                            className="btn btn-lg btn-outline-success"
                            onClick={()=>setSortAsc(s => !s)}
                            title="Toggle sort by price"
                            style={{ borderRadius: 12, whiteSpace: 'nowrap' }}
                        >
                            Price {sortAsc ? '↑' : '↓'}
                        </button>
                        <button className="btn btn-lg btn-outline-secondary" onClick={() => navigate('/categories')} style={{ borderRadius: 12 }}>
                            Back
                        </button>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        right: -10,
                        bottom: -10,
                        width: 220,
                        height: 220,
                        backgroundImage: 'url(/images/hero/hero.png)',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.25,
                        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))',
                    }}
                />
            </div>

            <div className="row">
                {visibleItems.map((item, idx) => (
                    <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={idx}>
                        <div
                            className="card h-100 shadow-sm product-card"
                            style={{
                                border: 'none',
                                borderRadius: 18,
                                overflow: 'hidden',
                                animation: 'rise 420ms ease forwards',
                                animationDelay: `${idx * 60}ms`,
                            }}
                        >
                            <div className="position-relative" style={{ height: 230, overflow: 'hidden', padding: '10px', background: '#f8f9fa' }}>
                                <img
                                    src={getProductImage(item.name, item.image)}
                                    alt={item.name}
                                    onError={(e)=>{ e.currentTarget.src='/images/products/milk/cow_milk.png'; }}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                                    className="product-image"
                                />
                                <span className="badge bg-success shadow-sm"
                                      style={{ position: 'absolute', top: 12, left: 12, borderRadius: 20 }}>
                                    ₹{item.price}
                                </span>
                                <div className="product-overlay d-flex align-items-center justify-content-center gap-2">
                                    <button className="btn btn-light shadow-sm" onClick={() => addToCart(item)} style={{ borderRadius: 12 }}>
                                        Add to Cart
                                    </button>
                                    <button className="btn btn-outline-light" onClick={() => openSubscribe(item)} style={{ borderRadius: 12 }}>
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between"
                                 style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f9fff7 100%)' }}>
                                <h6 className="card-title text-center" style={{ fontWeight: 800, color: '#0f5132' }}>
                                    {item.name}
                                </h6>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <small className="text-muted">Fresh & quality assured</small>
                                    <div>
                                        <button className="btn btn-sm btn-success me-2" onClick={() => addToCart(item)}>Add</button>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => openSubscribe(item)}>Subscribe</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {toast && <div style={{position:'fixed', right:20, top:90, zIndex:2000}}><div className="alert alert-success shadow-sm">{toast}</div></div>}

            <SubscribeModal show={showSub} onClose={()=>setShowSub(false)} product={subProduct} onSaved={onSaved} />

            <style>{`
                .product-card .product-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05));
                    opacity: 0;
                    transition: opacity 220ms ease;
                }
                .product-card:hover .product-overlay {
                    opacity: 1;
                }
                .product-image {
                    transform: scale(1);
                    transition: transform 300ms ease;
                }
                .product-card:hover .product-image {
                    transform: scale(1.06);
                }
                @keyframes rise {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default CategoryDetail;
