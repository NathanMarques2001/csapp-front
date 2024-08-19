import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../componetes/navbar";
import Loading from "../../componetes/loading";
import PopUpFiltro from "../../componetes/pop-up-filtro";
import Api from "../../utils/api";
import './style.css';
import { useCookies } from "react-cookie";

export default function Contratos() {
    const api = new Api();
    const [cookies, setCookie, removeCookie] = useCookies(['tipo', 'id']);
    const [isAdminOrDev, setIsAdminOrDev] = useState(false);
    const [clientesRoute, setClientesRoute] = useState("");
    const [contratosRoute, setContratosRoute] = useState("");
    const [contratos, setContratos] = useState([]);
    const [clientes, setClientes] = useState({});
    const [vendedores, setVendedores] = useState({});
    const [produtos, setProdutos] = useState({});
    const [filter, setFilter] = useState("");
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        if (cookies.tipo === "dev" || cookies.tipo === "admin") {
            setIsAdminOrDev(true);
            setClientesRoute('/clientes');
            setContratosRoute('/contratos');
        } else {
            setIsAdminOrDev(false);
            setClientesRoute(`/clientes/vendedor/${cookies.id}`);
            setContratosRoute(`/contratos/vendedor/${cookies.id}`);
        }

        const fetchData = async () => {
            try {
                const contratosResponse = await api.get(contratosRoute);
                setContratos(contratosResponse.contratos);

                const clientesResponse = await api.get(clientesRoute);
                const clientesMap = clientesResponse.clientes.reduce((map, cliente) => {
                    map[cliente.id] = {
                        nome_fantasia: cliente.nome_fantasia,
                        cpf_cnpj: cliente.cpf_cnpj,
                        razao_social: cliente.razao_social,
                        vendedor: cliente.id_usuario
                    };
                    return map;
                }, {});
                setClientes(clientesMap);

                const vendedoresResponse = await api.get('/usuarios');
                const vendedoresMap = vendedoresResponse.usuarios.reduce((map, vendedor) => {
                    map[vendedor.id] = {
                        nome: vendedor.nome
                    };
                    return map;
                }, {});
                setVendedores(vendedoresMap);

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
    }, [cookies.tipo, cookies.id, clientesRoute, contratosRoute]);

    const detalhesContrato = (id) => {
        navigate(`/edicao-contrato/${id}`);
    };

    const addContrato = () => {
        navigate("/cadastro-contrato");
    }

    const filtratContratos = (e) => {
        setFilter(e.target.value);
    };

    const aplicarFiltroPopUp = (filters) => {
        setFilters(filters);
        setShowFilterPopup(false);
    };

    const limparFiltros = () => {
        setFilters({});
    };

    const filteredContratos = contratos.filter(contrato => {
        const clienteNome = clientes[contrato.id_cliente]?.nome_fantasia || "";
        const clienteRazao = clientes[contrato.id_cliente]?.razao_social || "";
        const produtoNome = produtos[contrato.id_produto] || "";

        const filterConditions = [
            filters.id_cliente ? contrato.id_cliente.toString().includes(filters.id_cliente) : true,
            filters.id_produto ? contrato.id_produto.toString().includes(filters.id_produto) : true,
            filters.faturado ? contrato.faturado.toString().includes(filters.faturado) : true,
            filters.status ? contrato.status.toString().includes(filters.status) : true,
            filters.duracao ? contrato.duracao.toString().includes(filters.duracao) : true,
            filters.valor_mensal ? contrato.valor_mensal.toString().includes(filters.valor_mensal) : true,
            filters.razao_social ? clienteRazao.toLowerCase().includes(filters.razao_social.toLowerCase()) : true,
            filters.nome_fantasia ? clienteNome.toLowerCase().includes(filters.nome_fantasia.toLowerCase()) : true,
            filters.nome_produto ? produtoNome.toLowerCase().includes(filters.nome_produto.toLowerCase()) : true,
            clienteNome.toLowerCase().includes(filter.toLowerCase()),
        ];

        return filterConditions.every(condition => condition);
    });

    const calculaValorImpostoMensal = (valor, indice) => valor + ((valor * indice) / 100);

    const calculaValorTotalContratos = (contrato) => {
        const quantidade = contrato.quantidade || 1;
        const total = calculaValorImpostoMensal(parseFloat((contrato.valor_mensal * quantidade) * contrato.duracao), contrato.indice_reajuste);
        return total;
    };

    return (
        <>
            {loading && <Loading />}
            <div id="contratos-display">
                <Navbar />
                <div id="contratos-container">
                    <h1 id="contratos-titulo">Contratos</h1>
                    <input
                        type="text"
                        placeholder="Procure pelo cliente"
                        id="contratos-input"
                        value={filter}
                        onChange={filtratContratos}
                    />
                    <button onClick={addContrato} disabled={!isAdminOrDev} className={`contratos-botao ${!isAdminOrDev ? 'disabled' : ''}`} id="contratos-botao-add">Adicionar Contrato</button>
                    <button onClick={() => setShowFilterPopup(true)} className="contratos-botao" id="contratos-botao-filtro">Filtrar</button>
                    {showFilterPopup && (
                        <div className="filter-popup">
                            <PopUpFiltro onFilter={aplicarFiltroPopUp} closeModal={() => setShowFilterPopup(false)} />
                        </div>
                    )}
                    {Object.keys(filters).length > 0 && (
                        <div className="active-filters">
                            <p><b>Filtros Ativos:</b></p>
                            <p id="active-filters-container">
                                {Object.entries(filters).map(([key, value]) => (
                                    value && <span className="active-filters-current" key={key}>{`${key.replace(/_/g, ' ')}: ${value}`}</span>
                                ))}
                            </p>
                            <button onClick={limparFiltros} className="contratos-botao" id="contratos-botao-limpar-filtros">Limpar Filtros</button>
                        </div>
                    )}
                    {filteredContratos.length > 0 ? (
                        <table id="contratos-tabela">
                            <thead>
                                <tr>
                                    <th className="contratos-titulo-tabela">Cliente</th>
                                    <th className="contratos-titulo-tabela">CPF/CNPJ</th>
                                    <th className="contratos-titulo-tabela">Solução</th>
                                    <th className="contratos-titulo-tabela">Valor Contrato</th>
                                    <th className="contratos-titulo-tabela">Vendedor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContratos.map(contrato => (
                                    <tr key={contrato.id} onClick={() => detalhesContrato(contrato.id)} className="clickable-row">
                                        <td className="contratos-conteudo-tabela">{clientes[contrato.id_cliente]?.nome_fantasia || "Carregando..."}</td>
                                        <td className="contratos-conteudo-tabela">{clientes[contrato.id_cliente]?.cpf_cnpj || "Carregando..."}</td>
                                        <td className="contratos-conteudo-tabela">{produtos[contrato.id_produto] || "Carregando..."}</td>
                                        <td className="contratos-conteudo-tabela">{calculaValorTotalContratos(contrato).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td className="contratos-conteudo-tabela">{vendedores[clientes[contrato.id_cliente]?.vendedor]?.nome}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p id="contratos-sem-contratos">Ainda não foram cadastrados contratos!</p>
                    )}
                </div>
            </div>
        </>
    );
}
