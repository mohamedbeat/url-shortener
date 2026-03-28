import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface QRCodeProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    bgColor?: string;
    fgColor?: string;
    imageSettings?: {
        src: string;
        height: number;
        width: number;
        excavate: boolean;
    };
    showDownload?: boolean;
    showCopy?: boolean;
    className?: string;
}

export function QRCodeGenerator({
    value,
    size = 200,
    level = 'M',
    includeMargin = true,
    bgColor = '#ffffff',
    fgColor = '#000000',
    imageSettings,
    showDownload = true,
    showCopy = true,
    className = '',
}: QRCodeProps) {
    const qrCodeRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!qrCodeRef.current) return;

        try {
            // Find the canvas element inside the QR code component
            const canvas = qrCodeRef.current.querySelector('canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = canvas.toDataURL('image/png');
                link.click();

                toast('QR code downloaded successfully');
            }
        } catch (err) {
            toast('Failed to download QR code');
        }
    };

    const handleCopy = async () => {
        console.log("copying")
        if (!qrCodeRef.current) return;

        try {
            const canvas = qrCodeRef.current.querySelector('canvas');
            if (canvas) {
                const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((blob) => resolve(blob!));
                });

                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob,
                    }),
                ]);

                toast('QR code copied to clipboard')
            }
        } catch (err) {
            toast('Failed to copy QR code');
        }
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <div
                ref={qrCodeRef}
                className="rounded-lg border shadow-sm p-2 bg-white"
            >
                <QRCodeCanvas
                    value={value}
                    size={size}
                    level={level}
                    includeMargin={includeMargin}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    imageSettings={imageSettings}
                />
            </div>

            {(showDownload || showCopy) && (
                <div className="flex gap-2">
                    {showCopy && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="gap-2 cursor-pointer"
                        >
                            <Copy className="h-4 w-4" />
                            Copy
                        </Button>
                    )}
                    {showDownload && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="gap-2 cursor-pointer"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}