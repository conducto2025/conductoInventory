/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Users.css';

const API_BASE = 'https://conbackend222.onrender.com';
const API_KEY = '310424';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const headers = {
    'apikey': API_KEY,
    'admin-token': localStorage.getItem('adminToken'),
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/user/get-all-users`, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/', { replace: true });
  };

  return (
    <div className="dashboard">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      )}

      <div className="sidebar">
        <h2>📦 Conducto</h2>
        <ul className="menu">
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/users">Users</NavLink></li>
          <li><NavLink to="/stores">Stores</NavLink></li>
          <li><NavLink to="/categories">Categories</NavLink></li>
          <li><NavLink to="/subcategories">Subcategories</NavLink></li>
          <li><NavLink to="/companies">Companies</NavLink></li>
          <li><NavLink to="/products">Products</NavLink></li>
 
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">
        <h1>👤 Users Panel</h1>
        <input
          type="text"
          className="user-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="user-list">
          {filteredUsers.map((user) => (
            <div className="user-card" key={user._id}>
              <div className="user-header">
                <h3>{user.name || 'Unnamed User'}</h3>
                <span>{user.email || 'No Email'}</span>
              </div>
              <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
              <p><strong>Address:</strong> {user.address?.home}, {user.address?.street}, {user.address?.city} - {user.address?.pincode}</p>
              <p><strong>Landmark:</strong> {user.address?.landmark}</p>
              <p><strong>Nearby:</strong> {user.address?.nearby}</p>
              <div className="user-meta">
                <span>🛒 Orders: {user.orderIds?.length || 0}</span>
                <span>⭐ Ratings: {user.ratingIds?.length || 0}</span>
                <span>📝 Reviews: {user.reviewIds?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
