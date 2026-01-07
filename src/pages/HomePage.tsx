import CustomButton from "@/components/common/CustomButton";
import { Link } from "react-router-dom";
import { ModuleModel, UserInfo } from "@/App";

export interface HomePageProps {
  modules: ModuleModel[] | null;
}
const HomePage = ({ modules }: HomePageProps) => {
  return (
    <div className="">
      <div className="flex flex-col gap-4 items-center pt-16">
        <Link to="/inventory">
          <CustomButton title="Бар тооллого" />
        </Link>
        <Link to="/inventory">
          <CustomButton title="Бараа захиалга" />
        </Link>
        <Link to="/toollogo">
          <CustomButton title="Тооллого хийх" />
        </Link>
        {modules && modules.length > 0 && (
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
        )}
      </div>
    </div>
  );
};
export default HomePage;
