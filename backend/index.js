const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const app = express();

// Necessário atrás de proxy (Vercel), senão o limite por IP enxerga todo mundo como o mesmo IP
app.set('trust proxy', 1);

// Permite que o app (principalmente a versão web) chame a API.
// Em produção, o ideal é restringir à URL do app: cors({ origin: 'https://seu-app.com' })
app.use(cors());
app.use(express.json());

const limiteRespostas = rateLimit({
    windowMs: 15 * 60 * 1000, // 15min
    max: 10, // no máximo 10 respostas por IP a cada 15min
    message: { erro: 'Muitas respostas. Tente novamente mais tarde.' }
});

// Limite para login e cadastro: dificulta tentar senhas e adivinhar o código de acesso
const limiteLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15min
    max: 10, // no máximo 10 tentativas por IP a cada 15min
    message: { erro: 'Muitas tentativas. Tente novamente mais tarde.' }
});

// Verifica se quem está chamando respostas tem o token válido
// Se não houver token, o token for inválido e/ou tiver expirado, retorna erro 401; se for válido, executa next(), permitindo que a requisição continue para a rota.
// Se a adm não existir mais no banco de dados, recusa o acesso mesmo que o token seja válido

async function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    try {
        const dadosToken = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        const resultado = await pool.query(
            'SELECT id FROM pesquisadoras WHERE id = $1',
            [dadosToken.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Pesquisadora/administradora não encontrada' });
        }
        next();
    } catch (erro) {
        return res.status(401).json({ erro: 'Token inválido' });
    }
}

app.get('/', (req, res) => {
    res.send('API rodando!');
});

// SALVA uma resposta nova (uma vítima, um preenchimento):

// respostas precisa existir (não pode ser vazio), e latitude e longitude precisam ser número (nem texto e nem vazio)
app.post('/respostas', limiteRespostas, async (req, res) => {
    try {
        const { respostas, latitude, longitude } = req.body;

        if (!respostas || typeof respostas !== 'object' || Object.keys(respostas).length === 0) {
            return res.status(400).json({ erro: 'Respostas inválidas ou não enviadas' });
        }

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
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

// BUSCA todas as respostas já salvas (todas as vítimas, todos os preenchimentos), das mais recentes para as mais antigas:
app.get('/respostas', verificarToken, async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM respostas ORDER BY criado_em DESC');
        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// Acesso das pesquisadoras
// cadastro: exige o código de acesso
app.post('/pesquisadoras/cadastro', limiteLogin, async (req, res) => {
    try {
        const { email, senha, codigo } = req.body;

        if (codigo !== process.env.CODIGO_CADASTRO_PESQUISADORA) {
            return res.status(403).json({ erro: 'Código de acesso inválido' });
        }

        if (typeof email !== 'string' || !email.trim() || typeof senha !== 'string' || senha.length < 8) {
            return res.status(400).json({ erro: 'Informe um e-mail e uma senha com pelo menos 8 caracteres' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            'INSERT INTO pesquisadoras (email, senha) VALUES ($1, $2) RETURNING id, email',
            [email.trim(), senhaCriptografada]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        // 23505 = violação de unicidade (e-mail já cadastrado)
        if (erro.code === '23505') {
            return res.status(409).json({ erro: 'Este e-mail já está cadastrado' });
        }
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// login
app.post('/pesquisadoras/login', limiteLogin, async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha) {
            return res.status(400).json({ erro: 'Informe e-mail e senha' });
        }

        const resultado = await pool.query(
            'SELECT * FROM pesquisadoras WHERE email = $1',
            [email.trim()]
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

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
