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
    <input className="search" type="text" placeholder="Procure pelo nome ou fornecedor" />
  </div>
);

const WhiteRectangle = () => (
  <div className="white-rectangle">
    <div className="nome-label">Nome</div>
    <div className="nome-label">Fornecedor</div>
    <div className="nome-label">Ações</div>
    <div className="horizontal-line-2" style={{ marginTop: '50px', marginBottom: '10px' }} />
    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
      <span className="nome-label" style={{ marginRight: '5px' }}>Antivírus anual</span>
      <span className="nome-label" style={{ marginLeft: '5px' }}>Kasperky</span>
      <span className="nome-label" style={{ marginLeft: '5px', marginTop: '5px' }}>
        <span className="small-green-button">EDITAR</span>
        <span className="small-red-button">EXCLUIR</span> 
      </span>
    </div>

    <div className="horizontal-line-2" style={{ marginTop: '15px', marginBottom: '5px' }} />
    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
      <span className="nome-label" style={{ marginRight: '5px', marginTop: '20px' }}>Antivírus mensal</span>
      <span className="nome-label" style={{ marginLeft: '5px', marginTop: '20px' }}>Kasperky</span>
      <span className="nome-label" style={{ marginLeft: '5px', marginTop: '15px' }}>
        <span className="small-green-button" style={{ marginTop: '2px' }}>EDITAR </span>
        <span className="small-red-button">EXCLUIR</span> 
      </span>
    </div>
    <div className="horizontal-line-2" style={{ marginTop: '20px', marginBottom: '5px' }} />
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
        <p className="central-gestao">Central de Gestão</p>
      </div>
      <div className='caixa-2'>
        <a href="#!" className="usuario-text" onClick={() => setShowSolutions(false)}>Usuário</a>
        <a href="#!" className="solucoes-text" onClick={() => setShowSolutions(true)}>Soluções</a>
      </div>
      <div className="caixa-3">
        <UserInfo text="Soluções (2)" />
      </div>
      {showSolutions ? (
        <div className="novo-conteudo">
          <p>Novo Conteúdo exibido</p>
        </div>
      ) : (
        <>
          <div className='caixa-4-servico'>
            <SearchBar />
            <button className="green-button text-black">Adicionar solução</button>
            <button className="blue-button text-white">Adicionar fornecedor</button>
          </div>
          <div className='caixa-5-servico'>
            <WhiteRectangle />
          </div>
        </>
      )}
      <VerticalSidebar />
    </div>
  );
}

export default App;
