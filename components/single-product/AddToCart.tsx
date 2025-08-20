"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { ProductSignInButton } from "../form/Buttons";
import { toast } from "sonner";
import { addToCartAction } from "@/app/actions";
import { updateCartQuantityAction } from "@/app/actions";

function AddToCart({ wineId }: { wineId: string }) {
  const [amount, setAmount] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if wine is already in cart and get current quantity
  useEffect(() => {
    if (!userId || !mounted) return;

    const checkCartStatus = async () => {
      try {
        const response = await fetch(`/api/cart-items?wineId=${wineId}`);
        const data = await response.json();

        if (data.inCart) {
          setIsInCart(true);
          setAmount(data.amount || 1);
        }
      } catch (error) {
        console.error("Error checking cart status:", error);
      }
    };

    checkCartStatus();
  }, [wineId, userId, mounted]);

  const handleDecrease = () => {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  };

  const handleIncrease = () => {
    if (amount < 10) {
      setAmount(amount + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 10) {
      setAmount(value);
    }
  };

  // Handle adding/updating cart
  const handleCartAction = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("wineId", wineId);
      formData.append("amount", amount.toString());
      formData.append("userId", userId);

      let result;
      if (isInCart) {
        // Update existing cart item
        result = await updateCartQuantityAction(formData);
      } else {
        // Add new item to cart
        result = await addToCartAction(formData);
      }

      if (result.message && result.message.includes("successfully")) {
        toast(result.message);
        setIsInCart(true);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        toast(result.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error in cart action:", error);
      toast("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing item completely from cart
  const handleRemoveFromCart = async () => {
    try {
      const response = await fetch("/api/cart-items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wineId }),
      });

      if (response.ok) {
        setIsInCart(false);
        setAmount(1);
        toast("Item removed from cart");
        // Trigger cart refresh
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast("Failed to remove item");
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-6 w-6 p-0 rounded border border-primary/20 hover:bg-primary/10"
        onClick={handleDecrease}
        disabled={amount <= 1}
      >
        <Minus className="h-3 w-3" />
      </Button>

      <Input
        type="number"
        value={amount}
        onChange={handleInputChange}
        className="h-6 w-12 text-center text-xs border border-primary/20 focus:border-primary/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min="1"
        max="10"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-6 w-6 p-0 rounded border border-primary/20 hover:bg-primary/10"
        onClick={handleIncrease}
        disabled={amount >= 10}
      >
        <Plus className="h-3 w-3" />
      </Button>

      {mounted && userId ? (
        <div className="flex space-x-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={`h-6 px-2 text-xs ${
              isInCart
                ? "bg-blue-200 hover:bg-blue-300 text-blue-800 border-blue-300"
                : "bg-yellow-200 hover:bg-yellow-300 text-yellow-800 border-yellow-300"
            }`}
            onClick={handleCartAction}
            disabled={isLoading}
          >
            {isLoading
              ? "Loading..."
              : isInCart
              ? "Update Cart"
              : "Add to Cart"}
          </Button>

          {isInCart && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs bg-red-200 hover:bg-red-300 text-red-800 border-red-300"
              onClick={handleRemoveFromCart}
              disabled={isLoading}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : mounted && !userId ? (
        <ProductSignInButton />
      ) : (
        // Show loading state during hydration
        <div className="h-6 px-2 text-xs bg-gray-200 text-gray-500 border border-gray-300 rounded">
          Loading...
        </div>
      )}
    </div>
  );
}

export default AddToCart;
