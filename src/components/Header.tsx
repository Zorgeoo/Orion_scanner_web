import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ArrowLeft } from "lucide-react";

const Header = () => {
  // Navigate хийх
  const navigate = useNavigate();

  // Current pathname авахын тулд
  const location = useLocation();

  const historyStack = useRef<string[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Current Pathname avj baina ex : /inventory
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

  return (
    <nav className="flex justify-between fixed top-0 left-0 w-full z-50 px-4 pt-safe-header h-[64px] bg-white">
      <div
        onClick={goBack}
        className={`${
          canGoBack ? "visible" : "invisible"
        } text-orange-400 cursor-pointer hover:text-orange-300 transition-colors`}
      >
        <ArrowLeft />
      </div>
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-orange-400">
        Orion systems
      </h1>
      <Sidebar />
    </nav>
  );
};

export default Header;
