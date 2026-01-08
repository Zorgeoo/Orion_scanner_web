import CustomButton from "@/components/common/CustomButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserInfo } from "@/context/UserContext";
import { AlertCircle, CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";

const BarcodeScannerButton = () => {
  // Scan хийж байгаа эсэх
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Scan хийгдсэн код
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  // Барааны тоо ширхэг
  const [quantity, setQuantity] = useState<number | null>(null);

  // Message or error
  const [message, setMessage] = useState<string | null>(null);

  // Амжилттай бүртгэгдсэн эсэх
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Scan хийх
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

  // Бүртгэх
  const order = () => {
    setMessage(null);
    setIsSuccess(false);

    if (!scannedCode && !quantity) {
      return setMessage("Талбаруудыг бөглөнө үү");
    }

    if (!scannedCode) {
      return setMessage("Бараа уншуулна уу");
    }

    if (!quantity || quantity <= 0) {
      return setMessage("Тоо ширхэг бөглөнө үү");
    }

    setMessage("Амжилттай");
    setIsSuccess(true);
    setScannedCode(null);
    setQuantity(null);
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
            value={scannedCode ?? "Бараа уншуулна уу"}
            className="opacity-100 cursor-default border-black"
            id="barcode"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="quantity">Тоо ширхэг : </Label>
          <Input
            placeholder="Ширхэг оруулна уу"
            id="quantity"
            type="text"
            inputMode="numeric"
            min={1}
            value={quantity ? quantity : ""}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
            }}
          />
        </div>
        {message != null && (
          <div
            className={`flex items-center gap-2 border text-sm rounded-lg p-3 mt-2
               ${
                 isSuccess
                   ? "bg-green-50 border-green-200 text-green-600"
                   : "bg-red-50  border-red-200 text-red-600"
               }`}
          >
            {isSuccess ? (
              <CircleCheck className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}
        <CustomButton onClick={order} title="Бүртгэх" />
      </div>
    </div>
  );
};

export default BarcodeScannerButton;
