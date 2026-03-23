import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllLinks } from "@/lib/api/links";
import { BASE_URL, handleApiError } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertCircleIcon, Copy, Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteLinkDialog } from "../delete-link-dialog";


export function RecentLinks() {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLinkId, setDeleteLinkId] = useState<string | null>(null);

    const { isPending, isError, error, data, refetch } = useQuery({
        queryKey: ["links"],
        queryFn: () => getAllLinks({})
    })


    if (isError) {
        const err = handleApiError(error)
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
                    <Alert variant="destructive" className="p-4">
                        <AlertCircleIcon />
                        <AlertTitle>Something went wrong</AlertTitle>
                        <AlertDescription>
                            <p>
                                Something went wrong while fetching recent links data. <Button onClick={async () => await refetch()} variant={'link'} className={"cursor-pointer"}>
                                    Retry?
                                </Button>
                            </p>
                            <p>{err.message}</p>

                        </AlertDescription>
                    </Alert>
                </CardContent>

            </Card>
        )
    }

    if (isPending) {
        return (

            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Links </CardTitle>
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
                                <TableHead></TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead>Original URL</TableHead>
                                <TableHead className="text-center">Clicks</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                [...Array(6)].map((_, i) => {
                                    return (
                                        <TableRow key={i} id={i.toString()}>
                                            <TableCell>
                                                <div className="font-medium"><Skeleton className="h-10 w-16" /></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium"><Skeleton className="h-4 w-32" /></div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <span><Skeleton className="h-4 w-16" /></span>
                                                    <Button variant="ghost" size="icon" className="h-5 w-5">
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-medium">

                                                <Skeleton className="h-4 w-16" />
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">

                                                <Skeleton className="h-4 w-16" />
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                // variant={link.status === 'active' ? 'default' : 'secondary'}
                                                // className={link.status === 'active' ? 'bg-green-600' : ''}
                                                >

                                                    <Skeleton className="h-4 w-16" />
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

                                    )
                                })
                            }
                        </TableBody>

                    </Table>

                </CardContent>
            </Card>
        )
    }


    return (
        <Card className="lg:col-span-2 w-[350px] sm:w-auto">
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
                <DeleteLinkDialog
                    id={deleteLinkId}
                    open={deleteDialogOpen}
                    onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) setDeleteLinkId(null);
                    }}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableHead>Link</TableHead>
                            <TableHead>Original URL</TableHead>
                            <TableHead className="text-center">Clicks</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data.map((link) => (
                            <TableRow key={link.id}>
                                <TableCell>
                                    <div className="h-7 w-7" >
                                        <img src={link.publicURL} className="h-full w-full" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{link?.title}</div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <span>http://localhost:3000/{link.customSlug ? link.customSlug : link.shortHash}</span>
                                        <Button variant="ghost" size="icon" className="h-5 w-5">
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                                        {link.url}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {link.totalClicks.toString()}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {link.createdAt}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={link.isActive ? 'default' : 'secondary'}
                                        className={link.isActive ? 'bg-green-600' : ''}
                                    >
                                        {link.isActive ? "Active" : "Not active"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuGroup>
                                            <DropdownMenuTrigger>
                                                <Button variant="ghost" size="icon" className={"cursor-pointer"}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <a target="_blank" href={`${BASE_URL}${link.customSlug ? link.customSlug : link.shortHash}`} >
                                                    <DropdownMenuItem className={"cursor-pointer"}>
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        <p>
                                                            Visit
                                                        </p>
                                                    </DropdownMenuItem>
                                                </a>
                                                <DropdownMenuItem>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Copy URL
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setDeleteLinkId(link.id);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                >

                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>

                                        </DropdownMenuGroup>
                                    </DropdownMenu>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

        </Card >
    )
}