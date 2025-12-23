/**
 * Login Page
 * Premium, minimalist design matching the site aesthetic
 */

import { useState, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const from = location.state?.from;
        const ctx = gsap.context(() => {
            if (from === 'register') {
                gsap.fromTo(containerRef.current,
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
                );
            } else {
                gsap.fromTo(containerRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
                );
            }
        }, containerRef);
        return () => ctx.revert();
    }, [location.state]);

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

            // Redirect based on role
            if (user.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
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
            <div ref={containerRef} style={{
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
                        Welcome <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>back</span>
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                        Sign in to continue to your account
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

                    <div style={{ marginBottom: '2rem' }}>
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Register Link */}
                <p style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: 'var(--muted)',
                    fontSize: '0.95rem'
                }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{
                        color: 'var(--fg)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        borderBottom: '1px solid var(--fg)'
                    }} state={{ from: 'login' }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
