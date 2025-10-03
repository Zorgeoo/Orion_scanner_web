import { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
const ScanPage = () => {
  const [data, setData] = useState("Not Found");

  const handleScan = (err, result) => {
    if (result) {
      setData(result.text);
      print(result.text);
      // Optional: send scanned value to native WebView
      if (window.webkit?.messageHandlers?.scanner) {
        window.webkit.messageHandlers.scanner.postMessage(result.text);
      } else if (window.Android?.scanner) {
        window.Android.scanner(result.text);
      }
    }
  };

  return (
    <>
      <BarcodeScanner width={300} height={300} onUpdate={handleScan} />
      <p>Scanned: {data}</p>
    </>
  );
};
export default ScanPage;
