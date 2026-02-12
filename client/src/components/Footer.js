import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Hideal Hidráulica</h4>
            <p>Soluções práticas, eficientes e confiáveis para o seu negócio</p>
          </div>
          <div className="footer-section">
            <h4>Links Rápidos</h4>
            <ul>
              <li><a href="/">Catálogo</a></li>
              <li><a href="/admin">Painel Admin</a></li>
              <li><a href="https://hidealhidraulica.com.br">Site Principal</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contato</h4>
            <ul className="contact-info">
              <li><i className="fas fa-phone"></i> (11) 4654-1347</li>
              <li><i className="fab fa-whatsapp"></i> (11) 9 9698-4893</li>
              <li><i className="fas fa-envelope"></i> hidealhidraulica01@gmail.com</li>
              <li><i className="fas fa-map-marker-alt"></i> Rua Simões, 42 - Guarulhos/SP</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Redes Sociais</h4>
            <div className="social-links">
              <a href="javascript:void(0)" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="javascript:void(0)" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="javascript:void(0)" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="javascript:void(0)" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Hideal Hidráulica. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
