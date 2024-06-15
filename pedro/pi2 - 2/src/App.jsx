import React, { useState } from 'react';
import './App.css';

const UserInfo = ({ text }) => (
  <div className="user-info">
    <p className="usuario-text-2">{text}</p>
    <div className="horizontal-line" />
  </div>
);

const SearchBar = () => (
  <div className="search-container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-search"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input className="search" type="text" placeholder="Procure pelo nome" />
  </div>
);

const WhiteRectangle = () => (
  <div className="white-rectangle">
    <div className="nome-label">Nome</div>
    <div className="nome-label">CPF/CNPJ</div>
    <div className="nome-label">NPS</div>
    <div className="nome-label">Valor Contratos</div>
    <div className="nome-label">Data Cadastro</div>
    
    <div className="horizontal-line-2" style={{ marginTop: '50px', marginBottom: '10px' }} />
    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', position: 'relative', margin: '10px'}}>
      <span className="nome-label">Ciclano e Souza</span>
      <span className="nome-label">03.651.153/0001-26</span>
      <span className="nome-label">9</span>
      <span className="nome-label">R$ 5.763,71</span>
      <span className="nome-label">01/01/2024</span>
    </div>
    <div className="horizontal-line-2" style={{ marginTop: '8px', marginBottom: "1px"}} />
    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', position: 'relative', margin: '10px'}}>
      <span className="nome-label">Nathan Marques</span>
      <span className="nome-label">012.345.678-91</span>
      <span className="nome-label">10</span>
      <span className="nome-label">R$1200,00</span>
      <span className="nome-label">22/03/2024</span>
    </div>
    <div className="horizontal-line-2" style={{ marginTop: '5px'}} />
  </div>
);

const VerticalSidebar = () => (
  <div className="vertical-sidebar">
    <div className="first-box">
      <p className="prolinx-text">Prolinx</p>
    </div>
    <div className="second-box">
      <ul className="item-list">
        <li>Contratos</li>
        <li>Clientes</li>
        <li>Gestão</li>
      </ul>
      <p className="user-name-text">Fulano da Silva</p>
    </div>
    <div className="third-box">
      <p className="out-text">Sair</p>
    </div>
  </div>
);

const App = () => {
  const [showSolutions, setShowSolutions] = useState(false);

  return (
    <div className="app-container">
      <div className="caixa-1">
        <p className="clientes">Clientes</p>
      </div>
      {showSolutions ? (
        <div className="novo-conteudo">
          <p>Novo Conteúdo exibido</p>
        </div>
      ) : (
        <>
          <div className='caixa-4'>
            <SearchBar />
            <button className="green-button text-black">Adicionar Usuário</button>
            <button className="blue-button text-white">Filtrar</button>
          </div>
          <div className='caixa-5'>
            <WhiteRectangle />
          </div>
        </>
      )}
      <VerticalSidebar />
    </div>
  );
}

export default App;
