import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, ArrowRight, Copy, Check, Sparkles } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export function Hero() {
    const [longUrl, setLongUrl] = useState('')
    const [shortened, setShortened] = useState('')
    const [copied, setCopied] = useState(false)
    const navigate = useNavigate()

    const handleShorten = () => {
        // Demo shortening logic
        if (longUrl) {
            setShortened('https://short.link/' + Math.random().toString(36).substring(2, 8))
        }
    }

    const handleCopy = () => {
        if (shortened) {
            navigator.clipboard.writeText(shortened)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleGetStarted = () => {
        // Navigate to signup or dashboard
        navigate({ to: '/dashboard' })
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-muted/20 py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
                        <span className="font-medium">🚀 Launching Soon</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent max-w-4xl">
                        Shorten URLs in Seconds
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Create clean, memorable short links with powerful analytics.
                        Track every click, boost your marketing, and build trust with your audience.
                    </p>

                    {/* CTA Buttons - Added primary CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={handleGetStarted}
                            size="lg"
                            className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Get Started Free
                            <Sparkles className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-12 px-8 text-base"
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    {/* URL Input Form */}
                    <div className="w-full max-w-2xl space-y-4 mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or try it now
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <Input
                                    type="url"
                                    placeholder="Paste your long URL here..."
                                    value={longUrl}
                                    onChange={(e) => setLongUrl(e.target.value)}
                                    className="pl-10 h-12 text-lg"
                                />
                            </div>
                            <Button onClick={handleShorten} size="lg" variant="secondary" className="h-12 px-8">
                                Shorten Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        {/* Demo Result */}
                        {shortened && (
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border animate-slide-up">
                                <code className="text-sm font-mono text-primary">{shortened}</code>
                                <Button variant="ghost" size="sm" onClick={handleCopy}>
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-8">
                        <span>✓ No credit card required</span>
                        <span>✓ Forever free tier</span>
                        <span>✓ Real-time analytics</span>
                        <span>✓ Cancel anytime</span>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 opacity-30">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
                    <div className="w-1 h-2 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
                </div>
            </div>
        </section>
    )
}
// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Link, ArrowRight, Copy, Check } from 'lucide-react'

// export function Hero() {
//     const [longUrl, setLongUrl] = useState('')
//     const [shortened, setShortened] = useState('')
//     const [copied, setCopied] = useState(false)

//     const handleShorten = () => {
//         // Demo shortening logic
//         if (longUrl) {
//             setShortened('https://short.link/' + Math.random().toString(36).substring(2, 8))
//         }
//     }

//     const handleCopy = () => {
//         if (shortened) {
//             navigator.clipboard.writeText(shortened)
//             setCopied(true)
//             setTimeout(() => setCopied(false), 2000)
//         }
//     }

//     return (
//         <section className="relative h-screen overflow-hidden bg-gradient-to-b from-background to-muted/20 py-24 md:py-32">
//             <div className="container mx-auto px-4 md:px-6">
//                 <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
//                     {/* Badge */}
//                     <div className="inline-flex items-center rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
//                         <span className="font-medium">🚀 Launching Soon</span>
//                     </div>

//                     {/* Headline */}
//                     <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent max-w-4xl">
//                         Shorten URLs in Seconds
//                     </h1>

//                     {/* Subheadline */}
//                     <p className="text-xl text-muted-foreground max-w-2xl">
//                         Create clean, memorable short links with powerful analytics.
//                         Track every click, boost your marketing, and build trust with your audience.
//                     </p>

//                     {/* URL Input Form */}
//                     <div className="w-full max-w-2xl space-y-4">
//                         <div className="flex flex-col sm:flex-row gap-3">
//                             <div className="relative flex-1">
//                                 <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
//                                 <Input
//                                     type="url"
//                                     placeholder="Paste your long URL here..."
//                                     value={longUrl}
//                                     onChange={(e) => setLongUrl(e.target.value)}
//                                     className="pl-10 h-12 text-lg"
//                                 />
//                             </div>
//                             <Button onClick={handleShorten} size="lg" className="h-12 px-8">
//                                 Shorten Now
//                                 <ArrowRight className="ml-2 h-4 w-4" />
//                             </Button>
//                         </div>

//                         {/* Demo Result */}
//                         {shortened && (
//                             <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border animate-slide-up">
//                                 <code className="text-sm font-mono text-primary">{shortened}</code>
//                                 <Button variant="ghost" size="sm" onClick={handleCopy}>
//                                     {copied ? (
//                                         <Check className="h-4 w-4 text-green-500" />
//                                     ) : (
//                                         <Copy className="h-4 w-4" />
//                                     )}
//                                 </Button>
//                             </div>
//                         )}
//                     </div>

//                     {/* Trust Badges */}
//                     <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-8">
//                         <span>✓ No account required</span>
//                         <span>✓ Forever free tier</span>
//                         <span>✓ Real-time analytics</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Background Decoration */}
//             <div className="absolute inset-0 -z-10 opacity-30">
//                 <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
//                 <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
//                 <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
//             </div>
//         </section>
//     )
// }