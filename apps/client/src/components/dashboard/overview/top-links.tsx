import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Link } from '@tanstack/react-router'


// Mock data for top performing links
const topLinks = [
    {
        id: '1',
        title: 'Black Friday Deals',
        shortUrl: 'sho.rt/bf2024',
        clicks: 3456,
        percentage: 100,
    },
    {
        id: '2',
        title: 'Newsletter Signup',
        shortUrl: 'sho.rt/newsletter',
        clicks: 2341,
        percentage: 68,
    },
    {
        id: '3',
        title: 'Summer Sale 2024',
        shortUrl: 'sho.rt/summer24',
        clicks: 1234,
        percentage: 36,
    },
    {
        id: '4',
        title: 'Blog Post - React Tips',
        shortUrl: 'sho.rt/react-tips',
        clicks: 856,
        percentage: 25,
    },
]

export function TopLinks() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing Links</CardTitle>
                <CardDescription>
                    Your most clicked links this month
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topLinks.map((link) => (
                        <div key={link.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-medium">{link.title}</p>
                                    <p className="text-muted-foreground">{link.shortUrl}</p>
                                </div>
                                <span className="font-medium">{link.clicks} clicks</span>
                            </div>
                            <Progress value={link.percentage} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardContent className="border-t pt-4">
                <Link to="/dashboard">
                    <Button variant="outline" className="w-full" >
                        View detailed analytics
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}