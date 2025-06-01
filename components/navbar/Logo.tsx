import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { DiDotnet } from "react-icons/di";

function Logo() {
  return (
    <Button
      size="icon"
      asChild
      // variant="default"
      className="rounded-md p-3 sm:p-4 transition-colors"

      // temp - wait to see what 'theme' does !
      // className="bg-gray-300 hover:bg-gray-400 rounded-md p-5 transition-colors"
    >
      <Link href="/">
        <DiDotnet className="w-12 h-6 sm:w-16 sm:h-8 text-white" />
      </Link>
    </Button>
  );
}

export default Logo;
