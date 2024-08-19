class DateJS {
  constructor() {
    this.options = {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    this.location = "pt-BR";
  }

  formatDate(date) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString(this.location, this.options);
  }

}

export default DateJS;