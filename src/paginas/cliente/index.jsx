import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import botaoEditar from "../../assets/icons/icon-lapis.png";
import imgCliente from "../../assets/images/img-cliente.png";
import Navbar from "../../componetes/navbar";
import CardGestor from "../../componetes/card-gestor";
import CardContato from "../../componetes/card-contato";

export default function Cliente() {
    const api = new Api();
    const [cliente, setCliente] = useState({});
    const [contratos, setContratos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [fabricantes, setFabricantes] = useState([]);
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
                const clienteData = await api.get('/clientes/1');
                setCliente(clienteData.cliente);
                const contratosData = await api.get('/contratos/usuario/1');
                setContratos(contratosData.contratos);

                const produtosData = await api.get('/produtos');
                setProdutos(produtosData.produtos);

                const fabricantesData = await api.get('/fabricantes');
                setFabricantes(fabricantesData.fabricantes);
            } catch (err) {
                console.error("Error fetching data:", err);
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

    const calculateTotalContractValue = () => {
        return contratos.reduce((total, contrato) => total + parseFloat(contrato.valor_mensal), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="global-display">
            <Navbar />
            <div className="global-container">
                <div id="cliente-cabecalho">
                    <h2>Cliente - {cliente.nome}</h2>
                    <button className="solucoes-editar-btn solucoes-item-btn" id="cliente-editar-btn"><img src={botaoEditar} alt="" /></button>
                </div>
                <h3>Contratos</h3>
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
                                <td>{parseFloat(contrato.valor_mensal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td>{contrato.duracao} MESES</td>
                                <td>{getFabricanteNome(contrato.id_produto)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div id="cliente-faturamento-mensal">
                    Faturamento mensal: <b>{calculateTotalContractValue()}</b>
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
    );
}