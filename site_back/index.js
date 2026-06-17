import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pedido from './models/Pedido.js';
import Produto from './models/Produto.js'; // Garanta que essa linha existe!

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

// ROTA DE PEDIDOS
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

app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar pedidos.', erro: erro.message });
  }
});

app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Produto.findByIdAndDelete(id);
    res.json({ mensagem: 'Produto deletado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao deletar produto.', erro: erro.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
});