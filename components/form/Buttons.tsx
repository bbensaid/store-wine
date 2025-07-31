"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { SignInButton } from "@clerk/nextjs";

type btnSize = "default" | "lg" | "sm";

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

export function SubmitButton({
  className = "",
  text = "submit",
  size = "lg",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn("flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary capitalize", className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin text-primary" />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

export const ProductSignInButton = () => {
  return (
    <SignInButton mode="modal">
      <Button type="button" size="default" className="mt-8">
        Please Sign In
      </Button>
    </SignInButton>
  );
};

export const CardSignInButton = () => {
  return (
    <Button
      type="button"
      size="icon"
      className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary p-2 cursor-pointer opacity-50"
      disabled
    >
      <FaRegHeart className="text-primary" />
    </Button>
  );
};

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary p-2 cursor-pointer"
    >
      {pending ? (
        <ReloadIcon className="animate-spin text-primary" />
      ) : isFavorite ? (
        <FaHeart className="text-primary" />
      ) : (
        <FaRegHeart className="text-primary" />
      )}
    </Button>
  );
}; 