import CustomButton from "@/components/common/CustomButton";
import { Link } from "react-router-dom";
import { BarcodeScannerButtonProps } from "./Scanner";

const HomePage = ({ userInfo }: BarcodeScannerButtonProps) => {
  return (
    <div className="">
      <div className="flex flex-col gap-4 items-center pt-16">
        <div className="text-black">{userInfo?.username ?? "no dbase"}</div>
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
