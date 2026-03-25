import { Card, CardContent } from '@/components/ui/card'
import { FileText, Edit, Share2 } from 'lucide-react'

const steps = [
    {
        icon: FileText,
        title: "Paste Your URL",
        description: "Enter your long URL into the input field. It can be any link from any website.",
        step: "01"
    },
    {
        icon: Edit,
        title: "Customize (Optional)",
        description: "Choose a custom slug, set expiration, or add tags for better organization.",
        step: "02"
    },
    {
        icon: Share2,
        title: "Copy & Share",
        description: "Get your shortened link instantly and share it anywhere. Track performance in real-time.",
        step: "03"
    }
]

export function HowItWorks() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Three simple steps to cleaner, smarter links
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <CardContent className="pt-8">
                                <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/10">
                                    {step.step}
                                </div>
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <step.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}