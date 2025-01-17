import axios from 'axios';
import cookie from 'cookie';

class Api {
    // PRD
    //static baseUrl = "http://20.186.19.140/api";
    // DEV
    static baseUrl = "http://localhost:8080/api";
 

    constructor() {
        this.api = axios.create({
            baseURL: Api.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para adicionar o token de autenticação
        this.api.interceptors.request.use(
            (config) => {
                const cookies = document.cookie;
                const parsedCookies = cookie.parse(cookies);
                const token = parsedCookies['jwtToken'];

                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    async get(url) {
        try {
            const res = await this.api.get(url);
            return res.data;
        } catch (err) {
            throw err.response?.data?.message || "Erro ao fazer a requisição GET";
        }
    }

    async post(url, data) {
        try {
            const res = await this.api.post(url, data);
            return res.data;
        } catch (err) {
            throw err.response?.data?.message || "Erro ao fazer a requisição POST";
        }
    }

    async put(url, data) {
        try {
            const res = await this.api.put(url, data);
            return res.data;
        } catch (err) {
            throw err.response?.data?.message || "Erro ao fazer a requisição PUT";
        }
    }

    async delete(url) {
        try {
            const res = await this.api.delete(url);
            return res.data;
        } catch (err) {
            throw err.response?.data?.message || "Erro ao fazer a requisição DELETE";
        }
    }
}

export default Api;
