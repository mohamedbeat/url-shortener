import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { QRCodeGenerator } from './links/qr-code';
import { useIsMobile } from '@/hooks/use-mobile';

interface QRCodeDialogProps {
    url: string;
    shortCode?: string;
    showSizeControl?: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void
}

export function QRCodeDialog({ url, shortCode, open, onOpenChange, showSizeControl = true }: QRCodeDialogProps) {
    const isMobile = useIsMobile()
    const [size, setSize] = useState(isMobile ? 128 : 256);
    const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>QR Code</DialogTitle>
                    <DialogDescription>
                        Scan this QR code to visit your shortened URL
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-4 space-y-4">
                    <QRCodeGenerator
                        value={url}
                        size={size}
                        level={errorLevel}
                        showDownload={true}
                        showCopy={true}
                    />

                    {showSizeControl && (
                        <div className="w-full space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="size">Size: {size}px</Label>
                                <Input
                                    id="size"
                                    type="range"
                                    min="128"
                                    max="512"
                                    step="32"
                                    value={size}
                                    onChange={(e) => setSize(parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="error-level">Error Correction Level</Label>
                                <Select
                                    value={errorLevel}
                                    onValueChange={(value: any) => setErrorLevel(value)}
                                >
                                    <SelectTrigger id="error-level">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Low (7%)</SelectItem>
                                        <SelectItem value="M">Medium (15%)</SelectItem>
                                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                                        <SelectItem value="H">High (30%)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Higher levels allow more damage to the QR code while still being scannable
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="w-full border-t pt-4 mt-2">
                        <p className="text-sm text-muted-foreground break-all text-center">
                            {url}{shortCode}
                        </p>

                    </div>
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className={"cursor-pointer"}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}