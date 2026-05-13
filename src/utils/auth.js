import axios from "axios";
import { toast } from "react-toastify";

class Auth {
  // PRD
  static baseUrl = "https://csapp.prolinx.com.br/api";
  // DEV
  //static baseUrl = "http://localhost:8080/api";

  constructor() {
    this.auth = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.auth.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
          });
        } else if (error.message === "Network Error") {
          toast.error("Servidor indisponível. Verifique sua conexão ou tente mais tarde.");
        } else {
          toast.error("Ocorreu um erro na requisição. Tente novamente.");
        }
        return Promise.reject(error);
      }
    );
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
}

export default Auth;
