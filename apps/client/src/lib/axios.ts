// lib/axios.ts
import axios, { isAxiosError } from 'axios';

export const BASE_URL = import.meta.env.API_URL || 'http://192.168.100.37:3000/'
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for auth if needed
axiosInstance.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

export type httpErrorResponse = {
    message: string | string[]
    error: string
    statusCode: number
}

export function handleApiError(error: any) {
    console.error('API Error:', error);
    if (isAxiosError(error)) {

        const status = error.response?.status
        const data = error.response?.data as httpErrorResponse

        switch (status) {
            case 400:
                return {
                    message: data?.message,
                    type: 'warning',
                    status: 400
                };

            case 401:
                return {
                    message: 'Your session has expired. Please log in again.',
                    type: 'error',
                    status: 401,
                    action: 'redirect_login' // Custom flag for handling redirect
                };

            case 403:
                return {
                    message: 'You don\'t have permission to access this resource.',
                    type: 'error',
                    status: 403
                };

            case 404:
                return {
                    message: 'The requested resource was not found.',
                    type: 'warning',
                    status: 404
                };



            case 429:
                return {
                    message: 'Too many requests. Please try again later.',
                    type: 'warning',
                    status: 429
                };
            case 500:
            case 502:
            case 503:
            case 504:
                return {
                    message: 'Server error. Please try again later.',
                    type: 'error',
                    status: status
                };
            default:
                if (error.code === 'ECONNABORTED') {
                    return {
                        message: 'Request timeout. Please check your connection.',
                        type: 'warning',
                        status: 408
                    };
                }

                if (!error.response) {
                    return {
                        message: 'Network error. Please check your internet connection.',
                        type: 'error',
                        status: 0 // Custom status for network errors
                    };
                }

                return {
                    message: data?.message || 'An unexpected error occurred.',
                    type: 'error',
                    status: status || 500
                };
        }
    } else {
        return {
            message: 'An unexpected error occurred.',
            type: 'error',
            status: 500
        }
    }
}