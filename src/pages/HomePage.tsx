import { Link } from "react-router-dom";
import { ModuleModel } from "@/App";
import HomeSkeleton from "@/components/common/HomeSkeleton";

export interface HomePageProps {
  modules: ModuleModel[] | null;
  isLoading: boolean;
}
const HomePage = ({ modules, isLoading }: HomePageProps) => {
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
