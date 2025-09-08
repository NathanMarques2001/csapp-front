import Excel from "../utils/excel";
import { useState } from "react";
import Popup from "../componetes/pop-up";

export default function RelatorioClientes({
  clientes,
  contratos,
  usuariosMap,
  segmentosMap,
  gruposEconomicosMap,
  classificacoesClientesMap,
}) {
  const excel = new Excel("Relatório de Clientes");
  const [filtros, setFiltros] = useState({
    nome_fantasia: "",
    tipo: "",
    status: "",
    vendedor: "",
    segmento: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      (!filtros.nome_fantasia ||
        cliente.nome_fantasia.includes(filtros.nome_fantasia)) &&
      (!filtros.tipo || cliente.tipo === filtros.tipo) &&
      (!filtros.status || cliente.status === filtros.status) &&
      (!filtros.vendedor ||
        usuariosMap[cliente.id_usuario]?.nome === filtros.vendedor) &&
      (!filtros.segmento ||
        segmentosMap[cliente.id_segmento]?.nome === filtros.segmento)
  );

  const data = clientesFiltrados.map((cliente) => {
    const contratosCliente = contratos.filter(
      (contrato) =>
        contrato.id_cliente === cliente.id && contrato.status === "ativo"
    );

    const valorTotalContratos = contratosCliente.reduce((sum, contrato) => {
      const valor = parseFloat(contrato.valor_mensal);
      const indice = contrato.indice_reajuste || 0;
      return sum + valor + (valor * indice) / 100;
    }, 0);

    return {
      "Nome Fantasia": cliente.nome_fantasia,
      "CPF/CNPJ": cliente.cpf_cnpj,
      Tipo:
        classificacoesClientesMap[
          gruposEconomicosMap[cliente.id_grupo_economico]
            ?.id_classificacao_cliente
        ]?.nome ||
        classificacoesClientesMap[cliente.id_classificacao_cliente]?.nome ||
        "Desconhecido",
      Status: cliente.status,
      "Usuário Responsável": usuariosMap[cliente.id_usuario]?.nome || "Desconhecido",
      Segmento: segmentosMap[cliente.id_segmento]?.nome || "Desconhecido",
      "Valor Total dos Contratos": valorTotalContratos,
      "Pertence Grupo Econômico": cliente.id_grupo_economico && gruposEconomicosMap[cliente.id_grupo_economico] ? "sim" : "não"
    };
  });


  console.log(gruposEconomicosMap);
  console.log(classificacoesClientesMap);
  console.log(clientes);

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
          title="Exportar Clientes"
          message="Tem certeza que deseja exportar o relatório de clientes?"
          onConfirm={handleDownloadReport}
          onCancel={() => setAbrirPopup(false)}
        />
      )}

      {openModal && (
        <div id="filter-container">
          <form onSubmit={(e) => e.preventDefault()} className="filter-form">
            <div className="form-group">
              <label>Razão Social:</label>
              <select
                name="nome_fantasia"
                value={filtros.nome_fantasia}
                onChange={handleFiltroChange}
              >
                <option value="">Selecione</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.nome_fantasia}>
                    {cliente.nome_fantasia}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tipo:</label>
              <select
                name="tipo"
                value={filtros.tipo}
                onChange={handleFiltroChange}
              >
                <option value="">Selecione</option>
                <option value="top 30">TOP 30</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
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
                {Object.values(usuariosMap).map((usuario) => (
                  <option key={usuario.id} value={usuario.nome}>
                    {usuario.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Segmento:</label>
              <select
                name="segmento"
                value={filtros.segmento}
                onChange={handleFiltroChange}
              >
                <option value="">Selecione</option>
                {Object.values(segmentosMap).map((segmento) => (
                  <option key={segmento.id} value={segmento.nome}>
                    {segmento.nome}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setOpenModal(false)}
              id="filter-close-button"
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
            <th className="global-titulo-tabela">Nome</th>
            <th className="global-titulo-tabela">CPF/CNPJ</th>
            <th className="global-titulo-tabela">Tipo</th>
            <th className="global-titulo-tabela">Status</th>
            <th className="global-titulo-tabela">Vendedor</th>
            <th className="global-titulo-tabela">Segmento</th>
            <th className="global-titulo-tabela">Valor dos Contratos</th>
            <th className="global-titulo-tabela">Pertence Grupo Econômico</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cliente, index) => (
            <tr key={index}>
              <td className="global-conteudo-tabela">
                {cliente["Nome Fantasia"]}
              </td>
              <td className="global-conteudo-tabela">{cliente["CPF/CNPJ"]}</td>
              <td className="global-conteudo-tabela">{cliente["Tipo"]}</td>
              <td className="global-conteudo-tabela">{cliente["Status"]}</td>
              <td className="global-conteudo-tabela">
                {cliente["Usuário Responsável"]}
              </td>
              <td className="global-conteudo-tabela">{cliente["Segmento"]}</td>
              <td className="global-conteudo-tabela">
                {cliente["Valor Total dos Contratos"].toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td className="global-conteudo-tabela">
                {cliente["Pertence Grupo Econômico"]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
