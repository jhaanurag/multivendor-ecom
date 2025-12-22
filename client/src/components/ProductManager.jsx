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
        <div style={{ marginTop: '10rem', borderTop: '1px solid var(--border)', paddingTop: '10rem' }}>
            <div className="section-header" style={{ marginBottom: '4rem' }}>
                <p className="section-label">Inventory</p>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Product Management</h2>
            </div>

            {/* Add Product Form */}
            <div ref={formRef} style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                padding: '4rem',
                marginBottom: '8rem'
            }}>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '3rem', marginTop: 0 }}>Create Manifest</h4>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '3rem' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Item Nomenclature</label>
                            <input name="name" placeholder="E.g. Premium Leather Wallet" value={formData.name} onChange={handleInputChange} required
                                style={{ border: 'none', borderBottom: '1px solid var(--border)', padding: '1rem 0', background: 'transparent', outline: 'none', fontSize: '1rem' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Valuation (USD)</label>
                            <input type="number" name="price" placeholder="0.00" value={formData.price} onChange={handleInputChange} required
                                style={{ border: 'none', borderBottom: '1px solid var(--border)', padding: '1rem 0', background: 'transparent', outline: 'none', fontSize: '1rem' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Manifest Specification</label>
                        <textarea name="description" placeholder="Technical specifications and narrative..." value={formData.description} onChange={handleInputChange} required
                            style={{ border: 'none', borderBottom: '1px solid var(--border)', padding: '1rem 0', background: 'transparent', outline: 'none', minHeight: '80px', fontSize: '1rem', resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Strategic Stock</label>
                            <input type="number" name="stock" placeholder="Units available" value={formData.stock} onChange={handleInputChange} required
                                style={{ border: 'none', borderBottom: '1px solid var(--border)', padding: '1rem 0', background: 'transparent', outline: 'none', fontSize: '1rem' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Classification Tags</label>
                            <input name="tags" placeholder="Space, Tech, Minimal" value={formData.tags} onChange={handleInputChange}
                                style={{ border: 'none', borderBottom: '1px solid var(--border)', padding: '1rem 0', background: 'transparent', outline: 'none', fontSize: '1rem' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-end', marginTop: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', marginBottom: '1rem', display: 'block' }}>Visual Documentation</label>
                            <input type="file" onChange={handleFileChange} accept="image/*"
                                style={{ width: '100%', fontSize: '0.8rem', opacity: 0.6 }} />
                        </div>
                        <button type="submit" className="hero-btn" style={{
                            padding: '1.2rem 3rem',
                            background: 'var(--fg)',
                            color: 'var(--bg)',
                            width: '250px'
                        }}>
                            <span className="hero-btn-text">Archive Item</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Product List */}
            <div ref={listRef}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <h4 style={{ fontSize: '1.5rem', margin: 0 }}>Active Archive</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>{products.length} registered assets</p>
                </div>

                {loading ? (
                    <p className="text-muted">Synchronizing local data...</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ borderBottom: '2px solid var(--fg)' }}>
                                <tr>
                                    {['Identifier', 'Valuation', 'Status', 'Actions'].map(head => (
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
                                {products.map((p, i) => (
                                    <tr key={p._id} className="product-row" style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '2rem 1rem', fontWeight: 600 }}>{p.name}</td>
                                        <td style={{ padding: '2rem 1rem' }}>${p.price}</td>
                                        <td style={{ padding: '2rem 1rem' }}>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                color: p.stock > 0 ? 'var(--fg)' : 'var(--error)',
                                                fontWeight: p.stock > 0 ? 400 : 700
                                            }}>
                                                {p.stock} units available
                                            </span>
                                        </td>
                                        <td style={{ padding: '2rem 1rem' }}>
                                            <button onClick={() => handleDelete(p._id)} style={{
                                                color: 'var(--error)',
                                                background: 'transparent',
                                                border: '1px solid var(--error)',
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.65rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                cursor: 'pointer'
                                            }}>
                                                Decommission
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
