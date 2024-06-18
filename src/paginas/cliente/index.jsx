import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import botaoEditar from "../../assets/icons/icon-lapis.png";
import imgCliente from "../../assets/images/img-cliente.png";
import Navbar from "../../componetes/navbar";

export default function Cliente() {
    const api = new Api();
    const [cliente, setCliente] = useState('');

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
                <div>
                    <h2>Cliente - {cliente.nome}</h2>
                    <button><img src={botaoEditar} alt="" /></button>
                </div>
                <h3>Contratos</h3>
                <table>
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
                <div>
                    Faturamento mensal: R$ 5.763,71
                </div>
                <div>
                    Gestor de Contratos
                    <p>{cliente.gestor_contratos_nome}</p>
                    <p>{cliente.gestor_contratos_email}</p>
                    <p>{cliente.gestor_contratos_telefone_1}</p>
                    <p>{cliente.gestor_contratos_telefone_2}</p>
                </div>
                <div>
                    Gestor de Chamados
                    <p>{cliente.gestor_chamados_nome}</p>
                    <p>{cliente.gestor_chamados_email}</p>
                    <p>{cliente.gestor_chamados_telefone_1}</p>
                    <p>{cliente.gestor_chamados_telefone_2}</p>
                </div>
                <div>
                    Gestor Financeiro
                    <p>{cliente.gestor_financeiro_nome}</p>
                    <p>{cliente.gestor_financeiro_email}</p>
                    <p>{cliente.gestor_financeiro_telefone_1}</p>
                    <p>{cliente.gestor_financeiro_telefone_2}</p>
                </div>
                <div>
                    Contato Comercial
                </div>
                <div>
                    Contato Técnico
                </div>
                <div>
                    Fatos Importantes
                </div>
                <img src={imgCliente} alt="" />
            </div>
        </body>
    );
}