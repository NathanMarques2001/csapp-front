import * as XLSX from "xlsx";

export default class Excel {
  constructor() {}

  exportToExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório de Contratos");

    XLSX.writeFile(workbook, "RelatorioContratos.xlsx");
  };
}