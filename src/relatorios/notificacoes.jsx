import { useState, useMemo } from "react";
import Excel from "../utils/excel";
import Popup from "../componetes/pop-up";

export default function RelatorioNotificacoes({ notificacoes = [], usuariosMap = {} }) {
  const excel = new Excel("Relatório de Notificações");
  const [filtros, setFiltros] = useState({ usuario: "", modulo: "", confirmado: "" });
  const [openModal, setOpenModal] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);

  const modulos = useMemo(() => {
    const s = new Set();
    (notificacoes || []).forEach((n) => n.modulo && s.add(n.modulo));
    return Array.from(s);
  }, [notificacoes]);

  const notificacoesFiltradas = notificacoes.filter((n) => {
    const nomeUsuario = usuariosMap[n.id_usuario]?.nome;
    const confirmadoStr = n.confirmado_sn ? "sim" : "não";

    return (
      (!filtros.usuario || nomeUsuario === filtros.usuario) &&
      (!filtros.modulo || n.modulo === filtros.modulo) &&
      (!filtros.confirmado || confirmadoStr === filtros.confirmado)
    );
  });

  const data = notificacoesFiltradas.map((n) => ({
    Usuario: usuariosMap[n.id_usuario]?.nome || "Desconhecido",
    Descricao: n.descricao || "",
    Modulo: n.modulo || "",
    Confirmado: n.confirmado_sn ? "Sim" : "Não",
    "ID Contrato": n.id_contrato || "",
  }));

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
          title="Exportar Notificações"
          message="Tem certeza que deseja exportar o relatório de notificações?"
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
                {Object.values(usuariosMap).map((u) => (
                  <option key={u.id} value={u.nome}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Módulo:</label>
              <select name="modulo" value={filtros.modulo} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {modulos.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Confirmado:</label>
              <select name="confirmado" value={filtros.confirmado} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="não">Não</option>
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
            <th className="global-titulo-tabela">Descrição</th>
            <th className="global-titulo-tabela">Módulo</th>
            <th className="global-titulo-tabela">Confirmado</th>
            <th className="global-titulo-tabela">ID Contrato</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="global-conteudo-tabela">{row["Usuario"]}</td>
              <td className="global-conteudo-tabela">{row["Descricao"]}</td>
              <td className="global-conteudo-tabela">{row["Modulo"]}</td>
              <td className="global-conteudo-tabela">{row["Confirmado"]}</td>
              <td className="global-conteudo-tabela">{row["ID Contrato"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
