import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import homeIcon from "../assets/OrionIcon.jpg";

const Header = () => {
  // Navigate хийх
  const navigate = useNavigate();

  // Current pathname авахын тулд
  const location = useLocation();

  const isHome = location.pathname === "/";

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
    <nav className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex justify-between items-center px-4 h-16 max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="w-10 h-10">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="
        group flex items-center justify-center w-10 h-10 rounded-xl
        bg-gradient-to-br from-orange-400 to-orange-500
        hover:from-orange-500 hover:to-orange-600
        shadow-md hover:shadow-lg active:scale-95
        transition-all duration-200
      "
            >
              <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Logo/Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <img
            src={homeIcon}
            alt="Home Icon"
            className="h-8 sm:h-12 md:h-14 w-auto object-contain"
          />
        </div>
        <button
          onClick={logOut}
          className="
            group flex items-center justify-center gap-2 px-4 h-10 rounded-xl
            bg-red-50 hover:bg-red-100 border border-red-200
            transition-all duration-200
            hover:shadow-md active:scale-95
          "
        >
          <svg
            className="w-5 h-5 text-red-500 group-hover:rotate-12 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-sm font-medium text-red-600 hidden sm:inline">
            Гарах
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Header;
