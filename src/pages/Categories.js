/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Categories.css';

const API = 'https://conbackend222.onrender.com';
const API_KEY = '310424';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [form, setForm] = useState({ name: '', image: '', storeId: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const headers = {
    'apikey': API_KEY,
    'admin-token': localStorage.getItem('adminToken'),
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [catRes, storeRes, subcatRes] = await Promise.all([
        axios.get(`${API}/api/category`, { headers }),
        axios.get(`${API}/api/store`, { headers }),
        axios.get(`${API}/api/subcategory`, { headers }),
      ]);
      setCategories(catRes.data);
      setStores(storeRes.data);
      setSubcategories(subcatRes.data);
    } catch (err) {
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setForm({ name: cat.name, image: cat.image, storeId: cat.storeId });
      setEditingId(cat._id);
    } else {
      setForm({ name: '', image: '', storeId: '' });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setForm({ name: '', image: '', storeId: '' });
    setEditingId(null);
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/api/category/${editingId}`, form, { headers });
      } else {
        await axios.post(`${API}/api/category`, form, { headers });
      }
      fetchAll();
      closeModal();
    } catch (err) {
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/api/category/${id}`, { headers });
      fetchAll();
    } catch {
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoryNames = (ids) => {
    return ids.map(id => {
      const found = subcategories.find(sc => sc._id === id);
      return found ? found.name : id;
    }).join(', ');
  };

  const getStoreName = (storeId) => {
    return stores.find(s => s._id === storeId)?.name || 'Unknown Store';
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="category-page">
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
          <li><NavLink to="/stores">Stores</NavLink></li>
          <li><NavLink to="/categories" className="active">Categories</NavLink></li>
          <li><NavLink to="/subcategories">Subcategories</NavLink></li>
          <li><NavLink to="/companies">Companies</NavLink></li>
          <li><NavLink to="/products">Products</NavLink></li>
     
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">
        <h1>📂 Category Management</h1>
        <button className="create-btn" onClick={() => openModal()}>➕ Create Category</button>

        <div className="category-list">
          {categories.map(cat => (
            <div key={cat._id} className="category-card">
              <img src={cat.image} alt={cat.name} />
              <div className="info">
                <h3>{cat.name}</h3>
                <p><strong>Store:</strong> {getStoreName(cat.storeId)}</p>
                <p><strong>Subcategories:</strong> {getSubcategoryNames(cat.subcategoryIds || [])}</p>
              </div>
              <div className="actions">
                <button className="edit" onClick={() => openModal(cat)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(cat._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId ? 'Edit Category' : 'Create Category'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Category Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input type="text" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} required />
              <select value={form.storeId} onChange={e => setForm({ ...form, storeId: e.target.value })} required>
                <option value="">-- Select Store --</option>
                {stores.map(store => (
                  <option key={store._id} value={store._id}>{store.name}</option>
                ))}
              </select>
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

export default Categories;
