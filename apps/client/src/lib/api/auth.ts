// src/features/auth/services/auth-service.ts

import axiosInstance from "../axios"

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    picture?: string
    createdAt: string
}

class AuthService {
    async getCurrentUser(): Promise<User | null> {
        try {
            console.log('authenticating')
            const response = await axiosInstance.get<User>('api/auth/me')
            return response.data
        } catch (error) {
            return null
        }
    }

    async logout(): Promise<void> {
        await axiosInstance.post('api/auth/logout')
    }
}

export const authService = new AuthService()