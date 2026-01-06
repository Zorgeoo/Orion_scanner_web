import CustomButton from "@/components/common/CustomButton";
import { Link } from "react-router-dom";
import { UserInfo } from "@/App";
export interface HomePageProps {
  userInfo: UserInfo | null;
  count: number;
  error: string;
  token: boolean;
  getModules: () => void;
}
const HomePage = ({
  userInfo,
  count,
  error,
  token,
  getModules,
}: HomePageProps) => {
  return (
    <div className="">
      <div className="flex flex-col gap-4 items-center pt-16">
        <div className="text-black">{userInfo?.phoneNo ?? "no phoneNo"}</div>
        <div>{count}</div>
        <div>{error}</div>
        <div>{token ? "token setelsen" : "setleegui"}</div>
        <Link to="/inventory">
          <CustomButton title="Бар тооллого" />
        </Link>
        <Link to="/inventory">
          <CustomButton title="Бараа захиалга" />
        </Link>
        <Link to="/toollogo">
          <CustomButton title="Тооллого хийх" />
        </Link>
        <button onClick={getModules}>Get modules</button>
      </div>
    </div>
  );
};
export default HomePage;
