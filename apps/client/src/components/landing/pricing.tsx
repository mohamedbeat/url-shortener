import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for getting started",
        features: [
            "Up to 100 links/month",
            "Basic analytics",
            "Standard short domains",
            "QR code generation",
            "Email support"
        ],
        notIncluded: [],
        cta: "Get Started",
        popular: false
    },
    {
        name: "Pro",
        price: "$9",
        description: "For professionals and marketers",
        features: [
            "Unlimited links",
            "Advanced analytics",
            "Custom domains",
            "Priority support",
            "API access",
            "Team collaboration"
        ],
        notIncluded: [],
        cta: "Start Free Trial",
        popular: true
    },
    {
        name: "Business",
        price: "$49",
        description: "For teams and enterprises",
        features: [
            "Everything in Pro",
            "White-label solution",
            "SLA guarantee",
            "Dedicated account manager",
            "Custom integrations",
            "Advanced security"
        ],
        notIncluded: [],
        cta: "Contact Sales",
        popular: false
    }
]

export function Pricing() {
    return (
        <section className=" py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your needs. Upgrade or downgrade anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105 overflow-visible' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}