import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManager = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: ''
    });

    const API_URL = 'http://localhost:5000/api/products';
    const VENDOR_API_URL = 'http://localhost:5000/api/products/vendor';
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const res = await axios.get(VENDOR_API_URL, config);
            setProducts(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await axios.put(`${API_URL}/${editingProduct._id}`, formData, config);
            } else {
                await axios.post(API_URL, formData, config);
            }
            setFormData({ name: '', description: '', price: '', stock: '' });
            setEditingProduct(null);
            fetchMyProducts();
        } catch (error) {
            alert('Operation failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/${id}`, config);
                fetchMyProducts();
            } catch (error) {
                alert('Delete failed: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <div style={{ marginTop: '4rem' }}>
            <h3 style={{ marginBottom: '2rem' }}>Inventory Management</h3>

            <div className="card" style={{ maxWidth: '600px', marginBottom: '4rem' }}>
                <h4 style={{ marginBottom: '1.5rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Wireless Mouse" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            placeholder="Brief product description"
                            style={{ minHeight: '100px', resize: 'vertical' }}
                        />
                    </div>
                    <div className="flex-gap" style={{ marginBottom: '1.5rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="0.00" step="0.01" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Stock Level</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required placeholder="0" />
                        </div>
                    </div>
                    <div className="flex-gap">
                        <button type="submit" style={{ flex: 1 }}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
                        {editingProduct && (
                            <button
                                type="button"
                                onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '' }); }}
                                className="btn-ghost secondary"
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h4 style={{ marginBottom: '1.5rem' }}>Current Stock</h4>
            {loading ? (
                <div className="card"><div className="loading-indicator"></div></div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                                        No products in inventory.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id}>
                                        <td style={{ fontWeight: 500 }}>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{product.stock}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="btn-ghost"
                                                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="btn-ghost"
                                                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: 'var(--error)' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
