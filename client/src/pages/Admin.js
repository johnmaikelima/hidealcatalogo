import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    description: '',
    image: '',
    specs: {}
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '',
    description: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('adminPassword') || 'admin123';
    if (password === savedPassword) {
      setIsAuthenticated(true);
      loadData();
      showNotification('Login realizado com sucesso!', 'success');
    } else {
      showNotification('Senha incorreta!', 'error');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setLoading(false);
    } catch (error) {
      showNotification('Erro ao carregar dados', 'error');
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 3000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_id: '',
      price: '',
      description: '',
      image: '',
      specs: {}
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      price: product.price || '',
      description: product.description,
      image: product.image || '',
      specs: product.specs || {}
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        category_id: parseInt(formData.category_id),
        price: formData.price ? parseFloat(formData.price) : null
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, data);
        showNotification('Produto atualizado com sucesso!', 'success');
      } else {
        await axios.post('/api/products', data);
        showNotification('Produto criado com sucesso!', 'success');
      }

      setShowProductModal(false);
      loadData();
    } catch (error) {
      showNotification('Erro ao salvar produto', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        showNotification('Produto deletado com sucesso!', 'success');
        loadData();
      } catch (error) {
        showNotification('Erro ao deletar produto', 'error');
      }
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      icon: '',
      description: ''
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      description: category.description
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory.id}`, categoryForm);
        showNotification('Categoria atualizada com sucesso!', 'success');
      } else {
        await axios.post('/api/categories', categoryForm);
        showNotification('Categoria criada com sucesso!', 'success');
      }

      setShowCategoryModal(false);
      loadData();
    } catch (error) {
      showNotification('Erro ao salvar categoria', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (products.some(p => p.category_id === id)) {
      showNotification('Não é possível deletar uma categoria que contém produtos!', 'error');
      return;
    }

    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await axios.delete(`/api/categories/${id}`);
        showNotification('Categoria deletada com sucesso!', 'success');
        loadData();
      } catch (error) {
        showNotification('Erro ao deletar categoria', 'error');
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-box">
            <h2>Painel Administrativo</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="password">Senha de Acesso:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                Acessar
              </button>
            </form>
            <p className="login-info">
              <i className="fas fa-info-circle"></i>
              Utilize a senha fornecida para acessar o painel administrativo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <h1><i className="fas fa-cogs"></i> Painel Administrativo</h1>
            <button onClick={handleLogout} className="btn btn-secondary">
              <i className="fas fa-sign-out-alt"></i> Sair
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Content */}
      <div className="container">
        <div className="admin-wrapper">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <nav className="admin-nav">
              <button
                className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <i className="fas fa-box"></i> Produtos
              </button>
              <button
                className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <i className="fas fa-list"></i> Categorias
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-content">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="admin-tab">
                <div className="tab-header">
                  <h2>Gerenciar Produtos</h2>
                  <button onClick={handleAddProduct} className="btn btn-primary">
                    <i className="fas fa-plus"></i> Novo Produto
                  </button>
                </div>

                {loading ? (
                  <div className="loading">Carregando...</div>
                ) : (
                  <div className="products-table-wrapper">
                    <table className="products-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nome</th>
                          <th>Categoria</th>
                          <th>Preço</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => {
                          const category = categories.find(c => c.id === product.category_id);
                          return (
                            <tr key={product.id}>
                              <td>{product.id}</td>
                              <td>{product.name}</td>
                              <td>{category?.name}</td>
                              <td>{product.price ? `R$ ${product.price.toLocaleString('pt-BR')}` : 'Sem preço'}</td>
                              <td>
                                <div className="table-actions">
                                  <button
                                    className="edit-btn"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <i className="fas fa-edit"></i> Editar
                                  </button>
                                  <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <i className="fas fa-trash"></i> Deletar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="admin-tab">
                <div className="tab-header">
                  <h2>Gerenciar Categorias</h2>
                  <button onClick={handleAddCategory} className="btn btn-primary">
                    <i className="fas fa-plus"></i> Nova Categoria
                  </button>
                </div>

                {loading ? (
                  <div className="loading">Carregando...</div>
                ) : (
                  <div className="categories-grid">
                    {categories.map(category => (
                      <div key={category.id} className="category-card">
                        <i className={category.icon}></i>
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                        <div className="category-card-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditCategory(category)}
                          >
                            <i className="fas fa-edit"></i> Editar
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <i className="fas fa-trash"></i> Deletar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button
                className="modal-close"
                onClick={() => setShowProductModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label htmlFor="productName">Nome do Produto:</label>
                <input
                  type="text"
                  id="productName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="productCategory">Categoria:</label>
                  <select
                    id="productCategory"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="productPrice">Preço (R$):</label>
                  <input
                    type="number"
                    id="productPrice"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">Descrição:</label>
                <textarea
                  id="productDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="productImage">Imagem do Produto:</label>
                <input
                  type="file"
                  id="productImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <small>Você pode fazer upload de um arquivo ou colar uma URL</small>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowProductModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <button
                className="modal-close"
                onClick={() => setShowCategoryModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label htmlFor="categoryName">Nome da Categoria:</label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryIcon">Ícone (Font Awesome):</label>
                <input
                  type="text"
                  id="categoryIcon"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  placeholder="Ex: fas fa-dolly"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryDescription">Descrição:</label>
                <textarea
                  id="categoryDescription"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
