import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: String, required: true },
  tamanho: { type: String, required: true },
  imagem: { type: String, required: true }, // URL da imagem
  // 🆕 NOVO CAMPO ADICIONADO AQUI:
  categoria: { 
    type: String, 
    required: true,
    enum: ['Bordados', 'Amigurumis', 'Crochê', 'Patchwork'], // Só aceita uma dessas 4 opções
    default: 'Amigurumis' // Se não for enviado nada, assume Amigurumis
  }
});

const Produto = mongoose.model('Produto', ProdutoSchema);
export default Produto;