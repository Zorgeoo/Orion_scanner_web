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
    // <nav className="flex justify-between fixed top-0 left-0 w-full z-40 px-4 pt-safe-header h-[64px] bg-white">
    //   <div
    //     onClick={goBack}
    //     className={`${
    //       canGoBack ? "visible" : "invisible"
    //     } text-orange-400 cursor-pointer hover:text-orange-300 transition-colors`}
    //   >
    //     <ArrowLeft />
    //   </div>
    //   <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-orange-400">
    //     Orion systems
    //   </h1>
    //   <Sidebar />
    // </nav>
    <nav className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex justify-between items-center px-4 h-16 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`
            group flex items-center justify-center w-10 h-10 rounded-xl
            transition-all duration-200
            ${
              canGoBack
                ? "bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg active:scale-95"
                : "opacity-0 pointer-events-none"
            }
          `}
        >
          <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Logo/Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Orion
          </h1>
        </div>
        <Sidebar />
      </div>
    </nav>
  );
};

export default Header;
