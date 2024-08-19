import * as XLSX from "xlsx";

export default class Excel {
  constructor(nomeRelatorio) {
    this.nomeRelatorio = nomeRelatorio;
  }

  exportToExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.nomeRelatorio);

    XLSX.writeFile(workbook, `${this.nomeRelatorio}.xlsx`);
  };
}