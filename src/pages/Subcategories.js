/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Subcategories.css';

const API = 'https://conbackend222.onrender.com';
const API_KEY = '310424';

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    image: '',
    categoryId: '',
    storeId: '',
  });

  const headers = {
    'apikey': API_KEY,
    'admin-token': localStorage.getItem('adminToken')
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [subRes, catRes, storeRes, prodRes, compRes] = await Promise.all([
        axios.get(`${API}/api/subcategory`, { headers }),
        axios.get(`${API}/api/category`, { headers }),
        axios.get(`${API}/api/store`, { headers }),
        axios.get(`${API}/api/product`, { headers }),
        axios.get(`${API}/api/company`, { headers }),
      ]);
      setSubcategories(subRes.data);
      setCategories(catRes.data);
      setStores(storeRes.data);
      setProducts(prodRes.data);
      setCompanies(compRes.data);
    } catch (err) {
      alert('Error fetching subcategories');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (sc = null) => {
    if (sc) {
      setForm({
        name: sc.name,
        image: sc.image,
        categoryId: sc.categoryId,
        storeId: sc.storeId,
      });
      setEditingId(sc._id);
    } else {
      setForm({ name: '', image: '', categoryId: '', storeId: '' });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setForm({ name: '', image: '', categoryId: '', storeId: '' });
    setEditingId(null);
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/api/subcategory/${editingId}`, form, { headers });
      } else {
        await axios.post(`${API}/api/subcategory`, form, { headers });
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
    if (!window.confirm('Delete this subcategory?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/api/subcategory/${id}`, { headers });
      fetchAll();
    } catch {
      alert('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (id) => categories.find(c => c._id === id)?.name || 'Unknown';
  const getStoreName = (id) => stores.find(s => s._id === id)?.name || 'Unknown';

  const getProductCount = (id) => products.filter(p => p.subcategoryId === id).length;
  const getCompanyCount = (id) => companies.filter(c => c.subcategoryId === id).length;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="subcat-page">
      {loading && <div className="overlay"><div className="spinner"></div><p>Loading...</p></div>}

      <div className="sidebar">
        <h2>📦 Conducto</h2>
        <ul className="menu">
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/users">Users</NavLink></li>
          <li><NavLink to="/stores">Stores</NavLink></li>
          <li><NavLink to="/categories">Categories</NavLink></li>
          <li><NavLink to="/subcategories" className="active">Subcategories</NavLink></li>
          <li><NavLink to="/companies">Companies</NavLink></li>
          <li><NavLink to="/products">Products</NavLink></li>
         
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">
        <h1>📁 Subcategory Management</h1>
        <button className="create-btn" onClick={() => openModal()}>➕ Create Subcategory</button>

        <div className="subcat-list">
          {subcategories.map(sc => (
            <div key={sc._id} className="subcat-card">
              <img src={sc.image} alt={sc.name} />
              <div className="info">
                <h3>{sc.name}</h3>
                <p><strong>Category:</strong> {getCategoryName(sc.categoryId)}</p>
                <p><strong>Store:</strong> {getStoreName(sc.storeId)}</p>
                <p><strong>Products:</strong> {getProductCount(sc._id)}</p>
                <p><strong>Companies:</strong> {getCompanyCount(sc._id)}</p>
              </div>
              <div className="actions">
                <button className="edit" onClick={() => openModal(sc)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(sc._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId ? 'Edit Subcategory' : 'Create Subcategory'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Subcategory Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input type="text" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} required />
              <select value={form.storeId} onChange={e => setForm({ ...form, storeId: e.target.value })} required>
                <option value="">-- Select Store --</option>
                {stores.map(store => <option key={store._id} value={store._id}>{store.name}</option>)}
              </select>
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">-- Select Category --</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
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

export default Subcategories;
