import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom'
import Contratos from '../paginas/contratos';
import Cliente from '../paginas/cliente';
import Clientes from '../paginas/clientes';
import Gestao from '../paginas/gestao';
import Login from '../paginas/login';
import { useCookies } from 'react-cookie';
import CadastroSolucao from '../paginas/cadastro-solucao';
import CadastroFabricante from '../paginas/cadastro-fabricante';
import CadastroCliente from '../paginas/cadastro-cliente';

export default function Rotas() {

    const [cookies] = useCookies(['jwtToken']);

    return (
        <Router>
            <Routes>
                <Route path="/" element={!cookies['jwtToken'] ? <Login /> : <Contratos />} />
                <Route path="/contratos" element={!cookies['jwtToken'] ? <Login /> : <Contratos />} />
                <Route path="/clientes/:id" element={!cookies['jwtToken'] ? <Login /> : <Cliente />} />
                <Route path="/clientes" element={!cookies['jwtToken'] ? <Login /> : <Clientes />} />
                <Route path="/gestao" element={!cookies['jwtToken'] ? <Login /> : <Gestao />} />
                <Route path="/cadastro-solucao" element={!cookies['jwtToken'] ? <Login /> : <CadastroSolucao />} />
                <Route path="/cadastro-fabricante" element={!cookies['jwtToken'] ? <Login /> : <CadastroFabricante />} />
                <Route path="/cadastro-cliente" element={!cookies['jwtToken'] ? <Login /> : <CadastroCliente />} />
            </Routes>
        </Router>
    );
}
