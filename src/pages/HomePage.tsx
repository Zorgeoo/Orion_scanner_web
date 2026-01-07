import { Link, useLocation } from "react-router-dom";

import HomeSkeleton from "@/components/common/HomeSkeleton";
import { getModules, ModuleModel } from "@/api/services";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserInfo } from "@/context/UserContext";

const HomePage = () => {
  const context = useContext(UserContext);

  if (!context) return null; // fallback if context not provided

  const { userInfo, setUserInfo } = context;

  const location = useLocation();

  const [modules, setModules] = useState<ModuleModel[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // 📥 Setup receiver for user info from native app

    window.setUserInfo = (info: UserInfo) => {
      setUserInfo(info);
      if (info.token) {
        localStorage.setItem("authToken", info.token);
      }
    };

    if (window.webkit?.messageHandlers?.barcodeScanner) {
      window.webkit.messageHandlers.barcodeScanner.postMessage("reactReady");
    }

    // Cleanup
    return () => {
      delete window.setUserInfo;
    };
  }, []);

  useEffect(() => {
    if (!userInfo) return;

    const fetchModules = async () => {
      setIsLoading(true);
      const result = await getModules(
        userInfo.phoneNo,
        userInfo.dbase?.dbName || ""
      );
      setModules(result);
      setIsLoading(false);
    };

    fetchModules();
  }, [userInfo, location.pathname]);
  return (
    <div>
      {isLoading ? (
        <HomeSkeleton />
      ) : (
        modules &&
        modules.length > 0 && (
          <div className="flex flex-col gap-2 w-64 mx-auto pt-16">
            {modules.map(([code, name]) => (
              <Link
                key={code}
                to={
                  code === "toollogo"
                    ? "/toollogo"
                    : code === "product_info"
                    ? "/inventory"
                    : "/"
                }
                className="px-4 py-3 bg-gray-100 rounded hover:bg-gray-200 text-center"
              >
                {name}
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
};
export default HomePage;
