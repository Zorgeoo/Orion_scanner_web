import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface CustomButtonProps {
  title: string;
  color?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const CustomButton = ({
  title,
  onClick,
  color,
  isLoading,
}: CustomButtonProps) => {
  return (
    <Button
      className={`${color ? `w-full ${color}` : "bg-orange-400"}`}
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? <Spinner className="w-full" /> : title}
    </Button>
  );
};

export default CustomButton;
