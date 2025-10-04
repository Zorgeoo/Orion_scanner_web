import { Button } from "../ui/button";

interface CustomButtonProps {
  title: String;
  onClick?: () => void;
}

const CustomButton = ({ title, onClick }: CustomButtonProps) => {
  return <Button onClick={onClick}>{title}</Button>;
};

export default CustomButton;
