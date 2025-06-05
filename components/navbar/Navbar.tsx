"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import Container from "../global/Container";
import NavSearch from "./NavSearch";
import {
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiFillHeart,
} from "react-icons/ai";
import { GiWineBottle } from "react-icons/gi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { LuShoppingCart, LuAlignLeft, LuMenu } from "react-icons/lu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";

function Navbar() {
  // temp cart count
  const numItemsInCart = 9;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Container>
        <div className="flex flex-col gap-4 py-4 sm:py-6">
          <div className="flex items-center w-full">
            {/* Mobile: Home + Hamburger, Desktop: All buttons */}
            <div className="flex flex-1 items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
              {/* Home always visible */}
              <NavLinkButton
                href="/"
                label="Home"
                icon={<AiOutlineHome className="w-6 h-6 mr-1" />}
              />
              {/* Desktop buttons */}
              <div className="hidden sm:flex flex-1 items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                <NavLinkButton
                  href="/about"
                  label="About"
                  icon={<AiOutlineInfoCircle className="w-5 h-5 mr-1" />}
                />
                <NavLinkButton
                  href="/products"
                  label="Products"
                  icon={<GiWineBottle className="w-5 h-5 mr-1" />}
                />
                <NavLinkButton
                  href="/favorites"
                  label="Favorites"
                  icon={<AiFillHeart className="w-5 h-5 mr-1" color="black" />}
                />
                <NavLinkButton
                  href="/orders"
                  label="Orders"
                  icon={<HiOutlineShoppingBag className="w-5 h-5 mr-1" />}
                />
                <ModeButton />
                <AllButton />
                <CartNavButton count={numItemsInCart} />
              </div>
              {/* Mobile: Hamburger menu for other buttons */}
              <div className="sm:hidden ml-2">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Open menu"
                    >
                      <LuMenu className="w-6 h-6" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="p-6 flex flex-col gap-4 w-full max-w-xs">
                    <NavLinkButton
                      href="/about"
                      label="About"
                      icon={<AiOutlineInfoCircle className="w-5 h-5 mr-1" />}
                    />
                    <NavLinkButton
                      href="/products"
                      label="Products"
                      icon={<GiWineBottle className="w-5 h-5 mr-1" />}
                    />
                    <NavLinkButton
                      href="/favorites"
                      label="Favorites"
                      icon={
                        <AiFillHeart className="w-5 h-5 mr-1" color="black" />
                      }
                    />
                    <NavLinkButton
                      href="/orders"
                      label="Orders"
                      icon={<HiOutlineShoppingBag className="w-5 h-5 mr-1" />}
                    />
                    <ModeButton />
                    <AllButton />
                    <CartNavButton count={numItemsInCart} />
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
            {/* Search box at far right (desktop only) */}
            <div className="hidden sm:block ml-4 flex-shrink-0 w-[32rem] max-w-full">
              <NavSearch />
            </div>
          </div>
          {/* Mobile search below nav */}
          <div className="block sm:hidden w-full mt-2">
            <NavSearch />
          </div>
        </div>
      </Container>
    </nav>
  );
}

function NavLinkButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="capitalize px-3 py-2 text-base flex items-center"
    >
      <Link href={href} className="flex items-center">
        {icon}
        {label}
      </Link>
    </Button>
  );
}

function CartNavButton({ count }: { count: number }) {
  return (
    <Button
      asChild
      variant="outline"
      className="capitalize px-3 py-2 text-base flex items-center relative"
    >
      <Link href="/cart" className="flex items-center">
        <LuShoppingCart className="w-6 h-6 mr-1" />
        <span>Cart</span>
        <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
          {count}
        </span>
      </Link>
    </Button>
  );
}

function ModeButton() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center px-3 py-2 text-base"
        >
          <span className="relative flex items-center mr-1">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </span>
          <span>Mode</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AllButton() {
  return (
    <Button
      asChild
      variant="outline"
      className="capitalize px-3 py-2 text-base flex items-center"
    >
      <Link href="#" className="flex items-center">
        <LuAlignLeft className="w-6 h-6 mr-1" />
        All
      </Link>
    </Button>
  );
}

export default Navbar;
