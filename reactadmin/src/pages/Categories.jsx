import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// thumbnails for categories — place PNG files under public/images/categories/
const CATEGORY_IMAGES = {
    Milk: '/images/categories/milk.png',
    Butter: '/images/categories/butter.png',
    Cheese: '/images/categories/cheese.png',
    Yogurt: '/images/categories/yogurt.png',
    'Flavoured Milk': '/images/categories/flavoured_milk.png',
};

const CATEGORY_EMOJI = {
    Milk: '🥛',
    Butter: '🧈',
    Cheese: '🧀',
    Yogurt: '🍶',
    'Flavoured Milk': '🍫',
};

const Categories = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [query, setQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/category/category/');
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Could not load categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (catName) => {
        navigate(`/categories/${encodeURIComponent(catName)}`);
    };

    const filtered = useMemo(
        () =>
            categories.filter((cat) =>
                cat.name.toLowerCase().includes(query.trim().toLowerCase())
            ),
        [categories, query]
    );

    if (loading) return <div className="text-center mt-5">Loading categories...</div>;
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
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="d-flex align-items-center justify-content-between flex-column flex-md-row gap-3">
                        <div>
                            <h2 style={{ margin: 0, fontWeight: 900, color: '#004d40' }}>
                                Shop by Category
                            </h2>
                            <div className="text-muted mt-1">
                                {categories.length} categories • fresh and curated
                            </div>
                        </div>
                        <div style={{ minWidth: 280, maxWidth: 420, width: '100%' }}>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Search categories..."
                                aria-label="Search categories"
                                style={{ borderRadius: 12 }}
                            />
                        </div>
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

            <div className="row mt-3">
                {filtered.map((cat, idx) => {
                    const catName = cat.name;
                    return (
                    <div className="col-sm-6 col-md-4 col-lg-3 mb-3" key={cat.id || catName}>
                        <div
                            className="card h-100 shadow-sm hover-effect category-card"
                            style={{
                                cursor: 'pointer',
                                borderRadius: '18px',
                                overflow: 'hidden',
                                border: 'none',
                                animation: 'rise 420ms ease forwards',
                                animationDelay: `${idx * 70}ms`,
                            }}
                            onClick={() => handleCategoryClick(catName)}
                        >
                            <div className="position-relative" style={{ height: 220, overflow: 'hidden' }}>
                                <img
                                    className="category-image"
                                    src={CATEGORY_IMAGES[catName]}
                                    alt={catName}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    onError={(e) => { e.currentTarget.src = '/images/products/milk/cow_milk.png'; }}
                                />
                                <div className="category-emoji badge bg-light text-dark shadow-sm"
                                     style={{ position: 'absolute', top: 12, left: 12, borderRadius: 20, fontSize: 14 }}>
                                    <span style={{ fontSize: 18, marginRight: 6 }}>{CATEGORY_EMOJI[catName] || '🧀'}</span>{catName.split(' ')[0]}
                                </div>
                                <div className="category-overlay d-flex align-items-center justify-content-center">
                                    <span className="badge bg-light text-dark px-3 py-2 shadow-sm" style={{ borderRadius: 20 }}>
                                        View products →
                                    </span>
                                </div>
                            </div>
                            <div className="card-body d-flex flex-column align-items-center justify-content-center"
                                style={{
                                    height: '96px',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,1), rgba(250,255,245,0.92))'
                                }}>
                                <h5 className="card-title text-center"
                                    style={{ fontWeight: 900, color: '#0f5132', margin: 0 }}>{catName}</h5>
                                <div className="text-muted small mt-1">
                                    {cat.description || "Fresh produce"}
                                </div>
                            </div>
                        </div>
                    </div>
                )})}
            </div>

            {/* clicking a category navigates to its detail page */}
            <style>{`
                .hover-effect {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .hover-effect:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
                }
                .category-card .category-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0.05));
                    opacity: 0;
                    transition: opacity 220ms ease;
                }
                .category-card:hover .category-overlay {
                    opacity: 1;
                }
                .category-image {
                    transform: scale(1);
                    transition: transform 300ms ease;
                }
                .category-card:hover .category-image {
                    transform: scale(1.06);
                }
                @keyframes rise {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            {/* toast */}
            {toast && (
                <div style={{ position: 'fixed', right: 20, top: 90, zIndex: 2000 }}>
                    <div className="alert alert-success shadow-sm" role="alert" style={{ borderRadius: 8 }}>
                        {toast}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
