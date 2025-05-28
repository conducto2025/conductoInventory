/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Companies.css';

const API = 'https://conbackend222.onrender.com';
const API_KEY = '310424';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({
    name: '',
    logo: '',
    storeId: '',
    categoryId: '',
    subcategoryId: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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
      const [compRes, storeRes, catRes, subcatRes, prodRes] = await Promise.all([
        axios.get(`${API}/api/company`, { headers }),
        axios.get(`${API}/api/store`, { headers }),
        axios.get(`${API}/api/category`, { headers }),
        axios.get(`${API}/api/subcategory`, { headers }),
        axios.get(`${API}/api/product`, { headers }),
      ]);
      setCompanies(compRes.data);
      setStores(storeRes.data);
      setCategories(catRes.data);
      setSubcategories(subcatRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (company = null) => {
    if (company) {
      setForm({
        name: company.name,
        logo: company.logo,
        storeId: company.storeId,
        categoryId: company.categoryId,
        subcategoryId: company.subcategoryId,
      });
      setEditingId(company._id);
    } else {
      setForm({ name: '', logo: '', storeId: '', categoryId: '', subcategoryId: '' });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setForm({ name: '', logo: '', storeId: '', categoryId: '', subcategoryId: '' });
    setEditingId(null);
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/api/company/${editingId}`, form, { headers });
      } else {
        await axios.post(`${API}/api/company`, form, { headers });
      }
      fetchAll();
      closeModal();
    } catch (err) {
      alert('Error saving company');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/api/company/${id}`, { headers });
      fetchAll();
    } catch {
      alert('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const getStoreName = id => stores.find(s => s._id === id)?.name || 'Unknown';
  const getCategoryName = id => categories.find(c => c._id === id)?.name || 'Unknown';
  const getSubcategoryName = id => subcategories.find(sc => sc._id === id)?.name || 'Unknown';

  const getProducts = companyId => products.filter(p => p.companyId === companyId);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="company-page">
      {loading && <div className="overlay"><div className="spinner"></div><p>Loading...</p></div>}

      <div className="sidebar">
        <h2>📦 Conducto</h2>
        <ul className="menu">
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/users">Users</NavLink></li>
          <li><NavLink to="/stores">Stores</NavLink></li>
          <li><NavLink to="/categories">Categories</NavLink></li>
          <li><NavLink to="/subcategories">Subcategories</NavLink></li>
          <li><NavLink to="/companies" className="active">Companies</NavLink></li>
          <li><NavLink to="/products">Products</NavLink></li>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">
        <h1>🏢 Company Management</h1>
        <button className="create-btn" onClick={() => openModal()}>➕ Create Company</button>

        <div className="company-list">
          {companies.map(c => (
            <div className="company-card" key={c._id}>
              <div className="company-header">
                <img src={c.logo} alt="logo" />
                <div>
                  <h3>{c.name}</h3>
                  <p><strong>Store:</strong> {getStoreName(c.storeId)}</p>
                  <p><strong>Category:</strong> {getCategoryName(c.categoryId)}</p>
                  <p><strong>Subcategory:</strong> {getSubcategoryName(c.subcategoryId)}</p>
                </div>
                <div className="actions">
                  <button className="edit" onClick={() => openModal(c)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(c._id)}>Delete</button>
                  <button onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
                    {expanded === c._id ? 'Hide Products' : 'Show Products'}
                  </button>
                </div>
              </div>

              {expanded === c._id && (
                <div className="product-grid">
                  {getProducts(c._id).map(p => (
                    <div key={p._id} className="product-item">
                      <img src={p.images?.[0]} alt="product" />
                      <h4>{p.name}</h4>
                      <p>₹{p.discountPrice}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId ? 'Edit Company' : 'Create Company'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Company Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input type="text" placeholder="Logo URL" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} required />

              <select value={form.storeId} onChange={e => setForm({ ...form, storeId: e.target.value })} required>
                <option value="">-- Select Store --</option>
                {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>

              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">-- Select Category --</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>

              <select value={form.subcategoryId} onChange={e => setForm({ ...form, subcategoryId: e.target.value })} required>
                <option value="">-- Select Subcategory --</option>
                {subcategories.map(sc => <option key={sc._id} value={sc._id}>{sc.name}</option>)}
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

export default Companies;
