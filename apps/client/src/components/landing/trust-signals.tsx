import { Card, CardContent } from '@/components/ui/card'
import { Users, TrendingUp, Award, Clock } from 'lucide-react'

const stats = [
    {
        icon: Users,
        value: "100,000+",
        label: "Active Users"
    },
    {
        icon: TrendingUp,
        value: "50M+",
        label: "Links Shortened"
    },
    // {
    //     icon: Award,
    //     value: "99.9%",
    //     label: "Uptime"
    // },
    {
        icon: Clock,
        value: "<100ms",
        label: "Response Time"
    }
]

export function TrustSignals() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="pt-6 text-center">
                                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-6 py-3">
                        <span className="text-sm font-medium">⭐️ ⭐️ ⭐️ ⭐️ ⭐️</span>
                        <span className="text-sm text-muted-foreground">
                            Trusted by thousands of businesses worldwide
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}