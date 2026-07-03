import React, { useState, useEffect } from 'react';
import '../styles/Loja.css'; // Apontando corretamente para a pasta styles

function Loja() {
  const [produtos, setProdutos] = useState([]); 
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos'); 
  const [busca, setBusca] = useState(''); // 🆕 Estado para guardar o texto digitado na busca

  const carregarProdutos = async () => {
    try {
      const resposta = await fetch('https://dupla-atelie-backend.onrender.com/api/produtos');
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 🛠️ FUNÇÃO ATUALIZADA: Salva no Banco de Dados E envia para o WhatsApp!
  const handleCompra = async (nomeProduto, precoProduto) => {
    try {
      const resposta = await fetch('https://dupla-atelie-backend.onrender.com/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtoNome: nomeProduto, preco: precoProduto }),
      });
      
      const dados = await resposta.json();
      
      if (resposta.ok) {
        // 1. Seu número de telefone (Coloque 55 + DDD + seu número, sem espaços ou traços!)
        const numeroTelefone = "5511999999999"; 
        
        // 2. Montando a mensagem com quebras de linha (%0A) e negritos (*)
        const mensagem = `Olá, Dupla do Ateliê! ❤️%0A` +
                         `Gostaria de encomendar um amigurumi!%0A%0A` +
                         `🧸 *Produto:* ${nomeProduto}%0A` +
                         `💰 *Valor:* R$ ${precoProduto}%0A%0A` +
                         `Como faço para combinar a entrega e o pagamento?`;

        // 3. Criando o link e abrindo o WhatsApp do cliente
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagem}`;
        window.open(urlWhatsApp, "_blank");
      }
    } catch (erro) {
      alert("⚠️ Erro ao processar pedido.");
    }
  };

  // 🆕 LÓGICA DE FILTRAGEM DUPLA: Filtra por Categoria E por Texto digitado ao mesmo tempo
  const produtosFiltrados = produtos.filter(item => {
    // 1. Verifica a categoria ativa
    const bateuCategoria = categoriaAtiva === 'Todos' || item.categoria === categoriaAtiva;
    
    // 2. Verifica se o nome do produto contém o texto digitado
    const bateuBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
    
    return bateuCategoria && bateuBusca;
  });

  return (
    <div className="loja-container">
      <header className="loja-header">
        <h1 className="loja-title">Dupla do Ateliê</h1>
        
        {/* BOTÕES DE CATEGORIA */}
        <nav className="loja-menu">
          <button className={`menu-btn ${categoriaAtiva === 'Todos' ? 'ativo' : ''}`} onClick={() => setCategoriaAtiva('Todos')}>Todos</button>
          <button className={`menu-btn ${categoriaAtiva === 'Bordados' ? 'ativo' : ''}`} onClick={() => setCategoriaAtiva('Bordados')}>Bordados</button>
          <button className={`menu-btn ${categoriaAtiva === 'Amigurumis' ? 'ativo' : ''}`} onClick={() => setCategoriaAtiva('Amigurumis')}>Amigurumis</button>
          <button className={`menu-btn ${categoriaAtiva === 'Crochê' ? 'ativo' : ''}`} onClick={() => setCategoriaAtiva('Crochê')}>Crochê</button>
          <button className={`menu-btn ${categoriaAtiva === 'Patchwork' ? 'ativo' : ''}`} onClick={() => setCategoriaAtiva('Patchwork')}>Patchwork</button>
        </nav>

        {/* CONTAINER DA FRASE + CAMPO DE BUSCA */}
        <div className="loja-subheader-busca">
          <p className="loja-subtitle-frase">Feitos à mão com amor, ponto por ponto.</p>
          
          <input 
            type="text" 
            placeholder="🔎 Procurar Amigurumi" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="busca-input"
          />
        </div>
      </header>

      <main className="vitrine-container">
        <h2 className="vitrine-title">
          {categoriaAtiva === 'Todos' ? 'Nossas Criações Fofas' : `Criações em ${categoriaAtiva}`}
        </h2>

        <div className="grid-produtos">
          {produtosFiltrados.length === 0 ? (
            <p>Nenhum produto encontrado para a sua busca. 🧸</p>
          ) : (
            produtosFiltrados.map((item) => (
              <div key={item._id} className="produto-card">
                <img src={item.imagem} alt={item.nome} className="produto-imagem" />
                <h3 className="produto-nome">{item.nome}</h3>
                <p className="produto-detalhe">Tamanho: {item.tamanho} cm</p>
                <p className="produto-preco">R$ {item.preco}</p>
                
                {/* O seu botão continua chamando a handleCompra, mas agora com superpoderes! */}
                <button className="produto-botao" onClick={() => handleCompra(item.nome, item.preco)}>
                  Encomendar Agora via WhatsApp 💬
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