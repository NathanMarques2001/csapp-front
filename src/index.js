import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/global.css';
import Rotas from './rotas/Rotas';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Rotas />
  </React.StrictMode>
);
