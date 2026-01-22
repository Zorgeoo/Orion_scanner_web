import { Link, useLocation } from "react-router-dom";

import HomeSkeleton from "@/components/common/HomeSkeleton";
import { getModules } from "@/api/services";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { ModuleModel } from "@/types/ModuleModel";
import { showToast } from "@/utils/toast";

const HomePage = () => {
  const context = useContext(UserContext);

  if (!context) return null;

  const { userInfo } = context;

  const location = useLocation();

  const [modules, setModules] = useState<ModuleModel[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchModules = async () => {
    if (!userInfo) return;

    try {
      setIsLoading(true);

      const result = await getModules(
        userInfo.phoneNo,
        userInfo.dbase?.dbName || ""
      );

      setModules(result);
    } catch (e) {
      showToast.error("Модулууд авахад алдаа гарлаа");
      setModules(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.onLine && userInfo) {
      fetchModules();
    }
  }, [userInfo, location.pathname]);

  useEffect(() => {
    const onAppOnline = () => {
      if (!userInfo) return;
      fetchModules();
    };

    window.addEventListener("app:online", onAppOnline);

    return () => {
      window.removeEventListener("app:online", onAppOnline);
    };
  }, [userInfo]);

  return (
    <div>
      {isLoading ? (
        <HomeSkeleton />
      ) : (
        modules &&
        modules.length > 0 && (
          <div className="flex flex-col gap-2 w-64 mx-auto pt-16">
            {modules.map((module, index) => {
              const isDisabled = module.code === "amar_zahialga";
              if (!isDisabled) {
                return (
                  <Link
                    key={index}
                    to={
                      module.code === "toollogo"
                        ? "/toollogo"
                        : module.code === "product_info"
                        ? "/inventory"
                        : "/"
                    }
                    className={`w-full px-6 py-4 font-semibold rounded-2xl shadow-md text-center transition-all duration-300 relative
bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white
      `}
                  >
                    {module.name}
                  </Link>
                );
              }
            })}
          </div>
        )
      )}
    </div>
  );
};
export default HomePage;
