import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const FullscreenScanner = () => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const [result, setResult] = useState("");

  const startScanner = async () => {
    try {
      // Clean up existing reader before starting new one
      if (codeReader.current) {
        await codeReader.current.reset();
        codeReader.current = null;
      }

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const selectedDeviceId = devices[0]?.deviceId;

      codeReader.current = new BrowserMultiFormatReader();

      codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (res, err) => {
          if (res) {
            setResult(res.getText());
            // Stop scanning after first successful scan
            codeReader.current.reset();
            codeReader.current = null; // release reference
          }
          // You could handle err here if needed
        }
      );
    } catch (err) {
      console.error("Error initializing scanner:", err);
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      codeReader.current?.reset();
      codeReader.current = null;
    };
  }, []);

  const handleResetScanner = () => {
    setResult("");
    startScanner();
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
      <button onClick={handleResetScanner}>Scan again</button>
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
