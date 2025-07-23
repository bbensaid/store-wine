import { Button } from "../ui/button";

function AddToCart() {
  return (
    <Button 
      className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary capitalize mt-8" 
      size="lg"
    >
      add to cart
    </Button>
  );
}
export default AddToCart;
