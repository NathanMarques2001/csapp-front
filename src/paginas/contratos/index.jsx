import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import Navbar from "../../componetes/navbar";

export default function Contratos() {
    const api = new Api("http://localhost:8080");
    const [contratos, setContratos] = useState([]);
    const [clientes, setClientes] = useState({});
    const [produtos, setProdutos] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const contratosResponse = await api.get('/contratos');
                setContratos(contratosResponse.contratos);

                const clientesResponse = await api.get('/clientes');
                const clientesMap = clientesResponse.clientes.reduce((map, cliente) => {
                    map[cliente.id] = cliente.nome;
                    return map;
                }, {});
                setClientes(clientesMap);

                const produtosResponse = await api.get('/produtos');
                const produtosMap = produtosResponse.produtos.reduce((map, produto) => {
                    map[produto.id] = produto.nome;
                    return map;
                }, {});
                setProdutos(produtosMap);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (id) => {
        // Lógica para editar o contrato
        console.log("Edit contract with ID:", id);
    };

    const handleDelete = (id) => {
        // Lógica para deletar o contrato
        console.log("Delete contract with ID:", id);
    };

    const totalContratos = contratos ? contratos.length : 0;

    return (
        <div id="global-display">
            <Navbar />
            <div id="gestao-container">
                <h2>CONTRATOS ({totalContratos})</h2>
                {contratos.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Produto</th>
                                <th>Valor Mensal</th>
                                <th>Status</th>
                                <th>Data Criação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contratos.map(contrato => (
                                <tr key={contrato.id}>
                                    <td>{clientes[contrato.id_cliente] || "Carregando..."}</td>
                                    <td>{produtos[contrato.id_produto] || "Carregando..."}</td>
                                    <td>{contrato.valor_mensal}</td>
                                    <td>{contrato.status}</td>
                                    <td>{new Date(contrato.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => handleEdit(contrato.id)}>Editar</button>
                                        <button onClick={() => handleDelete(contrato.id)}>Excluir</button>
                                    </td>
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
