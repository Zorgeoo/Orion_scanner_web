import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "./common/CustomButton";
import Sidebar from "./Sidebar";

const Header = () => {
  const navigate = useNavigate();
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
    <nav className="flex items-center justify-between fixed top-0 left-0 w-full z-50 p-4">
      <CustomButton
        color={`${canGoBack ? "visible" : "invisible"}`}
        onClick={goBack}
        title="Буцах"
      />
      <h1 className="text-xl font-semibold text-orange-400">Orion systems</h1>
      <Sidebar />
      {/* 
      <CustomButton
        color="bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
        onClick={logOut}
        title="Гарах"
      /> */}
    </nav>
  );
};

export default Header;
