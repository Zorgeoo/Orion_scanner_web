import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const FullscreenScanner = () => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const selectedDeviceId = useRef(null);
  const [result, setResult] = useState("");

  // Stop scanner and camera stream
  const stopScannerAndCamera = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Start scanning with back camera
  const startScanner = async () => {
    try {
      if (!selectedDeviceId.current) {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();

        const backCamera = devices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("environment")
        );

        selectedDeviceId.current = backCamera
          ? backCamera.deviceId
          : devices[0]?.deviceId;
      }

      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }

      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId.current,
        videoRef.current,
        (res, err) => {
          if (res) {
            setResult(res.getText());

            // Stop scanning and camera after one successful scan
            stopScannerAndCamera();
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        }
      );
    } catch (err) {
      console.error("Error initializing scanner:", err);
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      stopScannerAndCamera();
    };
  }, []);

  const handleResetScanner = () => {
    setResult("");
    stopScannerAndCamera();

    // Small delay to ensure cleanup before restarting scanner
    setTimeout(() => {
      startScanner();
    }, 300);
  };

  return (
    <div style={styles.container}>
      {result === "" && (
        <video
          ref={videoRef}
          style={styles.video}
          muted
          autoPlay
          playsInline
          controls={false}
        />
      )}
      <button onClick={handleResetScanner} style={styles.button}>
        Scan again
      </button>
      <div style={styles.resultText}>
        Result: {result !== "" ? result : "Not found"}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    flexDirection: "column",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  button: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: "10px 20px",
    fontSize: "1em",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff6600",
    color: "white",
    cursor: "pointer",
    zIndex: 10001,
  },
  resultText: {
    position: "absolute",
    bottom: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#0f0",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "1.2em",
    zIndex: 10000,
  },
};

export default FullscreenScanner;
