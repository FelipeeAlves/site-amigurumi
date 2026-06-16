import React, { useState, useEffect } from 'react';


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
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dupla do Ateliê</h1>
        <p style={styles.subtitle}>Bordados | Amigurumis| Crochê | Patchwork</p>
        <p style={styles.subtitle}>Feitos à mão com amor, ponto por ponto.</p>
      </header>

      <main style={styles.vitrineContainer}>
        <h2 style={styles.vitrineTitle}>Nossas Criações Fofas</h2>
        <div style={styles.gridProdutos}>
          {amigurumis.length === 0 ? (
            <p>Nenhum amigurumi disponível no momento. Volte logo! 🧸</p>
          ) : (
            amigurumis.map((item) => (
              <div key={item._id} style={styles.produtoCard}>
                <img src={item.imagem} alt={item.nome} style={styles.produtoImagem} />
                <h3 style={styles.produtoNome}>{item.nome}</h3>
                <p style={styles.produtoDetalhe}>Tamanho: {item.tamanho} cm</p>
                <p style={styles.produtoPreco}>R$ {item.preco}</p>
                <button style={styles.produtoBotao} onClick={() => handleCompra(item.nome, item.preco)}>
                  Encomendar Agora
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// Estilos básicos da loja
const styles = {
  container: { fontFamily: 'Arial, sans-serif', color: '#333', backgroundColor: '#fff5f5', minHeight: '100vh' },
  header: { textAlign: 'center', padding: '40px 20px', backgroundColor: '#ffe3e3' },
  title: { fontSize: '2.5rem', color: '#d63384', marginBottom: '10px' },
  subtitle: { fontSize: '1.2rem', color: '#6c757d' },
  vitrineContainer: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' },
  vitrineTitle: { textAlign: 'center', color: '#d63384', marginBottom: '30px' },
  gridProdutos: { display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' },
  produtoCard: { backgroundColor: 'white', borderRadius: '15px', width: '280px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', paddingBottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  produtoImagem: { width: '100%', height: '220px', objectFit: 'cover' },
  produtoNome: { fontSize: '1.2rem', margin: '15px 10px 5px 10px', color: '#495057' },
  produtoDetalhe: { fontSize: '0.9rem', color: '#6c757d', margin: '0 0 10px 0' },
  produtoPreco: { fontSize: '1.4rem', fontWeight: 'bold', color: '#28a745', margin: '10px 0' },
  produtoBotao: { backgroundColor: '#d63384', color: 'white', border: 'none', padding: '12px 20px', fontSize: '1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', margin: '0 20px' }
};

export default Loja;