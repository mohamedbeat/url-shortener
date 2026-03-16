import { createFileRoute } from '@tanstack/react-router'
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
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
} from 'lucide-react'
export const Route = createFileRoute('/(auth)/dashboard/_l/')({
  component: DashboardPage,
})

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'New Users',
    value: '2,350',
    change: '+180.1%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Sales',
    value: '12,234',
    change: '+19%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    title: 'Active Users',
    value: '573',
    change: '-12%',
    trend: 'down',
    icon: Activity,
  },
]

const recentSales = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '$1,999.00',
    avatar: 'OM',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '$39.00',
    avatar: 'JL',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '$299.00',
    avatar: 'IN',
  },
  {
    name: 'William Kim',
    email: 'william.kim@email.com',
    amount: '$99.00',
    avatar: 'WK',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '$39.00',
    avatar: 'SD',
  },
]

const recentOrders = [
  {
    id: '#12345',
    customer: 'John Doe',
    product: 'MacBook Pro',
    status: 'completed',
    total: '$2,399.00',
  },
  {
    id: '#12346',
    customer: 'Jane Smith',
    product: 'iPhone 14 Pro',
    status: 'processing',
    total: '$999.00',
  },
  {
    id: '#12347',
    customer: 'Bob Johnson',
    product: 'AirPods Max',
    status: 'pending',
    total: '$549.00',
  },
  {
    id: '#12348',
    customer: 'Alice Brown',
    product: 'iPad Air',
    status: 'completed',
    total: '$599.00',
  },
]

function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendIcon className={`mr-1 h-4 w-4 ${trendColor}`} />
                  <span className={trendColor}>{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Two column layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent sales */}
        <Card className="md:col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.email} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">{sale.avatar}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-sm text-muted-foreground">{sale.email}</p>
                  </div>
                  <div className="font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card className="md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders from your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : order.status === 'processing'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardContent className="border-t pt-4">
            <Button variant="outline" className="w-full">
              View all orders
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional section for charts/analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Your store performance over the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
            Chart component would go here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
