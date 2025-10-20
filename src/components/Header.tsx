import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "./common/CustomButton";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const historyStack = useRef<string[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Pathname avj baina ex : /inventory
    const currentPath = location.pathname;

    // Push current path if different from last in stack
    if (historyStack.current[historyStack.current.length - 1] !== currentPath) {
      historyStack.current.push(currentPath);
    }

    // Update whether back button should be shown
    setCanGoBack(historyStack.current.length > 1);
  }, [location]);

  const goBack = () => {
    if (historyStack.current.length > 1) {
      // Remove current page
      historyStack.current.pop();
      const previousPath =
        historyStack.current[historyStack.current.length - 1];
      if (previousPath) {
        navigate(previousPath);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

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
    <nav className="flex items-center justify-between fixed top-0 left-0 w-full bg-orange-400 z-50 p-4">
      {canGoBack ? (
        // <button
        //   onClick={goBack}
        //   className="text-black text-lg hover:text-white focus:outline-none"
        //   aria-label="Go back"
        // >
        //   ← Буцах
        // </button>
        <CustomButton onClick={goBack} title="Буцах"></CustomButton>
      ) : (
        <div className="w-16" /> // Placeholder to keep layout consistent
      )}
      <h1 className="text-xl font-semibold">Orion systems</h1>
      <CustomButton
        color="bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
        onClick={logOut}
        title="Гарах"
      ></CustomButton>
      {/* <div className="w-16" />{" "} */}
      {/* balance the back button or keep empty space */}
    </nav>
  );
};

export default Header;
