import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import Contratos from '../paginas/contratos';
import Cliente from '../paginas/cliente';
import Clientes from '../paginas/clientes';
import Fabricantes from '../paginas/fabricantes';
import Solucoes from '../paginas/solucoes';
import Usuarios from '../paginas/usuarios';
import Gestao from '../paginas/gestao';

export default function Rotas() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Contratos />} />
                <Route path="/clientes/:id" element={<Cliente />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/fabricantes" element={<Fabricantes />} />
                <Route path="/solucoes" element={<Solucoes />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/gestao" element={<Gestao />} />
            </Routes>
        </Router>
    );
}
