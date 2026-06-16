import mongoose from 'mongoose';

// Definindo o molde do que um "Pedido" precisa ter
const PedidoSchema = new mongoose.Schema({
  produtoNome: {
    type: String,
    required: true // O nome do amigurumi é obrigatório
  },
  preco: {
    type: String,
    required: true
  },
  dataPedido: {
    type: Date,
    default: Date.now // Se não passarmos a data, ele pega a hora atual automaticamente
  },
  status: {
    type: String,
    default: 'Pendente' // Todo pedido novo começa como Pendente
  }
});

// Criando o Modelo baseado no Schema
const Pedido = mongoose.model('Pedido', PedidoSchema);

export default Pedido;