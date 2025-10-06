import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const historyStack = useRef<string[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
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
    <nav className="flex items-center justify-between fixed top-0 left-0 w-full bg-orange-400 z-50 p-4">
      {canGoBack ? (
        <button
          onClick={goBack}
          className="text-white text-lg hover:text-blue-300 focus:outline-none"
          aria-label="Go back"
        >
          ← Back
        </button>
      ) : (
        <div className="w-16" /> // Placeholder to keep layout consistent
      )}
      <h1 className="text-xl font-semibold">Orion systems</h1>
      <div className="w-16" />{" "}
      {/* balance the back button or keep empty space */}
    </nav>
  );
};

export default Header;
