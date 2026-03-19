import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Clock, Link2, MousePointerClick,
    QrCode
} from 'lucide-react'

// Mock data for recent activity
const recentActivity = [
    {
        id: '1',
        action: 'New click',
        target: 'sho.rt/summer24',
        location: 'New York, US',
        device: 'Mobile',
        time: '2 minutes ago',
        icon: MousePointerClick,
    },
    {
        id: '2',
        action: 'Link created',
        target: 'sho.rt/new-product',
        location: 'Dashboard',
        device: 'Web',
        time: '15 minutes ago',
        icon: Link2,
    },
    {
        id: '3',
        action: 'QR downloaded',
        target: 'sho.rt/bf2024',
        location: 'QR Codes',
        device: 'Web',
        time: '1 hour ago',
        icon: QrCode,
    },
    {
        id: '4',
        action: 'Link expired',
        target: 'sho.rt/old-link',
        location: 'System',
        device: 'Auto',
        time: '3 hours ago',
        icon: Clock,
    },
]

export function RecentActivity() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    Latest actions on your links
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentActivity.map((activity) => {
                        const Icon = activity.icon
                        return (
                            <div key={activity.id} className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-2">
                                    <Icon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">
                                            {activity.action}
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                            {activity.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-primary">{activity.target}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {activity.location} • {activity.device}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}