/**
 * Products Page
 * Product listing with search, filters, and grid layout
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
    const [notification, setNotification] = useState(null);

    const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty'];

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            const searchQuery = searchParams.get('search');
            const categoryQuery = searchParams.get('category');
            const sortQuery = searchParams.get('sort');

            if (searchQuery) params.search = searchQuery;
            if (categoryQuery) params.category = categoryQuery;
            if (sortQuery) params.sort = sortQuery;

            const response = await productsAPI.getAll(params);
            setProducts(response.data.data || []);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        if (search) {
            newParams.set('search', search);
        } else {
            newParams.delete('search');
        }
        setSearchParams(newParams);
    };

    const handleCategoryChange = (cat) => {
        const newParams = new URLSearchParams(searchParams);
        if (cat === category) {
            newParams.delete('category');
            setCategory('');
        } else {
            newParams.set('category', cat);
            setCategory(cat);
        }
        setSearchParams(newParams);
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSort(newSort);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', newSort);
        setSearchParams(newParams);
    };

    const handleAddToCart = (product) => {
        setNotification(`Added ${product.name} to cart`);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: 'var(--space-lg)',
            paddingTop: '108px',
            background: 'var(--bg)',
        }}>
            <div style={{ maxWidth: '1260px', margin: '0 auto' }}>

                {/* Notification Toast */}
                {notification && (
                    <div style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        padding: '1rem 1.5rem',
                        background: 'var(--fg)',
                        color: 'var(--bg)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        zIndex: 1000,
                        animation: 'slideIn 0.3s ease',
                    }}>
                        {notification}
                    </div>
                )}

                {/* Header */}
                <div style={{ marginBottom: '4rem' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        marginBottom: '1rem',
                        color: 'var(--fg)',
                    }}>
                        Products
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
                        Discover products from the world's most innovative vendors.
                    </p>
                </div>

                {/* Search & Filters Bar */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '3rem',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    {/* Search */}
                    <form onSubmit={handleSearch} style={{ flex: '1 1 300px', maxWidth: '400px' }}>
                        <div style={{ display: 'flex' }}>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                style={{
                                    flex: 1,
                                    padding: '0.9rem 1rem',
                                    border: '1px solid var(--border)',
                                    borderRight: 'none',
                                    background: 'transparent',
                                    color: 'var(--fg)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '0.9rem 1.5rem',
                                    background: 'var(--fg)',
                                    color: 'var(--bg)',
                                    border: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Sort Dropdown */}
                    <select
                        value={sort}
                        onChange={handleSortChange}
                        style={{
                            padding: '0.9rem 1rem',
                            border: '1px solid var(--border)',
                            background: '#1a1a1a',
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            minWidth: '180px',
                        }}
                    >
                        <option value="-createdAt" style={{ background: '#1a1a1a', color: '#fff' }}>Newest First</option>
                        <option value="createdAt" style={{ background: '#1a1a1a', color: '#fff' }}>Oldest First</option>
                        <option value="price" style={{ background: '#1a1a1a', color: '#fff' }}>Price: Low to High</option>
                        <option value="-price" style={{ background: '#1a1a1a', color: '#fff' }}>Price: High to Low</option>
                        <option value="-averageRating" style={{ background: '#1a1a1a', color: '#fff' }}>Top Rated</option>
                    </select>
                </div>

                {/* Category Pills */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '3rem',
                }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                background: category === cat ? 'var(--fg)' : 'transparent',
                                color: category === cat ? 'var(--bg)' : 'var(--fg)',
                                border: '1px solid var(--fg)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <p style={{
                    marginBottom: '2rem',
                    color: 'var(--muted)',
                    fontSize: '0.9rem',
                }}>
                    {products.length} product{products.length !== 1 ? 's' : ''} found
                </p>

                {/* Loading State */}
                {loading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '300px',
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '2px solid var(--border)',
                            borderTopColor: 'var(--fg)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }} />
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: 'var(--muted)',
                    }}>
                        <p style={{ marginBottom: '1rem' }}>{error}</p>
                        <button
                            onClick={fetchProducts}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'var(--fg)',
                                color: 'var(--bg)',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '6rem 2rem',
                        color: 'var(--muted)',
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.5rem',
                            marginBottom: '1rem',
                            color: 'var(--fg)',
                        }}>
                            No products found
                        </h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}

                {/* Product Grid */}
                {!loading && !error && products.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(252px, 1fr))',
                        gap: '2rem',
                    }}>
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default ProductsPage;
