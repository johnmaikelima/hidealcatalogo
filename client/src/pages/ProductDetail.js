import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const loadProduct = async () => {
    try {
      const allProducts = await axios.get('/api/products');
      const foundProduct = allProducts.data.find(p => slugify(p.name) === slug);
      
      if (!foundProduct) {
        setLoading(false);
        return;
      }

      setProduct(foundProduct);

      const related = allProducts.data
        .filter(p => p.category_id === foundProduct.category_id && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h1>Produto não encontrado</h1>
          <Link to="/" className="btn btn-primary">Voltar ao Catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Catálogo</Link>
            <span>/</span>
            <span>{product.category_name}</span>
            <span>/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-wrapper">
            <div className="product-detail-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="product-detail-image-placeholder">
                  <i className="fas fa-image"></i>
                </div>
              )}
            </div>
            <div className="product-detail-info">
              <span className="product-detail-category">{product.category_name}</span>
              <h1>{product.name}</h1>
              {product.price ? (
                <div className="product-detail-price">R$ {product.price.toLocaleString('pt-BR')}</div>
              ) : (
                <div className="product-detail-price no-price">Consulte nosso atendimento para orçamento</div>
              )}
              <p className="product-detail-description">{product.description}</p>

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="product-detail-specs">
                  <h3>Especificações</h3>
                  <ul className="specs-list">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="product-detail-actions">
                <a
                  href={`https://wa.me/5511996984893?text=Olá! Tenho interesse no produto: ${encodeURIComponent(product.name)}. Gostaria de mais informações e um orçamento.`}
                  className="btn-detail whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp"></i> Solicitar Orçamento
                </a>
                <a href="mailto:hidealhidraulica01@gmail.com" className="btn-detail primary">
                  <i className="fas fa-envelope"></i> Enviar Mensagem
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="container">
            <h2>Produtos Relacionados</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => {
                const slug = slugify(relatedProduct.name);
                return (
                  <div key={relatedProduct.id} className="product-card">
                    <div className="product-image">
                      {relatedProduct.image ? (
                        <img src={relatedProduct.image} alt={relatedProduct.name} />
                      ) : (
                        <div className="product-image-placeholder">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <span className="product-category">{relatedProduct.category_name}</span>
                      <h3 className="product-name">{relatedProduct.name}</h3>
                      <p className="product-description">{relatedProduct.description}</p>
                      {relatedProduct.price ? (
                        <div className="product-price">R$ {relatedProduct.price.toLocaleString('pt-BR')}</div>
                      ) : (
                        <div className="product-price no-price">Consulte nosso atendimento</div>
                      )}
                      <div className="product-actions">
                        <Link to={`/produto/${slug}`} className="product-link">
                          <i className="fas fa-eye"></i> Ver Detalhes
                        </Link>
                        <a
                          href={`https://wa.me/5511996984893?text=Olá! Tenho interesse no produto: ${encodeURIComponent(relatedProduct.name)}`}
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
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Interessado neste produto?</h2>
            <p>Entre em contato conosco para solicitar um orçamento ou mais informações</p>
            <a href="https://wa.me/5511996984893" className="btn btn-light" target="_blank" rel="noopener noreferrer">
              Fale Conosco via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
