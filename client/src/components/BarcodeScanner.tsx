import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => {
            console.error("Failed to clear scanner", error);
          });
        }
      },
      (errorMessage) => {
        // Just log errors, don't show to user as they happen constantly during scanning
        console.warn(errorMessage);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner during unmount", error);
        });
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[150] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border shadow-2xl rounded-xl w-full max-w-md overflow-hidden relative">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold">Scan Barcode / QR</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <div id="reader" className="w-full"></div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Point your camera at a chemical's barcode or CAS QR code.
          </p>
        </div>
      </div>
    </div>
  );
}
