import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/(noauth)/login/success/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login successful</CardTitle>
          <CardDescription>
            {isLoading ? 'Finalizing your session...' : isAuthenticated ? `Welcome${user?.firstName ? `, ${user.firstName}` : ''}` : 'Login completed, but your session could not be verified.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            onClick={() => navigate({ to: '/login' })}
            variant="outline"
            className="w-full"
            disabled={isLoading || isAuthenticated}
          >
            Go back to login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

