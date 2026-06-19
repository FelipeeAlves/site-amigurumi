import React, { useState, useEffect } from 'react';
import '../styles/Loja.css'; // Apontando corretamente para a pasta styles

function Loja() {
  const [produtos, setProdutos] = useState([]); // Mudamos o nome para ficar genérico (produtos)
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos'); // 🆕 Estado para controlar a aba ativa

  const carregarProdutos = async () => {
    try {
      const resposta = await fetch('http://localhost:5000/api/produtos');
      const dados = await resposta.json();
      setProdutos(dados);
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

  // 🆕 LÓGICA DE FILTRAGEM: Se for 'Todos', mostra tudo. Se não, filtra pela categoria do banco!
  const produtosFiltrados = categoriaAtiva === 'Todos' 
    ? produtos 
    : produtos.filter(item => item.categoria === categoriaAtiva);

  return (
    <div className="loja-container">
      <header className="loja-header">
        <h1 className="loja-title">Dupla do Ateliê</h1>
        
        {/* 🆕 BOTÕES DE CATEGORIA EM LUGAR DO TEXTO ESTÁTICO */}
        <nav className="loja-menu">
          <button 
            className={`menu-btn ${categoriaAtiva === 'Todos' ? 'ativo' : ''}`} 
            onClick={() => setCategoriaAtiva('Todos')}
          >
            Todos
          </button>
          <button 
            className={`menu-btn ${categoriaAtiva === 'Bordados' ? 'ativo' : ''}`} 
            onClick={() => setCategoriaAtiva('Bordados')}
          >
            Bordados
          </button>
          <button 
            className={`menu-btn ${categoriaAtiva === 'Amigurumis' ? 'ativo' : ''}`} 
            onClick={() => setCategoriaAtiva('Amigurumis')}
          >
            Amigurumis
          </button>
          <button 
            className={`menu-btn ${categoriaAtiva === 'Crochê' ? 'ativo' : ''}`} 
            onClick={() => setCategoriaAtiva('Crochê')}
          >
            Crochê
          </button>
          <button 
            className={`menu-btn ${categoriaAtiva === 'Patchwork' ? 'ativo' : ''}`} 
            onClick={() => setCategoriaAtiva('Patchwork')}
          >
            Patchwork
          </button>
        </nav>

        <p className="loja-subtitle-frase">Feitos à mão com amor, ponto por ponto.</p>
      </header>

      <main className="vitrine-container">
        {/* 🆕 Título dinâmico que muda de acordo com o filtro selecionado */}
        <h2 className="vitrine-title">
          {categoriaAtiva === 'Todos' ? 'Nossas Criações Fofas' : `Criações em ${categoriaAtiva}`}
        </h2>

        <div className="grid-produtos">
          {/* 🔥 Mudamos de amigurumis.length para produtosFiltrados.length */}
          {produtosFiltrados.length === 0 ? (
            <p>Nenhum produto em "{categoriaAtiva}" disponível no momento. Volte logo! 🧸</p>
          ) : (
            produtosFiltrados.map((item) => (
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

      <footer>
        <p>2026 Dupla do Ateliê - Todos os direitos reservados. Desenvolvido por Felipe A.</p>
      </footer>
    </div>
  );
}

export default Loja;