/**
 * Vendor Products Page
 * Product management for vendors - list, add, edit, delete
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLenis } from '../context/LenisContext';
import { productsAPI } from '../utils/api';
import { AlertTriangle, Check, Upload } from 'lucide-react';

const VendorProducts = () => {
    const { isVendor, isAuthenticated } = useAuth();
    const { stop, start } = useLenis();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        imageUrl: '',
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
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
        fetchProducts();
    }, [isAuthenticated, isVendor]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = 'hidden';
            stop();
        } else {
            document.body.style.overflow = '';
            start();
        }
        return () => {
            document.body.style.overflow = '';
            start();
        };
    }, [showForm, stop, start]);

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getVendorProducts();
            setProducts(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setDeleting(productId);
        try {
            await productsAPI.delete(productId);
            setProducts(products.filter(p => p._id !== productId));
            showNotification('Product deleted successfully');
        } catch (err) {
            console.error('Failed to delete product:', err);
            showNotification('Failed to delete product', 'error');
        } finally {
            setDeleting(null);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);

        // Only show URL in input if it's an external link, not a server upload
        const existingImage = product.images?.[0] || '';
        const isExternal = existingImage.startsWith('http');

        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.category || '',
            imageUrl: isExternal ? existingImage : '',
        });
        setImageFile(null);
        setImagePreview(product.images?.[0] ? getImageUrl(product) : null);
        setShowForm(true);
        setFormError(null);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            category: '',
            imageUrl: '',
        });
        setImageFile(null);
        setImagePreview(null);
        setShowForm(true);
        setFormError(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, imageUrl: '' })); // Clear URL when file selected
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormLoading(true);

        try {
            // If file is selected, use FormData
            if (imageFile) {
                const formDataObj = new FormData();
                formDataObj.append('name', formData.name);
                formDataObj.append('description', formData.description);
                formDataObj.append('price', formData.price);
                formDataObj.append('stock', formData.stock);
                formDataObj.append('category', formData.category);
                formDataObj.append('image', imageFile);

                if (editingProduct) {
                    await productsAPI.updateWithImage(editingProduct._id, formDataObj);
                } else {
                    await productsAPI.createWithImage(formDataObj);
                }
            } else {
                // Use regular JSON with URL
                const data = {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    category: formData.category,
                    images: formData.imageUrl ? [formData.imageUrl] : [],
                };

                // If editing and no new image/url provided, keep existing images
                if (editingProduct && !formData.imageUrl && !imageFile && editingProduct.images?.length > 0) {
                    // Check if we wiped the URL from state but it was a server image we want to keep
                    // Actually logic in backend usually handles "if not provided, don't update" or we send existing.
                    // A cleaner way: send the existing image path if user didn't change it.
                    // However, our logic above calculates data based on form inputs. 
                    // If imageUrl is empty (because it was hidden), we might send empty array?
                    // Let's refine: If text input empty & no file, but we have original server image, we should probably SEND that original path if purely JSON update.
                    // But simplest is: if user cleared it, they cleared it. 
                    // Wait, if I hide it in handleEdit, formData.imageUrl is ''. If I save, I send images: []. This deletes the image!
                    // FIX: If formData.imageUrl is empty AND imageFile is null, we should check if we should preserve existing.
                    // But typically, if I want to KEEP existing server image, I shouldn't send 'images' key at all or send the old one.
                    // Let's modify the `data` construction below.

                    if (!formData.imageUrl && !imageFile && editingProduct.images?.length > 0) {
                        // Preserve existing if not touched
                        data.images = editingProduct.images;
                    }
                }

                if (editingProduct) {
                    await productsAPI.update(editingProduct._id, data);
                } else {
                    await productsAPI.create(data);
                }
            }

            setShowForm(false);
            setImageFile(null);
            setImagePreview(null);
            fetchProducts();
            showNotification(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        } catch (err) {
            console.error('Product save error:', err);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to save product';
            setFormError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
            // Keep form open on error
        } finally {
            setFormLoading(false);
        }
    };

    const getImageUrl = (product) => {
        if (!product?.images?.[0]) return 'https://placehold.co/80x80/1a1a1a/666?text=No+Image';
        return product.images[0].startsWith('http')
            ? product.images[0]
            : `http://localhost:5000${product.images[0]}`;
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

    const inputStyle = {
        width: '100%',
        padding: '0.9rem',
        fontSize: '0.95rem',
        border: '1px solid var(--border)',
        background: '#1a1a1a',
        color: '#ffffff',
        outline: 'none',
    };

    const selectStyle = {
        ...inputStyle,
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        paddingRight: '2.5rem',
        cursor: 'pointer',
    };

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
                        {notification.type === 'error' ? <AlertTriangle size={18} strokeWidth={2.5} /> : <Check size={18} strokeWidth={2.5} />}
                        <span>{notification.message}</span>
                    </div>
                )}

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div>
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
                            Your Products
                        </h1>
                    </div>
                    <button
                        onClick={handleAdd}
                        style={{
                            padding: '0.9rem 1.5rem',
                            background: 'var(--fg)',
                            color: 'var(--bg)',
                            border: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                        }}
                    >
                        + Add Product
                    </button>
                </div>

                {/* Product Form Modal */}
                {showForm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '2rem',
                    }}>
                        <div 
                            data-lenis-prevent
                            style={{
                            background: 'var(--bg)',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                        }}>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                marginBottom: '1.5rem',
                            }}>
                                {editingProduct ? 'Edit Product' : 'Add Product'}
                            </h2>

                            {formError && (
                                <div style={{
                                    padding: '0.75rem',
                                    marginBottom: '1rem',
                                    background: 'rgba(220, 38, 38, 0.1)',
                                    color: '#dc2626',
                                    fontSize: '0.9rem',
                                }}>
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Price *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Stock *</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.stock}
                                            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#999' }}>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        style={selectStyle}
                                    >
                                        <option value="" style={{ background: '#1a1a1a', color: '#fff' }}>Select category</option>
                                        <option value="Electronics" style={{ background: '#1a1a1a', color: '#fff' }}>Electronics</option>
                                        <option value="Fashion" style={{ background: '#1a1a1a', color: '#fff' }}>Fashion</option>
                                        <option value="Home" style={{ background: '#1a1a1a', color: '#fff' }}>Home</option>
                                        <option value="Sports" style={{ background: '#1a1a1a', color: '#fff' }}>Sports</option>
                                        <option value="Books" style={{ background: '#1a1a1a', color: '#fff' }}>Books</option>
                                        <option value="Beauty" style={{ background: '#1a1a1a', color: '#fff' }}>Beauty</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#999' }}>Product Image</label>

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid var(--border)' }}
                                            />
                                        </div>
                                    )}

                                    {/* Custom File Upload UI */}
                                    <label style={{
                                        ...inputStyle,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        background: 'var(--bg-alt)',
                                        border: '1px dashed var(--border)',
                                        color: 'var(--muted)',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--fg)';
                                            e.currentTarget.style.color = 'var(--fg)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                            e.currentTarget.style.color = 'var(--muted)';
                                        }}
                                    >
                                        <Upload size={24} strokeWidth={1.5} />
                                        <span style={{ fontSize: '0.9rem' }}>
                                            {imageFile ? imageFile.name : "Choose an image file..."}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem', marginTop: '0.5rem', textAlign: 'center' }}>
                                        Upload an image (JPG, PNG, WebP - max 5MB)
                                    </p>

                                    {/* OR divider */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                                        <span style={{ fontSize: '0.75rem', color: '#666' }}>OR</span>
                                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                                    </div>

                                    {/* URL Input */}
                                    <input
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
                                            if (e.target.value) {
                                                setImageFile(null);
                                                setImagePreview(e.target.value);
                                            }
                                        }}
                                        style={inputStyle}
                                        placeholder="https://example.com/image.jpg"
                                        disabled={!!imageFile}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                                        Or paste a direct image URL
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        style={{
                                            flex: 1,
                                            padding: '0.9rem',
                                            background: 'transparent',
                                            color: 'var(--fg)',
                                            border: '1px solid var(--border)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        style={{
                                            flex: 1,
                                            padding: '0.9rem',
                                            background: 'var(--fg)',
                                            color: 'var(--bg)',
                                            border: 'none',
                                            fontWeight: 600,
                                            cursor: formLoading ? 'not-allowed' : 'pointer',
                                            opacity: formLoading ? 0.7 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        {formLoading && (
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                border: '2px solid var(--bg)',
                                                borderTopColor: 'transparent',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }} />
                                        )}
                                        {formLoading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Products List */}
                {products.length === 0 ? (
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
                            No products yet
                        </h3>
                        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                            Add your first product to start selling.
                        </p>
                        <button
                            onClick={handleAdd}
                            style={{
                                padding: '0.9rem 1.5rem',
                                background: 'var(--fg)',
                                color: 'var(--bg)',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Add Product
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.9rem',
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>Product</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>Price</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>Stock</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>Category</th>
                                    <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <img
                                                    src={getImageUrl(product)}
                                                    alt={product.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', background: 'var(--bg-alt)' }}
                                                />
                                                <span style={{ fontWeight: 500 }}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>${product.price?.toFixed(2)}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                color: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : 'var(--fg)',
                                            }}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--muted)' }}>{product.category || '—'}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--fg)',
                                                    padding: '0.5rem 1rem',
                                                    marginRight: '0.5rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                disabled={deleting === product._id}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #ef4444',
                                                    color: '#ef4444',
                                                    padding: '0.5rem 1rem',
                                                    cursor: deleting === product._id ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.8rem',
                                                    opacity: deleting === product._id ? 0.5 : 1,
                                                }}
                                            >
                                                {deleting === product._id ? '...' : 'Delete'}
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

export default VendorProducts;
