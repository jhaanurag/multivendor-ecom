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
        <div className="centered-box">
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h3>Create Account</h3>
                <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" disabled={isLoading} />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="name@example.com" disabled={isLoading} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" disabled={isLoading} />
                    </div>
                    <div className="form-group">
                        <label>Account Type</label>
                        <select name="role" value={formData.role} onChange={handleChange} disabled={isLoading}>
                            <option value="user">Customer</option>
                            <option value="vendor">Vendor</option>
                        </select>
                    </div>
                    <button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
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

export default Register;
