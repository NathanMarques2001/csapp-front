import { useCookies } from "react-cookie";
import Excel from "../utils/excel";

export default function RelatorioClientes({ clientes, contratos, usuarios, segmentos }) {
  const excel = new Excel("Relatório de Clientes");
  const [cookies, setCookie, removeCookie] = useCookies(['id', 'tipo']);

  if (cookies.tipo !== 'admin' && cookies.tipo !== 'dev') {
    clientes = clientes.filter(cliente => cliente.id_usuario === cookies.id);
  }

  const data = clientes.map(cliente => {
    // Filtrando os contratos do cliente
    const contratosCliente = contratos.filter(contrato => contrato.id_cliente === cliente.id && contrato.status === 'ativo');
    const calculaValorImpostoMensal = (valor, indice) => valor + ((valor * indice) / 100);

    // Somando o valor de todos os contratos do cliente
    const valorTotalContratos = contratosCliente.reduce((sum, contrato) => {
      const valorContrato = parseFloat(contrato.valor_mensal) * contrato.duracao;
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
  }

  return (
    <>
      <button onClick={e => handleDownloadReport(e)}>Exportar para Excel</button>
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
          {data.map(cliente => (
            <tr key={cliente.id}>
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
