import React from 'react';
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
    <div className="nome-label">Função</div>
    <div className="nome-label">E-mail</div>
    <div className="horizontal-line-2" style={{ marginTop: '50px', marginBottom: '01px' }} />
    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', position: 'relative'}}>
      <span className="nome-label" style={{ marginRight: '5px' }}>Presleyson</span> 🙂 <span className="nome-label" style={{ marginLeft: '5px' }}>Admin</span> <span className="nome-label" style={{ marginLeft: '5px' }}>Email@email.com</span>
    </div>
    <div className="horizontal-line-2" style={{ marginTop: '05px', marginBottom: "1px"}} />
    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', position: 'relative'}}>
      <span className="nome-label" style={{ marginRight: '5px' }}>Presleyson 2</span> 🙂 <span className="nome-label" style={{ marginLeft: '5px' }}>Admin 2</span> <span className="nome-label" style={{ marginLeft: '5px' }}>Email@email.com</span>
    </div>
    <div className="horizontal-line-2" style={{ marginTop: '05px'}} />
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

const App = () => (
  <div className="app-container">
    <div className="caixa-1">
      <p className="central-gestao">Central de Gestão</p>
    </div>
    <div className='caixa-2'>
      <p className="usuario-text">Usuário</p>
      <p className="solucoes-text">Soluções</p>
    </div>
    <div className="caixa-3">
      <UserInfo text="Usuários (2)" />
    </div>
    <div className='caixa-4'>
      <SearchBar />
      <button className="green-button text-black">Adicionar Usuário</button>
    </div>
    <div className='caixa-5'>
      <WhiteRectangle />
    </div>
    <VerticalSidebar />
  </div>
);

export default App;
