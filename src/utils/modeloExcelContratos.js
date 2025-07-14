import * as XLSX from "xlsx";

export const baixarModelo = () => {
  const dados = [
    {
      cpf_cnpj: "",
      nome_produto: "",
      nome_faturado: "",
      faturado: "",
      dia_vencimento: "",
      indice_reajuste: "",
      nome_indice: "",
      proximo_reajuste: "",
      status: "",
      duracao: "",
      valor_mensal: "",
      quantidade: "",
      descricao: "",
      data_inicio: "",
      tipo_faturamento: "",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ModeloContratos");

  XLSX.writeFile(wb, "modelo_contratos.xlsx");
};
