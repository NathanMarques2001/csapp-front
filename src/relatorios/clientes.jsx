import Excel from "../utils/excel";

export default function RelatorioClientes({ clientes, contratos, usuarios, segmentos }) {
  const excel = new Excel();

  const data = clientes.map(cliente => {
    // Filtrando os contratos do cliente
    const contratosCliente = contratos.filter(contrato => contrato.id_cliente === cliente.id);

    // Somando o valor de todos os contratos do cliente
    const valorTotalContratos = contratosCliente.reduce((total, contrato) => total + contrato.valor_mensal, 0);

    return {
      "Nome Fantasia": cliente.nome_fantasia,
      "CPF/CNPJ": cliente.cpf_cnpj,
      "Tipo": cliente.tipo,
      "Status": cliente.status,
      "Usuário Responsável": usuarios[cliente.id_usuario]?.nome,
      "Segmento": segmentos[cliente.id_segmento]?.nome,
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
            <th className="global-titulo-tabela">Nome Fantasia</th>
            <th className="global-titulo-tabela">CPF/CNPJ</th>
            <th className="global-titulo-tabela">Tipo</th>
            <th className="global-titulo-tabela">Status</th>
            <th className="global-titulo-tabela">Usuário Responsável</th>
            <th className="global-titulo-tabela">Segmento</th>
            <th className="global-titulo-tabela">Valor Total dos Contratos</th>
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
              <td className="global-conteudo-tabela">{cliente["Valor Total dos Contratos"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
