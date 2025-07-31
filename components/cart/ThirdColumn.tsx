"use client";
import { useState } from "react";
import SelectProductAmount from "../single-product/SelectProductAmount";
import { Mode } from "../single-product/SelectProductAmount";
import FormContainer from "../form/FormContainer";
import { SubmitButton } from "../form/Buttons";
import { removeCartItemAction, updateCartItemAction } from "@/utils/actions";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

function ThirdColumn({ 
  quantity, 
  id, 
  onCartUpdate 
}: { 
  quantity: number; 
  id: string;
  onCartUpdate: () => void;
}) {
  const [amount, setAmount] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAmountChange = async (value: number) => {
    setIsLoading(true);
    toast("Calculating...");
    const result = await updateCartItemAction({
      amount: value,
      cartItemId: id,
    });
    setAmount(value);
    toast(result.message || "Cart updated");
    onCartUpdate(); // Refresh cart data
    setIsLoading(false);
  };

  const handleRemove = async (prevState: any, formData: FormData) => {
    const result = await removeCartItemAction(prevState, formData);
    if (result.message) {
      onCartUpdate(); // Refresh cart data after removal
    }
    return result; // Return the result so FormContainer can handle it
  };

  return (
    <div className="md:ml-8">
      <SelectProductAmount
        amount={amount}
        setAmount={handleAmountChange}
        mode={Mode.CartItem}
        isLoading={isLoading}
      />
      <FormContainer action={handleRemove}>
        <input type="hidden" name="id" value={id} />
        <SubmitButton size="sm" className="mt-4" text="remove" />
      </FormContainer>
    </div>
  );
}

export default ThirdColumn;