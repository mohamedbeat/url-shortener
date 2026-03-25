import axios, { isAxiosError } from 'axios';

export const BASE_URL = import.meta.env.API_URL || 'http://localhost:3000/'
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Required when the backend sets httpOnly cookies and the frontend makes cross-origin XHR/fetch calls.
    withCredentials: true,
});

// Track refresh state to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(null);
        }
    });

    failedQueue = [];
};

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

// Response interceptor for handling 401 errors and token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request already retried, reject
        if (!isAxiosError(error) || error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Don't attempt refresh for auth endpoints (except refresh endpoint)
        const isAuthEndpoint = originalRequest.url?.includes('/auth/') &&
            !originalRequest.url?.includes('/auth/refresh');
        if (isAuthEndpoint) {
            // Clear auth and redirect to login
            handleAuthFailure();
            return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => {
                    return axiosInstance(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Attempt to refresh token
            await axiosInstance.post('/auth/refresh');

            // Process queued requests
            processQueue(null);

            // Retry original request
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Process queued requests with error
            processQueue(refreshError as Error);

            // Handle refresh failure
            handleAuthFailure();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

// Helper function to handle auth failure
const handleAuthFailure = () => {

    // You can dispatch a custom event for your app to listen to
    // window.dispatchEvent(new CustomEvent('auth:failure'));

    // Redirect to login page
    // Using window.location for simplicity
    // if (!window.location.pathname.includes('/login')) {
    //     window.location.href = '/login';
    // }
};

// // Optional: Add event listener for auth failure
// if (typeof window !== 'undefined') {
//     window.addEventListener('auth:failure', () => {
//         // You can update your app state here
//         console.log('Authentication failed - redirecting to login');
//     });
// }

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