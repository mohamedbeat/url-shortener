import { authService } from '@/lib/api/auth'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export function useAuth() {
    const queryClient = useQueryClient()

    const { data: user, isLoading } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: () => authService.getCurrentUser(),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    const logout = async () => {
        await authService.logout()
        queryClient.setQueryData(['auth', 'user'], null)
        queryClient.clear()
        window.location.href = '/login'
    }

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
    }
}