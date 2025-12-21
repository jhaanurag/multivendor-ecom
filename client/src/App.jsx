import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import VendorDashboard from './components/VendorDashboard';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import './App.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="container">
        <header className="navbar">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>MALL_PROTO</h1>
          </Link>
          <div className="nav-links">
            <Link to="/" className="btn-ghost">Shop</Link>
            <Link to="/cart" className="btn-ghost">Cart</Link>
            {user ? (
              <>
                <Link to="/orders" className="btn-ghost">Orders</Link>
                {user.role === 'vendor' && (
                  <Link to="/vendor" className="btn-ghost">Dashboard</Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>
                    {user.name}
                  </span>
                  <button onClick={logout} className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-ghost">Register</Link>
              </>
            )}
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<ProductCatalog user={user} />} />
            <Route path="/cart" element={<Cart user={user} />} />
            <Route path="/orders" element={<OrderHistory user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/vendor" element={<VendorDashboard user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
