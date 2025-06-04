import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";

function Logo() {
  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="flex justify-center items-center relative px-3 py-2 text-base"
    >
      <Link href="/" className="flex items-center">
        <AiOutlineHome className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-1" />
        <span className="hidden sm:inline">Home</span>
      </Link>
    </Button>
  );
}

export default Logo;
