import React, { useState, useEffect } from 'react';
import '../styles/Admin.css'; 

function Admin() {
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  // 🆕 Inicializando o objeto já com a categoria padrão 'Amigurumis'
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', tamanho: '', imagem: '', categoria: 'Amigurumis' });

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

    return () => clearInterval(intervalo);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto({ ...novoProduto, [name]: value });
  };

  const cadastrarProduto = async (e) => {
    e.preventDefault();

    // 🆕 TRATAMENTO DE ERRO / VALIDAÇÃO DO PREÇO
    // Remove "R$", espaços e troca vírgula por ponto para o JavaScript entender como número
    let precoLimpo = novoProduto.preco
      .replace('R$', '')
      .replace(/\s/g, '')
      .replace(',', '.');

    // Converte para número flutuante
    let precoNumero = parseFloat(precoLimpo);

    // Se não for um número válido ou for menor/igual a zero, barra o cadastro
    if (isNaN(precoNumero) || precoNumero <= 0) {
      alert("⚠️ Por favor, insenra um valor numérico válido para o preço (ex: 89.90 ou 89,90).");
      return; // Para a execução aqui e não salva no banco
    }

    // 🔥 Força o número a ter exatamente duas casas decimais (ex: 89.90)
    const produtoFormatado = {
      ...novoProduto,
      preco: precoNumero.toFixed(2)
    };

    try {
      const resposta = await fetch('http://localhost:5000/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoFormatado), // 🆕 Enviamos o produto já com o preço formatado!
      });

      if (resposta.ok) {
        alert("🎉 Produto cadastrado com sucesso!");
        setNovoProduto({ nome: '', preco: '', tamanho: '', imagem: '', categoria: 'Amigurumis' });
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

  const finalizarPedido = async (id) => {
    try {
      const resposta = await fetch(`http://localhost:5000/api/pedidos/${id}/finalizar`, {
        method: 'PUT',
      });
      
      if (resposta.ok) {
        alert("✅ Pedido marcado como Finalizado!");
        carregarDados(); 
      }
    } catch (erro) {
      alert("⚠️ Erro ao finalizar o pedido.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');     
    localStorage.removeItem('adminNome'); 
    window.location.href = '/login';      
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Painel de Controle</h1>
        <button onClick={handleLogout} className="btn-logout">
          Sair do Painel
        </button>
        <p className="admin-subtitle">Gerencie os produtos e pedidos da Dupla do Ateliê</p>
      </header>

      <div className="admin-conteudo">
        
        {/* FORMULÁRIO */}
        <section className="admin-card">
          <h2 className="card-title">Cadastrar Novo Produto</h2>
          <form onSubmit={cadastrarProduto} className="admin-form">
            <div className="form-group">
              <label>Nome do Produto:</label>
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

            {/* 🆕 NOVO CAMPO SELECT PARA SELECIONAR A CATEGORIA */}
            <div className="form-group">
              <label>Categoria:</label>
              <select name="categoria" value={novoProduto.categoria} onChange={handleInputChange} className="form-input" required>
                <option value="Amigurumis">Amigurumis</option>
                <option value="Bordados">Bordados</option>
                <option value="Crochê">Crochê</option>
                <option value="Patchwork">Patchwork</option>
              </select>
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
                    {/* 🆕 Exibindo a categoria também na listagem do admin para facilitar */}
                    <span className="item-detalhes">Categoria: {prod.categoria || 'Amigurumis'} | Tamanho: {prod.tamanho} cm | R$ {prod.preco}</span>
                  </div>
                  <button onClick={() => deletarProduto(prod._id)} className="btn-deletar">Deletar</button>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* PEDIDOS PENDENTES */}
        <section className="admin-card">
          <h2 className="card-title">Pedidos Pendentes ({pedidos.length})</h2>
          <ul className="admin-lista">
            {pedidos.length === 0 ? (
              <p>Nenhum pedido pendente por enquanto. 🕒</p>
            ) : (
              pedidos.map((ped) => (
                <li key={ped._id} className="lista-item">
                  <div className="item-info">
                    <span className="item-nome">📦 {ped.produtoNome}</span>
                    <span className="item-detalhes">Valor: R$ {ped.preco} | Status: {ped.status}</span>
                  </div>
                  <button onClick={() => finalizarPedido(ped._id)} className="btn-finalizar">
                    Finalizar
                  </button>
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