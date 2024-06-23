import { useEffect, useState } from "react";
import Api from "../../utils/api";
import Navbar from "../../componetes/navbar";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";

export default function Clientes() {
    const api = new Api();
    const [clientes, setClientes] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const clientesResponse = await api.get('/clientes');
                setClientes(clientesResponse.clientes);

                const contratosResponse = await api.get('/contratos');
                setContratos(contratosResponse.contratos);
                setLoading(false);
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
        navigate(`/clientes/${id}`);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(filter.toLowerCase())
    );

    const handleAddClient = () => {
        navigate('/cadastro-cliente');
    }

    return (
        <>
            {loading && <Loading />}
            <div className="global-display">
                <Navbar />
                <div className="global-container">
                    <h2 className="global-subtitulo">Clientes</h2>
                    <input
                        type="text"
                        placeholder="Procure pelo nome"
                        className="global-input"
                        value={filter}
                        onChange={handleFilterChange}
                    />
                    <button onClick={e => handleAddClient()} className="global-btn global-btn-verde">Adicionar cliente</button>
                    {filteredClientes.length > 0 ? (
                        <table className="global-tabela">
                            <thead>
                                <tr>
                                    <th className="global-titulo-tabela">Nome</th>
                                    <th className="global-titulo-tabela">CPF/CNPJ</th>
                                    <th className="global-titulo-tabela">NPS</th>
                                    <th className="global-titulo-tabela">Valor Contratos</th>
                                    <th className="global-titulo-tabela">Data Cadastro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClientes.map(cliente => (
                                    <tr key={cliente.id} onClick={() => handleRowClick(cliente.id)} className="clickable-row">
                                        <td className="global-conteudo-tabela">{cliente.nome}</td>
                                        <td className="global-conteudo-tabela">{cliente.cpf_cnpj}</td>
                                        <td className="global-conteudo-tabela">{cliente.nps}</td>
                                        <td className="global-conteudo-tabela">{calculateTotalContractValue(cliente.id).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td className="global-conteudo-tabela">{new Date(cliente.data_criacao).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Ainda não foram cadastrados clientes!</p>
                    )}
                </div>
            </div>
        </>
    );
}
