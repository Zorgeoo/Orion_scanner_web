// import { useRef } from "react";
import { useRef } from "react";
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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    onClick?.();
    setTimeout(() => {
      buttonRef.current?.blur();
    }, 0);
  };

  return (
    <Button
      ref={buttonRef}
      className={`${color ? color : "bg-orange-400"}`}
      disabled={isLoading}
      onClick={handleClick}
      onTouchEnd={() => buttonRef.current?.blur()}
    >
      {isLoading ? <Spinner /> : title}
    </Button>
  );
};

export default CustomButton;
