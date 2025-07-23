import { FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function FavoriteToggleButton() {
  return (
    <Button 
      size="icon" 
      className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary p-2 cursor-pointer"
    >
      <FaHeart className="text-primary" />
    </Button>
  );
}
export default FavoriteToggleButton;
