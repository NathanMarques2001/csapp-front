import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import Navbar from "../../componetes/navbar";

export default function Clientes() {
    const api = new Api("http://localhost:8080");
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientesResponse = await api.get('/clientes');
                setClientes(clientesResponse.clientes); // Ajuste para acessar o array dentro da resposta
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (id) => {
        // Lógica para editar o cliente
        console.log("Edit client with ID:", id);
    };

    const handleDelete = (id) => {
        // Lógica para deletar o cliente
        console.log("Delete client with ID:", id);
    };

    const totalClientes = clientes ? clientes.length : 0;

    return (
        <body id="clientes-body">
            <Navbar />
            <div>
                <h2>CLIENTES ({totalClientes})</h2>
                {clientes.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF/CNPJ</th>
                                <th>NPS</th>
                                <th>Valor Contratos</th>
                                <th>Data Cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nome}</td>
                                    <td>{cliente.cpf_cnpj}</td>
                                    <td>{cliente.nps}</td>
                                    <td>{cliente.valor_contratos}</td>
                                    <td>{new Date(cliente.data_criacao).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => handleEdit(cliente.id)}>Editar</button>
                                        <button onClick={() => handleDelete(cliente.id)}>Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        </body>
    );
}
