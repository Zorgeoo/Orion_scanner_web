import { Button } from "../ui/button";

interface CustomButtonProps {
  title: string;
  color?: string;
  onClick?: () => void;
}

const CustomButton = ({ title, onClick, color }: CustomButtonProps) => {
  return (
    <Button className={`${color ? color : ""}`} onClick={onClick}>
      {title}
    </Button>
  );
};

export default CustomButton;
