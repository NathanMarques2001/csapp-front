import axios from 'axios';

class Email {
  // PRD
  //static baseUrl = "https://csapp.prolinx.com.br/email/email";
  // DEV
  static baseUrl = "http://localhost:9090/email";

  constructor() {
    this.api = axios.create({
      baseURL: Email.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        // Adicione cabeçalhos de segurança (se necessário)
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains', // HSTS
        'X-Content-Type-Options': 'nosniff', // Evita tipo de conteúdo não esperado
        'X-Frame-Options': 'DENY', // Previne ataques de clickjacking
        'X-XSS-Protection': '1; mode=block', // Protege contra XSS
        // 'Authorization': `Bearer ${your_token_here}`, // Se necessário para autenticação via token
      },
    });
  }

  // Função para envio de e-mail
  async sendEmail(data) {
    try {
      // Verifique se os dados necessários estão presentes
      if (!data.to || !data.subject || !data.text || !data.html) {
        throw new Error('Dados incompletos para envio de e-mail');
      }

      // Enviar o e-mail
      const res = await this.api.post('/send', data);

      // Verifique se a resposta é bem-sucedida
      if (res.status !== 200) {
        throw new Error(`Falha no envio do e-mail: ${res.status}`);
      }

      return res.data;
    } catch (err) {
      // Erro ao enviar e-mail
      console.error('Erro ao enviar e-mail:', err.response ? err.response.data : err.message);
      throw err.response ? err.response.data : "Erro ao enviar e-mail";
    }
  }
}

export default Email;
