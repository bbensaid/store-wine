"use client";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import NavSearch from "./NavSearch";
import CartButton from "./CartButton";
import DarkMode from "./DarkMode";
import LinksDropdown from "./LinksDropdown";

export default function MobileMenu() {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <button
          aria-label="Open menu"
          className="p-2 rounded-md border bg-background"
        >
          <Menu className="w-6 h-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="p-6 flex flex-col gap-6 w-full max-w-xs">
        <div className="flex flex-col gap-4">
          <NavSearch />
          <CartButton />
          <DarkMode />
          <LinksDropdown />
        </div>
        <DrawerClose asChild>
          <button className="mt-8 p-2 rounded-md border bg-background">
            Close
          </button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
