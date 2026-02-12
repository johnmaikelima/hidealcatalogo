// ===================================
// SERVIDOR NODE.JS - HIDEAL CATÁLOGO
// ===================================

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Servir arquivos estáticos do React
const buildPath = path.join(__dirname, '../client/build');
if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
}

// Inicializar banco de dados SQLite
const dbPath = path.join(__dirname, 'catalogo.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('✅ Conectado ao SQLite em:', dbPath);
        initializeDatabase();
    }
});

// Inicializar tabelas
function initializeDatabase() {
    db.serialize(() => {
        // Tabela de categorias
        db.run(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                icon TEXT NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de produtos
        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category_id INTEGER NOT NULL,
                price REAL,
                description TEXT,
                image LONGTEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )
        `);

        // Tabela de especificações
        db.run(`
            CREATE TABLE IF NOT EXISTS specifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                spec_key TEXT NOT NULL,
                spec_value TEXT NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);

        // Verificar se há dados padrão
        db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
            if (row && row.count === 0) {
                insertDefaultData();
            }
        });
    });
}

// Inserir dados padrão
function insertDefaultData() {
    const categories = [
        { name: 'Carrinhos Hidráulicos', icon: 'fas fa-dolly', description: 'Carrinhos de transporte com sistema hidráulico' },
        { name: 'Empilhadeiras', icon: 'fas fa-pallet', description: 'Equipamentos para movimentação de carga' },
        { name: 'Macacos Hidráulicos', icon: 'fas fa-cog', description: 'Macacos de diferentes capacidades' },
        { name: 'Peças de Reposição', icon: 'fas fa-tools', description: 'Componentes e peças para manutenção' }
    ];

    categories.forEach((cat) => {
        db.run(
            'INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)',
            [cat.name, cat.icon, cat.description]
        );
    });

    const products = [
        { name: 'Carrinho Hidráulico 2.5T', category_id: 1, price: 1500, description: 'Carrinho hidráulico com capacidade de 2.5 toneladas, ideal para pequenos e médios comércios.' },
        { name: 'Carrinho Hidráulico 5T', category_id: 1, price: 2500, description: 'Carrinho hidráulico profissional com capacidade de 5 toneladas, perfeito para operações intensivas.' },
        { name: 'Empilhadeira Manual 1.5T', category_id: 2, price: 3500, description: 'Empilhadeira manual com capacidade de 1.5 toneladas, operação simples e eficiente.' },
        { name: 'Macaco Hidráulico 10T', category_id: 3, price: 800, description: 'Macaco hidráulico com capacidade de 10 toneladas, ideal para levantamento de cargas.' },
        { name: 'Macaco Hidráulico 20T', category_id: 3, price: 1200, description: 'Macaco hidráulico de alta capacidade com 20 toneladas, para operações pesadas.' },
        { name: 'Kit de Peças de Reposição', category_id: 4, price: null, description: 'Kit completo com peças de reposição para manutenção de equipamentos hidráulicos.' },
        { name: 'Óleo Hidráulico Premium 20L', category_id: 4, price: 350, description: 'Óleo hidráulico de alta qualidade, 20 litros, para melhor desempenho dos equipamentos.' },
        { name: 'Cilindro Hidráulico 50mm', category_id: 4, price: 600, description: 'Cilindro hidráulico com diâmetro de 50mm, peça de reposição de alta qualidade.' }
    ];

    products.forEach((prod) => {
        db.run(
            'INSERT INTO products (name, category_id, price, description) VALUES (?, ?, ?, ?)',
            [prod.name, prod.category_id, prod.price, prod.description]
        );
    });

    console.log('✅ Dados padrão inseridos com sucesso!');
}

// ===================================
// ROTAS - CATEGORIAS
// ===================================

app.get('/api/categories', (req, res) => {
    db.all('SELECT * FROM categories ORDER BY id', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

app.get('/api/categories/:id', (req, res) => {
    db.get('SELECT * FROM categories WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Categoria não encontrada' });
        } else {
            res.json(row);
        }
    });
});

app.post('/api/categories', (req, res) => {
    const { name, icon, description } = req.body;
    db.run(
        'INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)',
        [name, icon, description],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, name, icon, description });
            }
        }
    );
});

app.put('/api/categories/:id', (req, res) => {
    const { name, icon, description } = req.body;
    db.run(
        'UPDATE categories SET name = ?, icon = ?, description = ? WHERE id = ?',
        [name, icon, description, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Categoria não encontrada' });
            } else {
                res.json({ id: req.params.id, name, icon, description });
            }
        }
    );
});

app.delete('/api/categories/:id', (req, res) => {
    db.run('DELETE FROM categories WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Categoria não encontrada' });
        } else {
            res.json({ message: 'Categoria deletada com sucesso' });
        }
    });
});

// ===================================
// ROTAS - PRODUTOS
// ===================================

app.get('/api/products', (req, res) => {
    db.all(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        ORDER BY p.id
    `, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const products = rows || [];
            products.forEach(product => {
                db.all(
                    'SELECT spec_key, spec_value FROM specifications WHERE product_id = ?',
                    [product.id],
                    (err, specs) => {
                        product.specs = {};
                        if (specs) {
                            specs.forEach(spec => {
                                product.specs[spec.spec_key] = spec.spec_value;
                            });
                        }
                    }
                );
            });
            res.json(products);
        }
    });
});

app.get('/api/products/:id', (req, res) => {
    db.get(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
    `, [req.params.id], (err, product) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!product) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            db.all(
                'SELECT spec_key, spec_value FROM specifications WHERE product_id = ?',
                [req.params.id],
                (err, specs) => {
                    product.specs = {};
                    if (specs) {
                        specs.forEach(spec => {
                            product.specs[spec.spec_key] = spec.spec_value;
                        });
                    }
                    res.json(product);
                }
            );
        }
    });
});

app.post('/api/products', (req, res) => {
    const { name, category_id, price, description, image, specs } = req.body;
    
    db.run(
        'INSERT INTO products (name, category_id, price, description, image) VALUES (?, ?, ?, ?, ?)',
        [name, category_id, price || null, description, image || null],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                const productId = this.lastID;
                
                if (specs && Object.keys(specs).length > 0) {
                    Object.entries(specs).forEach(([key, value]) => {
                        db.run(
                            'INSERT INTO specifications (product_id, spec_key, spec_value) VALUES (?, ?, ?)',
                            [productId, key, value]
                        );
                    });
                }
                
                res.json({ id: productId, name, category_id, price, description, image, specs });
            }
        }
    );
});

app.put('/api/products/:id', (req, res) => {
    const { name, category_id, price, description, image, specs } = req.body;
    
    db.run(
        'UPDATE products SET name = ?, category_id = ?, price = ?, description = ?, image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, category_id, price || null, description, image || null, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Produto não encontrado' });
            } else {
                db.run('DELETE FROM specifications WHERE product_id = ?', [req.params.id]);
                
                if (specs && Object.keys(specs).length > 0) {
                    Object.entries(specs).forEach(([key, value]) => {
                        db.run(
                            'INSERT INTO specifications (product_id, spec_key, spec_value) VALUES (?, ?, ?)',
                            [req.params.id, key, value]
                        );
                    });
                }
                
                res.json({ id: req.params.id, name, category_id, price, description, image, specs });
            }
        }
    );
});

app.delete('/api/products/:id', (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            res.json({ message: 'Produto deletado com sucesso' });
        }
    });
});

// ===================================
// ROTA PADRÃO (React)
// ===================================

app.get('*', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.json({ message: 'Servidor rodando. Execute "npm run build" para compilar o React.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Banco de dados: ${dbPath}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar banco de dados:', err);
        } else {
            console.log('\n✅ Banco de dados fechado com sucesso');
        }
        process.exit(0);
    });
});
