/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const API_BASE = 'https://conbackend222.onrender.com';
const API_KEY = '310424';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const headers = {
    'apikey': API_KEY,
    'admin-token': localStorage.getItem('adminToken')
  };

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => window.history.go(1);
    fetchAllData();
    return () => (window.onpopstate = null);
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([fetchStats(), fetchInventory()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [products, categories, stores, companies, subcategories, users] = await Promise.all([
        axios.get(`${API_BASE}/api/product`, { headers }),
        axios.get(`${API_BASE}/api/category`, { headers }),
        axios.get(`${API_BASE}/api/store`, { headers }),
        axios.get(`${API_BASE}/api/company`, { headers }),
        axios.get(`${API_BASE}/api/subcategory`, { headers }),
        axios.get(`${API_BASE}/api/user/get-all-users`, { headers }),
      ]);
      setStats({
        productCount: products.data.length,
        categoryCount: categories.data.length,
        storeCount: stores.data.length,
        companyCount: companies.data.length,
        subcategoryCount: subcategories.data.length,
        userCount: users.data.length
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/product/inventory/list`, { headers });
      setInventory(res.data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    }
  };

  const handleStockUpdate = async (id, newQty) => {
    try {
      await axios.put(`${API_BASE}/api/product/inventory/${id}`, { stock: newQty }, { headers });
      fetchInventory();
    } catch (err) {
      console.error('Failed to update stock', err);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Do you want to log out?');
    setLoading(true);

    setTimeout(() => {
      if (confirmLogout) {
        localStorage.removeItem('adminToken');
        navigate('/', { replace: true });
      } else {
        setLoading(false); // cancel logout, remove spinner
      }
    }, 1200); // short loading screen even if cancelled
  };

  const filteredInventory = inventory.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
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
        <h1>Welcome to Conducto Admin Panel</h1>
        <p className="subtitle">Version: <strong>1.0.0</strong></p>

        <div className="stat-boxes">
          <div className="stat-card">🛍 Products<br /><strong>{stats.productCount || 0}</strong></div>
          <div className="stat-card">📂 Categories<br /><strong>{stats.categoryCount || 0}</strong></div>
          <div className="stat-card">📁 Subcategories<br /><strong>{stats.subcategoryCount || 0}</strong></div>
          <div className="stat-card">🏬 Stores<br /><strong>{stats.storeCount || 0}</strong></div>
          <div className="stat-card">🏢 Companies<br /><strong>{stats.companyCount || 0}</strong></div>
          <div className="stat-card">👤 Users<br /><strong>{stats.userCount || 0}</strong></div>
        </div>

        <h2 className="section-title">All Inventory</h2>

        <input
          type="text"
          placeholder="Search product by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="inventory-list">
          {filteredInventory.map(item => (
            <div className="inventory-card" key={item._id}>
              <img
                src={item.image || 'https://res.cloudinary.com/dlx5pltvp/image/upload/v1748351940/download_smrmfj.png'}
                alt="product"
              />
              <div className="inventory-info">
                <h3>{item.name}</h3>
                <p>{item.description || 'No description available.'}</p>
                <div className="stock-edit">
                  <label>Stock:</label>
                  <input
                    type="number"
                    defaultValue={item.stock}
                    onBlur={(e) => handleStockUpdate(item._id, Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
