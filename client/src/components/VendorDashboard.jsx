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
        <div ref={containerRef} className="container" style={{
            paddingTop: '10rem',
            paddingBottom: '10rem',
            color: 'var(--fg)',
            minHeight: '100vh',
            background: 'var(--bg)'
        }}>

            <header style={{ marginBottom: '6rem', maxWidth: '800px' }}>
                <p className="section-label">Command Center</p>
                <h1 style={{
                    fontSize: 'clamp(3rem, 6vw, 5rem)',
                    marginBottom: '1rem',
                    lineHeight: 1
                }}>
                    Partner Portal.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--muted)' }}>
                    Welcome back, {user.name}. Your empire expanded by {analytics?.totalOrders || 0} transactions this cycle.
                </p>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '8rem'
            }}>
                {[
                    { label: 'Inventory Units', value: analytics?.totalProducts || 0, icon: '📦' },
                    { label: 'Fulfillment Count', value: analytics?.totalOrders || 0, icon: '🛍️' },
                    { label: 'Revenue Units', value: analytics?.totalItemsSold || 0, icon: '📈' }
                ].map((stat, i) => (
                    <div
                        key={i}
                        ref={el => statsRef.current[i] = el}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            padding: '3rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--fg)';
                            e.currentTarget.style.background = 'var(--bg-alt)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <div style={{ fontSize: '1.5rem', opacity: 0.5 }}>{stat.icon}</div>
                        <div>
                            <p style={{
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                color: 'var(--muted)',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                margin: '0 0 0.5rem 0'
                            }}>
                                {stat.label}
                            </p>
                            <h3 style={{
                                fontSize: '4rem',
                                fontFamily: 'var(--font-display)',
                                margin: 0,
                                lineHeight: 1,
                                letterSpacing: '-0.04em'
                            }}>
                                {stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gap: '10rem', gridTemplateColumns: '1fr' }}>

                {/* Recent Orders Section */}
                <section ref={tableRef}>
                    <div className="section-header" style={{ marginBottom: '3rem' }}>
                        <p className="section-label">Logistics</p>
                        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Recent Activity</h2>
                    </div>

                    {orders.length === 0 ? (
                        <div style={{
                            padding: '6rem',
                            border: '1px dashed var(--border)',
                            textAlign: 'center'
                        }}>
                            <p className="text-muted">No transaction logs available yet.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ borderBottom: '2px solid var(--fg)' }}>
                                    <tr>
                                        {['Timestamp', 'Manifest', 'Volume', 'Status'].map(head => (
                                            <th key={head} style={{
                                                padding: '1.5rem 1rem',
                                                textAlign: 'left',
                                                fontWeight: 700,
                                                color: 'var(--fg)',
                                                textTransform: 'uppercase',
                                                fontSize: '0.7rem',
                                                letterSpacing: '0.15em'
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
                                            transition: 'background-color 0.2s'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-alt)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={{ padding: '2rem 1rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '2rem 1rem', fontWeight: 600 }}>
                                                {order.products.map(p => p.product.name).join(', ')}
                                            </td>
                                            <td style={{ padding: '2rem 1rem' }}>
                                                {order.products.reduce((acc, p) => acc + p.quantity, 0)} items
                                            </td>
                                            <td style={{ padding: '2rem 1rem' }}>
                                                <span style={{
                                                    padding: '0.4rem 0.8rem',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    backgroundColor: order.status === 'Delivered' ? 'var(--fg)' : 'transparent',
                                                    color: order.status === 'Delivered' ? 'var(--bg)' : 'var(--fg)',
                                                    border: '1px solid var(--fg)'
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

                {/* Product Manager Component Integration */}
                <ProductManager user={user} refreshAnalytics={fetchData} />
            </div>
        </div>
    );
};

export default VendorDashboard;
