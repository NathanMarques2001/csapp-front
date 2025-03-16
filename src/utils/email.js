import axios from 'axios';

class Email {
  // PRD
  static baseUrl = "https://csapp.prolinx.com.br/email";
  // DEV
  //static baseUrl = "http://localhost:9090/email";
  constructor() {
    this.api = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendEmail(data) {
    try {
      const res = await this.api.post(Email.baseUrl + '/send', data);
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || "Erro ao enviar email";
    }
  }
}

export default Email;