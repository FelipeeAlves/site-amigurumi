import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
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

// ==================== ROTAS DE PRODUTOS ====================

// 📑 CADASTRAR PRODUTO (POST) - Atualizado com Categoria
app.post('/api/produtos', async (req, res) => {
  try {
    // 🆕 Adicionamos 'categoria' aqui na desestruturação do req.body
    const { nome, preco, tamanho, imagem, categoria } = req.body;
    
    // 🆕 Passamos a categoria para o novo Produto
    const novoProduto = new Produto({ nome, preco, tamanho, imagem, categoria });
    
    await novoProduto.save();
    res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!', produto: novoProduto });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar produto.', erro: erro.message });
  }
});

// 🛒 LISTAR PRODUTOS NA LOJA (GET)
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar produtos.', erro: erro.message });
  }
});

// 🗑️ DELETAR PRODUTO (DELETE)
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Produto.findByIdAndDelete(id);
    res.json({ mensagem: 'Produto deletado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao deletar produto.', erro: erro.message });
  }
});


// ==================== ROTAS DE PEDIDOS ====================

// 🛒 1. CRIAR NOVO PEDIDO (POST) - Chamado pela Loja
app.post('/api/pedidos', async (req, res) => {
  try {
    const { produtoNome, preco } = req.body;
    
    const novoPedido = new Pedido({ 
      produtoNome, 
      preco,
      status: 'Pendente' 
    });
    
    await novoPedido.save();
    res.status(201).json({ mensagem: 'Pedido recebido!', pedido: novoPedido });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao salvar pedido.', erro: erro.message });
  }
});

// 📋 2. LISTAR APENAS PEDIDOS PENDENTES (GET) - Chamado pelo Admin
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find({ status: 'Pendente' });
    res.json(pedidos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar pedidos.', erro: erro.message });
  }
});

// 🆕 3. FINALIZAR PEDIDO (PUT) - Chamado pelo botão no Admin
app.put('/api/pedidos/:id/finalizar', async (req, res) => {
  try {
    const { id } = req.params;
    
    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      id, 
      { status: 'Finalizado' }, 
      { new: true }
    );

    if (!pedidoAtualizado) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    }

    res.json({ mensagem: '🎉 Pedido finalizado com sucesso!', pedido: pedidoAtualizado });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao finalizar pedido.', erro: erro.message });
  }
});


// ==================== ROTAS DE AUTENTICAÇÃO ====================

// 👤 CADASTRAR USUÁRIO ADMIN (POST)
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

// 🔑 REALIZAR LOGIN (POST)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome }, 
      'SEGREDO_DO_ATELIE', 
      { expiresIn: '2h' }
    );

    res.json({
      mensagem: '🎉 Login realizado com sucesso!',
      token: token,
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