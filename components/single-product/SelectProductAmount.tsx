import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

export enum Mode {
  SingleProduct = "singleProduct",
  CartItem = "cartItem",
}

type SelectProductAmountProps = {
  mode: Mode.SingleProduct;
  amount: number;
  setAmount: (value: number) => void;
};

type SelectCartItemAmountProps = {
  mode: Mode.CartItem;
  amount: number;
  setAmount: (value: number) => Promise<void>;
  isLoading: boolean;
};

function SelectProductAmount(
  props: SelectProductAmountProps | SelectCartItemAmountProps
) {
  const { mode, amount, setAmount } = props;

  const cartItem = mode === Mode.CartItem;
  const isLoading = cartItem ? props.isLoading : false;

  const handleDecrease = () => {
    if (amount > 1 && !isLoading) {
      setAmount(amount - 1);
    }
  };

  const handleIncrease = () => {
    if (!isLoading) {
      const maxAmount = cartItem ? amount + 10 : 10;
      if (amount < maxAmount) {
        setAmount(amount + 1);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && !isLoading) {
      const maxAmount = cartItem ? Math.max(amount + 10, value) : 10;
      const clampedValue = Math.min(Math.max(1, value), maxAmount);
      setAmount(clampedValue);
    }
  };

  return (
    <>
      <h4 className="mb-2">Amount : </h4>
      <div className="flex items-center space-x-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-md border border-primary/20 hover:bg-primary/10 hover:border-primary/40 disabled:opacity-50"
          onClick={handleDecrease}
          disabled={amount <= 1 || isLoading}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <Input
          type="number"
          value={amount}
          onChange={handleInputChange}
          disabled={isLoading}
          className="h-8 w-16 text-center border border-primary/20 focus:border-primary/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min="1"
          max={cartItem ? amount + 10 : 10}
        />
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-md border border-primary/20 hover:bg-primary/10 hover:border-primary/40 disabled:opacity-50"
          onClick={handleIncrease}
          disabled={isLoading}
          aria-label="Increase quantity"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </>
  );
}

export default SelectProductAmount;