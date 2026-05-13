import axios from "axios";
import cookie from "cookie";
import { toast } from "react-toastify";

class Api {
  // Configuração via variável de ambiente (Padrão CRA)
  static baseUrl = "https://csapp.prolinx.com.br/api";
  // static baseUrl = "http://localhost:8080/api";

  constructor() {
    this.api = axios.create({
      baseURL: Api.baseUrl,
      // headers: {
      //   "Content-Type": "application/json",
      // },
    });

    // Interceptor para adicionar o token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const cookies = document.cookie;
        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies["jwtToken"];

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor global para tratamento de erros da API
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Se a API backend retornou a nossa mensagem formatada amigável (ex: erros 400 de validação)
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
          });
        }
        // Se o servidor estiver totalmente fora do ar
        else if (error.message === "Network Error") {
          toast.error("Servidor indisponível. Verifique sua conexão ou tente mais tarde.");
        }
        // Erro inesperado
        else {
          toast.error("Ocorreu um erro na requisição. Tente novamente.");
        }

        return Promise.reject(error);
      }
    );
  }

  async get(url) {
    const res = await this.api.get(url);
    return res.data;
  }

  async post(url, data) {
    const isFormData = data instanceof FormData;
    const res = await this.api.post(url, data, {
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
    return res.data;
  }

  async put(url, data) {
    const res = await this.api.put(url, data);
    return res.data;
  }

  async delete(url) {
    const res = await this.api.delete(url);
    return res.data;
  }
}

export default Api;
