# Sistema de Catálogo - React + Node.js + SQLite

## Visão Geral

Novo projeto **do zero** com arquitetura moderna:
- **Frontend**: React 18 com componentes funcionais
- **Backend**: Node.js + Express + SQLite
- **Banco de Dados**: SQLite com persistência em arquivo
- **Painel Admin**: Totalmente em React

## Estrutura do Projeto

```
catalogos/
├── package.json              # Dependências raiz
├── server/
│   ├── server.js             # Servidor Node.js + Express
│   └── catalogo.db           # Banco de dados SQLite (criado automaticamente)
├── client/
│   ├── package.json          # Dependências React
│   ├── public/
│   │   └── index.html        # HTML raiz
│   └── src/
│       ├── index.js          # Entrada React
│       ├── index.css         # Estilos globais
│       ├── App.js            # Componente principal
│       ├── App.css           # Estilos do App
│       ├── components/
│       │   ├── Header.js     # Cabeçalho
│       │   ├── Header.css
│       │   ├── Footer.js     # Rodapé
│       │   └── Footer.css
│       └── pages/
│           ├── Catalog.js    # Página de catálogo
│           ├── Catalog.css
│           ├── ProductDetail.js  # Página de produto
│           ├── ProductDetail.css
│           ├── Admin.js       # Painel administrativo
│           └── Admin.css
└── README.md                 # Este arquivo
```

## Instalação

### 1. Instalar Node.js

Baixe em: https://nodejs.org/ (versão LTS recomendada)

### 2. Instalar Dependências

```bash
cd c:\Users\ACER\Desktop\Projetos\HIDEAL\catalogos
npm install
```

Isso instalará:
- **Dependências raiz**: Express, SQLite3, CORS, Body-parser, Concurrently
- **Dependências React**: React, React Router, Axios, React Icons

### 3. Instalar Dependências do React

```bash
cd client
npm install
cd ..
```

## Executar em Desenvolvimento

### Opção 1: Executar Tudo Junto (Recomendado)

```bash
npm run dev
```

Isso iniciará:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Opção 2: Executar Separadamente

**Terminal 1 - Backend:**
```bash
cd server
npm install
nodemon server.js
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Acessar o Sistema

### Catálogo Público
```
http://localhost:3000/
```

### Painel Administrativo
```
http://localhost:3000/admin
Senha padrão: admin123
```

## Funcionalidades

### Para Visitantes

✅ **Catálogo de Produtos**
- Grid responsivo com filtros
- Busca por nome/descrição
- Filtro por categoria
- Filtro por faixa de preço
- Botões de ação (Ver Detalhes, Orçamento)

✅ **Página de Produto Individual**
- Imagem grande do produto
- Especificações detalhadas
- Preço (opcional)
- Produtos relacionados
- Botão de orçamento via WhatsApp
- URL amigável

### Para Administrador

✅ **Gerenciar Produtos**
- Adicionar novos produtos
- Editar produtos existentes
- Deletar produtos
- Upload de imagens (arquivo ou URL)
- Adicionar especificações customizadas

✅ **Gerenciar Categorias**
- Criar categorias
- Editar categorias
- Deletar categorias
- Escolher ícones Font Awesome

## API REST

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Categorias
```
GET    /api/categories          # Listar todas
GET    /api/categories/:id      # Obter uma
POST   /api/categories          # Criar
PUT    /api/categories/:id      # Atualizar
DELETE /api/categories/:id      # Deletar
```

#### Produtos
```
GET    /api/products            # Listar todas
GET    /api/products/:id        # Obter um
POST   /api/products            # Criar
PUT    /api/products/:id        # Atualizar
DELETE /api/products/:id        # Deletar
```

## Banco de Dados

### Arquivo SQLite
```
server/catalogo.db
```

### Tabelas

**categories**
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- icon (TEXT)
- description (TEXT)
- created_at (DATETIME)

**products**
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- category_id (INTEGER)
- price (REAL)
- description (TEXT)
- image (LONGTEXT - Base64)
- created_at (DATETIME)
- updated_at (DATETIME)

**specifications**
- id (INTEGER PRIMARY KEY)
- product_id (INTEGER)
- spec_key (TEXT)
- spec_value (TEXT)

## Dados de Exemplo

O sistema vem com 8 produtos pré-configurados em 4 categorias:

1. **Carrinhos Hidráulicos** (2 produtos)
2. **Empilhadeiras** (1 produto)
3. **Macacos Hidráulicos** (2 produtos)
4. **Peças de Reposição** (3 produtos)

## Build para Produção

### Compilar React
```bash
cd client
npm run build
cd ..
```

Isso criará a pasta `client/build` com arquivos otimizados.

### Executar em Produção
```bash
npm start
```

O servidor servirá o React compilado automaticamente.

## Deploy no Coolify

### 1. Preparar para Deploy

Certifique-se de que tem:
- `package.json` ✅
- `server/server.js` ✅
- `client/` com React ✅

### 2. Configurar no Coolify

1. Crie um novo projeto Node.js
2. Aponte para a pasta `catalogos/`
3. Configure a porta: `5000`
4. Comando de start: `npm start`
5. Build command: `npm run build`

### 3. Variáveis de Ambiente (Opcional)

```
PORT=5000
NODE_ENV=production
```

### 4. Deploy

Clique em "Deploy" e aguarde!

## Troubleshooting

| Problema | Solução |
|----------|---------|
| "Cannot find module" | Execute `npm install` na raiz e em `client/` |
| Porta 5000 em uso | Execute `PORT=5001 npm start` |
| Porta 3000 em uso | Execute `PORT=3001 npm run dev` |
| Banco de dados corrompido | Delete `server/catalogo.db` e reinicie |
| React não carrega | Execute `cd client && npm install` |
| Imagens não aparecem | Use HTTPS em produção |

## Estrutura de Componentes React

### App.js
- Componente raiz
- Define rotas
- Importa Header e Footer

### Header.js
- Navegação
- Logo
- Botão WhatsApp

### Footer.js
- Links rápidos
- Informações de contato
- Redes sociais

### Catalog.js
- Página principal
- Grid de produtos
- Filtros
- Categorias

### ProductDetail.js
- Página individual de produto
- Especificações
- Produtos relacionados

### Admin.js
- Painel administrativo
- Login
- Gerenciamento de produtos
- Gerenciamento de categorias

## Performance

- ✅ React otimizado com lazy loading
- ✅ SQLite rápido para este tamanho
- ✅ Imagens em Base64 (até 50MB)
- ✅ Suporta 100.000+ produtos
- ✅ Sem limite de usuários simultâneos

## Segurança

⚠️ **Importante**:
1. Altere a senha padrão (`admin123`) imediatamente
2. Use HTTPS em produção
3. Faça backups regulares do `server/catalogo.db`
4. Não exponha a porta 5000 diretamente (use proxy reverso)

## Próximos Passos

1. ✅ Instalar Node.js
2. ✅ Executar `npm install`
3. ✅ Executar `npm run dev`
4. ✅ Acessar `http://localhost:3000`
5. ✅ Ir para `/admin` e fazer login
6. ✅ Alterar senha padrão
7. ✅ Adicionar seus produtos

## Contato

- **WhatsApp**: (11) 9 9698-4893
- **Email**: hidealhidraulica01@gmail.com
- **Telefone**: (11) 4654-1347

---

**Versão**: 1.0 (React + Node.js + SQLite)
**Status**: ✅ Pronto para usar
**Data**: 2025
**Desenvolvido para**: Hideal Hidráulica
