import axios from 'axios';

class Api {
    static baseUrl = "http://localhost:8080";
    constructor() {
        this.api = axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async get(url) {
        try {
            const res = await this.api.get(Api.baseUrl + url);
            return res.data;
        } catch (err) {
            console.error("Axios GET error:", err);
            throw err;
        }
    }

    async post(url, data) {
        try {
            const res = await this.api.post(Api.baseUrl + url, data);
            return res.data;
        } catch (err) {
            console.error("Axios POST error:", err);
            throw err;
        }
    }

    async put(url, data) {
        try {
            const res = await this.api.put(Api.baseUrl + url, data);
            return res.data;
        } catch (err) {
            console.error("Axios PUT error:", err);
            throw err;
        }
    }

    async delete(url) {
        try {
            const res = await this.api.delete(Api.baseUrl + url);
            return res.data;
        } catch (err) {
            console.error("Axios DELETE error:", err);
            throw err;
        }
    }
}

export default Api;
