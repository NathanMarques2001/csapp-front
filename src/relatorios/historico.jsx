import { useState } from "react";
import Api from "../utils/api";
import Carregando from "../componentes/carregando";
import Excel from "../utils/excel";

export default function RelatorioHistorico({ usuariosMap }) {
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [loading, setLoading] = useState(false);
    const [historicoClientes, setHistoricoClientes] = useState([]);
    const [historicoContratos, setHistoricoContratos] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState("clientes");

    const excelClientes = new Excel("Histórico Clientes");
    const excelContratos = new Excel("Histórico Contratos");

    async function buscarHistorico() {
        if (!dataInicio || !dataFim) {
            alert("Por favor, selecione as datas de início e fim.");
            return;
        }

        setLoading(true);
        try {
            const api = new Api();

            const [resClientes, resContratos] = await Promise.all([
                api.get(`/historico/clientes?dataInicio=${dataInicio}&dataFim=${dataFim}`),
                api.get(`/historico/contratos?dataInicio=${dataInicio}&dataFim=${dataFim}`)
            ]);

            setHistoricoClientes(resClientes || []);
            setHistoricoContratos(resContratos || []);

        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
            alert("Erro ao buscar dados históricos.");
        } finally {
            setLoading(false);
        }
    }

    function formatarData(data) {
        if (!data) return "-";
        // Tenta tratar como data somente se vier como string ISO
        const d = new Date(data);
        // Ajuste simples para exibir fuso local caso venha UTC (como é dateonly, vem string YYYY-MM-DD)
        // Se for string YYYY-MM-DD, split é mais seguro para evitar timezone shifts
        if (typeof data === 'string' && data.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        return d.toLocaleDateString('pt-BR');
    }

    function exportarExcel() {
        if (abaAtiva === "clientes") {
            excelClientes.exportToExcel(historicoClientes);
        } else {
            excelContratos.exportToExcel(historicoContratos);
        }
    }

    return (
        <div className="historico-container">
            {loading && <Carregando />}

            <div className="filtros-historico" style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "flex-end" }}>
                <div className="form-group">
                    <label>Data Início:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Data Fim:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                    />
                </div>
                <button onClick={buscarHistorico} className="relatorio-button">Buscar Histórico</button>
                {(historicoClientes.length > 0 || historicoContratos.length > 0) && (
                    <button onClick={exportarExcel} className="relatorio-button">Exportar Excel</button>
                )}
            </div>

            <div className="abas-historico" style={{ marginBottom: "15px" }}>
                <button
                    onClick={() => setAbaAtiva("clientes")}
                    className={`relatorio-button ${abaAtiva === "clientes" ? "ativo" : ""}`}
                    style={{ fontWeight: abaAtiva === "clientes" ? "bold" : "normal", marginRight: "10px" }}
                >
                    Histórico de Clientes ({historicoClientes.length})
                </button>
                <button
                    onClick={() => setAbaAtiva("contratos")}
                    className={`relatorio-button ${abaAtiva === "contratos" ? "ativo" : ""}`}
                    style={{ fontWeight: abaAtiva === "contratos" ? "bold" : "normal" }}
                >
                    Histórico de Contratos ({historicoContratos.length})
                </button>
            </div>

            {abaAtiva === "clientes" && (
                <table className="global-tabela">
                    <thead>
                        <tr>
                            <th className="global-titulo-tabela">Data Referência</th>
                            <th className="global-titulo-tabela">Razão Social</th>
                            <th className="global-titulo-tabela">Fantasia</th>
                            <th className="global-titulo-tabela">CNPJ</th>
                            <th className="global-titulo-tabela">Status</th>
                            <th className="global-titulo-tabela">Data Criação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historicoClientes.map((c) => (
                            <tr key={c.id}>
                                <td className="global-conteudo-tabela">{formatarData(c.data_referencia)}</td>
                                <td className="global-conteudo-tabela">{c.razao_social}</td>
                                <td className="global-conteudo-tabela">{c.nome_fantasia}</td>
                                <td className="global-conteudo-tabela">{c.cpf_cnpj}</td>
                                <td className="global-conteudo-tabela">{c.status}</td>
                                <td className="global-conteudo-tabela">{new Date(c.data_criacao).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {historicoClientes.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>Nenhum registro encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            )}

            {abaAtiva === "contratos" && (
                <table className="global-tabela">
                    <thead>
                        <tr>
                            <th className="global-titulo-tabela">Data Referência</th>
                            <th className="global-titulo-tabela">ID Contrato Ori.</th>
                            <th className="global-titulo-tabela">Status</th>
                            <th className="global-titulo-tabela">Valor Mensal</th>
                            <th className="global-titulo-tabela">Qtde</th>
                            <th className="global-titulo-tabela">Início</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historicoContratos.map((c) => (
                            <tr key={c.id}>
                                <td className="global-conteudo-tabela">{formatarData(c.data_referencia)}</td>
                                <td className="global-conteudo-tabela">{c.id_contrato_original}</td>
                                <td className="global-conteudo-tabela">{c.status}</td>
                                <td className="global-conteudo-tabela">
                                    {c.valor_mensal ? parseFloat(c.valor_mensal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                                </td>
                                <td className="global-conteudo-tabela">{c.quantidade}</td>
                                <td className="global-conteudo-tabela">{c.data_inicio ? new Date(c.data_inicio).toLocaleDateString() : '-'}</td>
                            </tr>
                        ))}
                        {historicoContratos.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>Nenhum registro encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
