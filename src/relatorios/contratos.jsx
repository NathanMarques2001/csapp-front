import { useState } from "react";
import Popup from "../componetes/pop-up";
import DateJS from "../utils/date-js";
import Excel from "../utils/excel";

export default function RelatorioContratos({ contratos, produtos, clientes, usuarios }) {
  const dateJs = new DateJS();
  const excel = new Excel("Relatório de Contratos");
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filtros, setFiltros] = useState({
    solucao: '',
    cliente: '',
    status: '',
    vendedor: '',
  });

  const contratosFiltrados = contratos.filter(contrato =>
    (!filtros.solucao || produtos[contrato.id_produto - 1]?.nome === filtros.solucao) &&
    (!filtros.cliente || clientes[contrato.id_cliente - 1]?.nome_fantasia === filtros.cliente) &&
    (!filtros.status || contrato.status === filtros.status) &&
    (!filtros.vendedor || usuarios[clientes[contrato.id_cliente - 1]?.id_usuario - 1]?.nome === filtros.vendedor)
  );

  const data = contratosFiltrados.map(contrato => {
    const calculaValorImpostoMensal = (valor, indice) => valor + ((valor * indice) / 100);

    return {
      "Solução": produtos[contrato.id_produto - 1]?.nome,
      "Cliente": clientes[contrato.id_cliente - 1]?.nome_fantasia,
      "Status": contrato.status,
      "Vendedor": usuarios[clientes[contrato.id_cliente - 1]?.id_usuario - 1]?.nome,
      "Reajuste": dateJs.formatDate(contrato.proximo_reajuste),
      "Expiração": `${contrato.duracao} MESES`,
      "Valor": calculaValorImpostoMensal(parseFloat(contrato.valor_mensal * contrato.duracao), contrato.indice_reajuste),
    };
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
      {abrirPopup && (<Popup title="Exportar Contratos" message="Tem certeza que deseja exportar o relatório de contratos?" onConfirm={e => handleDownloadReport(e)} onCancel={e => setAbrirPopup(false)} />)}

      {openModal &&
        <div id='filter-container'>
          <form onSubmit={e => e.preventDefault()} className="filter-form">
            <div className="form-group">
              <label>Solução:</label>
              <select name="solucao" value={filtros.solucao} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {Object.values(produtos).map(produto => (
                  <option key={produto.id} value={produto.nome}>{produto.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cliente:</label>
              <select name="cliente" value={filtros.cliente} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {Object.values(clientes).map(cliente => (
                  <option key={cliente.id} value={cliente.nome_fantasia}>{cliente.nome_fantasia}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status:</label>
              <select name="status" value={filtros.status} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Vendedor:</label>
              <select name="vendedor" value={filtros.vendedor} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {Object.values(usuarios).map(usuario => (
                  <option key={usuario.id} value={usuario.nome}>{usuario.nome}</option>
                ))}
              </select>
            </div>

            <button type="button" onClick={() => setOpenModal(false)} id='filter-close-button' className="filter-button">Fechar</button>
          </form>
        </div>
      }

      <button onClick={e => setOpenModal(true)}>Filtrar</button>
      <button onClick={e => setAbrirPopup(true)}>Exportar para Excel</button>

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
          {data.map((contrato, index) => (
            <tr key={index}>
              <td className="global-conteudo-tabela">{contrato["Solução"]}</td>
              <td className="global-conteudo-tabela">{contrato["Cliente"]}</td>
              <td className="global-conteudo-tabela">{contrato["Status"]}</td>
              <td className="global-conteudo-tabela">{contrato["Vendedor"]}</td>
              <td className="global-conteudo-tabela">{contrato["Reajuste"]}</td>
              <td className="global-conteudo-tabela">{contrato["Expiração"]}</td>
              <td className="global-conteudo-tabela">{contrato["Valor"].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
