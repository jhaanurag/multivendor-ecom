/**
 * Products Page
 * Product listing with search, filters, and grid layout
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const { showToast } = useToast();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');

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
        showToast(`Added ${product.name} to cart`);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Main Content Area */}
            <div style={{
                flex: 1,
                paddingTop: '0', // Keep top padding 0 to pull up
            }}>
                <div style={{
                    maxWidth: '1260px',
                    margin: '0 auto',
                    padding: '0 var(--space-lg)', // Moved padding here to match Navigation alignment
                    width: '100%',
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '3.6rem', padding: 'var(--space-lg) 0' }}>
                        <h1 style={{
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            margin: 0,
                            lineHeight: 1,
                            textTransform: 'uppercase',
                            color: 'var(--fg)',
                        }}>
                            Products
                        </h1>
                        <p style={{
                            fontSize: '1.2rem',
                            color: 'var(--muted)',
                            marginTop: '1rem',
                            maxWidth: '600px',
                            lineHeight: 1.5,
                        }}>
                            Discover products from the world's most innovative brands.
                        </p>
                    </div>

                    {/* Search & Filters Bar */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.9rem',
                        marginBottom: '2.7rem',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        {/* Search */}
                        <form onSubmit={handleSearch} style={{ flex: '1 1 270px', maxWidth: '360px' }}>
                            <div style={{ display: 'flex' }}>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products..."
                                    style={{
                                        flex: 1,
                                        padding: '0.81rem 0.9rem',
                                        border: '1px solid var(--border)',
                                        borderRight: 'none',
                                        background: 'transparent',
                                        color: 'var(--fg)',
                                        fontSize: '0.855rem',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.81rem 1.35rem',
                                        background: 'var(--fg)',
                                        color: 'var(--bg)',
                                        border: 'none',
                                        fontSize: '0.765rem',
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
                                padding: '0.81rem 0.9rem',
                                border: '1px solid var(--border)',
                                background: '#1a1a1a',
                                color: '#ffffff',
                                fontSize: '0.81rem',
                                cursor: 'pointer',
                                minWidth: '162px',
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
                        gap: '0.675rem',
                        marginBottom: '2.7rem',
                    }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                style={{
                                    padding: '0.54rem 1.08rem',
                                    background: category === cat ? 'var(--fg)' : 'transparent',
                                    color: category === cat ? 'var(--bg)' : 'var(--fg)',
                                    border: '1px solid var(--fg)',
                                    fontSize: '0.72rem',
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
                        marginBottom: '1.8rem',
                        color: 'var(--muted)',
                        fontSize: '0.81rem',
                    }}>
                        {products.length} product{products.length !== 1 ? 's' : ''} found
                    </p>

                    {/* Loading State */}
                    {loading && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '270px',
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
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
                            padding: '3.6rem',
                            color: 'var(--muted)',
                        }}>
                            <p style={{ marginBottom: '0.9rem' }}>{error}</p>
                            <button
                                onClick={fetchProducts}
                                style={{
                                    padding: '0.675rem 1.35rem',
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
                            padding: '5.4rem 1.8rem',
                            color: 'var(--muted)',
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.35rem',
                                marginBottom: '0.9rem',
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
                            gridTemplateColumns: 'repeat(auto-fill, minmax(227px, 1fr))',
                            gap: '1.8rem',
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
            </div>

            <Footer />

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ProductsPage;
