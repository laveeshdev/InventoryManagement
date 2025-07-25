import { useState, useEffect } from 'react';
import './App.css';
import AddItemForm from './components/AddItemForm';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Logo = () => (
  <div className="logo-circle">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="24" fill="#e6edfd"/>
      <path d="M24 14L34 19V29L24 34L14 29V19L24 14Z" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M24 34V24" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M34 19L24 24L14 19" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  </div>
);

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to fetch user profile to verify authentication
        const res = await fetch(`${apiUrl}/api/v1/product/list`, {
          credentials: 'include',
        });
        
        if (res.ok) {
          // If we can access protected routes, user is authenticated
          // Try to get user info from localStorage if available
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
          setIsLoggedIn(true);
        } else {
          // Clear any saved user data
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsCheckingAuth(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side session/cookies
      await fetch(`${apiUrl}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // Continue with logout even if API call fails
      console.log('Logout API call failed, but continuing with local logout');
    }
    
    // Clear local storage and state
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setLoginData({ username: '', password: '' });
  };

  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    if (form === 'login') {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('Login successful!');
        setIsLoggedIn(true);
        setUser(data.data?.user || null);
        // Save user data to localStorage for persistence
        if (data.data?.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${apiUrl}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('Signup successful! You can now log in.');
        setShowLogin(true);
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    }
  };


  // Dashboard with inventory listing
  const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'inventory', 'additem', 'updatelist', 'updatequantity'
    const [addForm, setAddForm] = useState({
      name: '',
      type: '',
      sku: '',
      quantity: '',
      price: '',
      description: '',
      image_url: ''
    });
    const [addMessage, setAddMessage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [updateQuantityForm, setUpdateQuantityForm] = useState({
      action: 'adjust', // 'adjust', 'sale', 'purchase'
      quantity: '',
      reason: ''
    });
    const [updateMessage, setUpdateMessage] = useState('');
    const [quantityInput, setQuantityInput] = useState('');

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${apiUrl}/api/v1/product/list`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch products.');
        }
      } catch (err) {
        setError('Network error.');
      }
      setLoading(false);
    };

    useEffect(() => {
      fetchProducts();
    }, []);

    const handleAddInputChange = (e) => {
      const { name, value } = e.target;
      setAddForm({ ...addForm, [name]: value });
    };

    const handleAddProduct = async (e) => {
      e.preventDefault();
      setAddMessage('');
      try {
        const res = await fetch(`${apiUrl}/api/v1/product/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            ...addForm,
            quantity: Number(addForm.quantity),
            price: Number(addForm.price)
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAddMessage('Product added successfully!');
          setAddForm({ name: '', type: '', sku: '', quantity: '', price: '', description: '', image_url: '' });
          fetchProducts();
          // Redirect to inventory page after successful addition
          setTimeout(() => {
            setCurrentView('inventory');
            setAddMessage('');
          }, 1500);
        } else {
          setAddMessage(data.message || 'Failed to add product.');
        }
      } catch (err) {
        setAddMessage('Network error.');
      }
    };

    // Calculate totals for overview
    const totalQuantity = products.reduce((sum, prod) => sum + prod.quantity, 0);
    const totalValue = products.reduce((sum, prod) => sum + (prod.quantity * prod.price), 0);

    // Inventory Page Component
    const InventoryPage = () => (
      <div className="inventory-page">
        <div className="inventory-header">
          <h1>Inventory Management</h1>
          <p>Manage all your inventory items</p>
        </div>
        
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Add your first product to get started!</p>
            <button className="add-first-btn" onClick={() => setCurrentView('additem')}>
              Add Product
            </button>
          </div>
        ) : (
          <div className="inventory-list">
            {products.map((prod) => (
              <div key={prod._id} className="inventory-item-card">
                <div className="item-main-info">
                  <div className="item-details">
                    <h3>{prod.name}</h3>
                    <div className="item-meta">
                      <span className="item-type">Type: {prod.type}</span>
                      <span className="item-sku">SKU: {prod.sku}</span>
                    </div>
                    {prod.description && (
                      <p className="item-description">{prod.description}</p>
                    )}
                  </div>
                  <div className="item-stats">
                    <div className="stat-group quantity-stat">
                      <span className="stat-value quantity-value">{prod.quantity}</span>
                      <span className="stat-label">Quantity</span>
                    </div>
                    <div className="stat-group">
                      <span className="stat-value">${prod.price}</span>
                      <span className="stat-label">Price</span>
                    </div>
                    <div className="stat-group">
                      <span className="stat-value">${(prod.quantity * prod.price).toFixed(2)}</span>
                      <span className="stat-label">Total Value</span>
                    </div>
                  </div>
                </div>
                <div className="item-actions">
                  <button
                    className="update-qty-btn"
                    onClick={() => setCurrentView('updatelist')}
                  >
                    Update Quantity
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    // Delete Product Function
    const handleDeleteProduct = async (productId) => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/product/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.success) {
          fetchProducts();
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        } else {
          alert(data.message || 'Failed to delete product.');
          // Close the modal even if delete failed
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        }
      } catch (err) {
        alert('Network error.');
        // Close the modal even if there was a network error
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      }
    };

    // Update List Page Component (modern card style, two buttons)
    const UpdateListPage = () => (
      <div className="update-list-page">
        <div className="update-list-header">
          <h1>Select an Item</h1>
        </div>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Add your first product to get started!</p>
            <button className="add-first-btn" onClick={() => setCurrentView('additem')}>
              Add Product
            </button>
          </div>
        ) : (
          <div className="update-products-list">
            {products.map((prod) => (
              <div key={prod._id} className="update-product-item" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'2rem'}}>
                <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                  <div style={{fontWeight:700, fontSize:'1.18rem', marginBottom:0}}>{prod.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:'0.7rem',color:'#555',fontSize:'1rem'}}>
                    <span>Current quantity:</span>
                    <span className="highlight-qty">{prod.quantity}</span>
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',alignItems:'flex-end',minWidth:'110px'}}>
                  <button
                    className="update-qty-btn"
                    style={{width:'90px'}}
                    onClick={() => {
                      setSelectedProduct(prod);
                      setQuantityInput(''); // Clear the input when selecting a new product
                      setCurrentView('updatequantity');
                    }}
                  >
                    Select
                  </button>
                  <button
                    className="delete-product-btn"
                    style={{width:'90px'}}
                    onClick={() => {
                      setProductToDelete(prod);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    // Update Quantity Page Component
    const UpdateQuantityPage = () => (
      <div className="update-quantity-page">
        <div className="update-quantity-header">
          <h1>Update Item Quantity</h1>
          <h2>{selectedProduct?.name}</h2>
          <p>Current quantity: <strong>{selectedProduct?.quantity}</strong></p>
        </div>
        <div className="update-quantity-form-container">
          <form className="update-quantity-form" onSubmit={(e) => {
            e.preventDefault();
            setUpdateMessage('');
            
            if (!selectedProduct || !quantityInput || Number(quantityInput) <= 0) {
              setUpdateMessage('Please enter a valid quantity.');
              return;
            }

            let newQuantity = selectedProduct.quantity;
            const actionQuantity = Number(quantityInput);

            switch (updateQuantityForm.action) {
              case 'adjust':
                newQuantity = actionQuantity;
                break;
              case 'sale':
                newQuantity = Math.max(0, selectedProduct.quantity - actionQuantity);
                break;
              case 'purchase':
                newQuantity = selectedProduct.quantity + actionQuantity;
                break;
              default:
                break;
            }

            fetch(`${apiUrl}/api/v1/product/${selectedProduct._id}/quantity`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ quantity: newQuantity })
            })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                setUpdateMessage('Quantity updated successfully!');
                fetchProducts();
                setTimeout(() => {
                  setCurrentView('updatelist');
                  setUpdateMessage('');
                  setUpdateQuantityForm({ action: 'adjust', quantity: '', reason: '' });
                  setQuantityInput('');
                }, 1500);
              } else {
                setUpdateMessage(data.message || 'Failed to update quantity.');
              }
            })
            .catch(() => {
              setUpdateMessage('Network error.');
            });
          }} autoComplete="off">
            <div className="update-type-section">
              <h3>Transaction Type</h3>
              <div className="update-type-buttons">
                <button
                  type="button"
                  className={`update-type-btn set-to${updateQuantityForm.action === 'adjust' ? ' active' : ''}`}
                  onClick={() => setUpdateQuantityForm(form => ({ ...form, action: 'adjust' }))}
                  title="Set the quantity to an exact value"
                  aria-label="Set To"
                >
                  <span style={{marginRight:6,verticalAlign:'middle'}}>🔢</span> Set To
                </button>
                <button
                  type="button"
                  className={`update-type-btn add${updateQuantityForm.action === 'purchase' ? ' active' : ''}`}
                  onClick={() => setUpdateQuantityForm(form => ({ ...form, action: 'purchase' }))}
                  title="Purchase (add to stock)"
                  aria-label="Purchase"
                >
                  <span style={{marginRight:6,verticalAlign:'middle'}}>🛒</span> Purchase
                </button>
                <button
                  type="button"
                  className={`update-type-btn subtract${updateQuantityForm.action === 'sale' ? ' active' : ''}`}
                  onClick={() => setUpdateQuantityForm(form => ({ ...form, action: 'sale' }))}
                  title="Sale (remove from stock)"
                  aria-label="Sale"
                >
                  <span style={{marginRight:6,verticalAlign:'middle'}}>💸</span> Sale
                </button>
              </div>
            </div>
            <div className="new-quantity-section">
              <h3>Quantity</h3>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter quantity"
                value={quantityInput}
                onChange={e => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setQuantityInput(val.replace(/^0+(?!$)/, ''));
                  }
                }}
                required
                min={1}
                className="quantity-input"
                autoComplete="off"
              />
            </div>
            <div className="form-actions-update">
              <button type="submit" className="update-quantity-btn">
                Update Quantity
              </button>
            </div>
            {updateMessage && (
              <div className={`form-message ${updateMessage.includes('successfully') ? 'success' : 'error'}`}>
                {updateMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    );

    // Delete Confirmation Modal Component
    const DeleteConfirmModal = () => (
      showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProductToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="delete-confirm-btn" 
                onClick={() => handleDeleteProduct(productToDelete._id)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )
    );


    // Add Item API handler for new AddItemForm
    const handleAddItemAPI = async (form) => {
      const res = await fetch(`${apiUrl}/api/v1/product/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to add product');
      // Refresh the products list to show the new item
      await fetchProducts();
      // Navigate back to dashboard
      setCurrentView('dashboard');
    };

    if (currentView === 'updatequantity') {
      return (
        <div className="dashboard">
          <nav className="dashboard-nav">
            <div className="nav-left">
              <button className="back-btn" onClick={() => setCurrentView('updatelist')}>
                ← Back to Update List
              </button>
            </div>
            <div className="nav-center">
              <Logo />
              <span className="nav-title">InventoryPro</span>
            </div>
            <div className="nav-right">
              <span className="welcome-text">Welcome, {user?.name || user?.username || 'User'}</span>
              <button className="logout-btn" onClick={handleLogout}>
                <span>🚪</span>
              </button>
            </div>
          </nav>
          <div className="dashboard-content">
            <UpdateQuantityPage />
            <DeleteConfirmModal />
          </div>
        </div>
      );
    }

    if (currentView === 'updatelist') {
      return (
        <div className="dashboard">
          <nav className="dashboard-nav">
            <div className="nav-left">
              <button className="back-btn" onClick={() => setCurrentView('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            <div className="nav-center">
              <Logo />
              <span className="nav-title">InventoryPro</span>
            </div>
            <div className="nav-right">
              <span className="welcome-text">Welcome, {user?.name || user?.username || 'User'}</span>
              <button className="logout-btn" onClick={handleLogout}>
                <span>🚪</span>
              </button>
            </div>
          </nav>
          <div className="dashboard-content">
            <UpdateListPage />
            <DeleteConfirmModal />
          </div>
        </div>
      );
    }

    if (currentView === 'additem') {
      return (
        <div className="dashboard">
          <nav className="dashboard-nav">
            <div className="nav-left">
              <button className="back-btn" onClick={() => setCurrentView('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            <div className="nav-center">
              <Logo />
              <span className="nav-title">InventoryPro</span>
            </div>
            <div className="nav-right">
              <span className="welcome-text">Welcome, {user?.name || user?.username || 'User'}</span>
              <button className="logout-btn" onClick={handleLogout}>
                <span>🚪</span>
              </button>
            </div>
          </nav>
          <div className="dashboard-content">
            <div className="add-item-header">
              <h1>Add New Item to Inventory</h1>
              <p>Fill in all the information for your new item</p>
            </div>
            <AddItemForm onAdd={handleAddItemAPI} />
          </div>
        </div>
      );
    }

    if (currentView === 'inventory') {
      return (
        <div className="dashboard">
          <nav className="dashboard-nav">
            <div className="nav-left">
              <button className="back-btn" onClick={() => setCurrentView('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            <div className="nav-center">
              <Logo />
              <span className="nav-title">InventoryPro</span>
            </div>
            <div className="nav-right">
              <span className="welcome-text">Welcome, {user?.name || user?.username || 'User'}</span>
              <button className="logout-btn" onClick={handleLogout}>
                <span>🚪</span>
              </button>
            </div>
          </nav>
          <div className="dashboard-content">
            <InventoryPage />
          </div>
        </div>
      );
    }

    return (
      <div className="dashboard">
        {/* Navigation Bar */}
        <nav className="dashboard-nav">
          <div className="nav-left">
            <Logo />
            <span className="nav-title">InventoryPro</span>
          </div>
          <div className="nav-right">
            <span className="welcome-text">Welcome, {user?.name || user?.username || 'User'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span>
            </button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Manage Your Inventory</h1>
            <p>What would you like to do today?</p>
          </div>
          
          <div className="dashboard-cards">
            {/* View Inventory Card */}
            <div className="dashboard-card" onClick={() => setCurrentView('inventory')}>
              <div className="card-icon blue-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 8L22 11V17L16 20L10 17V11L16 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M16 20V14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M22 11L16 14L10 11" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>View Inventory</h3>
              <p>View all your items, search, and manage your inventory</p>
              <button className="card-btn blue-btn">Show Inventory</button>
            </div>

            {/* Add Product Card */}
            <div className="dashboard-card" onClick={() => setCurrentView('additem')}>
              <div className="card-icon green-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 8V24M8 16H24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Add New Item</h3>
              <p>Add a new item to your inventory with all the details</p>
              <button className="card-btn gray-btn">Add Item</button>
            </div>

            {/* Update Inventory Card */}
            <div className="dashboard-card" onClick={() => setCurrentView('updatelist')}>
              <div className="card-icon orange-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M20 8L28 16L20 24M12 24L4 16L12 8M24 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Update Quantity</h3>
              <p>Update the quantity of existing items in your inventory</p>
              <button className="card-btn gray-btn">Update Quantity</button>
            </div>
          </div>

          {/* Quick Overview Card - Bottom Horizontal */}
          <div className="overview-section">
            <div className="dashboard-card overview-card-horizontal">
              <div className="card-header">
                <h3>Quick Overview</h3>
              </div>
              <div className="card-content">
                <div className="overview-stats-horizontal">
                  <div className="stat-item">
                    <span className="stat-value blue-text">{products.length}</span>
                    <span className="stat-label">Total Items</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value green-text">${totalValue.toFixed(0)}</span>
                    <span className="stat-label">Total Value</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value orange-text">{[...new Set(products.map(p => p.type))].length}</span>
                    <span className="stat-label">Categories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isCheckingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="auth-outer">
      {/* Minimal background shapes */}
      <div className="bg-shape shape1"></div>
      <div className="bg-shape shape2"></div>
      <div className="bg-shape shape3"></div>
      <div className="auth-header">
        <Logo />
        <h1 className="app-title">InventoryPro</h1>
        <div className="app-desc">Simple inventory management</div>
      </div>
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">{showLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <div className="auth-subtitle">{showLogin ? 'Sign in to your account' : 'Sign up to get started'}</div>
          {/* Toggle links removed for cleaner UI, handled by switch-link below */}
          {showLogin ? (
            <form className="auth-form" onSubmit={handleLogin} autoComplete="off">
              <label>Email or Username</label>
              <input type="text" name="username" placeholder="Enter your email or username" value={loginData.username} onChange={e => handleInputChange(e, 'login')} required />
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={e => handleInputChange(e, 'login')}
                  required
                />
                <span className="show-hide" onClick={() => setShowPassword(v => !v)} title={showPassword ? 'Hide' : 'Show'}>
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
              <button type="submit">Sign In</button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignup} autoComplete="off">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Enter your name" value={signupData.name} onChange={e => handleInputChange(e, 'signup')} required />
              <label>Username</label>
              <input type="text" name="username" placeholder="Choose a username" value={signupData.username} onChange={e => handleInputChange(e, 'signup')} required />
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your email" value={signupData.email} onChange={e => handleInputChange(e, 'signup')} required />
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={e => handleInputChange(e, 'signup')}
                  required
                  minLength={8}
                />
                <span className="show-hide" onClick={() => setShowPassword(v => !v)} title={showPassword ? 'Hide' : 'Show'}>
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
              <button type="submit">Sign Up</button>
            </form>
          )}
          <div className="switch-link">
            {showLogin ? (
              <>
                <div>Don't have an account?</div>
                <div><span className="switch-action" onClick={() => setShowLogin(false)}>Sign up here</span></div>
              </>
            ) : (
              <>
                <div>Already have an account?</div>
                <div><span className="switch-action" onClick={() => setShowLogin(true)}>Sign in here</span></div>
              </>
            )}
          </div>
          {message && <div className="message">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
