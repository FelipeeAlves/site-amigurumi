import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loja from './pages/Loja';
import Admin from './pages/Admin';
import Login from './pages/Login'; // 🆕 Importa a nova página de Login
import RotaProtegida from './components/RotaProtegida'; // 🆕 Importa o segurança

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública da Loja - Qualquer um acessa */}
        <Route path="/" element={<Loja />} />

        {/* Rota pública do Login */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 ROTA PROTEGIDA DO ADMIN */}
        {/* Reparou que o <Admin /> agora fica "dentro" da RotaProtegida? */}
        <Route 
          path="/admin" 
          element={
            <RotaProtegida>
              <Admin />
            </RotaProtegida>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;