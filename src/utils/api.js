import axios from 'axios';
import cookie from 'cookie';

class Api {
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
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async get(url) {
        try {
            const res = await this.api.get(url);
            return res.data;
        } catch (err) {
            console.error("Axios GET error:", err);
            throw err;
        }
    }

    async post(url, data) {
        try {
            const res = await this.api.post(url, data);
            return res.data;
        } catch (err) {
            console.error("Axios POST error:", err);
            throw err;
        }
    }

    async put(url, data) {
        try {
            const res = await this.api.put(url, data);
            return res.data;
        } catch (err) {
            console.error("Axios PUT error:", err);
            throw err;
        }
    }

    async delete(url) {
        try {
            const res = await this.api.delete(url);
            return res.data;
        } catch (err) {
            console.error("Axios DELETE error:", err);
            throw err;
        }
    }
}

export default Api;
