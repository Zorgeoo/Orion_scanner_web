declare global {
  interface Window {
    webkit?: {
      messageHandlers: {
        barcodeScanner: {
          postMessage: (message: string) => void;
        };
      };
    };
    onBarcodeScanned?: (result: string) => void;
  }
}
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const BarcodeScannerButton = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const startScanner = () => {
    if (window.webkit?.messageHandlers?.barcodeScanner) {
      window.webkit.messageHandlers.barcodeScanner.postMessage("openScanner");
    } else {
      alert("Barcode scanner not available.");
    }
  };

  useEffect(() => {
    window.onBarcodeScanned = (result: string) => {
      setScannedCode(result);
    };

    return () => {
      delete window.onBarcodeScanned;
    };
  }, []);

  return (
    <div className="flex flex-row justify-center items-center pt-4">
      <Button onClick={startScanner}>Scan Barcode</Button>
      {scannedCode && <p>Scanned Code: {scannedCode}</p>}
    </div>
  );
};

export default BarcodeScannerButton;
