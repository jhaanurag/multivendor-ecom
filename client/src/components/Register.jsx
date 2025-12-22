import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);

            setAlert({
                show: true,
                title: 'Account Created',
                message: 'Your account has been successfully created.'
            });
        } catch (error) {
            setAlert({
                show: true,
                title: 'Registration Error',
                message: error.response?.data?.message || 'Something went wrong during registration.'
            });
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setAlert({ ...alert, show: false });
        if (alert.title === 'Account Created') {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.role === 'vendor') {
                navigate('/vendor');
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div style={{ width: '100%', maxWidth: '500px', padding: '4rem', border: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <p className="section-label" style={{ justifyContent: 'center' }}>Join Platform</p>
                    <h1 style={{ margin: 0, fontSize: '3rem' }}>Register.</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Full Name"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                border: 'none',
                                borderBottom: '1px solid var(--border)',
                                padding: '1rem 0',
                                fontSize: '1rem',
                                background: 'transparent',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                border: 'none',
                                borderBottom: '1px solid var(--border)',
                                padding: '1rem 0',
                                fontSize: '1rem',
                                background: 'transparent',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                border: 'none',
                                borderBottom: '1px solid var(--border)',
                                padding: '1rem 0',
                                fontSize: '1rem',
                                background: 'transparent',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '3rem' }}>
                        <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Account Type</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                border: 'none',
                                borderBottom: '1px solid var(--border)',
                                padding: '1rem 0',
                                fontSize: '1rem',
                                background: 'transparent',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="user">Customer</option>
                            <option value="vendor">Vendor</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="hero-btn"
                        style={{
                            width: '100%',
                            background: 'var(--fg)',
                            color: 'var(--bg)',
                            padding: '1.2rem'
                        }}
                    >
                        <span className="hero-btn-text">
                            {isLoading ? 'Creating Account...' : 'Initialize Profile'}
                        </span>
                    </button>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem' }}>
                            Already a member? <a href="/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>Sign in</a>
                        </p>
                    </div>
                </form>
            </div>

            <Modal
                isOpen={alert.show}
                title={alert.title}
                message={alert.message}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default Register;
