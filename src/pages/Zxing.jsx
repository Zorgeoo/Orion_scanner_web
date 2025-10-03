import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const FullscreenScanner = () => {
  const videoRef = useRef(null);
  const [result, setResult] = useState("Not Found");
  const codeReader = useRef(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const selectedDeviceId = devices[0]?.deviceId;

        codeReader.current = new BrowserMultiFormatReader();

        codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (res, err) => {
            if (res) {
              const text = res.getText();
              setResult(text);

              // Send to native app
              if (window.webkit?.messageHandlers?.scanner) {
                window.webkit.messageHandlers.scanner.postMessage(text);
              } else if (window.Android?.scanner) {
                window.Android.scanner(text);
              }

              // Stop scanner after successful scan
              codeReader.current.reset();
            }
          }
        );
      } catch (err) {
        console.error("Error initializing scanner:", err);
      }
    };

    startScanner();

    return () => {
      codeReader.current?.reset();
    };
  }, []);

  return (
    <div style={styles.container}>
      <video ref={videoRef} style={styles.video} muted autoPlay playsInline />
      <div style={styles.overlayText}>Scanning...</div>
      <div style={styles.resultText}>Result: {result}</div>
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
  overlayText: {
    position: "absolute",
    top: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    fontSize: "1.5em",
    fontWeight: "bold",
    zIndex: 10000,
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
