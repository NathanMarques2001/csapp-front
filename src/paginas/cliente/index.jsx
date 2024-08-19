// Bibliotecas
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Componentes
import Navbar from "../../componetes/navbar";
import CardGestor from "../../componetes/card-gestor";
import CardContato from "../../componetes/card-contato";
import Loading from "../../componetes/loading";
// Estilos, funcoes, classes, imagens e etc
import "./style.css";
import Api from "../../utils/api";
import botaoEditar from "../../assets/icons/icon-lapis.png";
import imgCliente from "../../assets/images/img-cliente.png";
import PopupInformacoes from "../../componetes/pop-up-informacoes-adicionais";
import { useCookies } from "react-cookie";

export default function Cliente() {
    const api = new Api();
    const [showPopup, setShowPopup] = useState(false)
    const [cliente, setCliente] = useState({});
    const [contratos, setContratos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [fabricantes, setFabricantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [titulo, setTitulo] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();
    const [contatoComercial, setContatoComercial] = useState([]);
    const [contatoTecnico, setContatoTecnico] = useState([]);
    const [fatosImportantes, setFatosImportantes] = useState([]);
    const [contatoAdicionado, setContatoAdicionado] = useState(0);

    const [cookies, setCookie, removeCookie] = useCookies(['tipo']);
    const [isAdminOrDev, setIsAdminOrDev] = useState(false);

    useEffect(() => {
        // Verifica o tipo de usuário e atualiza o estado
        if (cookies.tipo === "dev" || cookies.tipo === "admin") {
            setIsAdminOrDev(true);
        } else {
            setIsAdminOrDev(false);
        }
    }, [cookies.tipo]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const clienteData = await api.get(`/clientes/${id}`);
                setCliente(clienteData.cliente);

                const contratosData = await api.get(`/contratos/cliente/${id}`);
                setContratos(contratosData.contratos);

                const produtosData = await api.get('/produtos');
                setProdutos(produtosData.produtos)

                const contratosAtivos = contratosData.contratos.filter(contrato => contrato.status === 'ativo');
                const contratosMap = contratosAtivos.contratos.reduce((map, contrato) => {
                    map[contrato.id] = {
                        id_produto: contrato.id_produto,
                        valor_mensal: contrato.valor_mensal,
                        duracao: contrato.duracao,
                        indice_reajuste: contrato.indice_reajuste
                    };
                    return map;
                }, {});
                setContratos(contratosMap);

                const fabricantesData = await api.get('/fabricantes');
                setFabricantes(fabricantesData.fabricantes);

                const contatosComerciaisData = await api.get(`/contatos-comerciais/${id}`);
                setContatoComercial(contatosComerciaisData.contatos_comerciais);

                const contatosTecnicosData = await api.get(`/contatos-tecnicos/${id}`);
                setContatoTecnico(contatosTecnicosData.contatos_tecnicos);

                const fatosImportantesData = await api.get(`/fatos-importantes/${id}`);
                setFatosImportantes(fatosImportantesData.fatos_importantes);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contatoAdicionado]);

    const getProdutoNome = (produtoId) => {
        const produto = produtos.find(p => p.id === produtoId);
        return produto ? produto.nome : "Desconhecido";
    };

    const getFabricanteNome = (produtoId) => {
        const produto = produtos.find(p => p.id === produtoId);
        if (produto) {
            const fabricante = fabricantes.find(f => f.id === produto.id_fabricante);
            return fabricante ? fabricante.nome : "Desconhecido";
        }
        return "Desconhecido";
    };

    const editar = (id) => {
        navigate(`/edicao-cliente/${id}`)
    };

    const calculaValorImpostoMensal = (valor, indice) => valor + ((valor * indice) / 100);

    const calculaValorTotalContratos = () => {
        return contratos.reduce((total, contrato) => total + calculaValorImpostoMensal(parseFloat(contrato.valor_mensal), contrato.indice_reajuste), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const abrirPopUp = async (e, titulo) => {
        e.preventDefault();
        setTitulo(titulo);
        setShowPopup(true);
    };

    const confirmSubmit = async () => {
        setShowPopup(false);
        setContatoAdicionado(contatoAdicionado + 1)
    };

    const cancelPopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            {loading && <Loading />}
            {showPopup && (
                <PopupInformacoes
                    title={titulo}
                    onConfirm={confirmSubmit}
                    onCancel={cancelPopup}
                />
            )}
            <div id="cliente-display">
                <Navbar />
                <div id="cliente-container">
                    <div id="cliente-cabecalho">
                        <div>
                            <h1 id="cliente-titulo-nome">Cliente - {cliente.nome_fantasia}</h1>
                            <p id="cliente-titulo-razao">{cliente.razao_social} - {cliente.cpf_cnpj}</p>
                        </div>
                        <button disabled={!isAdminOrDev} onClick={e => editar(cliente.id)} id="cliente-botao-editar" className={!isAdminOrDev ? 'disabled' : ''}><img src={botaoEditar} alt="ícone editar" /></button>
                    </div>
                    <h2 id="cliente-subtitulo-contratos">Contratos</h2>
                    <table id="cliente-tabela">
                        <thead>
                            <tr>
                                <th>Solução</th>
                                <th>Contratação</th>
                                <th>Valor</th>
                                <th>Recorrência</th>
                                <th>Fabricante</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contratos.map(contrato => (
                                <tr key={contrato.id - 1}>
                                    <td>{getProdutoNome(contrato.id_produto)}</td>
                                    <td>{new Date(contrato.createdAt).toLocaleDateString()}</td>
                                    <td>{calculaValorImpostoMensal(parseFloat(contrato.valor_mensal * contrato.duracao), contrato.indice_reajuste).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td>{contrato.duracao == 12000 ? `INDETERMINADO` : `${contrato.duracao} MESES`}</td>
                                    <td>{getFabricanteNome(contrato.id_produto)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div id="cliente-faturamento-mensal">
                        Faturamento mensal: <b>{calculaValorTotalContratos()}</b>
                    </div>
                    <div id="cliente-card-container">
                        <CardGestor titulo={"Gestor de Contratos"} nome={cliente.gestor_contratos_nome} email={cliente.gestor_contratos_email} telefone1={cliente.gestor_contratos_telefone_1} telefone2={cliente.gestor_contratos_telefone_2} permissao={isAdminOrDev} />
                        <CardGestor titulo={"Gestor de Chamados"} nome={cliente.gestor_chamados_nome} email={cliente.gestor_chamados_email} telefone1={cliente.gestor_chamados_telefone_1} telefone2={cliente.gestor_chamados_telefone_2} permissao={isAdminOrDev} />
                        <CardGestor titulo={"Gestor Financeiro"} nome={cliente.gestor_financeiro_nome} email={cliente.gestor_financeiro_email} telefone1={cliente.gestor_financeiro_telefone_1} telefone2={cliente.gestor_financeiro_telefone_2} permissao={isAdminOrDev} />
                    </div>
                    <div className="cliente-contatos-container">
                        <CardContato titulo={"Contato Comercial"} contatos={contatoComercial} abrirPopUp={e => abrirPopUp(e, "Contato Comercial")} />
                        <CardContato titulo={"Contato Técnico"} contatos={contatoTecnico} abrirPopUp={e => abrirPopUp(e, "Contato Técnico")} />
                    </div>
                    <div className="cliente-contatos-container" id="cliente-contatos-container-img">
                        <CardContato titulo={"Fatos Importantes"} contatos={fatosImportantes} abrirPopUp={e => abrirPopUp(e, "Fatos Importantes")} />
                        <img src={imgCliente} alt="" id="cliente-img" />
                    </div>
                </div>
            </div>
        </>
    );
}