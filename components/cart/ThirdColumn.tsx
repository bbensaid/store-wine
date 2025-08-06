"use client";
import { useState } from "react";
import SelectProductAmount from "../single-product/SelectProductAmount";
import { Mode } from "../single-product/SelectProductAmount";
import FormContainer from "../form/FormContainer";
import { SubmitButton } from "../form/Buttons";
import { removeCartItemAction, updateCartItemAction } from "@/utils/actions";
import { toast } from "sonner";


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

  const handleRemove = async (prevState: { message?: string }, formData: FormData) => {
    const result = await removeCartItemAction(prevState, formData);
    if (result.message) {
      onCartUpdate(); // Refresh cart data after removal
    }
    // Ensure we always return a message for FormContainer
    return { message: result.message || result.error || "Action completed" };
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