import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import Contratos from '../paginas/contratos';
import Cliente from '../paginas/cliente';
import Clientes from '../paginas/clientes';
import Gestao from '../paginas/gestao';
import Login from '../paginas/login';
import { useCookies } from 'react-cookie';
import FormSolucao from '../paginas/form-solucao';
import FormFabricante from '../paginas/form-fabricante';
import FormCliente from '../paginas/form-cliente';
import FormUsuario from '../paginas/form-usuario';
import FormContrato from '../paginas/form-contrato';
import Relatorios from '../paginas/relatorios';
import FormSegmento from '../paginas/form-segmento';
import FormFaturado from '../paginas/form-faturado';
import FormResetSenha from '../paginas/form-reset-senha';
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

export default function Rotas() {

    const [cookies] = useCookies(['jwtToken', 'tipo']);

    return (
        <Router>
            <Routes>
                <Route path="/" element={!cookies['jwtToken'] ? <Login /> : <Contratos />} />
                <Route path="/contratos" element={!cookies['jwtToken'] ? <Login /> : <Contratos />} />
                <Route path="/clientes/:id" element={!cookies['jwtToken'] ? <Login /> : <Cliente />} />
                <Route path="/clientes" element={!cookies['jwtToken'] ? <Login /> : <Clientes />} />
                <Route path="/relatorios" element={!cookies['jwtToken'] ? <Login /> : <Relatorios />} />
                <Route path="/gestao" element={!cookies['jwtToken'] ? <Login /> : cookies['tipo'] === "admin" || cookies['tipo'] === "dev" ? <Gestao /> : <Navigate to="/contratos" />} />
                <Route path="/cadastro-solucao" element={!cookies['jwtToken'] ? <Login /> : <FormSolucao mode="cadastro" />} />
                <Route path="/edicao-solucao/:id" element={!cookies['jwtToken'] ? <Login /> : <FormSolucao mode="edicao" />} />
                <Route path="/cadastro-fabricante" element={!cookies['jwtToken'] ? <Login /> : <FormFabricante mode="cadastro" />} />
                <Route path="/edicao-fabricante/:id" element={!cookies['jwtToken'] ? <Login /> : <FormFabricante mode="edicao" />} />
                <Route path="/cadastro-cliente" element={!cookies['jwtToken'] ? <Login /> : <FormCliente mode="cadastro" />} />
                <Route path="/edicao-cliente/:id" element={!cookies['jwtToken'] ? <Login /> : <FormCliente mode="edicao" />} />
                <Route path="/cadastro-usuario" element={!cookies['jwtToken'] ? <Login /> : <FormUsuario mode="cadastro" />} />
                <Route path="/edicao-usuario/:id" element={!cookies['jwtToken'] ? <Login /> : <FormUsuario mode="edicao" />} />
                <Route path="/cadastro-contrato" element={!cookies['jwtToken'] ? <Login /> : <FormContrato mode="cadastro" />} />
                <Route path="/edicao-contrato/:id" element={!cookies['jwtToken'] ? <Login /> : <FormContrato mode="edicao" />} />
                <Route path="/cadastro-segmento" element={!cookies['jwtToken'] ? <Login /> : <FormSegmento mode="cadastro" />} />
                <Route path="/edicao-segmento/:id" element={!cookies['jwtToken'] ? <Login /> : <FormSegmento mode="edicao" />} />
                <Route path="/cadastro-faturado" element={!cookies['jwtToken'] ? <Login /> : <FormFaturado mode="cadastro" />} />
                <Route path="/edicao-faturado/:id" element={!cookies['jwtToken'] ? <Login /> : <FormFaturado mode="edicao" />} />
                <Route path="/reset-senha" element={<FormResetSenha />} />
            </Routes>
        </Router>
    );
}
