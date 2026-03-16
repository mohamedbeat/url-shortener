import {
    ArrowUpRight,
    ArrowDownRight,
    Link2,
    MousePointerClick,
    QrCode, TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data for URL shortener stats
const urlStats = [
    {
        title: 'Total Links',
        value: '1,234',
        change: '+12.3%',
        trend: 'up',
        icon: Link2,
        description: 'Active short links',
    },
    {
        title: 'Total Clicks',
        value: '45.2K',
        change: '+23.1%',
        trend: 'up',
        icon: MousePointerClick,
        description: 'All-time clicks',
    },
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

export function QuickStatsGrid() {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
}