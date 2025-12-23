/**
 * Vendor Orders Page
 * Order management for vendors - view sub-orders and update status
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';

const VendorOrders = () => {
    const { isVendor, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [filter, setFilter] = useState('all');
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!isVendor) {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, isVendor]);

    const fetchOrders = async () => {
        try {
            const response = await ordersAPI.getVendorOrders();
            setOrders(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            console.error('Failed to update status:', err);
            showNotification('Failed to update status', 'error');
        } finally {
            setUpdating(null);
            showNotification('Order status updated');
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return '#10b981';
            case 'shipped': return '#3b82f6';
            case 'processing': return '#8b5cf6';
            case 'cancelled': return '#ef4444';
            default: return '#f59e0b';
        }
    };

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
                        background: notification.type === 'error' ? '#ef4444' : 'var(--fg)',
                        color: 'var(--bg)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        zIndex: 2000,
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        animation: 'slideIn 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        {notification.type === 'error' ? '⚠️' : '✅'} {notification.message}
                    </div>
                )}

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <Link to="/vendor/dashboard" style={{
                        color: 'var(--muted)',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        display: 'block',
                        marginBottom: '0.5rem',
                    }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                    }}>
                        Orders
                    </h1>
                </div>

                {/* Filter Pills */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                }}>
                    {['all', ...statusOptions].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: filter === status ? 'var(--fg)' : 'transparent',
                                color: filter === status ? 'var(--bg)' : 'var(--fg)',
                                border: '1px solid var(--border)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                            }}
                        >
                            {status} {status !== 'all' && `(${orders.filter(o => o.status === status).length})`}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'var(--bg-alt)',
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.25rem',
                            marginBottom: '0.75rem',
                        }}>
                            No orders found
                        </h3>
                        <p style={{ color: 'var(--muted)' }}>
                            {filter === 'all'
                                ? 'Orders for your products will appear here.'
                                : `No ${filter} orders.`}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                style={{
                                    padding: '1.5rem',
                                    background: 'var(--bg-alt)',
                                    border: '1px solid var(--border)',
                                }}
                            >
                                {/* Order Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1.5rem',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                }}>
                                    <div>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--muted)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            marginBottom: '0.25rem',
                                        }}>
                                            Order
                                        </p>
                                        <p style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                        }}>
                                            #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--muted)',
                                            marginBottom: '0.25rem',
                                        }}>
                                            Customer
                                        </p>
                                        <p style={{ fontWeight: 500 }}>
                                            {order.parentOrder?.user?.name || 'Customer'}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                                            {order.parentOrder?.user?.email}
                                        </p>

                                        {/* Shipping Address */}
                                        {order.parentOrder?.shippingAddress && (
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)', maxWidth: '200px', lineHeight: 1.4 }}>
                                                <p style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: '0.1rem' }}>Shipping To:</p>
                                                <p>{order.parentOrder.shippingAddress.address}</p>
                                                <p>{order.parentOrder.shippingAddress.city}, {order.parentOrder.shippingAddress.postalCode}</p>
                                                <p>{order.parentOrder.shippingAddress.country}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div style={{
                                    marginBottom: '1.5rem',
                                    paddingBottom: '1.5rem',
                                    borderBottom: '1px solid var(--border)',
                                }}>
                                    {order.items?.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '0.5rem',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            <span>
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span style={{ fontWeight: 500 }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '1rem',
                                        paddingTop: '1rem',
                                        borderTop: '1px dashed var(--border)',
                                        fontWeight: 600,
                                    }}>
                                        <span>Total</span>
                                        <span>${order.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{
                                            padding: '0.35rem 0.75rem',
                                            background: getStatusColor(order.status),
                                            color: '#fff',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                        }}>
                                            {order.status}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Status Update Dropdown */}
                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                        <select
                                            value=""
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            disabled={updating === order._id}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                border: '1px solid var(--border)',
                                                background: '#1a1a1a',
                                                color: '#ffffff',
                                                fontSize: '0.85rem',
                                                cursor: updating === order._id ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            <option value="" disabled style={{ background: '#1a1a1a', color: '#fff' }}>Update status</option>
                                            {statusOptions
                                                .filter(s => s !== order.status)
                                                .map(status => (
                                                    <option key={status} value={status} style={{ background: '#1a1a1a', color: '#fff' }}>
                                                        Mark as {status}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorOrders;
