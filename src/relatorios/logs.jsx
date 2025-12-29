import { useState, useMemo } from "react";
import Excel from "../utils/excel";
import Popup from "../componetes/pop-up";

export default function RelatorioLogs({ logs = [], contratos = [], clientes = [], produtos = [] }) {
  const excel = new Excel("Relatório de Logs");
  const [filtros, setFiltros] = useState({ usuario: "", cliente: "", statusCliente: "", solucao: "" });
  const [openModal, setOpenModal] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);

  const contratosMap = useMemo(() => {
    const m = {};
    (contratos || []).forEach((c) => (m[c.id] = c));
    return m;
  }, [contratos]);

  const clientesMap = useMemo(() => {
    const m = {};
    (clientes || []).forEach((c) => (m[c.id] = c));
    return m;
  }, [clientes]);

  const produtosMap = useMemo(() => {
    const m = {};
    (produtos || []).forEach((p) => (m[p.id] = p));
    return m;
  }, [produtos]);

  const clientesNomes = useMemo(() => {
    const s = new Set();
    (logs || []).forEach((l) => {
      const contrato = contratosMap[l.id_contrato];
      const cliente = contrato ? clientesMap[contrato.id_cliente] : null;
      if (cliente && cliente.nome_fantasia) s.add(cliente.nome_fantasia);
    });
    return Array.from(s);
  }, [logs, contratosMap, clientesMap]);

  const produtosList = useMemo(() => {
    const s = new Set();
    (logs || []).forEach((l) => {
      const contrato = contratosMap[l.id_contrato];
      const produto = contrato ? produtosMap[contrato.id_produto] : null;
      if (produto && produto.nome) s.add(produto.nome);
    });
    // also include all products passed in
    Object.values(produtosMap).forEach((p) => p && p.nome && s.add(p.nome));
    return Array.from(s);
  }, [logs, contratosMap, produtosMap]);

  const statusList = useMemo(() => {
    const s = new Set();
    Object.values(clientesMap).forEach((c) => { if (c && c.status) s.add(c.status); });
    return Array.from(s);
  }, [clientesMap]);

  const logsFiltrados = (logs || []).filter((l) => {
    const usuario = (l.nome_usuario || "").toString();
    const contrato = contratosMap[l.id_contrato];
    const cliente = contrato ? clientesMap[contrato.id_cliente] : null;
    const clienteNome = cliente ? cliente.nome_fantasia : "";
    const produto = contrato ? produtosMap[contrato.id_produto] : null;

    return (
      (!filtros.usuario || usuario === filtros.usuario) &&
      (!filtros.cliente || clienteNome === filtros.cliente) &&
      (!filtros.statusCliente || (cliente && cliente.status === filtros.statusCliente)) &&
      (!filtros.solucao || (produto && produto.nome === filtros.solucao))
    );
  });

  // Expand logs: one row per alteração
  const data = [];
  logsFiltrados.forEach((l) => {
    const contrato = contratosMap[l.id_contrato];
    const cliente = contrato ? clientesMap[contrato.id_cliente] : null;
    const produto = contrato ? produtosMap[contrato.id_produto] : null;

    const alteracaoLines = (l.alteracao || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    if (alteracaoLines.length === 0) {
      data.push({
        Usuario: l.nome_usuario || "Sistema",
        Cliente: cliente ? cliente.nome_fantasia : "Desconhecido",
        StatusCliente: cliente ? cliente.status || "" : "",
        Solucao: produto ? produto.nome : "Desconhecido",
        Alteracao: "",
        Data: l.createdAt ? new Date(l.createdAt).toLocaleString() : "",
      });
    } else {
      alteracaoLines.forEach((line) => {
        data.push({
          Usuario: l.nome_usuario || "Sistema",
          Cliente: cliente ? cliente.nome_fantasia : "Desconhecido",
          StatusCliente: cliente ? cliente.status || "" : "",
          Solucao: produto ? produto.nome : "Desconhecido",
          Alteracao: line,
          Data: l.createdAt ? new Date(l.createdAt).toLocaleString() : "",
        });
      });
    }
  });

  function handleDownloadReport(e) {
    e.preventDefault();
    excel.exportToExcel(data);
    setAbrirPopup(false);
  }

  function handleFiltroChange(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  return (
    <>
      {abrirPopup && (
        <Popup
          title="Exportar Logs"
          message="Tem certeza que deseja exportar o relatório de logs?"
          onConfirm={handleDownloadReport}
          onCancel={() => setAbrirPopup(false)}
        />
      )}

      {openModal && (
        <div id="filter-container">
          <form onSubmit={(e) => e.preventDefault()} className="filter-form">
            <div className="form-group">
              <label>Usuário:</label>
              <select name="usuario" value={filtros.usuario} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {Array.from(new Set(logs.map((l) => l.nome_usuario))).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cliente:</label>
              <select name="cliente" value={filtros.cliente} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {clientesNomes.map((cn) => (
                  <option key={cn} value={cn}>
                    {cn}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status Cliente:</label>
              <select name="statusCliente" value={filtros.statusCliente} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {statusList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Solução:</label>
              <select name="solucao" value={filtros.solucao} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {produtosList.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <button type="button" onClick={() => setOpenModal(false)} id="filter-close-button" className="filter-button">
              Fechar
            </button>
          </form>
        </div>
      )}

      <button onClick={() => setOpenModal(true)} className="relatorio-button" id="relatorio-button-filtrar">
        Filtrar
      </button>
      <button onClick={() => setAbrirPopup(true)} className="relatorio-button" id="relatorio-button-exportar">
        Exportar para Excel
      </button>

      <table className="global-tabela">
        <thead>
          <tr>
            <th className="global-titulo-tabela">Usuário</th>
            <th className="global-titulo-tabela">Cliente</th>
            <th className="global-titulo-tabela">Status Cliente</th>
            <th className="global-titulo-tabela">Solução</th>
            <th className="global-titulo-tabela">Alteração</th>
            <th className="global-titulo-tabela">Data</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="global-conteudo-tabela">{row.Usuario}</td>
              <td className="global-conteudo-tabela">{row.Cliente}</td>
              <td className="global-conteudo-tabela">{row.StatusCliente}</td>
              <td className="global-conteudo-tabela">{row.Solucao}</td>
              <td className="global-conteudo-tabela">
                {String(row.Alteracao)
                  .split('\n')
                  .map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
              </td>
              <td className="global-conteudo-tabela">{row.Data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
