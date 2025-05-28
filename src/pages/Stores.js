/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Stores.css';

const API = 'https://conbackend222.onrender.com';
const API_KEY = '310424';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    branch: '',
    address: '',
    pincode: '',
    manager: '',
    phoneNumber: '',
    location: { lat: '', lng: '' },
  });

  const headers = {
    'apikey': API_KEY,
    'admin-token': localStorage.getItem('adminToken')
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API}/api/store`, { headers });
      setStores(res.data);
    } catch {
      alert('Error fetching stores');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (store = null) => {
    if (store) {
      setForm({
        name: store.name,
        branch: store.branch,
        address: store.address,
        pincode: store.pincode,
        manager: store.manager,
        phoneNumber: store.phoneNumber,
        location: {
          lat: store.location?.lat || '',
          lng: store.location?.lng || '',
        },
      });
      setEditingId(store._id);
    } else {
      setForm({
        name: '',
        branch: '',
        address: '',
        pincode: '',
        manager: '',
        phoneNumber: '',
        location: { lat: '', lng: '' },
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({
      name: '',
      branch: '',
      address: '',
      pincode: '',
      manager: '',
      phoneNumber: '',
      location: { lat: '', lng: '' },
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/api/store/${editingId}`, form, { headers });
      } else {
        await axios.post(`${API}/api/store`, form, { headers });
      }
      fetchStores();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save store');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this store?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/api/store/${id}`, { headers });
      fetchStores();
    } catch {
      alert('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="stores-page">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      <div className="sidebar">
        <h2>📦 Conducto</h2>
        <ul className="menu">
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/users">Users</NavLink></li>
          <li><NavLink to="/stores" className="active">Stores</NavLink></li>
          <li><NavLink to="/categories">Categories</NavLink></li>
          <li><NavLink to="/subcategories">Subcategories</NavLink></li>
          <li><NavLink to="/companies">Companies</NavLink></li>
          <li><NavLink to="/products">Products</NavLink></li>
        
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="store-content">
        <h1>🏬 Store Management</h1>
        <button className="create-btn" onClick={() => openModal()}>➕ Create Store</button>

        <div className="store-list-vertical">
          {stores.map((store) => (
            <div key={store._id} className="store-box-vertical">
              <div className="store-info">
                <h3>{store.name} - {store.branch}</h3>
                <p><strong>📍 Address:</strong> {store.address}</p>
                <p><strong>📬 Pincode:</strong> {store.pincode}</p>
                <p><strong>👨‍💼 Manager:</strong> {store.manager}</p>
                <p><strong>📞 Phone:</strong> {store.phoneNumber}</p>
                <p><strong>🌍 Location:</strong> Lat {store.location?.lat}, Lng {store.location?.lng}</p>
              </div>
              <div className="store-actions">
                <button className="edit" onClick={() => openModal(store)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(store._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId ? 'Edit Store' : 'Create Store'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Store Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input type="text" placeholder="Branch" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} required />
              <input type="text" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
              <input type="text" placeholder="Pincode" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} required />
              <input type="text" placeholder="Manager" value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })} required />
              <input type="text" placeholder="Phone Number" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} required />
              <input type="number" placeholder="Latitude" value={form.location.lat} onChange={e => setForm({ ...form, location: { ...form.location, lat: e.target.value } })} required />
              <input type="number" placeholder="Longitude" value={form.location.lng} onChange={e => setForm({ ...form, location: { ...form.location, lng: e.target.value } })} required />
              <div className="modal-actions">
                <button type="submit" className="save">{editingId ? 'Update' : 'Create'}</button>
                <button type="button" className="cancel" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;