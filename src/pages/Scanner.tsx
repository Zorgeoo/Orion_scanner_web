import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import CustomButton from "@/components/common/CustomButton";

const FullscreenScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const stopScanner = () => {
    try {
      console.log("Stopping scanner...");
      
      // Stop the code reader if it exists
      if (codeReader.current) {
        try {
          (codeReader.current as any).reset?.();
        } catch (resetError) {
          console.log("Reset method not available");
        }
        codeReader.current = null;
      }

      // Stop camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      setIsScanning(false);
      console.log("Scanner stopped");
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  const startScanner = async () => {
    try {
      console.log("Starting scanner...");
      setError("");
      
      // Stop previous scanner
      stopScanner();
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 300));

      setIsScanning(true);

      // Create new code reader
      codeReader.current = new BrowserMultiFormatReader();

      // Get devices
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      
      if (!devices || devices.length === 0) {
        setError("No camera found. Please check permissions.");
        setIsScanning(false);
        return;
      }

      // Use first available camera
      const deviceId = devices[0].deviceId;
      console.log("Using camera:", devices[0].label);

      // Start scanning
      if (videoRef.current) {
        codeReader.current.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result) => {
            if (result) {
              console.log("Code found:", result.getText());
              setResult(result.getText());
              stopScanner();
            }
          }
        );
      }

      console.log("Scanner started");

    } catch (err) {
      console.error("Scanner error:", err);
      setError("Failed to start scanner");
      setIsScanning(false);
    }
  };

  useEffect(() => {
    // Start scanner on mount
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const handleResetScanner = () => {
    console.log("Reset button clicked");
    setResult("");
    setError("");
    startScanner();
  };


  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black flex flex-col justify-center items-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        ref={videoRef}
        muted
        autoPlay
        playsInline
        controls={false}
        style={{ display: isScanning ? 'block' : 'none' }}
      />
      
      {/* Overlay with scanning indicator */}
      {isScanning && (
        <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded z-20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>Camera active - Scanning for codes...</span>
          </div>
        </div>
      )}

      {/* Overlay when not scanning */}
      {!isScanning && result === "" && (
        <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded z-20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Camera stopped - Click button to scan</span>
          </div>
        </div>
      )}

      <div className="z-10 flex flex-col items-center gap-4">
        <CustomButton
          onClick={handleResetScanner}
          title={isScanning ? "Scanning..." : "Scan Again"}
        />
        
        {error && (
          <div className="text-red-400 text-center max-w-sm">
            Error: {error}
          </div>
        )}
        
        <div className="text-white text-center max-w-sm">
          {result !== "" ? (
            <div>
              <div className="text-green-400 font-bold">Scan Complete:</div>
              <div className="break-all bg-green-900 bg-opacity-30 p-2 rounded mt-2">{result}</div>
              <div className="text-gray-400 text-sm mt-2">Click "Дахин уншуулах" to scan again</div>
            </div>
          ) : (
            <div className="text-gray-400">No code detected yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullscreenScanner;
