import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, BarChart3, Sparkles, QrCode, Link2, Shield } from 'lucide-react'

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Shorten URLs instantly with our optimized infrastructure. No waiting, just results."
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Track clicks, locations, devices, and referrers in real-time with beautiful charts."
    },
    {
        icon: Sparkles,
        title: "Custom Slugs",
        description: "Create memorable, branded links with custom aliases that reflect your brand."
    },
    {
        icon: QrCode,
        title: "QR Codes",
        description: "Generate QR codes automatically for every short link. Perfect for print materials."
    },
    {
        icon: Link2,
        title: "Link Management",
        description: "Organize, edit, and manage all your links in one powerful dashboard."
    },
    {
        icon: Shield,
        title: "Secure & Reliable",
        description: "Enterprise-grade security with SSL encryption and 99.9% uptime guarantee."
    }
]

export function Features() {
    return (
        <section className=" py-24 bg-muted/30" id='features'>
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Everything You Need to Shorten Smarter
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Powerful features that help you create, manage, and track your links effectively
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}