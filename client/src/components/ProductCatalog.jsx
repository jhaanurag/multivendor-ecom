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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Product Catalog</h2>
                <input
                    type="text"
                    placeholder="Search by name or tags..."
                    value={search}
                    onChange={handleSearch}
                    style={{ padding: '8px', width: '300px' }}
                />
            </div>

            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {products.length === 0 ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No products found.</p>
                    ) : (
                        products.map(product => (
                            <div key={product._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                                {product.images && product.images[0] && (
                                    <img
                                        src={`http://localhost:5000${product.images[0]}`}
                                        alt={product.name}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                )}
                                <div style={{ marginTop: '10px' }}>
                                    <span style={{ fontSize: '12px', color: '#666' }}>{product.shop?.name}</span>
                                    <h3>{product.name}</h3>
                                    <p style={{ fontSize: '14px', color: '#444' }}>{product.description}</p>

                                    <div style={{ marginTop: '10px' }}>
                                        {product.tags.map(tag => (
                                            <span key={tag} style={{ background: '#eee', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', marginRight: '5px' }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                        <span style={{ fontWeight: 'bold' }}>${product.price}</span>
                                        <div>
                                            <button
                                                onClick={() => toggleWishlist(product._id)}
                                                style={{ marginRight: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                                            >
                                                {wishlist.some(w => (w._id || w) === product._id) ? '❤️' : '🤍'}
                                            </button>
                                            <button
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock <= 0}
                                                style={{ padding: '5px 10px' }}
                                            >
                                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '11px', marginTop: '5px', color: '#888' }}>
                                        Rating: {product.averageRating.toFixed(1)} ({product.numReviews} reviews)
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
