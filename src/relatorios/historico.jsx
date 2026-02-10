import { useState } from "react";
import Api from "../utils/api";
import Carregando from "../componentes/carregando";
import Excel from "../utils/excel";
import Popup from "../componentes/pop-up";

export default function RelatorioHistorico({ usuariosMap }) {
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [loading, setLoading] = useState(false);
    const [historicoClientes, setHistoricoClientes] = useState([]);
    const [historicoContratos, setHistoricoContratos] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState("clientes");
    const [abrirPopup, setAbrirPopup] = useState(false);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

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

    function confirmExportarExcel() {
        setAbrirPopup(true);
    }

    function exportarExcel() {
        if (abaAtiva === "clientes") {
            excelClientes.exportToExcel(historicoClientes);
        } else {
            excelContratos.exportToExcel(historicoContratos);
        }
        setAbrirPopup(false);
    }

    return (
        <>
            {loading && <Carregando />}

            {abrirPopup && (
                <Popup
                    title={`Exportar Histórico - ${abaAtiva === "clientes" ? "Clientes" : "Contratos"}`}
                    message={`Deseja exportar o histórico de ${abaAtiva === "clientes" ? "clientes" : "contratos"}?`}
                    onConfirm={exportarExcel}
                    onCancel={() => setAbrirPopup(false)}
                />
            )}

            {mostrarFiltros && (
                <div id="filter-container">
                    <form onSubmit={(e) => { e.preventDefault(); buscarHistorico(); setMostrarFiltros(false); }} className="filter-form">
                        <div className="form-group">
                            <label>Data Início:</label>
                            <input
                                type="date"
                                className="global-input"
                                style={{ width: "90%" }}
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Fim:</label>
                            <input
                                type="date"
                                className="global-input"
                                style={{ width: "90%" }}
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="filter-button"
                            style={{ marginTop: "10px", width: "100%", backgroundColor: "#97c93d", color: "white", border: "none", padding: "10px" }}
                        >
                            Buscar
                        </button>
                        <button
                            type="button"
                            onClick={() => setMostrarFiltros(false)}
                            id="filter-close-button"
                            className="filter-button"
                            style={{ marginTop: "10px" }}
                        >
                            Fechar
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={() => setMostrarFiltros(true)}
                className="relatorio-button"
                id="relatorio-button-filtrar"
            >
                Filtrar
            </button>
            <button
                onClick={() => setAbrirPopup(true)}
                className="relatorio-button"
                id="relatorio-button-exportar"
            >
                Exportar para Excel
            </button>

            <div className="abas-historico" style={{ marginBottom: "20px", borderBottom: "2px solid #e9ecef", display: "flex", gap: "20px", marginTop: "2%" }}>
                <button
                    onClick={() => setAbaAtiva("clientes")}
                    style={{
                        background: "none",
                        border: "none",
                        borderBottom: abaAtiva === "clientes" ? "3px solid #0056b3" : "3px solid transparent",
                        padding: "10px 5px",
                        fontSize: "16px",
                        fontWeight: abaAtiva === "clientes" ? "700" : "500",
                        color: abaAtiva === "clientes" ? "#0056b3" : "#6c757d",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                >
                    Histórico de Clientes <span style={{ fontSize: "12px", background: "#e9ecef", padding: "2px 8px", borderRadius: "10px", marginLeft: "8px", verticalAlign: "middle" }}>{historicoClientes.length}</span>
                </button>
                <button
                    onClick={() => setAbaAtiva("contratos")}
                    style={{
                        background: "none",
                        border: "none",
                        borderBottom: abaAtiva === "contratos" ? "3px solid #0056b3" : "3px solid transparent",
                        padding: "10px 5px",
                        fontSize: "16px",
                        fontWeight: abaAtiva === "contratos" ? "700" : "500",
                        color: abaAtiva === "contratos" ? "#0056b3" : "#6c757d",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                >
                    Histórico de Contratos <span style={{ fontSize: "12px", background: "#e9ecef", padding: "2px 8px", borderRadius: "10px", marginLeft: "8px", verticalAlign: "middle" }}>{historicoContratos.length}</span>
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
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#6c757d" }}>Nenhum registro encontrado para o período selecionado.</td></tr>
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
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#6c757d" }}>Nenhum registro encontrado para o período selecionado.</td></tr>
                        )}
                    </tbody>
                </table>
            )}
        </>
    );
}
