import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp } from 'lucide-react'

export function QuickAnalytics() {
    return (
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
    )
}