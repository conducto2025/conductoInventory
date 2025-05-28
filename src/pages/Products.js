/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

const API = 'https://conbackend222.onrender.com';
const API_KEY = '310424';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    images: [''],
    description: '',
    highlights: [''],
    specifications: [{
      title: '',
      specs: [{ key: '', value: '' }]
    }],
    price: '',
    discountPrice: '',
    stock: '',
    storeId: '',
    categoryId: '',
    subcategoryId: '',
    companyId: '',
    tags: [],
    offer: { title: '', percentage: '', expiresAt: '' }
  });
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
      const [prodRes, storeRes, catRes, subcatRes, compRes] = await Promise.all([
        axios.get(`${API}/api/product`, { headers }),
        axios.get(`${API}/api/store`, { headers }),
        axios.get(`${API}/api/category`, { headers }),
        axios.get(`${API}/api/subcategory`, { headers }),
        axios.get(`${API}/api/company`, { headers }),
      ]);
      setProducts(prodRes.data);
      setStores(storeRes.data);
      setCategories(catRes.data);
      setSubcategories(subcatRes.data);
      setCompanies(compRes.data);
    } catch (err) {
      alert('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (p = null) => {
    if (p) {
      setForm(p);
      setEditingId(p._id);
    } else {
      setForm({
        name: '',
        brand: '',
        model: '',
        images: [''],
        description: '',
        highlights: [''],
        specifications: [{
          title: '',
          specs: [{ key: '', value: '' }]
        }],
        price: '',
        discountPrice: '',
        stock: '',
        storeId: '',
        categoryId: '',
        subcategoryId: '',
        companyId: '',
        tags: [],
        offer: { title: '', percentage: '', expiresAt: '' }
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/api/product/${editingId}`, form, { headers });
      } else {
        await axios.post(`${API}/api/product`, form, { headers });
      }
      fetchAll();
      closeModal();
    } catch (err) {
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/api/product/${id}`, { headers });
      fetchAll();
    } catch (err) {
      alert('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="product-page">
      {loading && <div className="overlay"><div className="spinner"></div><p>Loading...</p></div>}

      <div className="sidebar">
        <h2>📦 Conducto</h2>
        <ul className="menu">
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/users">Users</NavLink></li>
          <li><NavLink to="/stores">Stores</NavLink></li>
          <li><NavLink to="/categories">Categories</NavLink></li>
          <li><NavLink to="/subcategories">Subcategories</NavLink></li>
          <li><NavLink to="/companies">Companies</NavLink></li>
          <li><NavLink to="/products" className="active">Products</NavLink></li>
     
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">
        <h1>🛒 Product Management</h1>
        <button className="create-btn" onClick={() => openModal()}>➕ Add Product</button>

        <input
          className="search-bar"
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="product-grid">
          {filteredProducts.map(p => (
            <div key={p._id} className="product-card">
              <img src={p.images?.[0]} alt="img" />
              <h3>{p.name}</h3>
              <p>₹{p.discountPrice}</p>
              <p><small>Stock: {p.stock}</small></p>
              <div className="product-actions">
                <button onClick={() => openModal(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>





      {modalOpen && (
  <div className="modal">
    <div className="modal-content large-modal">
      <div className="modal-header">
        <h2>{editingId ? 'Edit Product' : 'Create Product'}</h2>
      </div>
      
      <div className="modal-body">
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Basic Information Section */}
          <div className="form-group">
            <label>Product Name *</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Brand *</label>
            <input 
              type="text" 
              value={form.brand} 
              onChange={e => setForm({ ...form, brand: e.target.value })}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Model</label>
            <input 
              type="text" 
              value={form.model} 
              onChange={e => setForm({ ...form, model: e.target.value })}
            />
          </div>
          
          {/* Images Section */}
          <div className="form-group form-full-width">
            <label>Product Images</label>
            <div className="array-input-container">
              {form.images.map((image, index) => (
                <div key={index} className="array-input-item">
                  <input
                    type="text"
                    placeholder={`https://example.com/image${index + 1}.jpg`}
                    value={image}
                    onChange={e => {
                      const newImages = [...form.images];
                      newImages[index] = e.target.value;
                      setForm({ ...form, images: newImages });
                    }}
                  />
                  {form.images.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        const newImages = [...form.images];
                        newImages.splice(index, 1);
                        setForm({ ...form, images: newImages });
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="array-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setForm({ ...form, images: [...form.images, ''] })}
                >
                  Add Image URL
                </button>
              </div>
            </div>
          </div>
          
          {/* Description Section */}
          <div className="form-group form-full-width">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          
          {/* Pricing Section */}
          <div className="form-group">
            <label>Price (₹) *</label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Discount Price (₹)</label>
            <input
              type="number"
              value={form.discountPrice}
              onChange={e => setForm({ ...form, discountPrice: Number(e.target.value) })}
            />
          </div>
          
          <div className="form-group">
            <label>Stock Quantity *</label>
            <input
              type="number"
              value={form.stock}
              onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
              required
            />
          </div>
          
          {/* Categories Section */}
          <div className="form-group">
            <label>Store</label>
            <select
              value={form.storeId}
              onChange={e => setForm({ ...form, storeId: e.target.value })}
            >
              <option value="">Select Store</option>
              {stores.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Subcategory</label>
            <select
              value={form.subcategoryId}
              onChange={e => setForm({ ...form, subcategoryId: e.target.value })}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map(sc => (
                <option key={sc._id} value={sc._id}>{sc.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Company</label>
            <select
              value={form.companyId}
              onChange={e => setForm({ ...form, companyId: e.target.value })}
            >
              <option value="">Select Company</option>
              {companies.map(comp => (
                <option key={comp._id} value={comp._id}>{comp.name}</option>
              ))}
            </select>
          </div>
          
          {/* Highlights Section */}
          <div className="form-group form-full-width">
            <label>Product Highlights</label>
            <div className="array-input-container">
              {form.highlights.map((highlight, index) => (
                <div key={index} className="array-input-item">
                  <input
                    type="text"
                    placeholder={`Highlight feature ${index + 1}`}
                    value={highlight}
                    onChange={e => {
                      const newHighlights = [...form.highlights];
                      newHighlights[index] = e.target.value;
                      setForm({ ...form, highlights: newHighlights });
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      const newHighlights = [...form.highlights];
                      newHighlights.splice(index, 1);
                      setForm({ ...form, highlights: newHighlights });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="array-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setForm({ ...form, highlights: [...form.highlights, ''] })}
                >
                  Add Highlight
                </button>
              </div>
            </div>
          </div>
          
          {/* Specifications Section */}
          <div className="form-group form-full-width">
            <label>Product Specifications</label>
            <div className="array-input-container">
              {form.specifications.map((spec, specIndex) => (
                <div key={specIndex} className="spec-group">
                  <div className="array-input-item">
                    <input
                      type="text"
                      placeholder="Specification group title"
                      value={spec.title}
                      onChange={e => {
                        const newSpecs = [...form.specifications];
                        newSpecs[specIndex].title = e.target.value;
                        setForm({ ...form, specifications: newSpecs });
                      }}
                    />
                    {form.specifications.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const newSpecs = [...form.specifications];
                          newSpecs.splice(specIndex, 1);
                          setForm({ ...form, specifications: newSpecs });
                        }}
                      >
                        Remove Group
                      </button>
                    )}
                  </div>
                  
                  {spec.specs.map((item, itemIndex) => (
                    <div key={itemIndex} className="array-input-item" style={{ marginLeft: '1rem' }}>
                      <input
                        type="text"
                        placeholder="Spec name"
                        value={item.key}
                        onChange={e => {
                          const newSpecs = [...form.specifications];
                          newSpecs[specIndex].specs[itemIndex].key = e.target.value;
                          setForm({ ...form, specifications: newSpecs });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Spec value"
                        value={item.value}
                        onChange={e => {
                          const newSpecs = [...form.specifications];
                          newSpecs[specIndex].specs[itemIndex].value = e.target.value;
                          setForm({ ...form, specifications: newSpecs });
                        }}
                      />
                      {spec.specs.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const newSpecs = [...form.specifications];
                            newSpecs[specIndex].specs.splice(itemIndex, 1);
                            setForm({ ...form, specifications: newSpecs });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <div className="array-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const newSpecs = [...form.specifications];
                        newSpecs[specIndex].specs.push({ key: '', value: '' });
                        setForm({ ...form, specifications: newSpecs });
                      }}
                    >
                      Add Specification
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="array-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setForm({
                      ...form,
                      specifications: [
                        ...form.specifications,
                        { title: '', specs: [{ key: '', value: '' }] }
                      ]
                    });
                  }}
                >
                  Add Specification Group
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeModal}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          {editingId ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Products;
