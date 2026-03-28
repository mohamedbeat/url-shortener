import { createFileRoute, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MousePointer, Smartphone, Calendar, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { fetchLinkAnalytics, type AnalyticsData } from '@/lib/api/links';
import { WorldMap } from '@/components/dashboard/links/world-map';

export const Route = createFileRoute('/(auth)/dashboard/_l/links/analytics/index/$linkId')({
  component: AnalyticsPage,
});

// Colors for charts
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec489a', '#06b6d4', '#84cc16'];



function AnalyticsPage() {
  const { linkId } = useParams({ strict: false });

  if (!linkId) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No link selected for analytics</AlertDescription>
      </Alert>
    );
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['linkAnalytics', linkId],
    queryFn: () => fetchLinkAnalytics(linkId),
    enabled: !!linkId,
  });



  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load analytics data</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (!data) {
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>No data provided</AlertDescription>
    </Alert>
  }

  const analytics = data as AnalyticsData;
  const totalClicks = analytics.clickMetrics.total;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Link Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analytics for your shortened URL
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All-time clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickMetrics.last30Days.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{((analytics.clickMetrics.last30Days / totalClicks) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickMetrics.last7Days.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.clickMetrics.last7Days / analytics.clickMetrics.last30Days) * 100).toFixed(1)}% of last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.clickMetrics.last30Days / 30).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Clicks per day (last 30 days)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different analytics sections */}
      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">Click Trend</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices & Tech</TabsTrigger>
          <TabsTrigger value="temporal">Temporal Patterns</TabsTrigger>
        </TabsList>

        {/* Click Trend Tab */}
        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Click Trend Over Time</CardTitle>
              <CardDescription>
                Number of clicks per day for the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.clickTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      interval={Math.floor(analytics.clickTrend.length / 10)}
                    />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>
                Geographic distribution of clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.geographicData.topCountries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6">
                      {analytics.geographicData.topCountries.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Map View Section - New addition */}
          <WorldMap
            data={analytics.geographicData.topCountries}
            totalClicks={analytics.clickMetrics.total}
          />
        </TabsContent>

        {/* Traffic Sources Tab */}
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.trafficSources.topReferrers}
                      dataKey="count"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {analytics.trafficSources.topReferrers.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices & Tech Tab */}
        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>
                  Distribution by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.deviceData.deviceTypes}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {analytics.deviceData.deviceTypes.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Systems</CardTitle>
                <CardDescription>
                  OS distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.deviceData.operatingSystems} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
                <CardDescription>
                  Browser distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.deviceData.browsers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Temporal Patterns Tab */}
        <TabsContent value="temporal" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clicks by Hour</CardTitle>
                <CardDescription>
                  Peak hours for clicks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.temporalPatterns.clicksByHour}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Peak Hours</h4>
                  <div className="flex flex-wrap gap-2">
                    {analytics.temporalPatterns.peakHours.map((peak) => (
                      <span key={peak.hour} className="px-2 py-1 bg-primary/10 rounded-md text-sm">
                        {peak.hour}:00 - {peak.count} clicks
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clicks by Day of Week</CardTitle>
                <CardDescription>
                  Weekly patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.temporalPatterns.clicksByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Best Performing Timeframes</CardTitle>
                <CardDescription>
                  Top 5 time slots for engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.temporalPatterns.bestTimeframes.map((timeframe, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{timeframe.day}</p>
                          <p className="text-sm text-muted-foreground">{timeframe.hour}:00 - {timeframe.hour + 1}:00</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{timeframe.count.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Loading skeleton
function AnalyticsSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}