// app/routes/dashboard/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowUpRight,
  ArrowDownRight,
  Link2,
  MousePointerClick,
  QrCode,
  Globe,
  TrendingUp,
  Clock,
  Calendar,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  MoreHorizontal,
  Zap,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/(auth)/dashboard/_l/')({
  component: DashboardPage,
})

// Mock data for URL shortener stats
const urlStats = [
  {
    title: 'Total Links',
    value: '1,234',
    change: '+12.3%',
    trend: 'up',
    icon: Link2,
    description: 'Active short links',
  },
  {
    title: 'Total Clicks',
    value: '45.2K',
    change: '+23.1%',
    trend: 'up',
    icon: MousePointerClick,
    description: 'All-time clicks',
  },
  {
    title: 'Click Rate',
    value: '24.8%',
    change: '+5.2%',
    trend: 'up',
    icon: TrendingUp,
    description: 'Average CTR',
  },
  {
    title: 'QR Codes',
    value: '342',
    change: '+18',
    trend: 'up',
    icon: QrCode,
    description: 'Generated QR codes',
  },
]

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

// Mock data for top performing links
const topLinks = [
  {
    id: '1',
    title: 'Black Friday Deals',
    shortUrl: 'sho.rt/bf2024',
    clicks: 3456,
    percentage: 100,
  },
  {
    id: '2',
    title: 'Newsletter Signup',
    shortUrl: 'sho.rt/newsletter',
    clicks: 2341,
    percentage: 68,
  },
  {
    id: '3',
    title: 'Summer Sale 2024',
    shortUrl: 'sho.rt/summer24',
    clicks: 1234,
    percentage: 36,
  },
  {
    id: '4',
    title: 'Blog Post - React Tips',
    shortUrl: 'sho.rt/react-tips',
    clicks: 856,
    percentage: 25,
  },
]

// Mock data for recent activity
const recentActivity = [
  {
    id: '1',
    action: 'New click',
    target: 'sho.rt/summer24',
    location: 'New York, US',
    device: 'Mobile',
    time: '2 minutes ago',
    icon: MousePointerClick,
  },
  {
    id: '2',
    action: 'Link created',
    target: 'sho.rt/new-product',
    location: 'Dashboard',
    device: 'Web',
    time: '15 minutes ago',
    icon: Link2,
  },
  {
    id: '3',
    action: 'QR downloaded',
    target: 'sho.rt/bf2024',
    location: 'QR Codes',
    device: 'Web',
    time: '1 hour ago',
    icon: QrCode,
  },
  {
    id: '4',
    action: 'Link expired',
    target: 'sho.rt/old-link',
    location: 'System',
    device: 'Auto',
    time: '3 hours ago',
    icon: Clock,
  },
]

// CTA for empty state
const EmptyState = () => (
  <Card className="border-dashed">
    <CardHeader className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Link2 className="h-10 w-10 text-primary" />
      </div>
      <CardTitle className="mt-4">No short links created yet</CardTitle>
      <CardDescription className="text-base">
        Create your first short link to start tracking clicks and managing your URLs effectively.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex justify-center pb-8">
      <Link to="/dashboard">

        <Button size="lg" >
          <Link2 className="mr-2 h-5 w-5" />
          Create your first short link

        </Button>
      </Link>
    </CardContent>
  </Card>
)

function DashboardPage() {
  // For demo purposes, show empty state if no links
  const hasLinks = true // Change to false to see empty state

  if (!hasLinks) {
    return (
      <div className="space-y-6">
        <div className=''>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your URL shortener dashboard. Get started by creating your first short link.
          </p>
        </div>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="space-y-6 ">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between  ">
        <div className=''>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your links today.
          </p>
        </div>
        <Link to="/dashboard" className='w-full sm:w-max sm:block'>
          <Button className={"w-full"} >
            <Link2 className="mr-2 h-4 w-4" />
            Create new link
          </Button>
        </Link>


      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {urlStats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight
          const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600'

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendIcon className={`mr-1 h-4 w-4 ${trendColor}`} />
                    <span className={trendColor}>{stat.change}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent links - spans 2 columns */}
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

        {/* Right column - Top links and activity */}
        <div className="space-y-6">
          {/* Top performing links */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Links</CardTitle>
              <CardDescription>
                Your most clicked links this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLinks.map((link) => (
                  <div key={link.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{link.title}</p>
                        <p className="text-muted-foreground">{link.shortUrl}</p>
                      </div>
                      <span className="font-medium">{link.clicks} clicks</span>
                    </div>
                    <Progress value={link.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardContent className="border-t pt-4">
              <Link to="/dashboard">
                <Button variant="outline" className="w-full" >
                  View detailed analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions on your links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-primary">{activity.target}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.location} • {activity.device}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Click Analytics</CardTitle>
          <CardDescription>
            Track your link performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clicks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="clicks">Clicks</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="referrers">Referrers</TabsTrigger>
            </TabsList>
            <TabsContent value="clicks" className="space-y-4">
              <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p>Clicks chart would go here</p>
                  <p className="text-sm">Using your preferred chart library</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="devices">
              <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                Device breakdown chart
              </div>
            </TabsContent>
            <TabsContent value="locations">
              <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                Geographic distribution chart
              </div>
            </TabsContent>
            <TabsContent value="referrers">
              <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                Top referrers table
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bulk Create</CardTitle>
            <CardDescription>
              Create multiple links at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full" >
                <Zap className="mr-2 h-4 w-4" />
                Bulk shorten
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">QR Codes</CardTitle>
            <CardDescription>
              Generate QR codes for your links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full" >
                <QrCode className="mr-2 h-4 w-4" />
                Create QR code
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Export Data</CardTitle>
            <CardDescription>
              Download your link analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
// import { createFileRoute } from '@tanstack/react-router'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import {
//   ArrowUpRight,
//   ArrowDownRight,
//   Users,
//   DollarSign,
//   ShoppingCart,
//   Activity,
// } from 'lucide-react'
// export const Route = createFileRoute('/(auth)/dashboard/_l/')({
//   component: DashboardPage,
// })

// const stats = [
//   {
//     title: 'Total Revenue',
//     value: '$45,231.89',
//     change: '+20.1%',
//     trend: 'up',
//     icon: DollarSign,
//   },
//   {
//     title: 'New Users',
//     value: '2,350',
//     change: '+180.1%',
//     trend: 'up',
//     icon: Users,
//   },
//   {
//     title: 'Sales',
//     value: '12,234',
//     change: '+19%',
//     trend: 'up',
//     icon: ShoppingCart,
//   },
//   {
//     title: 'Active Users',
//     value: '573',
//     change: '-12%',
//     trend: 'down',
//     icon: Activity,
//   },
// ]

// const recentSales = [
//   {
//     name: 'Olivia Martin',
//     email: 'olivia.martin@email.com',
//     amount: '$1,999.00',
//     avatar: 'OM',
//   },
//   {
//     name: 'Jackson Lee',
//     email: 'jackson.lee@email.com',
//     amount: '$39.00',
//     avatar: 'JL',
//   },
//   {
//     name: 'Isabella Nguyen',
//     email: 'isabella.nguyen@email.com',
//     amount: '$299.00',
//     avatar: 'IN',
//   },
//   {
//     name: 'William Kim',
//     email: 'william.kim@email.com',
//     amount: '$99.00',
//     avatar: 'WK',
//   },
//   {
//     name: 'Sofia Davis',
//     email: 'sofia.davis@email.com',
//     amount: '$39.00',
//     avatar: 'SD',
//   },
// ]

// const recentOrders = [
//   {
//     id: '#12345',
//     customer: 'John Doe',
//     product: 'MacBook Pro',
//     status: 'completed',
//     total: '$2,399.00',
//   },
//   {
//     id: '#12346',
//     customer: 'Jane Smith',
//     product: 'iPhone 14 Pro',
//     status: 'processing',
//     total: '$999.00',
//   },
//   {
//     id: '#12347',
//     customer: 'Bob Johnson',
//     product: 'AirPods Max',
//     status: 'pending',
//     total: '$549.00',
//   },
//   {
//     id: '#12348',
//     customer: 'Alice Brown',
//     product: 'iPad Air',
//     status: 'completed',
//     total: '$599.00',
//   },
// ]

// function DashboardPage() {
//   return (
//     <div className="space-y-6">
//       {/* Page title */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//         <p className="text-muted-foreground">
//           Welcome back! Here's what's happening with your store today.
//         </p>
//       </div>


//       <Card>
//         <CardHeader>
//           <CardTitle>No short links created yet</CardTitle>
//           <CardDescription>
//             Start creating short links to see your quick stats and performance overview here.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
//             <Button>
//               Create Short link
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Stats grid */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => {
//           const Icon = stat.icon
//           const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight
//           const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600'

//           return (
//             <Card key={stat.title}>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   {stat.title}
//                 </CardTitle>
//                 <Icon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//                 <p className="text-xs text-muted-foreground flex items-center mt-1">
//                   <TrendIcon className={`mr-1 h-4 w-4 ${trendColor}`} />
//                   <span className={trendColor}>{stat.change}</span>
//                   <span className="ml-1">from last month</span>
//                 </p>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Two column layout */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
//         {/* Recent sales */}
//         <Card className="md:col-span-1 lg:col-span-4">
//           <CardHeader>
//             <CardTitle>Recent Sales</CardTitle>
//             <CardDescription>
//               You made 265 sales this month.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentSales.map((sale) => (
//                 <div key={sale.email} className="flex items-center gap-4">
//                   <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
//                     <span className="text-sm font-medium">{sale.avatar}</span>
//                   </div>
//                   <div className="flex-1 space-y-1">
//                     <p className="text-sm font-medium leading-none">{sale.name}</p>
//                     <p className="text-sm text-muted-foreground">{sale.email}</p>
//                   </div>
//                   <div className="font-medium">{sale.amount}</div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recent orders */}
//         <Card className="md:col-span-1 lg:col-span-3">
//           <CardHeader>
//             <CardTitle>Recent Orders</CardTitle>
//             <CardDescription>
//               Latest orders from your store.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Order</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Total</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {recentOrders.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell>
//                       <div className="font-medium">{order.id}</div>
//                       <div className="text-sm text-muted-foreground">
//                         {order.customer}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           order.status === 'completed'
//                             ? 'default'
//                             : order.status === 'processing'
//                               ? 'secondary'
//                               : 'outline'
//                         }
//                       >
//                         {order.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">{order.total}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//           <CardContent className="border-t pt-4">
//             <Button variant="outline" className="w-full">
//               View all orders
//             </Button>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Additional section for charts/analytics */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Performance Overview</CardTitle>
//           <CardDescription>
//             Your store performance over the last 30 days.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
//             Chart component would go here
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
