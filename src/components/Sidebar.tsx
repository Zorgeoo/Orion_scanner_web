import { useState } from "react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logOut = () => {
    if (window.webkit?.messageHandlers?.barcodeScanner) {
      // iOS
      window.webkit.messageHandlers.barcodeScanner.postMessage("logOutRequest");
    } else if ((window as any).barcodeScanner) {
      // Android
      (window as any).barcodeScanner.postMessage("logOutRequest");
    } else {
      alert("It is not mobile device");
    }
  };
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 120,
          height: "100%",
          backgroundColor: "#333",
          color: "white",
          padding: 20,
          zIndex: 1000,
        }}
      >
        <h2>Menu</h2>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li onClick={logOut}>Log Out</li>
        </ul>
      </motion.div>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 900,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
