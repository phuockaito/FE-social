import axios, { AxiosError, type AxiosResponse } from "axios";
import queryString from "query-string";

export const axiosClient = axios.create({
    baseURL: "/api",
    headers: {
        "content-type": "application/json",
    },
    responseType: "json",
    paramsSerializer: (params) => queryString.stringify(params),
    timeout: 30000,
});

axiosClient.interceptors.request.use(
    (config) => {
        return config;
    },
    function error() {
        throw error;
    }
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response?.data) {
            return response.data;
        }
        return response;
    },
    async (error: AxiosError) => {
        throw error?.response?.data || error;
    }
);
