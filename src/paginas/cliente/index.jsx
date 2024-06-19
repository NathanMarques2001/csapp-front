import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import botaoEditar from "../../assets/icons/icon-lapis.png";
import imgCliente from "../../assets/images/img-cliente.png";
import Navbar from "../../componetes/navbar";
import CardGestor from "../../componetes/card-gestor";

export default function Cliente() {
    const api = new Api();
    const [cliente, setCliente] = useState('');
    const contatoComercial = [
        {
            id: 1,
            conteudo: "Nome: João da Silva"
        },
        {
            id: 2,
            conteudo: "Email: blabla@gmail.com"
        }
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
                const data = await api.get('/clientes/1');
                setCliente(data.cliente);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <body className="global-display">
            <Navbar />
            <div className="global-container">
                <div id="cliente-cabecalho">
                    <h2>Cliente - {cliente.nome}</h2>
                    <button id="cliente-editar-btn"><img src={botaoEditar} alt="" /></button>
                </div>
                <h3>Contratos</h3>
                <table id="cliente-tabela">
                    <thead>
                        <tr>
                            <th>Solução</th>
                            <th>Contratação</th>
                            <th>Valor</th>
                            <th>Recorrência</th>
                            <th>Faturamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Antivirus Mensal</td>
                            <td>01/01/2024</td>
                            <td>R$ 5.763,71</td>
                            <td>12 MESES</td>
                            <td>Kaspersky</td>
                        </tr>
                    </tbody>
                </table>
                <div id="cliente-faturamento-mensal">
                    Faturamento mensal: <b>R$ 5.763,71</b>
                </div>
                <div id="cliente-card-container">
                    <div className="cliente-card-gestor">
                        <h3>Gestor de Contratos</h3>
                        <div>
                            <p><img src={iconeGestor} alt="" />{cliente.gestor_contratos_nome}</p>
                            <p><img src={iconeEmail} alt="" />{cliente.gestor_contratos_email}</p>
                            <p><img src={iconeTelefone} alt="" />{cliente.gestor_contratos_telefone_1}</p>
                            <p><img src={iconeTelefoneAdicional} alt="" />{cliente.gestor_contratos_telefone_2}</p>
                        </div>
                    </div>
                    <div className="cliente-card-gestor">
                        <h3>Gestor de Chamados</h3>
                        <div>
                            <p><img src={iconeGestor} alt="" />{cliente.gestor_chamados_nome}</p>
                            <p><img src={iconeEmail} alt="" />{cliente.gestor_chamados_email}</p>
                            <p><img src={iconeTelefone} alt="" />{cliente.gestor_chamados_telefone_1}</p>
                            <p><img src={iconeTelefoneAdicional} alt="" />{cliente.gestor_chamados_telefone_2}</p>
                        </div>
                    </div>
                    <div className="cliente-card-gestor">
                        <h3>Gestor Financeiro</h3>
                        <div>
                            <p><img src={iconeGestor} alt="" />{cliente.gestor_financeiro_nome}</p>
                            <p><img src={iconeEmail} alt="" />{cliente.gestor_financeiro_email}</p>
                            <p><img src={iconeTelefone} alt="" />{cliente.gestor_financeiro_telefone_1}</p>
                            <p><img src={iconeTelefoneAdicional} alt="" />{cliente.gestor_financeiro_telefone_2}</p>
                        </div>
                    </div>
                </div>
                <div className="cliente-contatos-container">
                    <div>
                        <h3>Contato Comercial</h3>
                        {contatoComercial.map(contato => (
                            <p key={contato.id}>{contato.conteudo}</p>
                        ))}
                    </div>
                    <div>
                        <h3>Contato Técnico</h3>
                        {contatoTecnico.map(contato => (
                            <p key={contato.id}>{contato.conteudo}</p>
                        ))}
                    </div>
                </div>
                <div className="cliente-contatos-container" id="cliente-contatos-container-img">
                    <div>
                        <h3>Fatos Importantes</h3>
                        {fatosImportantes.map(fato => (
                            <p key={fato.id}>{fato.conteudo}</p>
                        ))}
                    </div>
                    <img src={imgCliente} alt="" id="cliente-img" />
                </div>
            </div>
        </body>
    );
}