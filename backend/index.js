const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
require ('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const app = express();

const limiteRespostas  = rateLimit ({
    windowMs: 15 * 60 * 1000, // 15min
    max: 10, // no máximo 10 respostas por IP a cada 15min
    message: { erro: 'Muitas respostas. Tente novamente mais tarde.'}

})

// Verifica se quem está chamando GET / respostas tem o token válido
// Se não houver token, retorna erro 401; se o token for inválido ou estiver expirado, também retorna 401; se for válido, executa next(), permitindo que a requisição continue para a rota.

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
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

app.use(express.json());

// SALVA uma resposta nova (uma vítima, um preenchimento):

// respostas precisa existir (não pode ser vazio), e latitude e longitude precisam ser número (nem texto e nem vazio)
app.post('/respostas', limiteRespostas, async (req, res) => {
    try {
        const { respostas, latitude, longitude } = req.body;

        if(!respostas || typeof respostas !== 'object' || Object.keys(respostas).length === 0) {
            return res.status(400).json({ erro: 'Respostas inválidas ou não enviadas' });
        }
        
        if(typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ erro: 'Latitude e longitude precisam ser números válidos' });
        }
        const resultado = await pool.query(
            'INSERT INTO respostas (respostas, latitude, longitude) VALUES ($1, $2, $3) RETURNING *',
            [respostas, latitude, longitude]
        );
        
        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// BUSCA todas as respostas já salvas (todas as vítimas, todos os preenchimentos):
app.get('/respostas', verificarToken, async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM respostas');
        res.json(resultado.rows);     
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// Acesso das pesquisadoras
// cadastro: exige o código de acesso
app.post('/pesquisadoras/cadastro', async (req, res) => {
    try {
        const { email, senha, codigo } = req.body;
        if (codigo !== process.env.CODIGO_CADASTRO_PESQUISADORA) {
            return res.status(403).json({ erro: 'Código de acesso inválido' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            'INSERT INTO pesquisadoras (email, senha) VALUES ($1, $2) RETURNING id, email',
            [email, senhaCriptografada]
        );
        
        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
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
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});