/**
 * Product Detail Page
 * Single product view with add to cart, quantity selector, and reviews
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI, cartAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await productsAPI.getById(id);
            setProduct(response.data.data);
        } catch (err) {
            setError('Product not found');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
            return;
        }

        setAddingToCart(true);
        try {
            await cartAPI.addItem(product._id, quantity);
            setNotification('Added to cart!');
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            setNotification('Failed to add to cart');
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setAddingToCart(false);
        }
    };

    const imageUrl = product?.images?.[0]
        ? (product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`)
        : 'https://placehold.co/600x600/1a1a1a/666?text=No+Image';

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'var(--bg)',
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid var(--border)',
                    borderTopColor: 'var(--fg)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'var(--bg)',
                padding: 'var(--space-lg)',
            }}>
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    marginBottom: '1rem',
                }}>
                    {error}
                </h1>
                <Link to="/products" style={{
                    color: 'var(--fg)',
                    textDecoration: 'underline',
                }}>
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            padding: 'var(--space-lg)',
            paddingTop: '108px',
            background: 'var(--bg)',
        }}>
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
                }}>
                    {notification}
                </div>
            )}

            <div style={{ maxWidth: '1260px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <div style={{ marginBottom: '2rem' }}>
                    <Link to="/products" style={{
                        color: 'var(--muted)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                    }}>
                        ← Back to Products
                    </Link>
                </div>

                {/* Product Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '4rem',
                    alignItems: 'start',
                }}>
                    {/* Image */}
                    <div style={{
                        position: 'sticky',
                        top: '108px',
                    }}>
                        <div style={{
                            background: 'var(--bg-alt)',
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}>
                            <img
                                src={imageUrl}
                                alt={product?.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        {/* Shop */}
                        {product?.shop?.name && (
                            <p style={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: 'var(--muted)',
                                marginBottom: '1rem',
                            }}>
                                {product.shop.name}
                            </p>
                        )}

                        {/* Name */}
                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            letterSpacing: '-0.03em',
                            marginBottom: '1rem',
                            color: 'var(--fg)',
                            lineHeight: 1.1,
                        }}>
                            {product?.name}
                        </h1>

                        {/* Rating */}
                        {product?.averageRating > 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1.5rem',
                            }}>
                                <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>★</span>
                                <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>
                                    {product.averageRating.toFixed(1)} ({product.numReviews} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <p style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-display)',
                            marginBottom: '2rem',
                            color: 'var(--fg)',
                        }}>
                            ${product?.price?.toFixed(2)}
                        </p>

                        {/* Description */}
                        <div style={{
                            marginBottom: '2rem',
                            paddingBottom: '2rem',
                            borderBottom: '1px solid var(--border)',
                        }}>
                            <h3 style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--muted)',
                                marginBottom: '0.75rem',
                            }}>
                                Description
                            </h3>
                            <p style={{
                                fontSize: '1rem',
                                lineHeight: 1.7,
                                color: 'var(--fg)',
                            }}>
                                {product?.description || 'No description available.'}
                            </p>
                        </div>

                        {/* Stock */}
                        <div style={{ marginBottom: '2rem' }}>
                            {product?.stock > 0 ? (
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: product.stock <= 5 ? '#f59e0b' : 'var(--muted)',
                                }}>
                                    {product.stock <= 5 ? `Only ${product.stock} left in stock` : `${product.stock} in stock`}
                                </p>
                            ) : (
                                <p style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 600 }}>
                                    Out of Stock
                                </p>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        {product?.stock > 0 && (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                {/* Quantity Selector */}
                                <div style={{
                                    display: 'flex',
                                    border: '1px solid var(--border)',
                                }}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'transparent',
                                            border: 'none',
                                            fontSize: '1.2rem',
                                            cursor: 'pointer',
                                            color: 'var(--fg)',
                                        }}
                                    >
                                        −
                                    </button>
                                    <span style={{
                                        width: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        borderLeft: '1px solid var(--border)',
                                        borderRight: '1px solid var(--border)',
                                    }}>
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'transparent',
                                            border: 'none',
                                            fontSize: '1.2rem',
                                            cursor: 'pointer',
                                            color: 'var(--fg)',
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    style={{
                                        flex: 1,
                                        minWidth: '200px',
                                        padding: '1rem 2rem',
                                        background: 'var(--fg)',
                                        color: 'var(--bg)',
                                        border: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        cursor: addingToCart ? 'not-allowed' : 'pointer',
                                        opacity: addingToCart ? 0.7 : 1,
                                        transition: 'opacity 0.3s, transform 0.3s',
                                    }}
                                    onMouseEnter={(e) => !addingToCart && (e.target.style.transform = 'translateY(-2px)')}
                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        )}

                        {/* Tags */}
                        {product?.tags?.length > 0 && (
                            <div style={{ marginTop: '3rem' }}>
                                <h3 style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: 'var(--muted)',
                                    marginBottom: '0.75rem',
                                }}>
                                    Tags
                                </h3>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {product.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                background: 'var(--bg-alt)',
                                                fontSize: '0.8rem',
                                                color: 'var(--muted)',
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                {product?.reviews?.length > 0 && (
                    <div style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid var(--border)' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '2rem',
                            marginBottom: '2rem',
                        }}>
                            Reviews ({product.reviews.length})
                        </h2>
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {product.reviews.map((review, index) => (
                                <div key={index} style={{
                                    padding: '1.5rem',
                                    background: 'var(--bg-alt)',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.75rem',
                                    }}>
                                        <span style={{ fontWeight: 600 }}>{review.name}</span>
                                        <span style={{ color: '#fbbf24' }}>{'★'.repeat(review.rating)}</span>
                                    </div>
                                    <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
