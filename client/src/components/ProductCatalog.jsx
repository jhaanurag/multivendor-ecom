import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductCatalog = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item._id === product._id);
        if (existingItem) {
            setCart(cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Product Catalog</h2>

            {loading ? (
                <div className="card">
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Loading products...</p>
                    <div className="loading-indicator"></div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {products.length === 0 ? (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                            <p style={{ color: 'var(--muted)' }}>No products available at the moment.</p>
                        </div>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ flex: '1' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {product.shop?.name || 'Generic'}
                                    </span>
                                    <h4 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{product.name}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {product.description}
                                    </p>
                                </div>

                                <div style={{ marginTop: '1.5rem' }}>
                                    <div className="hr" style={{ margin: '1rem 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.25rem' }}>${product.price}</div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock <= 0}
                                        >
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        marginTop: '0.75rem',
                                        color: product.stock < 5 ? 'var(--error)' : 'var(--muted)',
                                        fontWeight: 600
                                    }}>
                                        {product.stock} units left
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
