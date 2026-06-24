import { useState, useMemo } from "react";
import Excel from "../utils/excel";
import Popup from "../componentes/pop-up";

export default function RelatorioNotificacoes({ notificacoes = [], usuariosMap = {}, contratos = [], clientes = [], produtos = [] }) {
  const excel = new Excel("Relatório de Notificações");
  const [filtros, setFiltros] = useState({ usuario: "", modulo: "", confirmado: "", cliente: "", solucao: "", indiceReajuste: "", renovacaoAutomatica: "" });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);

  const modulos = useMemo(() => {
    const s = new Set();
    (notificacoes || []).forEach((n) => n.modulo && s.add(n.modulo));
    return Array.from(s);
  }, [notificacoes]);

  const indicesReajuste = useMemo(() => {
    const s = new Set();
    (contratos || []).forEach((c) => c.nome_indice && s.add(c.nome_indice.toUpperCase()));
    return Array.from(s);
  }, [contratos]);

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

  const usuariosList = useMemo(() => Object.values(usuariosMap || {}), [usuariosMap]);
  const clientesList = useMemo(() => Object.values(clientesMap || {}), [clientesMap]);
  const produtosList = useMemo(() => Object.values(produtosMap || {}), [produtosMap]);

  const notificacoesFiltradas = notificacoes.filter((n) => {
    const nomeUsuario = usuariosMap[n.id_usuario]?.nome;
    const confirmadoStr = n.confirmado_sn ? "sim" : "não";
    const contrato = contratosMap[n.id_contrato];
    const cliente = contrato ? clientesMap[contrato.id_cliente] : null;
    const produto = contrato ? produtosMap[contrato.id_produto] : null;

    const indiceReajusteVal = contrato?.nome_indice ? contrato.nome_indice.toUpperCase() : "";
    const renovacaoAutomaticaVal = contrato ? (contrato.renovacao_automatica ? "sim" : "não") : "não";

    return (
      (!filtros.usuario || nomeUsuario === filtros.usuario) &&
      (!filtros.modulo || n.modulo === filtros.modulo) &&
      (!filtros.confirmado || confirmadoStr === filtros.confirmado) &&
      (!filtros.cliente || (cliente && cliente.razao_social === filtros.cliente)) &&
      (!filtros.solucao || (produto && produto.nome === filtros.solucao)) &&
      (!filtros.indiceReajuste || indiceReajusteVal === filtros.indiceReajuste) &&
      (!filtros.renovacaoAutomatica || renovacaoAutomaticaVal === filtros.renovacaoAutomatica)
    );
  });

  const dadosExportacao = notificacoesFiltradas.map((n) => {
    const contrato = contratosMap[n.id_contrato];
    const cliente = contrato ? clientesMap[contrato.id_cliente] : null;
    const produto = contrato ? produtosMap[contrato.id_produto] : null;

    return {
      Vendedor: usuariosMap[n.id_usuario]?.nome || "Desconhecido",
      Cliente: cliente ? cliente.razao_social : "Desconhecido",
      Solucao: produto ? produto.nome : "Desconhecido",
      Descricao: n.descricao || "",
      Modulo: n.modulo || "",
      Confirmado: n.confirmado_sn ? "Sim" : "Não",
      "Índice de Reajuste": contrato ? (contrato.nome_indice ? contrato.nome_indice.toUpperCase() : "N/A") : "N/A",
      "Renovação Automática": contrato ? (contrato.renovacao_automatica ? "Sim" : "Não") : "Não",
      "ID Contrato": n.id_contrato || "",
    };
  });

  function baixarRelatorio(e) {
    e.preventDefault();
    excel.exportToExcel(dadosExportacao);
    setAbrirPopup(false);
  }

  function aoMudarFiltro(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  return (
    <>
      {abrirPopup && (
        <Popup
          title="Exportar Notificações"
          message="Tem certeza que deseja exportar o relatório de notificações?"
          onConfirm={baixarRelatorio}
          onCancel={() => setAbrirPopup(false)}
        />
      )}

      {mostrarFiltros && (
        <div id="filter-container">
          <form onSubmit={(e) => e.preventDefault()} className="filter-form">
            <div className="form-group">
              <label>Vendedor:</label>
              <select name="usuario" value={filtros.usuario} onChange={aoMudarFiltro}>
                <option value="">Selecione</option>
                {Object.values(usuariosMap).map((u) => (
                  <option key={u.id} value={u.nome}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Módulo:</label>
              <select name="modulo" value={filtros.modulo} onChange={aoMudarFiltro}>
                <option value="">Selecione</option>
                {modulos.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cliente:</label>
              <select name="cliente" value={filtros.cliente} onChange={aoMudarFiltro}>
                <option value="">Selecione</option>
                {clientesList.map((c) => (
                  <option key={c.id} value={c.razao_social}>
                    {c.razao_social}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Solução:</label>
              <select name="solucao" value={filtros.solucao} onChange={aoMudarFiltro}>
                <option value="">Selecione</option>
                {produtosList.map((p) => (
                  <option key={p.id} value={p.nome}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Confirmado:</label>
              <select name="confirmado" value={filtros.confirmado} onChange={aoMudarFiltro}>
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="não">Não</option>
              </select>
            </div>

            <div className="form-group">
              <label>Índice de Reajuste:</label>
              <select name="indiceReajuste" value={filtros.indiceReajuste} onChange={aoMudarFiltro}>
                <option value="">Selecione</option>
                {indicesReajuste.map((idx) => (
                  <option key={idx} value={idx}>
                    {idx}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Renovação Automática:</label>
              <select name="renovacaoAutomatica" value={filtros.renovacaoAutomatica} onChange={aoMudarFiltro}>
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="não">Não</option>
              </select>
            </div>

            <button type="button" onClick={() => setMostrarFiltros(false)} id="filter-close-button" className="filter-button">
              Fechar
            </button>
          </form>
        </div>
      )}

      <button onClick={() => setMostrarFiltros(true)} className="relatorio-button" id="relatorio-button-filtrar">
        Filtrar
      </button>
      <button onClick={() => setAbrirPopup(true)} className="relatorio-button" id="relatorio-button-exportar">
        Exportar para Excel
      </button>

      <table className="global-tabela">
        <thead>
          <tr>
            <th className="global-titulo-tabela">Vendedor</th>
            <th className="global-titulo-tabela">Cliente</th>
            <th className="global-titulo-tabela">Solução</th>
            <th className="global-titulo-tabela">Descrição</th>
            <th className="global-titulo-tabela">Módulo</th>
            <th className="global-titulo-tabela">Confirmado</th>
            <th className="global-titulo-tabela">Índice de Reajuste</th>
            <th className="global-titulo-tabela">Renovação Automática</th>
            <th className="global-titulo-tabela">ID Contrato</th>
          </tr>
        </thead>
        <tbody>
          {dadosExportacao.map((row, i) => (
            <tr key={i}>
              <td className="global-conteudo-tabela">{row["Vendedor"]}</td>
              <td className="global-conteudo-tabela">{row["Cliente"]}</td>
              <td className="global-conteudo-tabela">{row["Solucao"]}</td>
              <td className="global-conteudo-tabela">{row["Descricao"]}</td>
              <td className="global-conteudo-tabela">{row["Modulo"]}</td>
              <td className="global-conteudo-tabela">{row["Confirmado"]}</td>
              <td className="global-conteudo-tabela">{row["Índice de Reajuste"]}</td>
              <td className="global-conteudo-tabela">{row["Renovação Automática"]}</td>
              <td className="global-conteudo-tabela">{row["ID Contrato"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
