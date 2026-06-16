import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: String, required: true },
  tamanho: { type: String, required: true },
  imagem: { type: String, required: true } // URL da imagem
});

const Produto = mongoose.model('Produto', ProdutoSchema);
export default Produto;