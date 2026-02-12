import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="https://hidealhidraulica.com.br/img/logo.png" alt="Hideal Hidráulica" />
          </Link>
          <nav>
            <ul className="nav-menu">
              <li><a href="https://hidealhidraulica.com.br" target="_blank" rel="noopener noreferrer">Início</a></li>
              <li><a href="https://hidealhidraulica.com.br/sobre.html" target="_blank" rel="noopener noreferrer">Sobre Nós</a></li>
              <li><a href="https://hidealhidraulica.com.br/produtos.html" target="_blank" rel="noopener noreferrer">Produtos</a></li>
              <li><a href="https://hidealhidraulica.com.br/informacoes.html" target="_blank" rel="noopener noreferrer">Informações</a></li>
              <li><a href="https://hidealhidraulica.com.br/contato.html" target="_blank" rel="noopener noreferrer">Contato</a></li>
              <li className="nav-catalog"><Link to="/">Catálogo</Link></li>
            </ul>
          </nav>
          <a href="https://wa.me/5511996984893" className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i>
            <span>Falar com um atendente</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
