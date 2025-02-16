import axios from "axios";
const apiPath = import.meta.env.VITE_API_PATH

class HttpService {
    constructor() {
        this.axiosInstance = axios.create({
            withCredentials: true,
            baseURL: apiPath,
            timeout: 10000,
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
