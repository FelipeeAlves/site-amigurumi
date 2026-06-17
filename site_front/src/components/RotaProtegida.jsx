import React from 'react';
import { Navigate } from 'react-router-dom';

// Esse componente embrulha a página do Admin para protegê-la
function RotaProtegida({ children }) {
  // Verifica se existe um token salvo no navegador
  const token = localStorage.getItem('token');

  // Se NÃO houver token, redireciona na hora para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se houver token, permite que o usuário acesse a página (children)
  return children;
}

export default RotaProtegida;