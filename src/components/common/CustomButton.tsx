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
      className={`${color ? color : "bg-orange-400"}`}
      disabled={isLoading}
      onClick={onClick}
      onTouchEnd={(e) => {
        e.currentTarget.blur(); // Remove focus after touch
      }}
    >
      {isLoading ? <Spinner /> : title}
    </Button>
  );
};

export default CustomButton;
