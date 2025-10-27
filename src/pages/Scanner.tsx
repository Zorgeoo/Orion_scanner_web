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
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const BarcodeScannerButton = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

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

  const order = () => {
    setErrorMessage(null);
    if (scannedCode != null && quantity > 0) {
      alert("Success");
    } else if (scannedCode != null) {
      setErrorMessage("Тоо ширхэг бөглөнө үү");
    } else if (quantity > 0) {
      setErrorMessage("Бараа уншуулна уу");
    } else {
      setErrorMessage("Талбаруудыг бөглөнө үү");
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
        <CustomButton
          onClick={startScanner}
          title="Scan barcode"
          isLoading={isScanning}
        />
        <div>
          <Label htmlFor="barcode">Код : </Label>
          <Input
            value={scannedCode ?? "No barcode"}
            className="opacity-100 cursor-default border-black"
            id="barcode"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="quantity">Тоо ширхэг : </Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        {errorMessage != null && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mt-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        <CustomButton onClick={order} title="Бүртгэх" />
      </div>
    </div>
  );
};

export default BarcodeScannerButton;
