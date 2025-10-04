import CustomButton from "@/components/common/CustomButton";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="">
      <div className="flex flex-col gap-4 items-center pt-16">
        <Link to="/inventory">
          <CustomButton title="Бараа тооллого" />
        </Link>
        <Link to="/inventory">
          <CustomButton title="Бараа захиалга" />
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
