import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const Cart = ({ user }) => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '' });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(cart.map(item => {
            if (item._id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleCheckout = async () => {
        if (!user || !user.token) {
            setAlert({
                show: true,
                title: 'Authentication Required',
                message: 'Please log in to complete your checkout.'
            });
            return;
        }

        if (cart.length === 0) return;

        setIsLoading(true);
        try {
            const products = cart.map(item => ({
                product: item._id,
                quantity: item.quantity
            }));

            await axios.post('http://localhost:5000/api/orders', { products }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            setCart([]);
            setAlert({
                show: true,
                title: 'Order Placed',
                message: 'Your order has been successfully placed. Check your email for confirmation.'
            });
        } catch (error) {
            setAlert({
                show: true,
                title: 'Order Error',
                message: error.response?.data?.message || 'Something went wrong during checkout.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Shopping Cart</h2>

            {cart.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Your cart is empty.</p>
                    <button onClick={() => window.location.href = '/'} className="secondary">
                        Browse Products
                    </button>
                </div>
            ) : (
                <div>
                    <div className="table-container" style={{ marginBottom: '2rem' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => (
                                    <tr key={item._id}>
                                        <td style={{ fontWeight: 500 }}>{item.name}</td>
                                        <td>${item.price}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <button
                                                    onClick={() => updateQuantity(item._id, -1)}
                                                    className="btn-ghost"
                                                    style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--border)' }}
                                                >
                                                    −
                                                </button>
                                                <span style={{ fontWeight: 600, minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                    className="btn-ghost"
                                                    style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--border)' }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="btn-ghost"
                                                style={{ fontSize: '0.75rem', color: 'var(--error)' }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 500, marginBottom: '0.25rem' }}>Estimated Total</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>${calculateTotal()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                style={{ padding: '0.75rem 2rem' }}
                            >
                                {isLoading ? 'Processing...' : 'Complete Purchase'}
                            </button>
                        </div>
                    </div>
                    {isLoading && <div className="loading-indicator" style={{ marginTop: '1rem' }}></div>}
                </div>
            )}

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
