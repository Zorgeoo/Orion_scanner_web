import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import CustomButton from "@/components/common/CustomButton";

const FullscreenScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerState = useRef<'idle' | 'starting' | 'scanning' | 'stopping'>('idle');

  const stopScanner = () => {
    try {
      console.log("Stopping scanner...");
      scannerState.current = 'stopping';
      
      // Stop the code reader if it exists
      if (codeReader.current) {
        // Use try-catch for reset method as it might not be available in all versions
        try {
          (codeReader.current as any).reset?.();
        } catch (resetError) {
          console.log("Reset method not available, continuing with cleanup");
        }
        codeReader.current = null;
      }

      // Stop camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }

      // Additional cleanup for video element
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }

      setIsScanning(false);
      setIsProcessing(false);
      scannerState.current = 'idle';
      console.log("Scanner stopped");
    } catch (err) {
      console.error("Error stopping scanner:", err);
      scannerState.current = 'idle';
    }
  };

  const startScanner = async () => {
    try {
      console.log("Starting scanner...");
      scannerState.current = 'starting';
      setError("");
      setIsProcessing(true);
      
      // Clean up previous scanner state
      stopScanner();

      // Wait to fully release the camera
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Setting isScanning to true");
      setIsScanning(true);
      scannerState.current = 'scanning';

      // Wait for video element to be ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if video element exists
      if (!videoRef.current) {
        console.error("Video element not found");
        setError("Video element not found. Please refresh the page.");
        setIsScanning(false);
        return;
      }

      console.log("Video element found:", videoRef.current);

      // Create a new code reader instance
      codeReader.current = new BrowserMultiFormatReader();

      // List available devices
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      console.log("Available devices:", devices);

      if (!devices || devices.length === 0) {
        setError("No camera devices found. Please check camera permissions.");
        setIsScanning(false);
        return;
      }

      // Find back camera (prefer rear-facing camera)
      let selectedDeviceId = null;
      
      // Look for back camera first
      const backCamera = devices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      
      if (backCamera) {
        selectedDeviceId = backCamera.deviceId;
        console.log("Using back camera:", backCamera.label);
      } else {
        // Fallback to first device if no back camera found
        selectedDeviceId = devices[0]?.deviceId;
        console.log("Using first available camera:", devices[0]?.label);
      }

      if (!selectedDeviceId) {
        setError("No camera device selected.");
        setIsScanning(false);
        return;
      }

      console.log("Selected device ID:", selectedDeviceId);

      console.log("Starting decode from video device...");
      
      // Use a simpler approach - just start the scanner without complex error handling
      codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (res, err) => {
          console.log("Scanner callback:", { hasResult: !!res, hasError: !!err });
          
          if (res) {
            const scannedText = res.getText();
            console.log("Code detected:", scannedText);
            setResult(scannedText);
            stopScanner();
          }
        }
      );

      setIsProcessing(false);
      console.log("Scanner started successfully");

    } catch (err) {
      console.error("Error initializing scanner:", err);
      setError(`Failed to initialize scanner: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsScanning(false);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Request camera permission immediately when component mounts
    const requestPermissionAndStart = async () => {
      try {
        console.log("Requesting camera permission on mount...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment' // Prefer back camera
          } 
        });
        console.log("Camera permission granted");
        // Stop the stream immediately as we just needed permission
        stream.getTracks().forEach(track => track.stop());
        
        // Start the scanner
        await startScanner();
      } catch (err) {
        console.error("Camera permission denied:", err);
        setError("Camera permission denied. Please allow camera access and try again.");
      }
    };

    requestPermissionAndStart();

    return () => {
      stopScanner();
    };
  }, []);

  const handleResetScanner = async () => {
    console.log("Reset button clicked");
    
    // Simple check - only prevent if actively processing
    if (isProcessing) {
      console.log("Scanner is processing, ignoring click");
      return;
    }
    
    console.log("Resetting scanner...");
    setResult("");
    setError("");
    
    // Start scanner directly
    await startScanner();
  };

  const requestCameraPermission = async () => {
    try {
      console.log("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Camera permission granted");
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      // Now try to start the scanner
      await startScanner();
    } catch (err) {
      console.error("Camera permission denied:", err);
      setError("Camera permission denied. Please allow camera access and try again.");
    }
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
        {error && error.includes("camera") ? (
          <CustomButton
            onClick={requestCameraPermission}
            title="Camera Permission Required - Click to Allow"
          />
        ) : (
          <CustomButton
            onClick={handleResetScanner}
            title={
              isProcessing 
                ? "Processing..." 
                : isScanning 
                  ? "Уншиж байна..." 
                  : "Scan Again"
            }
          />
        )}
        
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
