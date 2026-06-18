import React, { useState, useEffect } from 'react';
import '../styles/Loja.css'; // Apontando corretamente para a pasta styles

function Loja() {
  const [amigurumis, setAmigurumis] = useState([]);

  const carregarProdutos = async () => {
    try {
      const resposta = await fetch('http://localhost:5000/api/produtos');
      const dados = await resposta.json();
      setAmigurumis(dados);
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleCompra = async (nomeProduto, precoProduto) => {
    try {
      const resposta = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtoNome: nomeProduto, preco: precoProduto }),
      });
      const dados = await resposta.json();
      if (resposta.ok) {
        alert(`🎉 Sucesso! Pedido recebido de: ${dados.pedido.produtoNome}`);
      }
    } catch (erro) {
      alert("⚠️ Erro ao processar pedido.");
    }
  };

  return (
    <div className="loja-container">
      <header className="loja-header">
        <h1 className="loja-title">Dupla do Ateliê</h1>
        <p className="loja-subtitle">Bordados | Amigurumis | Crochê | Patchwork</p>
        <p className="loja-subtitle">Feitos à mão com amor, ponto por ponto.</p>
      </header>

      <main className="vitrine-container">
        <h2 className="vitrine-title">Nossas Criações Fofas</h2>
        <div className="grid-produtos">
          {amigurumis.length === 0 ? (
            <p>Nenhum amigurumi disponível no momento. Volte logo! 🧸</p>
          ) : (
            amigurumis.map((item) => (
              <div key={item._id} className="produto-card">
                <img src={item.imagem} alt={item.nome} className="produto-imagem" />
                <h3 className="produto-nome">{item.nome}</h3>
                <p className="produto-detalhe">Tamanho: {item.tamanho} cm</p>
                <p className="produto-preco">R$ {item.preco}</p>
                <button className="produto-botao" onClick={() => handleCompra(item.nome, item.preco)}>
                  Encomendar Agora
                </button>
              </div>
            ))
          )}
        </div>
      </main>
      {/* O Rodapé pode ficar fixo aqui embaixo, aparecendo em todas as páginas */}
      <footer>
        <p>2026 Dupla do Ateliê - Todos os direitos reservados. Desenvolvido por Felipe A.</p>
      </footer>
    </div>
  );
}

export default Loja;