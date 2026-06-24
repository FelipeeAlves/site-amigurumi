# 🧸 Dupla do Ateliê - E-commerce de Artesanato

Este é um projeto de e-commerce completo (Full Stack) desenvolvido para a **Dupla do Ateliê**, uma loja especializada em produtos feitos à mão, como Amigurumis, Bordados, Crochê e Patchwork. O sistema conta com uma loja virtual responsiva para os clientes e um Painel Administrativo protegido para gerenciamento de produtos e controle de pedidos pendentes.

---

## 🚀 Funcionalidades

### 🛒 Portal do Cliente (Loja)
* **Vitrine Dinâmica:** Visualização de produtos organizados em um layout moderno (CSS Grid) adaptável para celulares, tablets e computadores.
* **Filtros por Categorias:** Navegação fluida entre as abas de *Bordados*, *Amigurumis*, *Crochê* e *Patchwork* sem recarregar a página.
* **Encomendas Instantâneas:** Botão "Encomendar Agora" que envia o pedido diretamente para o banco de dados em tempo real.

### 🔑 Painel de Controle (Admin)
* **Autenticação Segura:** Área administrativa protegida por login com criptografia de senha (`bcrypt`) e geração de tokens de acesso (`JWT`).
* **Gerenciamento de Produtos (CRUD):** Cadastro e exclusão de novos itens na vitrine diretamente pelo painel.
* **Tratamento e Validação de Preços:** Sistema inteligente no front-end que padroniza os valores salvos no banco sempre com duas casas decimais (ex: `89.90`), evitando erros de digitação.
* **Fluxo de Pedidos:** Listagem automatizada de pedidos com atualização de status ("Pendente" para "Finalizado") em tempo real através de requisições `PUT`.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
* **React.js** (Hooks, State, useEffect)
* **Vite** (Ambiente de desenvolvimento rápido)
* **CSS3** (Variáveis nativas, Flexbox, CSS Grid Responsivo)

### Back-end
* **Node.js** com **Express**
* **MongoDB Atlas** (Banco de dados NoSQL na nuvem)
* **Mongoose** (Modelagem de dados)
* **JSON Web Tokens (JWT)** (Autenticação de usuários)
* **Bcrypt** (Criptografia de senhas)
* **CORS** & **Dotenv** (Segurança e variáveis de ambiente)
