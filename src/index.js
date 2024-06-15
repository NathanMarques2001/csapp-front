import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/global.css';
import Contratos from '../src/paginas/contratos';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Contratos />
  </React.StrictMode>
);
