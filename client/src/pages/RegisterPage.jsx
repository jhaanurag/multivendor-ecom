/**
 * Register Page
 * Premium design with role selection (Customer/Vendor)
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await register(name, email, password, role);

            // Redirect based on role
            if (user.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else {
                navigate('/products');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-lg)',
            background: 'var(--bg)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '460px'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        marginBottom: '1rem',
                        color: 'var(--fg)'
                    }}>
                        Join <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>us</span>
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                        Create your account to get started
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        background: 'rgba(220, 38, 38, 0.1)',
                        border: '1px solid rgba(220, 38, 38, 0.3)',
                        color: '#dc2626',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--muted)'
                        }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem',
                                border: '1px solid var(--border)',
                                background: 'transparent',
                                color: 'var(--fg)',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--fg)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            placeholder="John Doe"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--muted)'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem',
                                border: '1px solid var(--border)',
                                background: 'transparent',
                                color: 'var(--fg)',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--fg)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--muted)'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem',
                                border: '1px solid var(--border)',
                                background: 'transparent',
                                color: 'var(--fg)',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--fg)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Role Selection */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.75rem',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--muted)'
                        }}>
                            I want to
                        </label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    background: role === 'user' ? 'var(--fg)' : 'transparent',
                                    color: role === 'user' ? 'var(--bg)' : 'var(--fg)',
                                    border: '1px solid var(--fg)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Shop
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('vendor')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    background: role === 'vendor' ? 'var(--fg)' : 'transparent',
                                    color: role === 'vendor' ? 'var(--bg)' : 'var(--fg)',
                                    border: '1px solid var(--fg)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Sell
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1.1rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            background: 'var(--fg)',
                            color: 'var(--bg)',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'opacity 0.3s, transform 0.3s'
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Login Link */}
                <p style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: 'var(--muted)',
                    fontSize: '0.95rem'
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{
                        color: 'var(--fg)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        borderBottom: '1px solid var(--fg)'
                    }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
