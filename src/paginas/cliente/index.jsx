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

export default function Cliente() {
    const api = new Api();
    const [cliente, setCliente] = useState({});
    const [contratos, setContratos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [fabricantes, setFabricantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const contatoComercial = [
        {
            id: 1,
            conteudo: "Nome: João da Silva"
        },
        {
            id: 2,
            conteudo: "Email: blabla@gmail.com"
        },
        {
            id: 1,
            conteudo: "Nome: João da Silva"
        },
        {
            id: 2,
            conteudo: "Email: blabla@gmail.com"
        },
        {
            id: 1,
            conteudo: "Nome: João da Silva"
        },
        {
            id: 2,
            conteudo: "Email: blabla@gmail.com"
        },
        {
            id: 1,
            conteudo: "Nome: João da Silva"
        },
        {
            id: 2,
            conteudo: "Email: blabla@gmail.com"
        },
        {
            id: 1,
            conteudo: "Nome: João da Silva"
        },
        {
            id: 2,
            conteudo: "Email: blabla@gmail.com"
        },
        {
            id: 1,
            conteudo: "Nome: João da Silva"
        },
        {
            id: 2,
            conteudo: "Email: blabla@gmail.com"
        },
    ];

    const contatoTecnico = [
        {
            id: 1,
            conteudo: "Nome: Maria da Silva"
        },
        {
            id: 2,
            conteudo: "Email: asdasdsa@yahoo.com"
        }
    ];

    const fatosImportantes = [
        {
            id: 1,
            conteudo: "Fato 1"
        },
        {
            id: 2,
            conteudo: "Fato 2"
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const clienteData = await api.get(`/clientes/${id}`);
                setCliente(clienteData.cliente);
                const contratosData = await api.get(`/contratos/usuario/${id}`);
                setContratos(contratosData.contratos);

                const produtosData = await api.get('/produtos');
                setProdutos(produtosData.produtos)

                const contratosAtivos = contratosData.contratos.filter(contrato => contrato.status === 'ativo');
                setContratos(contratosAtivos);

                const fabricantesData = await api.get('/fabricantes');
                setFabricantes(fabricantesData.fabricantes);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    return (
        <>
            {loading && <Loading />}
            <div id="cliente-display">
                <Navbar />
                <div id="cliente-container">
                    <div id="cliente-cabecalho">
                        <div>
                            <h1 id="cliente-titulo-nome">Cliente - {cliente.nome_fantasia}</h1>
                            <p id="cliente-titulo-razao">{cliente.razao_social} - {cliente.cpf_cnpj}</p>
                        </div>
                        <button onClick={e => editar(cliente.id)} id="cliente-botao-editar"><img src={botaoEditar} alt="ícone editar" /></button>
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
                                <tr key={contrato.id}>
                                    <td>{getProdutoNome(contrato.id_produto)}</td>
                                    <td>{new Date(contrato.createdAt).toLocaleDateString()}</td>
                                    <td>{calculaValorImpostoMensal(parseFloat(contrato.valor_mensal), contrato.indice_reajuste).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td>{contrato.duracao} MESES</td>
                                    <td>{getFabricanteNome(contrato.id_produto)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div id="cliente-faturamento-mensal">
                        Faturamento mensal: <b>{calculaValorTotalContratos()}</b>
                    </div>
                    <div id="cliente-card-container">
                        <CardGestor titulo={"Gestor de Contratos"} nome={cliente.gestor_contratos_nome} email={cliente.gestor_contratos_email} telefone1={cliente.gestor_contratos_telefone_1} telefone2={cliente.gestor_contratos_telefone_2} />
                        <CardGestor titulo={"Gestor de Chamados"} nome={cliente.gestor_chamados_nome} email={cliente.gestor_chamados_email} telefone1={cliente.gestor_chamados_telefone_1} telefone2={cliente.gestor_chamados_telefone_2} />
                        <CardGestor titulo={"Gestor Financeiro"} nome={cliente.gestor_financeiro_nome} email={cliente.gestor_financeiro_email} telefone1={cliente.gestor_financeiro_telefone_1} telefone2={cliente.gestor_financeiro_telefone_2} />
                    </div>
                    <div className="cliente-contatos-container">
                        <CardContato titulo={"Contato Comercial"} contatos={contatoComercial} />
                        <CardContato titulo={"Contato Técnico"} contatos={contatoTecnico} />
                    </div>
                    <div className="cliente-contatos-container" id="cliente-contatos-container-img">
                        <CardContato titulo={"Fatos Importantes"} contatos={fatosImportantes} />
                        <img src={imgCliente} alt="" id="cliente-img" />
                    </div>
                </div>
            </div>
        </>
    );
}