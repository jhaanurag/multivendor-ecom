import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ProductManager from './ProductManager';
import gsap from 'gsap';

const VendorDashboard = ({ user }) => {
    const [analytics, setAnalytics] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Refs for animation
    const containerRef = useRef(null);
    const statsRef = useRef([]);
    const tableRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    // Animation Effect
    useEffect(() => {
        if (!loading && analytics) {
            const ctx = gsap.context(() => {
                // Animate Stats
                gsap.fromTo(statsRef.current, 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }
                );

                // Animate Table
                gsap.fromTo(tableRef.current,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.3 }
                );

            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, analytics]);

    const fetchData = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const [analyticsRes, ordersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/analytics/vendor', config),
                axios.get('http://localhost:5000/api/orders/vendor', config)
            ]);
            setAnalytics(analyticsRes.data.data);
            setOrders(ordersRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (!user || user.role !== 'vendor') return (
        <div style={{ paddingTop: '80px', textAlign: 'center', color: 'var(--fg)' }}>
            Access Denied
        </div>
    );
    
    if (loading) return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: 'var(--bg)',
            color: 'var(--fg)'
        }}>
           Loading Dashboard...
        </div>
    );

    return (
        <div ref={containerRef} style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '100px 20px 40px', // Added top padding for fixed nav
            color: 'var(--fg)',
            minHeight: '100vh',
            background: 'var(--bg)'
        }}>
            
            <header style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    marginBottom: '0.5rem' 
                }}>
                    Welcome back, {user.name}
                </h2>
                <p style={{ color: 'var(--muted)' }}>Here's what's happening with your store today.</p>
            </header>

            {/* Stats Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px', 
                marginBottom: '60px' 
            }}>
                {[
                    { label: 'Total Products', value: analytics?.totalProducts || 0, icon: '📦' },
                    { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: '🛍️' },
                    { label: 'Items Sold', value: analytics?.totalItemsSold || 0, icon: '📈' }
                ].map((stat, i) => (
                    <div 
                        key={i} 
                        ref={el => statsRef.current[i] = el}
                        style={{ 
                            background: 'var(--bg)', 
                            border: '1px solid var(--border)', 
                            padding: '30px', 
                            borderRadius: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            transition: 'transform 0.3s ease, border-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--fg)';
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                        <small style={{ 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.1em', 
                            color: 'var(--muted)',
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}>
                            {stat.label}
                        </small>
                        <h3 style={{ 
                            fontSize: '2.5rem', 
                            fontFamily: 'var(--font-display)',
                            margin: 0,
                            lineHeight: 1
                        }}>
                            {stat.value}
                        </h3>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gap: '60px', gridTemplateColumns: '1fr' }}> {/* Stacked layout */}
                
                {/* Recent Orders Section */}
                <section ref={tableRef}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Recent Orders</h3>
                    </div>

                    {orders.length === 0 ? (
                        <div style={{ 
                            padding: '40px', 
                            border: '1px dashed var(--border)', 
                            textAlign: 'center', 
                            color: 'var(--muted)',
                            borderRadius: '4px'
                        }}>
                            <p>No orders yet.</p>
                        </div>
                    ) : (
                        <div style={{ 
                            overflowX: 'auto', 
                            border: '1px solid var(--border)', 
                            borderRadius: '4px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                                    <tr>
                                        {['Date', 'Product', 'Qty', 'Status'].map(head => (
                                            <th key={head} style={{ 
                                                padding: '20px', 
                                                textAlign: 'left', 
                                                fontWeight: 600, 
                                                color: 'var(--muted)',
                                                textTransform: 'uppercase',
                                                fontSize: '0.75rem',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, i) => (
                                        <tr key={i} style={{ 
                                            borderBottom: '1px solid var(--border)',
                                            background: 'var(--bg)',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-alt)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                                        >
                                            <td style={{ padding: '20px', color: 'var(--muted)' }}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '20px', fontWeight: 500, color: 'var(--fg)' }}>
                                                {order.products.map(p => p.product.name).join(', ')}
                                            </td>
                                            <td style={{ padding: '20px', color: 'var(--fg)' }}>
                                                {order.products.reduce((acc, p) => acc + p.quantity, 0)}
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '50px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    backgroundColor: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: order.status === 'Delivered' ? 'var(--success)' : 'var(--warning)',
                                                    border: `1px solid ${order.status === 'Delivered' ? 'var(--success)' : 'var(--warning)'}`
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Product Manager */}
                <ProductManager user={user} refreshAnalytics={fetchData} />
            </div>
        </div>
    );
};

export default VendorDashboard;
