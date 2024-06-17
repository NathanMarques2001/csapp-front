import { useEffect, useState } from "react";
import Api from "../../utils/api";
import Navbar from "../../componetes/navbar";
import { useCookies } from 'react-cookie';

export default function Contratos() {
    const api = new Api();
    const [contratos, setContratos] = useState([]);
    const [clientes, setClientes] = useState({});
    const [produtos, setProdutos] = useState({});
    const [filter, setFilter] = useState("");
    const [cookies, setCookie] = useCookies(['jwtToken']);
    const jwt = cookies['jwtToken'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const contratosResponse = await api.get('/contratos');
                setContratos(contratosResponse.contratos);

                const clientesResponse = await api.get('/clientes');
                const clientesMap = clientesResponse.clientes.reduce((map, cliente) => {
                    map[cliente.id] = {
                        nome: cliente.nome,
                        cpf_cnpj: cliente.cpf_cnpj
                    };
                    return map;
                }, {});
                setClientes(clientesMap);

                console.log(jwt)

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

    const handleRowClick = (id) => {
        console.log("Edit contract with ID:", id);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredContratos = contratos.filter(contrato => {
        const clienteNome = clientes[contrato.id_cliente]?.nome || "";
        return clienteNome.toLowerCase().includes(filter.toLowerCase());
    });

    return (
        <div className="global-display">
            <Navbar />
            <div className="global-container">
                <h2 className="global-subtitulo">Contratos</h2>
                <input
                    type="text"
                    placeholder="Procure pelo cliente"
                    className="global-input"
                    value={filter}
                    onChange={handleFilterChange}
                />
                <button className="global-btn global-btn-verde">Adicionar Contrato</button>
                <button className="global-btn global-btn-azul">Filtrar</button>
                {filteredContratos.length > 0 ? (
                    <table className="global-tabela">
                        <thead>
                            <tr>
                                <th className="global-titulo-tabela">Cliente</th>
                                <th className="global-titulo-tabela">CPF/CNPJ</th>
                                <th className="global-titulo-tabela">Solução</th>
                                <th className="global-titulo-tabela">Valor Contrato</th>
                                <th className="global-titulo-tabela">Início Contrato</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContratos.map(contrato => (
                                <tr key={contrato.id} onClick={() => handleRowClick(contrato.id)} className="clickable-row">
                                    <td className="global-conteudo-tabela">{clientes[contrato.id_cliente]?.nome || "Carregando..."}</td>
                                    <td className="global-conteudo-tabela">{clientes[contrato.id_cliente]?.cpf_cnpj || "Carregando..."}</td>
                                    <td className="global-conteudo-tabela">{produtos[contrato.id_produto] || "Carregando..."}</td>
                                    <td className="global-conteudo-tabela">{contrato.valor_mensal}</td>
                                    <td className="global-conteudo-tabela">{new Date(contrato.createdAt).toLocaleDateString()}</td>
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
