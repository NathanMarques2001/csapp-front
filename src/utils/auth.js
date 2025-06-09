import axios from 'axios';

class Auth {
    // PRD
    //static baseUrl = "https://csapp.prolinx.com.br/api";
    // DEV
    static baseUrl = "http://localhost:8080/api";

  constructor() {
    this.auth = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async login(url, data) {
    try {
      const res = await this.auth.post(Auth.baseUrl + url, data);
      return res.data;
    } catch (err) {
      console.error("Axios POST error:", err);
      throw err;
    }
  }

    async loginWithMicrosoft(microsoftToken) {
    // A URL para o endpoint do seu backend que criamos
    const url = "/usuarios/login-microsoft"; 
    // O corpo da requisição que seu backend espera
    const data = { microsoftToken }; 
    
    // Reutiliza o método de post que você já criou!
    return this.login(url, data);
  }
}

export default Auth;
