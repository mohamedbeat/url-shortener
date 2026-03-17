// app/routes/dashboard/index.tsx
import { CreateLinkDialog } from '@/components/dashboard/create-link-dialog'
import { QuickActions } from '@/components/dashboard/overview/quick-actions'
import { QuickAnalytics } from '@/components/dashboard/overview/quick-analytics'
import { QuickStatsGrid } from '@/components/dashboard/overview/quick-stats-grid'
import { RecentActivity } from '@/components/dashboard/overview/recent-activity'
import { RecentLinks } from '@/components/dashboard/overview/recent-links'
import { TopLinks } from '@/components/dashboard/overview/top-links'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Link2,
} from 'lucide-react'

export const Route = createFileRoute('/(auth)/dashboard/_l/')({
  component: DashboardPage,
})

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

        <CreateLinkDialog >
          <Button size="lg" >
            <Link2 className="mr-2 h-5 w-5" />
            Create your first short link
          </Button>
        </CreateLinkDialog>

      </Link>
    </CardContent>
  </Card>
)

function DashboardPage() {
  // For demo purposes, show empty state if no links
  const hasLinks = true// Change to false to see empty state

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
        <CreateLinkDialog >
          <Button size="lg" >
            <Link2 className="mr-2 h-5 w-5" />
            Create your short link
          </Button>
        </CreateLinkDialog>

      </div>

      {/* Stats grid */}
      <QuickStatsGrid />

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent links - spans 2 columns */}
        <RecentLinks />

        {/* Right column - Top links and activity */}
        <div className="space-y-6">
          {/* Top performing links */}
          <TopLinks />

          {/* Recent activity */}
          <RecentActivity />
        </div>
      </div>

      {/* Analytics tabs */}
      <QuickAnalytics />

      {/* Quick actions */}
      <QuickActions />
    </div>
  )
}
