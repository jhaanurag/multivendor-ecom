import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductManager from './ProductManager';

const VendorDashboard = ({ user }) => {
    const [analytics, setAnalytics] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

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

    if (!user || user.role !== 'vendor') return <div>Access Denied</div>;
    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h2>Vendor Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', margin: '20px 0' }}>
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <small>Total Products</small>
                    <h3>{analytics?.totalProducts || 0}</h3>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <small>Total Orders</small>
                    <h3>{analytics?.totalOrders || 0}</h3>
                </div>
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <small>Items Sold</small>
                    <h3>{analytics?.totalItemsSold || 0}</h3>
                </div>
            </div>

            <section style={{ marginTop: '40px' }}>
                <h3>Recent Orders</h3>
                {orders.length === 0 ? (
                    <p>No orders yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Date</th>
                                <th style={{ padding: '10px' }}>Product</th>
                                <th style={{ padding: '10px' }}>Qty</th>
                                <th style={{ padding: '10px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px' }}>{order.products.map(p => p.product.name).join(', ')}</td>
                                    <td style={{ padding: '10px' }}>{order.products.reduce((acc, p) => acc + p.quantity, 0)}</td>
                                    <td style={{ padding: '10px' }}>{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <ProductManager user={user} refreshAnalytics={fetchData} />
        </div>
    );
};

export default VendorDashboard;
