import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// UI Components
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
import { getAllLinks } from '@/lib/api/links';
import type { LinksQueryParams, } from '@/types/link';
import { CreateLinkDialog } from '@/components/dashboard/create-link-dialog';
import { BASE_URL } from '@/lib/axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { LinkSortFields, SortOrder } from '@packages/shared/types';

// Types and API
export const Route = createFileRoute('/(auth)/dashboard/_l/links/')({
  component: LinksPage,
  validateSearch: (search: Record<string, unknown>): LinksQueryParams => {
    return {
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 3,
      field: search.field as LinkSortFields || 'createdAt',
      order: search.order as SortOrder || 'DESC'
    };
  },
})

function LinksPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  // Fetch links with query params including sorting
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['links', search],
    queryFn: () => getAllLinks(
      {
        page: search.page?.toString(),
        limit: search.limit?.toString(),
      },
      {
        field: search.field,
        order: search.order
      }
    ),
  });

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Links</h1>
        <CreateLinkDialog />
      </div>

      {/* Links Table */}
      <Card>
        <CardContent className="p-6">
          <div className="border ">
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
                  data.data.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={link.publicURL} alt={link.title} />
                            <AvatarFallback className="text-xs">
                              {link.title.slice(0, 2).toUpperCase()}
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
                          <Button variant="ghost" size="sm">
                            <DropdownMenuTrigger >
                              <ExternalLink className="h-4 w-4" />
                            </DropdownMenuTrigger>
                          </Button>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => window.open(`${BASE_URL}${link.shortHash}`, '_blank')}
                            >
                              Open short URL
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(link.url, '_blank')}
                            >
                              Open original URL
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
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
    </div>
  );
}

export default LinksPage;
