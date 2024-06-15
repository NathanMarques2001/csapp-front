import axios from 'axios';

class Api {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
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
