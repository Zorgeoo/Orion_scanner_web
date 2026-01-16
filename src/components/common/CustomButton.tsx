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
      className={`relative ${color ?? "bg-orange-400"}
    disabled:opacity-100
    active:opacity-100
    focus-visible:outline-none
    focus-visible:ring-0
    [-webkit-tap-highlight-color:transparent]
  `}
      disabled={isLoading}
      onClick={onClick}
    >
      <span className={isLoading ? "invisible" : "visible"}>{title}</span>

      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className="text-white" />
        </span>
      )}
    </Button>
  );
  //   <Button
  //     disabled={isLoading}
  //     onClick={onClick}
  //     className={`relative ${color ?? "bg-orange-400"}
  //   active:opacity-100
  //   focus-visible:outline-none
  //   focus-visible:ring-0
  //   [-webkit-tap-highlight-color:transparent]
  // `}
  //   >
  //     <span className={isLoading ? "invisible" : "visible"}>{title}</span>

  //     {/* Spinner (overlayed) */}
  //     {isLoading && (
  //       <span className="absolute inset-0 flex items-center justify-center">
  //         <Spinner className="text-white" />
  //       </span>
  //     )}
  //   </Button>
  // );
};

export default CustomButton;
