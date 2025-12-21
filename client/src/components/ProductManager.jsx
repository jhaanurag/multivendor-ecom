import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManager = ({ user, refreshAnalytics }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        tags: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const res = await axios.get('http://localhost:5000/api/products/vendor', config);
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

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('tags', formData.tags);
        if (image) {
            data.append('image', image);
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            await axios.post('http://localhost:5000/api/products', data, config);
            setFormData({ name: '', description: '', price: '', stock: '', tags: '' });
            setImage(null);
            fetchProducts();
            refreshAnalytics();
            alert('Product added!');
        } catch (error) {
            alert('Error: ' + error.response?.data?.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            await axios.delete(`http://localhost:5000/api/products/${id}`, config);
            fetchProducts();
            refreshAnalytics();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div style={{ marginTop: '40px' }}>
            <h3>Manage Products</h3>

            <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
                <h4>Add New Product</h4>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                    <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
                    <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInputChange} required />
                    <input name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleInputChange} />
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    <button type="submit" style={{ padding: '10px', background: '#333', color: '#fff', border: 'none' }}>Add Product</button>
                </form>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h4>Your Products</h4>
                {loading ? <p>Loading...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>Price</th>
                                <th style={{ padding: '10px' }}>Stock</th>
                                <th style={{ padding: '10px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{p.name}</td>
                                    <td style={{ padding: '10px' }}>${p.price}</td>
                                    <td style={{ padding: '10px' }}>{p.stock}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => handleDelete(p._id)} style={{ color: 'red' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProductManager;
