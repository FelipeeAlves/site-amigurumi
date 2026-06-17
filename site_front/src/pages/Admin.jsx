import React, { useState, useEffect } from 'react';
import '../styles/Admin.css'; // 🔥 DOIS PONTOS (../) para sair de pages e ir para styles!

function Admin() {
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', tamanho: '', imagem: '' });

  const carregarDados = async () => {
    try {
      const resPedidos = await fetch('http://localhost:5000/api/pedidos');
      const dadosPedidos = await resPedidos.json();
      setPedidos(dadosPedidos);

      const resProdutos = await fetch('http://localhost:5000/api/produtos');
      const dadosProdutos = await resProdutos.json();
      setProdutos(dadosProdutos);
    } catch (erro) {
      console.error("Erro ao carregar dados do admin:", erro);
    }
  };

  useEffect(() => {
    carregarDados();

    const intervalo = setInterval(() => {
      carregarDados();
    }, 5000);

    return() => {clearInterval(intervalo)
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto({ ...novoProduto, [name]: value });
  };

  const cadastrarProduto = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch('http://localhost:5000/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto),
      });

      if (resposta.ok) {
        alert("🎉 Produto cadastrado com sucesso!");
        setNovoProduto({ nome: '', preco: '', tamanho: '', imagem: '' });
        carregarDados();
      }
    } catch (erro) {
      alert("⚠️ Erro ao cadastrar produto.");
    }
  };

  const deletarProduto = async (id) => {
    if (confirm("Tem certeza que deseja deletar este amigurumi?")) {
      try {
        const resposta = await fetch(`http://localhost:5000/api/produtos/${id}`, {
          method: 'DELETE',
        });
        if (resposta.ok) {
          alert("Produto removido!");
          carregarDados();
        }
      } catch (erro) {
        alert("⚠️ Erro ao deletar produto.");
      }
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Painel de Controle</h1>
        <p className="admin-subtitle">Gerencie os produtos e pedidos da Dupla do Ateliê</p>
      </header>

      <div className="admin-conteudo">
        
        {/* FORMULÁRIO */}
        <section className="admin-card">
          <h2 className="card-title">Cadastrar Novo Amigurumi</h2>
          <form onSubmit={cadastrarProduto} className="admin-form">
            <div className="form-group">
              <label>Nome do Amigurumi:</label>
              <input type="text" name="nome" value={novoProduto.nome} onChange={handleInputChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label>Preço (ex: R$ 89.90):</label>
              <input type="text" name="preco" value={novoProduto.preco} onChange={handleInputChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label>Tamanho em cm (ex: 20 cm):</label>
              <input type="text" name="tamanho" value={novoProduto.tamanho} onChange={handleInputChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label>Link da Imagem (URL):</label>
              <input type="text" name="imagem" value={novoProduto.imagem} onChange={handleInputChange} className="form-input" required />
            </div>

            <button type="submit" className="btn-cadastrar">Salvar Produto no Banco</button>
          </form>
        </section>

        {/* VITRINE */}
        <section className="admin-card">
          <h2 className="card-title">Produtos na Vitrine ({produtos.length})</h2>
          <ul className="admin-lista">
            {produtos.length === 0 ? (
              <p>Nenhum produto cadastrado ainda. 🧸</p>
            ) : (
              produtos.map((prod) => (
                <li key={prod._id} className="lista-item">
                  <div className="item-info">
                    <span className="item-nome">{prod.nome}</span>
                    <span className="item-detalhes">Tamanho: {prod.tamanho} cm | R$ {prod.preco}</span>
                  </div>
                  <button onClick={() => deletarProduto(prod._id)} className="btn-deletar">Deletar</button>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* PEDIDOS */}
        <section className="admin-card">
          <h2 className="card-title">Pedidos Recebidos ({pedidos.length})</h2>
          <ul className="admin-lista">
            {pedidos.length === 0 ? (
              <p>Nenhum pedido recebido por enquanto. 🕒</p>
            ) : (
              pedidos.map((ped) => (
                <li key={ped._id} className="lista-item">
                  <div className="item-info" handleCompra>
                    <span className="item-nome">📦 {ped.produtoNome}</span>
                    <span className="item-detalhes">Valor: R$ {ped.preco} | Status: Novo Pedido</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

      </div>
    </div>
  );
}

export default Admin;