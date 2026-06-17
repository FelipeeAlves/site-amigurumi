import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Já vamos criar esse arquivo de estilo!

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa erros antigos

    try {
      const resposta = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // 🔥 SEGREDO: Salva o Token e o nome do Admin no navegador
        localStorage.setItem('token', dados.token);
        localStorage.setItem('adminNome', dados.usuario.nome);

        alert(`👋 Bem-vindo(a), ${dados.usuario.nome}!`);
        
        // Redireciona o usuário para a página do Admin
        navigate('/admin');
      } else {
        // Mostra a mensagem de erro que veio do backend
        setErro(dados.mensagem);
      }
    } catch (err) {
      setErro('⚠️ Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Acesso Restrito</h2>
        <p className="login-subtitle">Painel Administrativo - Dupla do Ateliê</p>

        {erro && <p className="login-erro">{erro}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>E-mail:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Senha:</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              className="form-input" 
              required 
            />
          </div>

          <button type="submit" className="btn-login">Entrar no Painel</button>
        </form>
      </div>
    </div>
  );
}

export default Login;