import React from 'react';
import FormularioProduto from '../components/FormularioProduto';

function Admin() {
  // Como agora o formulário está isolado, criamos uma função simples pós-cadastro
  const aoCadastrar = () => {
    alert("Pronto! O produto já está salvo no banco e visível na loja.");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Painel de Controle</h1>
        <p style={styles.subtitle}>Área restrita para cadastro de amigurumis</p>
      </header>
      
      <main style={styles.main}>
        <FormularioProduto onProdutoCadastrado={aoCadastrar} />
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <a href="/" style={styles.link}>⬅ Voltar para a Loja</a>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' },
  header: { textAlign: 'center', padding: '30px 20px', backgroundColor: '#343a40', color: 'white' },
  title: { fontSize: '2rem', marginBottom: '5px' },
  subtitle: { fontSize: '1rem', color: '#6c757d' },
  main: { padding: '20px' },
  link: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }
};

export default Admin;