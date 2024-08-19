import DateJS from "../utils/date-js";
import Excel from "../utils/excel";

export default function RelatorioContratos({ contratos, produtos, clientes, usuarios }) {
  const dateJs = new DateJS();
  const excel = new Excel("Relatório de Contratos");

  const data = contratos.map(contrato => {
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
    excel.exportToExcel(data)
  }

  return (
    <>
      <button onClick={e => handleDownloadReport(e)}>Exportar para Excel</button>
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
          {data.map(contrato => (
            <tr key={contrato.id}>
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
