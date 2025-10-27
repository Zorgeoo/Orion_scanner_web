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
import CustomButton from "@/components/common/CustomButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const BarcodeScannerButton = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanner = () => {
    if (window.webkit?.messageHandlers?.barcodeScanner) {
      // iOS
      setScannedCode(null);
      setIsScanning(true);
      window.webkit.messageHandlers.barcodeScanner.postMessage("openScanner");
    } else if ((window as any).barcodeScanner) {
      // Android
      setScannedCode(null);
      setIsScanning(true);
      (window as any).barcodeScanner.postMessage("openScanner");
    } else {
      alert("Barcode scanner not available.");
    }
  };

  useEffect(() => {
    window.onBarcodeScanned = (result: string | null) => {
      setIsScanning(false);

      if (result !== null) {
        setScannedCode(result);
      }
    };

    return () => {
      delete window.onBarcodeScanned;
    };
  }, []);

  return (
    <div className="flex flex-row justify-center items-center pt-4">
      <div className="flex flex-col gap-4">
        {/* <Button onClick={startScanner} disabled={isScanning}>
          {isScanning ? <Spinner /> : "Scan barcode"}
        </Button> */}
        <CustomButton
          onClick={startScanner}
          title="Scan barcode"
          isLoading={isScanning}
        />
        <div>
          <Label htmlFor="barcode">Barcode : </Label>
          <Input
            value={scannedCode ?? "No barcode"}
            className="opacity-100 cursor-default border-black"
            id="barcode"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerButton;
