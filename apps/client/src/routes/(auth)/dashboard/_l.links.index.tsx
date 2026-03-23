import { createFileRoute, Link } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  X,
  SquareStack,
  BarChart3,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { getAllLinks, toggleLinkStatus } from '@/lib/api/links';
import type { LinksQueryParams, } from '@/types/link';
import { CreateLinkDialog } from '@/components/dashboard/create-link-dialog';
import { BASE_URL } from '@/lib/axios';
import type { LinkSortFields, SortOrder, status } from '@packages/shared/types';
import { DeleteLinkDialog } from '@/components/dashboard/delete-link-dialog';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateBulkLinkDialog } from '@/components/dashboard/create-bulk-link-dialog ';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/(auth)/dashboard/_l/links/')({
  component: LinksPage,
  validateSearch: (search: Record<string, unknown>): LinksQueryParams => {
    return {
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 10,
      field: search.field as LinkSortFields || 'createdAt',
      order: search.order as SortOrder || 'DESC',
      search: (search.search as string) || '',
      status: (search.status as status) || 'all', // all | active | inactive
    };
  },
})

function LinksPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const queryClient = useQueryClient();
  const [deleteLinkId, setDeleteLinkId] = useState<string | null>(null);

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [searchInput, setSearchInput] = useState(search.search);
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate({
        search: {
          ...search,
          search: searchInput,
          page: 1,
        },
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);
  // Fetch links with query params including sorting
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['links', search],
    queryFn: () => getAllLinks(
      {
        page: search.page?.toString(),
        limit: search.limit?.toString(),
        search: search.search,
        status: search.status,
      },
      {
        field: search.field,
        order: search.order
      }
    ),
  });



  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleLinkStatus(id, {
        isActive
      }),
    onSuccess: (updatedLink) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast('Status updated', {
        description: `Link is now ${updatedLink.isActive ? 'active' : 'inactive'}.`,
      });
    },
    onError: (error) => {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to update link status',
      });
    },
  });

  // Copy to clipboard function
  const copyToClipboard = async (text: string, title: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied!', {
        description: `${title} has been copied to clipboard.`,

      });
    } catch (err) {
      toast.error('Error', {
        description: 'Failed to copy to clipboard',
      });
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    navigate({ search: { ...search, page: newPage } });
  };

  // Handle sorting
  const handleSort = (field: LinkSortFields) => {
    const currentOrder = search.field === field && search.order === 'ASC' ? 'DESC' : 'ASC';
    navigate({
      search: {
        ...search,
        field,
        order: currentOrder,
        page: 1 // Reset to first page when sorting
      }
    });
  };



  // Get sort icon
  const getSortIcon = (field: LinkSortFields) => {
    if (search.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return search.order === 'ASC' ?
      <ArrowUp className="ml-2 h-4 w-4" /> :
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  if (isError) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            <Button onClick={() => refetch()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 ">Your Links</h1>
        <div className='space-x-2 flex '>
          <CreateLinkDialog />
          <CreateBulkLinkDialog >
            <Button size="lg">
              <SquareStack className="mr-2 h-5 w-5" />
              Create multiple
            </Button>

          </CreateBulkLinkDialog>
        </div>
      </div>

      {/* Links Table */}
      <Card className='w-[21rem] sm:w-auto'>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <Input
              placeholder="Search by title, URL, or slug..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="max-w-sm"
            />

            {/* Status */}
            <Select value={search.status} onValueChange={(value) => {
              navigate({
                search: {
                  ...search,
                  status: value as status,
                  page: 1,
                },
              })
            }
            }>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset */}
            <Button variant="outline" onClick={() => {
              setSearchInput('')
              navigate({
                search: {
                  page: 1,
                  limit: 10,
                  field: 'createdAt',
                  order: 'DESC',
                  search: '',
                  status: 'all',
                },
              })
            }
            } className={"cursor-pointer"}>
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead>Short URL</TableHead>
                  <TableHead
                    className="text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('totalClicks')}
                  >
                    <div className="flex items-center justify-center">
                      Clicks
                      {getSortIcon('totalClicks')}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Created
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-3 w-[200px]" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-4 w-[50px] mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[70px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-[60px] ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.data.length ? (
                  data.data.map((link) => {
                    const shortUrl = `${BASE_URL}${link.shortHash}`;
                    const isStatusPending = toggleStatusMutation.isPending &&
                      toggleStatusMutation.variables?.id === link.id;

                    return (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8 rounded-none">
                              <AvatarImage src={link.publicURL} alt={link.title} className={"rounded-none"} />
                              <AvatarFallback className="text-xs rounded-none">
                                {link.title?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{link.title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                {link.url}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="relative bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm rounded">
                            {link.customSlug || link.shortHash}
                          </code>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {link.totalClicks.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={link.isActive ? 'bg-green-600 hover:bg-green-700' : ''}
                            variant={link.isActive ? 'default' : 'secondary'}
                          >
                            {link.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger >
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <Link to='/dashboard/links/analytics/index/$linkId'
                                params={{
                                  linkId: link.id
                                }}

                              >
                                <DropdownMenuItem
                                  className={"cursor-pointer"}
                                >
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  <span>Analytics</span>
                                </DropdownMenuItem>

                              </Link>

                              <Separator />
                              {/* Copy Options */}
                              <DropdownMenuItem
                                onClick={() => copyToClipboard(shortUrl, 'Short URL')}
                                className="cursor-pointer"
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy short URL</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => copyToClipboard(link.url, 'Original URL')}
                                className="cursor-pointer"
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy original URL</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {/* Open Options */}
                              <DropdownMenuItem
                                onClick={() => window.open(shortUrl, '_blank')}
                                className="cursor-pointer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                <span>Open short URL</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => window.open(link.url, '_blank')}
                                className="cursor-pointer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                <span>Open original URL</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {/* Toggle Status */}
                              <DropdownMenuItem
                                onClick={() => toggleStatusMutation.mutate({
                                  id: link.id,
                                  isActive: !link.isActive
                                })}
                                disabled={isStatusPending}
                                className="cursor-pointer"
                              >
                                {isStatusPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : link.isActive ? (
                                  <EyeOff className="mr-2 h-4 w-4" />
                                ) : (
                                  <Eye className="mr-2 h-4 w-4" />
                                )}
                                <span>
                                  {link.isActive ? 'Deactivate' : 'Activate'}
                                </span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {/* Delete Option */}
                              <DropdownMenuItem
                                // onClick={() => handleDeleteClick(link.id, link.title)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setDeleteLinkId(link.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground mb-4">No links found</p>
                        <CreateLinkDialog />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data && data.pagination.totalPages > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((data.pagination.currentPage - 1) * data.pagination.limit) + 1} to{' '}
                {Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.total)}{' '}
                of {data.pagination.total} links
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                  disabled={!data.pagination.hasPreviousPage}
                  className="cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      const current = data.pagination.currentPage;
                      return page === 1 ||
                        page === data.pagination.totalPages ||
                        Math.abs(page - current) <= 1;
                    })
                    .map((page, index, array) => {
                      if (index > 0 && array[index - 1] !== page - 1) {
                        return (
                          <span key={`ellipsis-${page}`} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        );
                      }
                      return (
                        <Button
                          key={page}
                          variant={page === data.pagination.currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-9 cursor-pointer"
                        >
                          {page}
                        </Button>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                  disabled={!data.pagination.hasNextPage}
                  className="cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}

      <DeleteLinkDialog id={deleteLinkId} open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) setDeleteLinkId(null);
      }} />

    </div>
  );
}

export default LinksPage
