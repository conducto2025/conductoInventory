import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp } from '../utils/api';
import './Auth.css';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      localStorage.setItem('adminToken', res.data.adminToken);
      alert('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {loading && (
        <div className="auth-loading-overlay">
          <div className="spinner"></div>
          <p>Verifying OTP...</p>
        </div>
      )}

      <div className="auth-box">
        <h3 className="admin-title">WELCOME TO CONDUCTO ADMIN PANEL VERSION: 1.0.0</h3>
        <h2>Verify OTP</h2>
        <p>OTP sent to: <strong>{email}</strong></p>

        <div className="input-icon">
          <span>🗝️</span>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
        </div>

        <button onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify & Login'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
