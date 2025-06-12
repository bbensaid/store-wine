"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import Container from "../global/Container";
import NavSearch from "./NavSearch";
import { AiOutlineInfoCircle, AiFillHeart } from "react-icons/ai";
import { GiWineBottle } from "react-icons/gi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { LuShoppingCart, LuMenu } from "react-icons/lu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import LinksDropdown from "./LinksDropdown";
import { Cinzel, Cormorant_Garamond } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
  style: ["italic"],
});

function Navbar() {
  // temp cart count
  const numItemsInCart = 9;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Container>
        <div className="flex flex-col gap-4 py-2 sm:py-3">
          <div className="flex items-center w-full justify-between">
            {/* Left: Logo + Search */}
            <div className="flex items-center flex-shrink-0 gap-2 sm:gap-4">
              <Link
                href="/"
                className="flex flex-col items-center justify-center"
              >
                <img
                  src="/images/logo.png"
                  alt="Wine Store Logo"
                  className="h-12 md:h-14 w-auto max-h-[3.5rem]"
                />
                <span
                  className={`${cinzel.className} text-xl font-semibold tracking-widest text-[#8B0015] mt-1`}
                >
                  VINEFOX
                </span>
                <span
                  className={`${cormorant.className} text-xs md:text-sm text-[#8B0015] mt-1 text-center`}
                >
                  Discover. Share. Savor the rare.
                </span>
              </Link>
              <div className="hidden sm:block ml-2 flex-shrink-0 w-64">
                <NavSearch />
              </div>
            </div>
            {/* Right: Nav links + Menu + Cart */}
            <div className="flex items-center gap-4">
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
              <LinksDropdown />
              <CartNavButton count={numItemsInCart} />
            </div>
            {/* Mobile: Hamburger menu for other buttons */}
            <div className="sm:hidden ml-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Open menu">
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
                  <LinksDropdown />
                  <CartNavButton count={numItemsInCart} />
                </DrawerContent>
              </Drawer>
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
  className = "",
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className={`capitalize px-3 py-2 md:px-4 md:py-2 text-base md:text-lg flex items-center ${className}`}
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
      className="capitalize px-3 py-2 md:px-4 md:py-2 text-base md:text-lg flex items-center relative"
    >
      <Link href="/cart" className="flex items-center">
        <LuShoppingCart className="w-6 h-6 mr-1" />
        <span>Cart</span>
        <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs md:h-6 md:w-6 md:text-sm">
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
          className="flex items-center px-3 py-2 md:px-4 md:py-2 text-base md:text-lg"
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

export default Navbar;
