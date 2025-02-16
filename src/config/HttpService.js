import axios from "axios";

class HttpService {
    constructor() {
        this.axiosInstance = axios.create({
            withCredentials: true,
            baseURL: process.env.VITE_API_PATH, // Change to your API URL
            timeout: 10000, // 10 seconds timeout
            headers: {
                "Content-Type": "application/json",
            },
        });



        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error("API Error:", error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    get(url, config = {}) {
        return this.axiosInstance.get(url, config);
    }

    post(url, data, config = {}) {
        return this.axiosInstance.post(url, data, config);
    }

    put(url, data, config = {}) {
        return this.axiosInstance.put(url, data, config);
    }

    delete(url, config = {}) {
        return this.axiosInstance.delete(url, config);
    }
}

export default new HttpService();
