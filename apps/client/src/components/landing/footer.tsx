import { Button } from '@/components/ui/button'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

const footerSections = {
    product: ["Features", "Pricing", "API", "Changelog"],
    resources: ["Documentation", "Guides", "Status", "Support"],
    company: ["About", "Blog", "Careers", "Contact"],
    legal: ["Privacy", "Terms", "Security", "Cookies"]
}

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                    <div className="col-span-2">
                        <h3 className="text-lg font-bold mb-4">ShortLink</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Making links shorter, smarter, and more powerful.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                                <Github className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {Object.entries(footerSections).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold mb-4 capitalize">{title}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} ShortLink. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}