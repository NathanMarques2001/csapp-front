// Bibliotecas
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Componentes
import Navbar from "../../componetes/navbar";
import Loading from "../../componetes/loading";
// Estilos, funcoes, classes, imagens e etc
import Api from "../../utils/api";
import './style.css';
import { useCookies } from "react-cookie";

export default function Clientes() {
    const api = new Api();
    const [cookies, setCookie, removeCookie] = useCookies(['tipo', 'id']);
    const [isAdminOrDev, setIsAdminOrDev] = useState(false);
    const [clientesRoute, setClientesRoute] = useState("");
    const [contratosRoute, setContratosRoute] = useState("");
    const [clientes, setClientes] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [vendedores, setVendedores] = useState({});
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setClientesRoute('/clientes');
        setContratosRoute('/contratos');
        if (cookies.tipo === "dev" || cookies.tipo === "admin") {
            setIsAdminOrDev(true);
            // setClientesRoute('/clientes');
            // setContratosRoute('/contratos');
        } else {
            setIsAdminOrDev(false);
            // setClientesRoute(`/clientes/vendedor/${cookies.id}`);
            // setContratosRoute(`/contratos/vendedor/${cookies.id}`);
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const clientesResponse = await api.get(clientesRoute);
                setClientes(clientesResponse.clientes);

                const vendedoresResponse = await api.get('/usuarios');
                const vendedoresMap = vendedoresResponse.usuarios.reduce((map, vendedor) => {
                    map[vendedor.id] = vendedor.nome;
                    return map;
                }, {});
                setVendedores(vendedoresMap);

                const contratosResponse = await api.get(contratosRoute);
                setContratos(contratosResponse.contratos);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cookies.tipo, cookies.id, clientesRoute, contratosRoute]);

    const calculaValorImpostoMensal = (valor, indice) => valor + ((valor * indice) / 100);

    const calculaValorTotalContratos = (clienteId) => {
        const clienteContratos = contratos.filter(contrato => contrato.id_cliente === clienteId && contrato.status === 'ativo');

        const total = clienteContratos.reduce((sum, contrato) => {
            const valorContrato = parseFloat(contrato.valor_mensal);
            const valorComImposto = calculaValorImpostoMensal(valorContrato, contrato.indice_reajuste);
            return sum + valorComImposto;
        }, 0);

        return total;
    };

    const detalhesCliente = (id) => {
        navigate(`/clientes/${id}`);
    };

    const filtraClientes = (e) => {
        setFilter(e.target.value);
    };

    const clientesFiltrados = clientes.filter(cliente => {
        return (
            cliente.nome_fantasia.toLowerCase().includes(filter.toLowerCase()) || 
            cliente.cpf_cnpj.includes(filter)
        );
    });
    

    const addCliente = () => {
        navigate('/cadastro-cliente');
    }

    return (
        <>
            {loading && <Loading />}
            <div id="clientes-display">
                <Navbar />
                <div id="clientes-container">
                    <h1 id="clientes-titulo">Clientes</h1>
                    <input
                        type="text"
                        placeholder="Procure pelo nome"
                        id="clientes-input"
                        value={filter}
                        onChange={filtraClientes}
                    />
                    <button disabled={!isAdminOrDev} className={!isAdminOrDev ? 'disabled' : ''} onClick={e => addCliente()} id="clientes-botao">Adicionar cliente</button>
                    {clientesFiltrados.length > 0 ? (
                        <table id="clientes-tabela">
                            <thead>
                                <tr>
                                    <th className="clientes-titulo-tabela">Nome Fantasia</th>
                                    <th className="clientes-titulo-tabela">CPF/CNPJ</th>
                                    <th className="clientes-titulo-tabela">Categoria</th>
                                    <th className="clientes-titulo-tabela">Valor Contratos</th>
                                    <th className="clientes-titulo-tabela">Vendedor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesFiltrados.map(cliente => (
                                    <tr key={cliente.id} onClick={() => detalhesCliente(cliente.id)} className="clickable-row">
                                        <td className="clientes-conteudo-tabela">{cliente.nome_fantasia}</td>
                                        <td className="clientes-conteudo-tabela">{cliente.cpf_cnpj}</td>
                                        <td className="clientes-conteudo-tabela">{cliente.tipo.toUpperCase()}</td>
                                        <td className="clientes-conteudo-tabela">{calculaValorTotalContratos(cliente.id).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td className="clientes-conteudo-tabela">{vendedores[cliente.id_usuario]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p id="clientes-sem-clientes">Ainda não foram cadastrados clientes!</p>
                    )}
                </div>
            </div>
        </>
    );
}
