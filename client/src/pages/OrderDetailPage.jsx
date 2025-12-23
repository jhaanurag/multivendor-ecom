/**
 * Order Detail Page
 * Detailed view of a specific order
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ordersAPI.getOrder(id);
                setOrder(response.data.data);
            } catch (err) {
                console.error('Failed to load order:', err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

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

    if (error || !order) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'var(--bg)',
                color: 'var(--fg)',
            }}>
                <h2>Order Not Found</h2>
                <Link to="/orders" style={{ color: 'var(--muted)', marginTop: '1rem' }}>
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            await ordersAPI.cancelOrder(order._id);
            // Refresh order
            const response = await ordersAPI.getOrder(id);
            setOrder(response.data.data);
            alert('Order cancelled successfully');
        } catch (err) {
            console.error('Failed to cancel order:', err);
            alert(err.response?.data?.error || 'Failed to cancel order');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: 'var(--space-lg)',
            paddingTop: '108px',
            background: 'var(--bg)',
            color: 'var(--fg)',
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <Link to="/orders" style={{
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    marginBottom: '2rem',
                    display: 'inline-block',
                }}>
                    ← Back to Orders
                </Link>

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '3rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 700,
                            letterSpacing: '-0.04em',
                            marginBottom: '0.5rem',
                        }}>
                            Order #{order._id.slice(-8).toUpperCase()}
                        </h1>
                        <p style={{ color: 'var(--muted)' }}>
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {order.status === 'pending' && (
                            <button 
                                onClick={handleCancelOrder}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'transparent',
                                    border: '1px solid #ef4444',
                                    color: '#ef4444',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '0.85rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#ef4444';
                                    e.target.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#ef4444';
                                }}
                            >
                                Cancel Order
                            </button>
                        )}
                        <span style={{
                            padding: '0.5rem 1rem',
                            background: getStatusColor(order.status),
                            color: '#fff',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '0.85rem',
                            borderRadius: '4px',
                        }}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Items Section */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        marginBottom: '1.5rem',
                    }}>
                        Items
                    </h2>
                    
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {order.subOrders?.map((subOrder) => (
                            <div key={subOrder._id} style={{
                                border: '1px solid var(--border)',
                                padding: '1.5rem',
                                background: 'var(--bg-alt)',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '1rem',
                                    paddingBottom: '0.5rem',
                                    borderBottom: '1px dashed var(--border)',
                                    fontSize: '0.9rem',
                                    color: 'var(--muted)',
                                }}>
                                    <span>Sold by: <strong>{subOrder.shop?.name || 'Shop'}</strong></span>
                                    <span style={{
                                        color: getStatusColor(subOrder.status),
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                    }}>
                                        {subOrder.status}
                                    </span>
                                </div>

                                {subOrder.items.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.5rem',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                             {/* If we had image URL in item, we'd show it here. 
                                                 Since subOrder items structure might vary, relying on name */}
                                            <span style={{ fontSize: '1rem' }}>{item.name}</span>
                                            <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>×{item.quantity}</span>
                                        </div>
                                        <span style={{ fontWeight: 500 }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div style={{
                     display: 'grid',
                     gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                     gap: '2rem',
                }}>
                    {/* Shipping Address */}
                    <div style={{
                        padding: '2rem',
                        border: '1px solid var(--border)',
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.2rem',
                            marginBottom: '1rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}>
                            Shipping Address
                        </h3>
                        <div style={{ lineHeight: 1.6, color: 'var(--muted)' }}>
                            <p style={{ color: 'var(--fg)', fontWeight: 600 }}>{order.user?.name}</p>
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                            <p>{order.shippingAddress?.country}</p>
                        </div>
                    </div>

                    {/* Order Total */}
                    <div style={{
                        padding: '2rem',
                        background: 'var(--bg-alt)',
                        border: '1px solid var(--border)',
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.2rem',
                            marginBottom: '1rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}>
                            Order Summary
                        </h3>
                        <div style={{
                             display: 'flex', 
                             justifyContent: 'space-between',
                             marginBottom: '0.5rem',
                             fontSize: '0.95rem',
                        }}>
                            <span style={{ color: 'var(--muted)' }}>Subtotal</span>
                            <span>${order.totalAmount?.toFixed(2)}</span>
                        </div>
                        <div style={{
                             display: 'flex', 
                             justifyContent: 'space-between',
                             marginBottom: '1rem',
                             fontSize: '0.95rem',
                        }}>
                            <span style={{ color: 'var(--muted)' }}>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div style={{
                            borderTop: '1px solid var(--border)',
                            paddingTop: '1rem',
                            marginTop: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: 700,
                            fontSize: '1.2rem',
                        }}>
                            <span>Total</span>
                            <span>${order.totalAmount?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
