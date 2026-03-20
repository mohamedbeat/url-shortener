import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FcGoogle } from 'react-icons/fc'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { BASE_URL } from '@/lib/axios'

export const Route = createFileRoute('/(noauth)/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${BASE_URL}api/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-12 cursor-pointer"
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
