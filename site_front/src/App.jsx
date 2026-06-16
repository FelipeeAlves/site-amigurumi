import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loja from './pages/Loja';
import Admin from './pages/Admin';


function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal: quem acessa o site limpo vê a Loja */}
        <Route path="/" element={<Loja />} />
        
        {/* Rota admin: quem digita /admin acessa o painel de cadastro */}
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* O Rodapé pode ficar fixo aqui embaixo, aparecendo em todas as páginas */}
      <footer style={styles.footer}>
        <p> Dupla do Ateliê - Todos os direitos reservados. Desenvolvido por Felipe</p>
      </footer>
    </Router>
  );
}

const styles = {
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#343a40',
    color: 'white',
    fontSize: '0.9rem',
    width: '100%',
    boxSizing: 'border-box'
  }
};

export default App;