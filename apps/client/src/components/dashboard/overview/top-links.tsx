import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { getAllLinks } from '@/lib/api/links'
import { getStats } from '@/lib/api/stats'
import { handleApiError } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AlertCircleIcon } from 'lucide-react'




export function TopLinks() {

    const limit = 5
    const { data, isPending, isError, error, refetch } = useQuery({
        queryKey: ['top-links'],
        queryFn: () => getAllLinks({ limit: limit.toString() }, {
            field: 'totalClicks',
            order: 'DESC'
        })
    })

    const statsQuery = useQuery({
        queryKey: ['stats'],
        queryFn: getStats
    })


    function calculatePercentage(count: number, total: number) {
        return (count * 100) / total
    }


    if (isError) {
        const err = handleApiError(error)
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Links</CardTitle>
                    <CardDescription>
                        Your most clicked links this month
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive" className="p-4">
                        <AlertCircleIcon />
                        <AlertTitle>Something went wrong</AlertTitle>
                        <AlertDescription>
                            <p>
                                Something went wrong while fetching recent links data. <Button onClick={async () => await refetch()} variant={'link'} className={"cursor-pointer"}>
                                    Retry?
                                </Button>
                            </p>
                            <p>{err.message}</p>

                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    if (isPending) {
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
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className='w-full mr-2'>
                                        <Skeleton className='h-2 w-full' />
                                        <Skeleton className='h-2 w-full' />
                                    </div>
                                    <Skeleton className='h-2 w-14' />
                                </div>
                                {/* <Progress value={link.percentage} className="h-2" /> */}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        )
    }

    return (
        <Card className='w-[350px] sm:w-auto overflow-y-auto overflow-x-auto'>
            <CardHeader>
                <CardTitle>Top Performing Links</CardTitle>
                <CardDescription>
                    Your most clicked links this month
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.data.map((link) => (
                        <div key={link.id} className="space-y-2">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="h-7 w-7" >
                                    <img src={link.publicURL} className="h-full w-full" />
                                </div>
                                <div className='flex-1'>
                                    <p className="font-medium">{link.title}</p>
                                    <p className="text-muted-foreground">{link.url}</p>
                                </div>
                                <span className="font-medium">{link.totalClicks} clicks</span>
                            </div>
                            {
                                statsQuery.data?.totalClicks && <Progress value={calculatePercentage(link.totalClicks, statsQuery.data.totalClicks)} className="h-2" />
                            }

                        </div>
                    ))}
                </div>
            </CardContent>
            {/* <CardContent className="border-t pt-4">
                <Link to="/dashboard">
                    <Button variant="outline" className="w-full" >
                        View detailed analytics
                    </Button>
                </Link>
            </CardContent> */}
        </Card>
    )
}