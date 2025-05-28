import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOtp } from '../utils/api';
import './Auth.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      await requestOtp(email, password);
      alert('OTP sent to email!');
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {loading && (
        <div className="auth-loading-overlay">
          <div className="spinner"></div>
          <p>Requesting OTP...</p>
        </div>
      )}

      <div className="auth-box">
        <h3 className="admin-title">WELCOME TO CONDUCTO ADMIN PANEL VERSION: 1.0.0</h3>
        <h2>Admin Login</h2>

        <div className="input-icon">
          <span>📧</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-icon">
          <span>🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleRequestOtp} disabled={loading}>
          {loading ? 'Sending...' : 'Request OTP'}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
