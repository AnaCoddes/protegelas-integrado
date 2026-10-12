const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
require ('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const app = express();

// Verifica se quem está chamando GET / respostas tem o token válido
function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({erro: 'Token não fornecido'});
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (erro) {
        return res.status(401).json({erro: 'Token inválido'});
    }
}

app.get('/', (req, res) => {
    res.send('API rodando!');
});

app.get('/teste-banco', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW()');
        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

app.use(express.json());

// SALVA uma resposta nova (uma vítima, um preenchimento):
app.post('/respostas', async (req, res) => {
    try {
        const { respostas, latitude, longitude } = req.body;
        const resultado = await pool.query(
            'INSERT INTO respostas (respostas, latitude, longitude) VALUES ($1, $2, $3) RETURNING *',
            [respostas, latitude, longitude]
        );
        
        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// BUSCA todas as respostas já salvas (todas as vítimas, todos os preenchimentos):
app.get('/respostas', verificarToken, async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM respostas');
        res.json(resultado.rows);     
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Acesso das pesquisadoras
// cadastro:
app.post('/pesquisadoras/cadastro', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const resultado = await pool.query(
            'INSERT INTO pesquisadoras (email, senha) VALUES ($1, $2) RETURNING id, email',
            [email, senhaCriptografada]
        );
        
        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// login
app.post('/pesquisadoras/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const resultado = await pool.query(
            'SELECT * FROM pesquisadoras WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
        }

        const pesquisadora = resultado.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, pesquisadora.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos' }); 
        }

        // JWT_SECRET: autenticador de tokens
        const token = jwt.sign({ id: pesquisadora.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
   
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

app.listen(3000, () => {
    console.log('Servidor reodando na porta 3000');
});