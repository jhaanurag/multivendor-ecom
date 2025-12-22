import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';

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

    const formRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Animation for list items when products load
    useEffect(() => {
        if (!loading && products.length > 0) {
            gsap.fromTo(".product-row",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [products, loading]);

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
        <div style={{ marginTop: '60px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '20px' }}>
                Manage Products
            </h3>

            {/* Add Product Form */}
            <div ref={formRef} style={{ 
                background: 'var(--bg)', 
                border: '1px solid var(--border)', 
                padding: '30px', 
                borderRadius: '4px', 
                marginBottom: '40px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Add New Product</h4>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required 
                            style={{ padding: '15px', background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--fg)' }} />
                        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required 
                            style={{ padding: '15px', background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--fg)' }} />
                    </div>

                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required 
                        style={{ padding: '15px', background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--fg)', minHeight: '100px' }} />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInputChange} required 
                            style={{ padding: '15px', background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--fg)' }} />
                         <input name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleInputChange} 
                            style={{ padding: '15px', background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--fg)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                         <input type="file" onChange={handleFileChange} accept="image/*" 
                            style={{ flex: 1, padding: '10px', background: 'var(--bg-alt)', border: '1px solid var(--border)' }} />
                        <button type="submit" className="btn" style={{ 
                            padding: '15px 30px', 
                            background: 'var(--fg)', 
                            color: 'var(--bg)', 
                            fontWeight: 600, 
                            border: '1px solid var(--fg)',
                            cursor: 'pointer'
                        }}>
                            Add Product
                        </button>
                    </div>
                </form>
            </div>

            {/* Product List */}
            <div ref={listRef}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Your Products</h4>
                
                {loading ? (
                    <p style={{ color: 'var(--muted)' }}>Loading items...</p>
                ) : (
                    <div style={{ 
                        overflowX: 'auto', 
                        border: '1px solid var(--border)', 
                        borderRadius: '4px',
                        background: 'var(--bg)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    {['Name', 'Price', 'Stock', 'Action'].map(head => (
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
                                {products.map((p, i) => (
                                    <tr key={p._id} className="product-row" style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '20px', fontWeight: 500 }}>{p.name}</td>
                                        <td style={{ padding: '20px' }}>${p.price}</td>
                                        <td style={{ padding: '20px' }}>{p.stock}</td>
                                        <td style={{ padding: '20px' }}>
                                            <button onClick={() => handleDelete(p._id)} style={{ 
                                                color: 'var(--error)', 
                                                background: 'transparent', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                padding: '5px 10px',
                                                border: '1px solid var(--error)',
                                                borderRadius: '50px'
                                            }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManager;
