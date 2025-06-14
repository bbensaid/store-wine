"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import Container from "../global/Container";
import NavSearch from "./NavSearch";
import { AiFillHeart } from "react-icons/ai";
import { GiWineBottle } from "react-icons/gi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import {
  LuMenu,
  LuUser,
  LuHouse,
  LuPhone,
  LuCircleHelp,
  LuShield,
} from "react-icons/lu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LinksDropdown from "./LinksDropdown";
import { Cinzel } from "next/font/google";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import React from "react";

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm h-16 flex items-center">
      <Container>
        {/* Logo outside and left of navbar */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-50 pl-2">
          <div className="border border-primary/20 bg-white/90 rounded-xl shadow-sm px-3 py-1 flex items-center min-w-[110px]">
            <Link href="/" className="flex items-center h-full">
              <img
                src="/images/logo.png"
                alt="Wine Store Logo"
                className="h-10 w-auto max-h-[2.5rem]"
              />
              <span
                className={`${cinzel.className} text-xl font-semibold tracking-widest text-primary ml-2`}
              >
                VINEFOX
              </span>
            </Link>
          </div>
        </div>
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center w-full h-16 gap-x-4 lg:gap-x-4 md:gap-x-2 justify-between">
          {/* Home button now inside navbar, to the right of logo */}
          <NavLinkButton
            href="/"
            label="Home"
            icon={<LuHouse className="w-5 h-5 mr-1 text-primary" />}
            active={pathname === "/"}
            className=""
          />
          {/* Search (fixed width, gap to buttons) */}
          <div className="flex-grow min-w-0 mr-4">
            <NavSearch className="w-full h-10 rounded-md border border-primary/30 pl-4 text-base" />
          </div>
          {/* All nav/utility buttons (right) */}
          <div className="flex items-center gap-x-3 ml-auto text-sm md:text-xs">
            <NavLinkButton
              href="/products"
              label="Products"
              icon={<GiWineBottle className="w-5 h-5 mr-1 text-primary" />}
              active={pathname.startsWith("/products")}
              className=""
            />
            <NavLinkButton
              href="/favorites"
              label="Favorites"
              icon={<AiFillHeart className="w-5 h-5 mr-1 text-primary" />}
              active={pathname.startsWith("/favorites")}
              className=""
            />
            <NavLinkButton
              href="/orders"
              label="Orders"
              icon={
                <HiOutlineShoppingBag className="w-5 h-5 mr-1 text-primary" />
              }
              active={pathname.startsWith("/orders")}
              className=""
            />
            <LinksDropdown />
            <Button
              variant="outline"
              className="flex items-center gap-2 text-primary hidden lg:flex"
            >
              <LuPhone className="w-5 h-5 text-primary" />
              Customer Service
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-primary hidden lg:flex"
            >
              <LuCircleHelp className="w-5 h-5 text-primary" />
              Help
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-primary hidden lg:flex"
            >
              <LuShield className="w-5 h-5 text-primary" />
              Privacy Policy
            </Button>
            <ModeButton className="" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50 pr-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-primary"
              >
                <LuUser className="w-5 h-5 mr-1 text-primary" />
                Sign in
              </Button>
            </div>
            <CartButton />
          </div>
        </div>
        {/* Mobile Navbar */}
        <div className="flex md:hidden items-center w-full h-16 gap-x-2 px-2">
          <div className="flex items-center min-w-[90px]">
            <Link href="/" className="flex items-center h-full">
              <img
                src="/images/logo.png"
                alt="Wine Store Logo"
                className="h-8 w-auto max-h-[2rem]"
              />
              <span
                className={`${cinzel.className} text-lg font-semibold tracking-widest text-primary ml-2`}
              >
                VINEFOX
              </span>
            </Link>
          </div>
          <div className="flex-grow" />
          <CartButton />
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <LuMenu className="w-6 h-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-6 flex flex-col gap-4 w-full max-w-xs">
              <NavSearch className="mb-2" />
              <NavLinkButton
                href="/"
                label="Home"
                icon={<LuHouse className="w-5 h-5 mr-1 text-primary" />}
                className=""
              />
              <NavLinkButton
                href="/products"
                label="Products"
                icon={<GiWineBottle className="w-5 h-5 mr-1" />}
                className=""
              />
              <NavLinkButton
                href="/favorites"
                label="Favorites"
                icon={<AiFillHeart className="w-5 h-5 mr-1" color="black" />}
                className=""
              />
              <NavLinkButton
                href="/orders"
                label="Orders"
                icon={<HiOutlineShoppingBag className="w-5 h-5 mr-1" />}
                className=""
              />
              <LinksDropdown />
              <Button
                variant="outline"
                className="flex items-center gap-2 text-primary"
              >
                <LuPhone className="w-5 h-5 text-primary" />
                Customer Service
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-primary"
              >
                <LuCircleHelp className="w-5 h-5 text-primary" />
                Help
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-primary"
              >
                <LuShield className="w-5 h-5 text-primary" />
                Privacy Policy
              </Button>
              <ModeButton className="" />
              <Button
                variant="outline"
                className="flex items-center gap-2 text-primary"
              >
                <LuUser className="w-5 h-5 mr-1 text-primary" />
                Sign in
              </Button>
              <CartButton />
            </DrawerContent>
          </Drawer>
        </div>
      </Container>
    </nav>
  );
}

function NavLinkButton({
  href,
  label,
  icon,
  active = false,
  className = "",
}: {
  href: string;
  label: string;
  icon: React.ReactElement<any>;
  active?: boolean;
  className?: string;
}) {
  const iconWithColor = React.cloneElement(icon, {
    ...icon.props,
    className: clsx(
      icon.props.className ?? "",
      active ? "text-white" : "text-primary"
    ),
  });
  return (
    <Button
      variant={active ? undefined : "outline"}
      className={
        className +
        " flex items-center gap-2 " +
        (active ? "bg-primary text-white border-primary" : "text-primary")
      }
      asChild
    >
      <Link href={href}>
        {iconWithColor}
        {label}
      </Link>
    </Button>
  );
}

function ModeButton({ className = "" }: { className?: string }) {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={className + " flex items-center text-primary"}
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

// Stub CartButton (icon + text, no cart logic)
function CartButton() {
  return (
    <Button variant="outline" className="flex items-center gap-2 text-primary">
      <HiOutlineShoppingBag className="w-5 h-5 text-primary" />
      Cart
    </Button>
  );
}

export default Navbar;
