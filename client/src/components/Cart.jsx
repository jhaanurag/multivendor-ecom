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

    if (isLoading) return <p style={{ padding: '20px' }}>Loading cart...</p>;

    if (!cart || cart.items.length === 0) {
        return (
            <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
                <p>Your cart is empty.</p>
                <button onClick={() => window.location.href = '/'}>Go Shopping</button>
            </div>
        );
    }

    const total = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
            <h2>Shopping Cart</h2>
            <div style={{ marginTop: '20px' }}>
                {cart.items.map(item => (
                    <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <div>
                            <span style={{ fontWeight: 'bold' }}>{item.product.name}</span>
                            <div style={{ fontSize: '13px', color: '#666' }}>Qty: {item.quantity} x ${item.product.price}</div>
                        </div>
                        <div>
                            <span style={{ fontWeight: 'bold', marginRight: '20px' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.product._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '30px', borderTop: '2px solid #333', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total: ${total.toFixed(2)}</span>
                </div>
                <div>
                    <button onClick={clearCart} style={{ marginRight: '10px' }}>Clear Cart</button>
                    <button onClick={handleCheckout} style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>Checkout</button>
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
