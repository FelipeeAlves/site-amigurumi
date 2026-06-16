import React, { useState } from 'react';

function FormularioProduto({ onProdutoCadastrado }) {
  // Estados para controlar o que o usuário digita nos inputs
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [imagem, setImagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que a página recarregue

    try {
      const resposta = await fetch('http://localhost:5000/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, tamanho, imagem })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('🎉 Produto cadastrado com sucesso!');
        // Limpa os campos do formulário
        setNome(''); setPreco(''); setTamanho(''); setImagem('');
        // Avisa o componente pai para atualizar a lista na tela
        onProdutoCadastrado();
      } else {
        alert('❌ Erro: ' + dados.mensagem);
      }
    } catch (erro) {
      alert('⚠️ Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={styles.formContainer}>
      <h3> + Cadastrar Novo Amigurumi</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Nome do Amigurumi (ex: Leãozinho)" value={nome} onChange={(e) => setNome(e.target.value)} required style={styles.input}/>
        <input type="text" placeholder="Preço (ex: R$ 89,90)" value={preco} onChange={(e) => setPreco(e.target.value)} required style={styles.input}/>
        <input type="text" placeholder="Tamanho (ex: 20cm)" value={tamanho} onChange={(e) => setTamanho(e.target.value)} required style={styles.input}/>
        <input type="text" placeholder="URL da Imagem na internet" value={imagem} onChange={(e) => setImagem(e.target.value)} required style={styles.input}/>
        <button type="submit" style={styles.botao}>Salvar no Banco de Dados</button>
      </form>
    </div>
  );
}

const styles = {
  formContainer: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', maxWidth: '400px', margin: '20px auto', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' },
  botao: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default FormularioProduto;