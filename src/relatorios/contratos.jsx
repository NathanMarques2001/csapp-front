import { useState } from "react";
import Popup from "../componetes/pop-up";
import DateJS from "../utils/date-js";
import Excel from "../utils/excel";

export default function RelatorioContratos({
  contratos,
  produtos,
  clientes,
  usuariosMap,
}) {
  const dateJs = new DateJS();
  const excel = new Excel("Relatório de Contratos");
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filtros, setFiltros] = useState({
    solucao: "",
    cliente: "",
    status: "",
    vendedor: "",
  });

  const produtosMap = produtos.reduce((map, p) => ((map[p.id] = p), map), {});
  const clientesMap = clientes.reduce((map, c) => ((map[c.id] = c), map), {});

  const contratosFiltrados = contratos.filter((contrato) => {
    const produto = produtosMap[contrato.id_produto];
    const cliente = clientesMap[contrato.id_cliente];
    const vendedor = usuariosMap[cliente?.id_usuario];

    return (
      (!filtros.solucao || produto?.nome === filtros.solucao) &&
      (!filtros.cliente || cliente?.nome_fantasia === filtros.cliente) &&
      (!filtros.status || contrato.status === filtros.status) &&
      (!filtros.vendedor || vendedor?.nome === filtros.vendedor)
    );
  });

  const data = contratosFiltrados.map((contrato) => {
    const cliente = clientesMap[contrato.id_cliente];
    const produto = produtosMap[contrato.id_produto];
    const vendedor = usuariosMap[cliente?.id_usuario];

    const valor = parseFloat(contrato.valor_mensal);
    const reajuste = contrato.indice_reajuste || 0;
    const valorFinal = valor + (valor * reajuste) / 100;

    return {
      Solução: produto?.nome || "Desconhecido",
      Cliente: cliente?.nome_fantasia || "Desconhecido",
      Status: contrato.status,
      Vendedor: vendedor?.nome || "Desconhecido",
      Reajuste: dateJs.formatDate(contrato.proximo_reajuste),
      Expiração: `${contrato.duracao} MESES`,
      Valor: valorFinal,
    };
  });

  const handleDownloadReport = (e) => {
    e.preventDefault();
    excel.exportToExcel(data);
    setAbrirPopup(false);
  };

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <>
      {abrirPopup && (
        <Popup
          title="Exportar Contratos"
          message="Tem certeza que deseja exportar o relatório de contratos?"
          onConfirm={handleDownloadReport}
          onCancel={() => setAbrirPopup(false)}
        />
      )}

      {openModal && (
        <div id="filter-container">
          <form onSubmit={(e) => e.preventDefault()} className="filter-form">
            <div className="form-group">
              <label>Solução:</label>
              <select
                name="solucao"
                value={filtros.solucao}
                onChange={handleFiltroChange}
              >
                <option value="">Selecione</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.nome}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cliente:</label>
              <select
                name="cliente"
                value={filtros.cliente}
                onChange={handleFiltroChange}
              >
                <option value="">Selecione</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.nome_fantasia}>
                    {c.nome_fantasia}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={filtros.status}
                onChange={handleFiltroChange}
              >
                <option value="">Selecione</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Vendedor:</label>
              <select
                name="vendedor"
                value={filtros.vendedor}
                onChange={handleFiltroChange}
              >
                <option value="">Selecione</option>
                {Object.values(usuariosMap).map((v) => (
                  <option key={v.id} value={v.nome}>
                    {v.nome}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="filter-button"
            >
              Fechar
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpenModal(true)}
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

      <table className="global-tabela">
        <thead>
          <tr>
            <th className="global-titulo-tabela">Solução</th>
            <th className="global-titulo-tabela">Cliente</th>
            <th className="global-titulo-tabela">Status</th>
            <th className="global-titulo-tabela">Vendedor</th>
            <th className="global-titulo-tabela">Reajuste</th>
            <th className="global-titulo-tabela">Expiração</th>
            <th className="global-titulo-tabela">Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={i}>
              <td className="global-conteudo-tabela">{c["Solução"]}</td>
              <td className="global-conteudo-tabela">{c["Cliente"]}</td>
              <td className="global-conteudo-tabela">{c["Status"]}</td>
              <td className="global-conteudo-tabela">{c["Vendedor"]}</td>
              <td className="global-conteudo-tabela">{c["Reajuste"]}</td>
              <td className="global-conteudo-tabela">{c["Expiração"]}</td>
              <td className="global-conteudo-tabela">
                {c["Valor"].toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
