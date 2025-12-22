import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, title: '', message: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);

            setAlert({
                show: true,
                title: 'Welcome Back',
                message: 'You have successfully logged in.'
            });
        } catch (error) {
            setAlert({
                show: true,
                title: 'Login Error',
                message: error.response?.data?.message || 'Invalid email or password.'
            });
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setAlert({ ...alert, show: false });
        if (alert.title === 'Welcome Back') {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.role === 'vendor') {
                navigate('/vendor');
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '450px', padding: '4rem', border: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <p className="section-label" style={{ justifyContent: 'center' }}>Vault Access</p>
                    <h1 style={{ margin: 0, fontSize: '3rem' }}>Login.</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Identity / Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div style={{ marginBottom: '3rem' }}>
                        <label className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Secret / Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            {isLoading ? 'Authenticating...' : 'Enter Platform'}
                        </span>
                    </button>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem' }}>
                            New here? <a href="/register" style={{ textDecoration: 'underline', fontWeight: 600 }}>Create an account</a>
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

export default Login;
