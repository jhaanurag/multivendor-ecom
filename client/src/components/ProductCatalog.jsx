import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductCatalog = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetchProducts();
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchProducts = async (searchTerm = '') => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products?search=${searchTerm}`);
            setProducts(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const res = await axios.get('http://localhost:5000/api/auth/profile', config);
            setWishlist(res.data.data.wishlist || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const addToCart = async (product) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            await axios.post('http://localhost:5000/api/cart', {
                productId: product._id,
                quantity: 1
            }, config);
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart. Are you logged in?');
        }
    };

    const toggleWishlist = async (productId) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const res = await axios.post(`http://localhost:5000/api/auth/wishlist/${productId}`, {}, config);
            setWishlist(res.data.data);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        fetchProducts(e.target.value);
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
            {/* Page Header */}
            <div className="section-header" style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <p className="section-label">Curated Collection</p>
                    <h1 style={{ margin: 0, fontSize: 'clamp(3rem, 6vw, 5rem)' }}>Catalog</h1>
                </div>
                <div style={{ minWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={handleSearch}
                        className="search-input"
                        style={{
                            border: 'none',
                            borderBottom: '1px solid var(--border)',
                            padding: '1rem 0',
                            fontSize: '1.25rem',
                            letterSpacing: '-0.02em',
                            background: 'transparent'
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="centered-box">
                    <p className="tracking-wider uppercase text-sm">Loading products...</p>
                </div>
            ) : (
                <div className="grid grid-4" style={{ gap: '2rem' }}>
                    {products.length === 0 ? (
                        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                            <p>No matches found for your search.</p>
                        </div>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="product-card">
                                {/* Wishlist Button - Top Right Floating */}
                                <button
                                    onClick={() => toggleWishlist(product._id)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        zIndex: 10,
                                        background: 'rgba(255,255,255,0.8)',
                                        backdropFilter: 'blur(4px)',
                                        border: 'none',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    {wishlist.some(w => (w._id || w) === product._id) ? '❤️' : '🤍'}
                                </button>

                                <div className="product-card__image-container">
                                    {product.images && product.images[0] ? (
                                        <img
                                            src={`http://localhost:5000${product.images[0]}`}
                                            alt={product.name}
                                            className="product-card__image"
                                        />
                                    ) : (
                                        <div className="product-card__image" style={{ background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ opacity: 0.2, fontSize: '3rem' }}>🛍️</span>
                                        </div>
                                    )}
                                </div>

                                <div className="product-card__content">
                                    <div className="product-card__brand">
                                        {product.shop?.name || 'Independent Vendor'}
                                    </div>
                                    <h3 className="product-card__name">
                                        {product.name}
                                    </h3>

                                    <div className="product-card__tags">
                                        {product.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="product-card__tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                                        <span className="product-card__price">${product.price}</span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock <= 0}
                                            className="btn--ghost"
                                            style={{
                                                border: '1px solid var(--fg)',
                                                padding: '0.6rem 1rem',
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
