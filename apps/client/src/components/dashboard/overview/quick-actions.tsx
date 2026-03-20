import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import {
    Calendar, QrCode, Zap
} from 'lucide-react'
import { CreateBulkLinkDialog } from '../create-bulk-link-dialog '


export function QuickActions() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Bulk Create</CardTitle>
                    <CardDescription>
                        Create multiple links at once
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateBulkLinkDialog>
                        <Button variant="outline" className="w-full cursor-pointer" >
                            <Zap className="mr-2 h-4 w-4" />
                            Bulk shorten
                        </Button>
                    </CreateBulkLinkDialog>

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
                    <Button variant="outline" className="w-full cursor-pointer" >
                        <QrCode className="mr-2 h-4 w-4" />
                        Create QR code
                    </Button>
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
                    <Button variant="outline" className="w-full cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}