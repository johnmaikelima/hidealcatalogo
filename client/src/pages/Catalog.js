import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Catalog.css';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm, priceRange]);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category_id === parseInt(selectedCategory));
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (!p.price) return false;
        if (max === Infinity) return p.price >= min;
        return p.price >= min && p.price <= max;
      });
    }

    setFilteredProducts(filtered);
  };

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="catalog">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Catálogo de Produtos</h1>
          <p>Explore nossa completa linha de equipamentos hidráulicos e peças de reposição</p>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-wrapper">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </div>
            <div className="filter-group">
              <label htmlFor="categoryFilter">Categoria:</label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="priceFilter">Preço:</label>
              <select
                id="priceFilter"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Qualquer preço</option>
                <option value="0-500">Até R$ 500</option>
                <option value="500-1000">R$ 500 - R$ 1.000</option>
                <option value="1000-5000">R$ 1.000 - R$ 5.000</option>
                <option value="5000-Infinity">Acima de R$ 5.000</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2>Categorias</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="category-item"
                onClick={() => setSelectedCategory(cat.id.toString())}
              >
                <i className={cat.icon}></i>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="products-section">
        <div className="container">
          <h2>Produtos</h2>
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>Nenhum produto encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.category_id);
                const slug = slugify(product.name);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className="product-image-placeholder">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <span className="product-category">{category?.name}</span>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      {product.price ? (
                        <div className="product-price">R$ {product.price.toLocaleString('pt-BR')}</div>
                      ) : (
                        <div className="product-price no-price">Consulte nosso atendimento para orçamento</div>
                      )}
                      <div className="product-actions">
                        <Link to={`/produto/${slug}`} className="product-link">
                          <i className="fas fa-eye"></i> Ver Detalhes
                        </Link>
                        <a
                          href={`https://wa.me/5511996984893?text=Olá! Tenho interesse no produto: ${encodeURIComponent(product.name)}`}
                          className="product-whatsapp"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-whatsapp"></i> Orçamento
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Não encontrou o que procura?</h2>
            <p>Entre em contato conosco para conhecer mais sobre nossos produtos e serviços</p>
            <a href="https://wa.me/5511996984893" className="btn btn-light" target="_blank" rel="noopener noreferrer">
              Fale Conosco via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Catalog;
