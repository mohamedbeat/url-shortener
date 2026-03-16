import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { Copy, Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";

// Mock data for recent links
const recentLinks = [
    {
        id: '1',
        title: 'Summer Sale 2024',
        shortUrl: 'sho.rt/summer24',
        originalUrl: 'https://mywebsite.com/products/summer-sale-2024?utm_source=social',
        clicks: 1234,
        createdAt: '2 hours ago',
        status: 'active',
    },
    {
        id: '2',
        title: 'Blog Post - React Tips',
        shortUrl: 'sho.rt/react-tips',
        originalUrl: 'https://blog.dev/react-best-practices-2024',
        clicks: 856,
        createdAt: '5 hours ago',
        status: 'active',
    },
    {
        id: '3',
        title: 'Newsletter Signup',
        shortUrl: 'sho.rt/newsletter',
        originalUrl: 'https://mywebsite.com/subscribe',
        clicks: 2341,
        createdAt: '1 day ago',
        status: 'active',
    },
    {
        id: '4',
        title: 'Product Launch',
        shortUrl: 'sho.rt/new-product',
        originalUrl: 'https://mywebsite.com/products/new-launch',
        clicks: 567,
        createdAt: '2 days ago',
        status: 'inactive',
    },
    {
        id: '5',
        title: 'Black Friday Deals',
        shortUrl: 'sho.rt/bf2024',
        originalUrl: 'https://mywebsite.com/black-friday',
        clicks: 3456,
        createdAt: '3 days ago',
        status: 'active',
    },
]

export function RecentLinks() {
    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Links</CardTitle>
                    <CardDescription>
                        Your most recently created short links
                    </CardDescription>
                </div>
                <Link to="/dashboard">
                    <Button variant="outline" size="sm" >
                        View all
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Link</TableHead>
                            <TableHead>Original URL</TableHead>
                            <TableHead className="text-center">Clicks</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentLinks.map((link) => (
                            <TableRow key={link.id}>
                                <TableCell>
                                    <div className="font-medium">{link.title}</div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <span>{link.shortUrl}</span>
                                        <Button variant="ghost" size="icon" className="h-5 w-5">
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                                        {link.originalUrl}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {link.clicks.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {link.createdAt}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={link.status === 'active' ? 'default' : 'secondary'}
                                        className={link.status === 'active' ? 'bg-green-600' : ''}
                                    >
                                        {link.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <Button variant="ghost" size="icon">
                                            <DropdownMenuTrigger >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                        </Button>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Visit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy URL
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}