import { useEffect, useState } from "react";
import Api from "../../utils/api";
import Navbar from "../../componetes/navbar";
import Loading from "../../componetes/loading";
import PopUpFiltro from "../../componetes/pop-up-filtro";
import { useNavigate } from "react-router-dom";

export default function Contratos() {
    const api = new Api();
    const [contratos, setContratos] = useState([]);
    const [clientes, setClientes] = useState({});
    const [produtos, setProdutos] = useState({});
    const [filter, setFilter] = useState("");
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
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

                const produtosResponse = await api.get('/produtos');
                const produtosMap = produtosResponse.produtos.reduce((map, produto) => {
                    map[produto.id] = produto.nome;
                    return map;
                }, {});
                setProdutos(produtosMap);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRowClick = (id) => {
        navigate(`/edicao-contrato/${id}`);
    };

    const handleAddContract = () => {
        navigate("/cadastro-contrato");
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleFilterApply = (filters) => {
        setFilters(filters);
        setShowFilterPopup(false);
    };

    const filteredContratos = contratos.filter(contrato => {
        const clienteNome = clientes[contrato.id_cliente]?.nome || "";

        const filterConditions = [
            filters.id_cliente ? contrato.id_cliente.toString().includes(filters.id_cliente) : true,
            filters.id_produto ? contrato.id_produto.toString().includes(filters.id_produto) : true,
            filters.faturado ? contrato.faturado.toString().includes(filters.faturado) : true,
            filters.dia_vencimento ? contrato.dia_vencimento.toString().includes(filters.dia_vencimento) : true,
            filters.indice_reajuste ? contrato.indice_reajuste.toString().includes(filters.indice_reajuste) : true,
            filters.proximo_reajuste ? contrato.proximo_reajuste.toString().includes(filters.proximo_reajuste) : true,
            filters.status ? contrato.status.toString().includes(filters.status) : true,
            filters.duracao ? contrato.duracao.toString().includes(filters.duracao) : true,
            filters.valor_mensal ? contrato.valor_mensal.toString().includes(filters.valor_mensal) : true,
            filters.quantidade ? contrato.quantidade.toString().includes(filters.quantidade) : true,
            filters.email_envio ? contrato.email_envio.toString().includes(filters.email_envio) : true,
            filters.descricao ? contrato.descricao.toLowerCase().includes(filters.descricao.toLowerCase()) : true,
            clienteNome.toLowerCase().includes(filter.toLowerCase()),
        ];

        return filterConditions.every(condition => condition);
    });

    return (
        <>
            {loading && <Loading />}
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
                    <button onClick={handleAddContract} className="global-btn global-btn-verde">Adicionar Contrato</button>
                    <button onClick={() => setShowFilterPopup(true)} className="global-btn global-btn-azul">Filtrar</button>
                    {showFilterPopup && (
                        <div className="filter-popup">
                            <PopUpFiltro onFilter={handleFilterApply} />
                            <button onClick={() => setShowFilterPopup(false)} className="close-popup-btn">Fechar</button>
                        </div>
                    )}
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
                        <p>Ainda não foram cadastrados contratos!</p>
                    )}
                </div>
            </div>
        </>
    );
}
