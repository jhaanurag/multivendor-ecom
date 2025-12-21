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
        <div className="centered-box">
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h3>Sign In</h3>
                <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" disabled={isLoading} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" disabled={isLoading} />
                    </div>
                    <button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                    {isLoading && <div className="loading-indicator" style={{ marginTop: '1rem' }}></div>}
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
