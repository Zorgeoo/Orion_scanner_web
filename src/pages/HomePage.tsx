import CustomButton from "@/components/common/CustomButton";
import { Link } from "react-router-dom";
import { UserInfo } from "@/App";
export interface HomePageProps {
  userInfo: UserInfo | null;
  count: number;
  error: string;
  token: boolean;
}
const HomePage = ({ userInfo, count, error, token }: HomePageProps) => {
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
      </div>
    </div>
  );
};
export default HomePage;
