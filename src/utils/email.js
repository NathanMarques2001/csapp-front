import axios from 'axios';

class Email {
  // PRD
  //static baseUrl = "http://20.186.19.140/email";
  // DEV
  static baseUrl = "http://localhost:9090/email";
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