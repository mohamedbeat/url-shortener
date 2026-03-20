import { Link, createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, ArrowLeft, Link2 } from 'lucide-react';


export const Route = createFileRoute('/(noauth)/notfound/')({
  component: NotFound,
})


export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md text-center shadow-lg border-muted-foreground/20">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight">404</CardTitle>
          <CardDescription className="text-lg mt-2">
            Oops! This link seems to be broken
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The shortened URL you're looking for doesn't exist or may have expired.
          </p>

        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            <Link to="/">
              <Button className="flex-1 gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}


