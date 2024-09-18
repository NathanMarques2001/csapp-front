import { useCookies } from "react-cookie";
import Excel from "../utils/excel";
import { useState } from "react";
import Popup from "../componetes/pop-up";

export default function RelatorioClientes({ clientes, contratos, usuarios, segmentos }) {
  const excel = new Excel("Relatório de Clientes");
  const [cookies] = useCookies(['id', 'tipo']);
  const [filtros, setFiltros] = useState({
    nome_fantasia: '',
    tipo: '',
    status: '',
    vendedor: '',
    segmento: ''
  });
  const [openModal, setOpenModal] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);

  if (cookies.tipo !== 'admin' && cookies.tipo !== 'dev') {
    clientes = clientes.filter(cliente => cliente.id_usuario === cookies.id);
  }

  const clientesFiltrados = clientes.filter(cliente =>
    (!filtros.nome_fantasia || cliente.nome_fantasia.includes(filtros.nome_fantasia)) &&
    (!filtros.tipo || cliente.tipo === filtros.tipo) &&
    (!filtros.status || cliente.status === filtros.status) &&
    (!filtros.vendedor || usuarios[cliente.id_usuario - 1]?.nome === filtros.vendedor) &&
    (!filtros.segmento || segmentos[cliente.id_segmento - 1]?.nome === filtros.segmento)
  );

  const data = clientesFiltrados.map(cliente => {
    const contratosCliente = contratos.filter(contrato => contrato.id_cliente === cliente.id && contrato.status === 'ativo');
    const calculaValorImpostoMensal = (valor, indice) => valor + ((valor * indice) / 100);

    const valorTotalContratos = contratosCliente.reduce((sum, contrato) => {
      const valorContrato = parseFloat(contrato.valor_mensal);
      const valorComImposto = calculaValorImpostoMensal(valorContrato, contrato.indice_reajuste);
      return sum + valorComImposto;
    }, 0);

    return {
      "Nome Fantasia": cliente.nome_fantasia,
      "CPF/CNPJ": cliente.cpf_cnpj,
      "Tipo": cliente.tipo.toUpperCase(),
      "Status": cliente.status,
      "Usuário Responsável": usuarios[cliente.id_usuario - 1]?.nome,
      "Segmento": segmentos[cliente.id_segmento - 1]?.nome,
      "Valor Total dos Contratos": valorTotalContratos
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
      {abrirPopup && (
        <Popup
          title="Exportar Clientes"
          message="Tem certeza que deseja exportar o relatório de clientes?"
          onConfirm={e => handleDownloadReport(e)}
          onCancel={() => setAbrirPopup(false)}
        />
      )}
      {openModal && (
        <div id="filter-container">
          <form onSubmit={e => e.preventDefault()} className="filter-form">
            <div className="form-group">
              <label>Razão Social:</label>
              <select name="nome_fantasia" value={filtros.nome_fantasia} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.nome_fantasia}>{cliente.nome_fantasia}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tipo:</label>
              <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                <option value="top 30">TOP 30</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
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
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.nome}>{usuario.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Segmento:</label>
              <select name="segmento" value={filtros.segmento} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {segmentos.map(segmento => (
                  <option key={segmento.id} value={segmento.nome}>{segmento.nome}</option>
                ))}
              </select>
            </div>

            <button type="button" onClick={() => setOpenModal(false)} id="filter-close-button" className="filter-button">Fechar</button>
          </form>
        </div>
      )}
      <button onClick={() => setOpenModal(true)} className="relatorio-button" id="relatorio-button-filtrar">Filtrar</button>
      <button onClick={() => setAbrirPopup(true)} className="relatorio-button" id="relatorio-button-exportar">Exportar para Excel</button>
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
          </tr>
        </thead>
        <tbody>
          {data.map((cliente, index) => (
            <tr key={index}>
              <td className="global-conteudo-tabela">{cliente["Nome Fantasia"]}</td>
              <td className="global-conteudo-tabela">{cliente["CPF/CNPJ"]}</td>
              <td className="global-conteudo-tabela">{cliente["Tipo"]}</td>
              <td className="global-conteudo-tabela">{cliente["Status"]}</td>
              <td className="global-conteudo-tabela">{cliente["Usuário Responsável"]}</td>
              <td className="global-conteudo-tabela">{cliente["Segmento"]}</td>
              <td className="global-conteudo-tabela">{cliente["Valor Total dos Contratos"].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
