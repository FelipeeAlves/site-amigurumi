import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; // 🆕 Importação do JWT para gerar o "crachá" de acesso
import Pedido from './models/Pedido.js';
import Produto from './models/Produto.js'; 
import Usuario from './models/Usuario.js'; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado com sucesso ao MongoDB Atlas!'))
  .catch((erro) => console.error('❌ Erro ao conectar ao MongoDB:', erro));

app.get('/', (req, res) => {
  res.send('Servidor do Amigurumi está online!');
});

// 📑 ROTA PARA CADASTRAR PRODUTO (POST)
app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, preco, tamanho, imagem } = req.body;
    const novoProduto = new Produto({ nome, preco, tamanho, imagem });
    await novoProduto.save();
    res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!', produto: novoProduto });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar produto.', erro: erro.message });
  }
});

// 🛒 ROTA PARA LISTAR PRODUTOS NO SITE (GET)
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar produtos.', erro: erro.message });
  }
});

// ROTA DE PEDIDOS (POST)
app.post('/api/pedidos', async (req, res) => {
  try {
    const { produtoNome, preco } = req.body;
    const novoPedido = new Pedido({ produtoNome, preco });
    await novoPedido.save();
    res.status(201).json({ mensagem: 'Pedido recebido!', pedido: novoPedido });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao salvar pedido.', erro: erro.message });
  }
});

// ROTA PARA LISTAR OS PEDIDOS (GET)
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar pedidos.', erro: erro.message });
  }
});

// ROTA PARA DELETAR PRODUTO (DELETE)
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Produto.findByIdAndDelete(id);
    res.json({ mensagem: 'Produto deletado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao deletar produto.', erro: erro.message });
  }
});

// 👤 ROTA PARA CADASTRAR O USUÁRIO ADMIN (POST)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({ nome, email, senha: senhaCriptografada });
    await novoUsuario.save();

    res.status(201).json({ mensagem: 'Usuário administrador criado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.', erro: erro.message });
  }
});

// 🔑 🆕 ROTA DE LOGIN (POST) - Verifica os dados e entrega o Token
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Busca o usuário pelo e-mail informado
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      // Retorna 400 se o e-mail não existir no banco
      return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    // 2. Compara a senha digitada com a senha criptografada que está no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      // Retorna 400 se a senha estiver errada
      return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    // 3. Se passou pelos testes, gera o Token JWT (o crachá de acesso)
    // Usamos uma palavra-chave para assinar o token ('SEGREDO_DO_ATELIE') e dizemos que ele expira em 2 horas
    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome }, 
      'SEGREDO_DO_ATELIE', 
      { expiresIn: '2h' }
    );

    // 4. Responde enviando o token gerado e os dados básicos do usuário logado
    res.json({
      mensagem: '🎉 Login realizado com sucesso!',
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzIzODRjZWVmMGM3NGU1ODcyMzYzZSIsIm5vbWUiOiJGZWxpcGUiLCJpYXQiOjE3ODE2NzY2MjYsImV4cCI6MTc4MTY4MzgyNn0.lHsiR7k4L2ydd9GCqw6JJ9wtyiCVtfEX2fYYlL3Zkcg",
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao realizar login.', erro: erro.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
});