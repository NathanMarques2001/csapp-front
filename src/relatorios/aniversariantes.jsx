import { useState, useMemo } from "react";
import Excel from "../utils/excel";
import Popup from "../componetes/pop-up";

export default function RelatorioAniversariantes({ clientes }) {
    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];

    const hoje = new Date();
    const [mesSelecionado, setMesSelecionado] = useState(String(hoje.getMonth() + 1));
    const [abrirPopup, setAbrirPopup] = useState(false);

    // Normaliza e extrai dia/mes de uma string 'YYYY-MM-DD' ou similar.
    const extraiDiaMes = (dateStr) => {
        if (!dateStr) return null;
        // aceita formatos como 'YYYY-MM-DD' ou 'YYYY-MM-DDT...'
        const parts = dateStr.split("-");
        if (parts.length < 3) return null;
        const year = parts[0];
        const month = parts[1];
        const day = parts[2].slice(0, 2);
        if (!/^[0-9]{2}$/.test(day) || !/^[0-9]{2}$/.test(month)) return null;
        return { day, month };
    };

    // Gera linhas: uma linha por pessoa (gestor) cujo mês bate com o selecionado
    const aniversariantes = useMemo(() => {
        if (!clientes || clientes.length === 0) return [];
        const rows = [];
        clientes.forEach((c) => {
            const clienteNome = c.nome_fantasia || c.razao_social || "—";
            const cpfCnpj = c.cpf_cnpj || "";

            const campos = [
                {
                    fieldDate: c.gestor_contratos_nascimento,
                    name: c.gestor_contratos_nome,
                    cargo: "Gestor Contratos",
                },
                {
                    fieldDate: c.gestor_chamados_nascimento,
                    name: c.gestor_chamados_nome,
                    cargo: "Gestor Chamados",
                },
                {
                    fieldDate: c.gestor_financeiro_nascimento,
                    name: c.gestor_financeiro_nome,
                    cargo: "Gestor Financeiro",
                },
            ];

            campos.forEach((item) => {
                const dm = extraiDiaMes(item.fieldDate);
                if (!dm) return;
                // comparar mês (numérico sem zeros à esquerda)
                if (String(Number(dm.month)) === String(Number(mesSelecionado))) {
                    rows.push({
                        Cliente: clienteNome,
                        "CPF/CNPJ": cpfCnpj,
                        Pessoa: item.name || "—",
                        Cargo: item.cargo,
                        "Data Nascimento": `${dm.day}/${dm.month}`,
                    });
                }
            });
        });
        // deduplicate rows that may repeat because same person appears in multiple cargos
        const unique = [];
        const seen = new Set();
        rows.forEach((r) => {
            const clienteKey = (r["Cliente"] || "").toString().trim();
            const cpfKey = (r["CPF/CNPJ"] || "").toString().replace(/\s+/g, "").trim();
            const pessoaKey = (r["Pessoa"] || "").toString().trim();
            const dataKey = (r["Data Nascimento"] || "").toString().trim();
            const key = `${clienteKey}|${cpfKey}|${pessoaKey}|${dataKey}`;
            if (!seen.has(key)) {
                seen.add(key);
                // normalize trimmed fields
                unique.push({
                    Cliente: clienteKey,
                    "CPF/CNPJ": cpfKey,
                    Pessoa: pessoaKey,
                    Cargo: r["Cargo"],
                    "Data Nascimento": dataKey,
                });
            }
        });

        // ordenar por dia
        unique.sort((a, b) => {
            const da = Number(a["Data Nascimento"].split("/")[0]);
            const db = Number(b["Data Nascimento"].split("/")[0]);
            return da - db;
        });
        return unique;
    }, [clientes, mesSelecionado]);

    const excel = new Excel(`Relatório Aniversariantes - ${meses[Number(mesSelecionado) - 1]}`);

    const handleDownloadReport = (e) => {
        e.preventDefault();
        excel.exportToExcel(aniversariantes);
        setAbrirPopup(false);
    };

    return (
        <>
            {abrirPopup && (
                <Popup
                    title={`Exportar aniversariantes - ${meses[Number(mesSelecionado) - 1]}`}
                    message={`Deseja exportar os aniversariantes de ${meses[Number(mesSelecionado) - 1]}?`}
                    onConfirm={handleDownloadReport}
                    onCancel={() => setAbrirPopup(false)}
                />
            )}

            <select
                id="select-tabela-relatorios"
                style={{ marginLeft: "4%" }}
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(e.target.value)}
            >
                {meses.map((m, i) => (
                    <option key={i} value={String(i + 1)}>
                        {m}
                    </option>
                ))}
            </select>

            <button className="relatorio-button"
                id="relatorio-button-exportar" onClick={() => setAbrirPopup(true)}>
                Exportar para Excel
            </button>

            <table className="global-tabela">
                <thead>
                    <tr>
                        <th className="global-titulo-tabela">Cliente</th>
                        <th className="global-titulo-tabela">CPF/CNPJ</th>
                        <th className="global-titulo-tabela">Pessoa</th>
                        <th className="global-titulo-tabela">Cargo</th>
                        <th className="global-titulo-tabela">Data Nascimento</th>
                    </tr>
                </thead>
                <tbody>
                    {aniversariantes.map((row, i) => (
                        <tr key={i}>
                            <td className="global-conteudo-tabela">{row["Cliente"]}</td>
                            <td className="global-conteudo-tabela">{row["CPF/CNPJ"]}</td>
                            <td className="global-conteudo-tabela">{row["Pessoa"]}</td>
                            <td className="global-conteudo-tabela">{row["Cargo"]}</td>
                            <td className="global-conteudo-tabela">{row["Data Nascimento"]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
