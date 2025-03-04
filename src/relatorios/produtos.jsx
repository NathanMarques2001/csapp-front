import { useCookies } from "react-cookie";
import Excel from "../utils/excel";
import { useState } from "react";
import Popup from "../componetes/pop-up";

export default function RelatorioProdutos({ produtos, fabricantes }) {
  const excel = new Excel("Relatório de Produtos");
  const [cookies] = useCookies(['id', 'tipo']);
  const [filtros, setFiltros] = useState({
    nome: '',
    fabricante: '',
    status: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);

  const fabricantesMap = fabricantes.reduce((map, fabricante) => {
    map[fabricante.id] = fabricante;
    return map;
  }, {});

  const produtosFiltrados = produtos.filter(produto =>
    (!filtros.nome || produto.nome.includes(filtros.nome)) &&
    (!filtros.fabricante || fabricantesMap[produto.id_fabricante]?.nome === filtros.fabricante) &&
    (!filtros.status || produto.status === filtros.status)
  );

  const data = produtosFiltrados.map(produto => {
    return {
      "Nome": produto.nome,
      "Fabricante": fabricantesMap[produto.id_fabricante]?.nome,
      "Status": produto.status,
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
          title="Exportar Produtos"
          message="Tem certeza que deseja exportar o relatório de produtos?"
          onConfirm={e => handleDownloadReport(e)}
          onCancel={() => setAbrirPopup(false)}
        />
      )}
      {openModal && (
        <div id="filter-container">
          <form onSubmit={e => e.preventDefault()} className="filter-form">
            <div className="form-group">
              <label>Produto:</label>
              <select name="nome" value={filtros.nome} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {produtos.map(produto => (
                  <option key={produto.id} value={produto.nome}>{produto.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Fabricante:</label>
              <select name="fabricante" value={filtros.fabricante} onChange={handleFiltroChange}>
                <option value="">Selecione</option>
                {Object.values(fabricantesMap).map(fabricante => (
                  <option key={fabricante.id} value={fabricante.nome}>{fabricante.nome}</option>
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
            <th className="global-titulo-tabela">Fabricante</th>
            <th className="global-titulo-tabela">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cliente, index) => (
            <tr key={index}>
              <td className="global-conteudo-tabela">{cliente["Nome"]}</td>
              <td className="global-conteudo-tabela">{cliente["Fabricante"]}</td>
              <td className="global-conteudo-tabela">{cliente["Status"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
