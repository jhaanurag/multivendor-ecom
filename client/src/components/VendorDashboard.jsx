import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductManager from './ProductManager';

const VendorDashboard = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [hasShop, setHasShop] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkShopAndFetchOrders = async () => {
            try {
                if (!user || !user.token) return;

                // 1. Check if user has a shop
                const shopRes = await axios.get('http://localhost:5000/api/shops', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                const myShop = shopRes.data.data.find(s => s.owner === user._id);
                setHasShop(!!myShop);

                // 2. Fetch orders
                const orderRes = await axios.get('http://localhost:5000/api/orders/vendor', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrders(orderRes.data);
            } catch (error) {
                console.error(error);
                if (error.response?.status === 404) setHasShop(false);
            } finally {
                setIsChecking(false);
            }
        };
        checkShopAndFetchOrders();
    }, [user]);

    const initializeShop = async () => {
        setIsLoading(true);
        try {
            await axios.post('http://localhost:5000/api/shops', {
                name: `${user.name}'s Shop`,
                description: 'Initial shop setup.'
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setHasShop(true);
        } catch (error) {
            alert('Failed to initialize shop: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || user.role !== 'vendor') return <div className="centered-box"><h2>Access Denied</h2></div>;
    if (isChecking) return <div className="centered-box"><div className="card"><p>Loading dashboard...</p><div className="loading-indicator" style={{ marginTop: '1rem' }}></div></div></div>;

    if (!hasShop) {
        return (
            <div className="centered-box">
                <div className="card" style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
                    <h3>Shop Setup Required</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '2rem' }}>
                        You haven't set up your shop profile yet. Initialize your shop to start selling products.
                    </p>
                    <button onClick={initializeShop} disabled={isLoading} style={{ width: '100%' }}>
                        {isLoading ? 'Setting up...' : 'Initialize My Shop'}
                    </button>
                    {isLoading && <div className="loading-indicator" style={{ marginTop: '1rem' }}></div>}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Vendor Dashboard</h2>

            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Recent Sales</h3>
                {orders.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--muted)' }}>No transactions recorded yet.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Customer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((item, index) => (
                                    <tr key={index}>
                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                        <td>{item.product.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.customer ? item.customer.name : 'Guest'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <div className="hr"></div>

            <ProductManager user={user} />
        </div>
    );
};

export default VendorDashboard;
