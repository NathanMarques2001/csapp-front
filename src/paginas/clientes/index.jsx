import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import Navbar from "../../componetes/navbar";

export default function Clientes() {
    const api = new Api("http://localhost:8080");
    const [clientes, setClientes] = useState([]);
    const [contratos, setContratos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientesResponse = await api.get('/clientes');
                setClientes(clientesResponse.clientes);

                const contratosResponse = await api.get('/contratos');
                setContratos(contratosResponse.contratos);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const calculateTotalContractValue = (clienteId) => {
        const clienteContratos = contratos.filter(contrato => contrato.id_cliente === clienteId && contrato.status === 'Ativo');
        const total = clienteContratos.reduce((sum, contrato) => sum + parseFloat(contrato.valor_mensal), 0);
        return total;
    };

    const handleRowClick = (id) => {
        console.log("Edit client with ID:", id);
        // Aqui você pode redirecionar para a página de edição do cliente ou abrir um modal, etc.
    };

    return (
        <div id="global-display">
            <Navbar />
            <div>
                <h2>Clientes</h2>
                {clientes.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF/CNPJ</th>
                                <th>NPS</th>
                                <th>Valor Contratos</th>
                                <th>Data Cadastro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente.id} onClick={() => handleRowClick(cliente.id)} className="clickable-row">
                                    <td>{cliente.nome}</td>
                                    <td>{cliente.cpf_cnpj}</td>
                                    <td>{cliente.nps}</td>
                                    <td>{calculateTotalContractValue(cliente.id).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td>{new Date(cliente.data_criacao).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        </div>
    );
}
