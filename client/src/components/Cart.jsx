import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const Cart = ({ user }) => {
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, title: '', message: '' });

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchCart();
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchCart = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const res = await axios.get('http://localhost:5000/api/cart', config);
            setCart(res.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setIsLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            await axios.delete(`http://localhost:5000/api/cart/${productId}`, config);
            fetchCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const clearCart = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            await axios.delete('http://localhost:5000/api/cart', config);
            setCart({ items: [] });
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const handleCheckout = async () => {
        if (!localStorage.getItem('token')) {
            setAlert({ show: true, title: 'Auth Required', message: 'Please login to checkout.' });
            return;
        }

        if (!cart || cart.items.length === 0) return;

        setIsLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

            // Simplified: Use first address if available or prompt for one
            // For now, use a dummy address since UI is minimal
            const shippingAddress = {
                street: '123 Test St',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345',
                country: 'Test Country'
            };

            const products = cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }));

            await axios.post('http://localhost:5000/api/orders', { products, shippingAddress }, config);
            await clearCart();

            setAlert({
                show: true,
                title: 'Order Placed!',
                message: 'Your order has been successfully placed.'
            });
        } catch (error) {
            setAlert({
                show: true,
                title: 'Error',
                message: error.response?.data?.message || 'Failed to place order.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return (
        <div className="container" style={{ paddingTop: '12rem' }}>
            <p className="tracking-wider uppercase text-sm">Synchronizing your selection...</p>
        </div>
    );

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '12rem', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '2rem' }}>Empty.</h1>
                <p style={{ marginBottom: '4rem' }}>Your shopping bag is waiting for its first item.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="hero-btn"
                    style={{ border: '1px solid var(--fg)' }}
                >
                    <span className="hero-btn-text">Browse Collection</span>
                </button>
            </div>
        );
    }

    const total = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    return (
        <div className="container" style={{ paddingTop: '10rem', paddingBottom: '10rem' }}>
            <div className="section-header" style={{ marginBottom: '6rem' }}>
                <p className="section-label">Your Selection</p>
                <h1 style={{ margin: 0 }}>Shopping Bag</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '6rem', alignItems: 'start' }}>
                {/* Cart Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {cart.items.map(item => (
                        <div key={item.product._id} style={{ display: 'flex', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ width: '120px', height: '150px', background: 'var(--accent)', overflow: 'hidden' }}>
                                {item.product.images?.[0] ? (
                                    <img
                                        src={`http://localhost:5000${item.product.images[0]}`}
                                        alt={item.product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🛍️</div>
                                )}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{item.product.name}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                                        Vendor: {item.product.shop?.name || 'Independent'}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Quantity: {item.quantity}</p>
                                        <p style={{ margin: '0.5rem 0 0', fontWeight: 700 }}>${item.product.price}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product._id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--error)',
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer', marginTop: '1rem' }}
                    >
                        Clear Shopping Bag
                    </button>
                </div>

                {/* Summary Sidebar */}
                <div style={{ border: '1px solid var(--fg)', padding: '2.5rem', position: 'sticky', top: '8rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', marginTop: 0 }}>Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span>Shipping</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Calculated at next step</span>
                    </div>
                    <div style={{ margin: '2rem 0', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.25rem' }}>
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="hero-btn"
                        style={{ width: '100%', background: 'var(--fg)', color: 'var(--bg)' }}
                    >
                        <span className="hero-btn-text">Proceed to Checkout</span>
                    </button>
                </div>
            </div>

            <Modal
                isOpen={alert.show}
                title={alert.title}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
            />
        </div>
    );
};

export default Cart;
