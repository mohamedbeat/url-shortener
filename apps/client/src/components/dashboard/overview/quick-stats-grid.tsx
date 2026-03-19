import {
    ArrowUpRight,
    ArrowDownRight,
    Link2,
    MousePointerClick,
    QrCode, TrendingUp,
    Icon,
    AlertCircleIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/api/stats';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for URL shortener stats
const urlStats = [
    {
        title: 'Click Rate',
        value: '24.8%',
        change: '+5.2%',
        trend: 'up',
        icon: TrendingUp,
        description: 'Average CTR',
    },
    {
        title: 'QR Codes',
        value: '342',
        change: '+18',
        trend: 'up',
        icon: QrCode,
        description: 'Generated QR codes',
    },
]

// Skeleton component for the stats grid
function StatsGridSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-20 mb-2" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function QuickStatsGrid() {
    const { isPending, isError, data, error, refetch } = useQuery({
        queryKey: ['stats'],
        queryFn: getStats
    })

    if (isError) {
        return (
            <Alert variant="destructive" className="p-4">
                <AlertCircleIcon />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                    Something went wrong while fetching quick stats data.
                    <Button onClick={async () => await refetch()} variant={'link'} className={"cursor-pointer"}>
                        Retry?
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    if (isPending) {
        return <StatsGridSkeleton />
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total links
                    </CardTitle>
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalLinks}</div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUpRight className={`mr-1 h-4 w-4 text-green-600`} />
                            <span className={"text-green-600"}>+5</span>
                        </p>
                        <span className="text-xs text-muted-foreground">
                            Active short links
                        </span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total clicks
                    </CardTitle>
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalClicks}</div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUpRight className={`mr-1 h-4 w-4 text-green-600`} />
                            <span className={"text-green-600"}>+5</span>
                        </p>
                        <span className="text-xs text-muted-foreground">
                            All-times clicks
                        </span>
                    </div>
                </CardContent>
            </Card>
            {urlStats.map((stat) => {
                const Icon = stat.icon
                const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight
                const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600'

                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground flex items-center">
                                    <TrendIcon className={`mr-1 h-4 w-4 ${trendColor}`} />
                                    <span className={trendColor}>{stat.change}</span>
                                </p>
                                <span className="text-xs text-muted-foreground">
                                    {stat.description}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}