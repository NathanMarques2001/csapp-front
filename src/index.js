import React from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './utils/authConfig';
import './style/global.css';
import './style/medias.css';
import Rotas from './rotas/Rotas';
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

// --- CORREÇÃO AQUI ---
// Cria a instância do MSAL usando a configuração importada
const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <Rotas />
    </MsalProvider>
  </React.StrictMode>
);