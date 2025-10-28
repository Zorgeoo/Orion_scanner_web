import { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  // Sidebar нээсэн эсэх
  const [isOpen, setIsOpen] = useState(false);

  // Logout хийх
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
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="text-orange-400 cursor-pointer hover:text-orange-300 transition-colors"
      >
        <Menu />
      </div>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          color: "white",
          zIndex: 1000,
        }}
        onClick={() => setIsOpen(false)}
        className="flex flex-col justify-center items-center gap-6 px-10 bg-orange-400"
      >
        <Link to="/">
          <div
            className="font-bold text-xl cursor-pointer hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Home
          </div>
        </Link>
        <div
          className="font-bold text-xl cursor-pointer hover:text-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            logOut();
          }}
        >
          Гарах
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
