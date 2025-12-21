import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!user || !user.token) return;
                const res = await axios.get('http://localhost:5000/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrders(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (!user) return <div className="centered-box"><div className="card"><h3>Access Denied</h3><p>Please log in to view your order history.</p></div></div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Order History</h2>

            {loading ? (
                <div className="card">
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Retrieving your orders...</p>
                    <div className="loading-indicator"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <p style={{ color: 'var(--muted)' }}>No orders found for your account.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {orders.map(order => (
                        <div key={order._id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Order ID</div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order._id}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Date</div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="table-container" style={{ marginBottom: '1.5rem' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th style={{ textAlign: 'right' }}>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.products.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.product?.name || 'Unknown Item'}</td>
                                                <td>{item.quantity}</td>
                                                <td style={{ textAlign: 'right' }}>${item.product?.price?.toFixed(2) || '0.00'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Amount</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>${order.totalAmount.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
