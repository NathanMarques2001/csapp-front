import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom'
import Contratos from '../paginas/contratos';
import Cliente from '../paginas/cliente';
import Clientes from '../paginas/clientes';
import Fabricantes from '../paginas/fabricantes';
import Gestao from '../paginas/gestao';
import Login from '../paginas/login';
import { useCookies } from 'react-cookie';

export default function Rotas() {

    const [cookies] = useCookies(['jwtToken']);

    return (
        <Router>
            <Routes>
                <Route path="/" element={!cookies['jwtToken'] ? <Login /> : <Contratos />} />
                <Route path="/contratos" element={!cookies['jwtToken'] ? <Login /> : <Contratos />} />
                <Route path="/clientes/:id" element={!cookies['jwtToken'] ? <Login /> : <Cliente />} />
                <Route path="/clientes" element={!cookies['jwtToken'] ? <Login /> : <Cliente />} />
                <Route path="/fabricantes" element={!cookies['jwtToken'] ? <Login /> : <Fabricantes />} />
                <Route path="/gestao" element={!cookies['jwtToken'] ? <Login /> : <Gestao />} />
            </Routes>
        </Router>
    );
}
