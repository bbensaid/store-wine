"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import Container from "../global/Container";
import NavSearch from "./NavSearch";
import { HiOutlineShoppingBag } from "react-icons/hi";
import {
  LuMenu,
  LuUser,
  LuHouse,
  LuPhone,
  LuCircleHelp,
  LuShield,
  LuMail,
  LuMessageCircle,

  LuWine,
  LuHeart,
  LuFileQuestion,
} from "react-icons/lu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Cinzel } from "next/font/google";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import React, { useState } from "react";

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

function Navbar() {
  const pathname = usePathname();
  const [winesOpen, setWinesOpen] = useState(false);
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
            active={pathname === "/" || pathname === ""}
            className=""
          />
          {/* Search (fixed width, gap to buttons) */}
          <div className="flex-grow min-w-0 mr-4">
            <NavSearch className="w-full h-10 rounded-md border border-primary/30 pl-4 text-base" />
          </div>
          {/* All nav/utility buttons (right) */}
          <div className="flex items-center gap-x-3 ml-auto text-sm md:text-xs">
            <DropdownMenu open={winesOpen} onOpenChange={setWinesOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  className={
                    "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                    (winesOpen || pathname.startsWith("/products") || pathname.startsWith("/favorites")
                      ? "bg-gray-200 text-primary border-gray-400"
                      : "")
                  }
                >
                  <LuWine className="w-5 h-5 text-primary" />
                  Wines
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white border border-primary/20 text-primary">
                <DropdownMenuItem asChild className="capitalize w-full text-primary">
                  <Link href="/products" className="flex items-center gap-2 text-primary">
                    <LuWine className="w-5 h-5 text-primary" />
                    All Wines
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="capitalize w-full text-primary">
                  <Link href="/favorites" className="flex items-center gap-2 text-primary">
                    <LuHeart className="w-5 h-5 text-primary" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname.startsWith("/orders")
                  ? "bg-gray-200 text-primary border-gray-400"
                  : "")
              }
              asChild
            >
              <Link href="/orders">
                <HiOutlineShoppingBag className="w-5 h-5 mr-1 text-primary" />
                Orders
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary hidden lg:flex"
                >
                  <LuPhone className="w-5 h-5 text-primary" />
                  Customer Service
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white border border-primary/20 text-primary">
                <DropdownMenuItem className="capitalize w-full text-primary">
                  <LuMail className="w-5 h-5 mr-2 text-primary" />
                  Email Support
                </DropdownMenuItem>
                <DropdownMenuItem className="capitalize w-full text-primary">
                  <LuMessageCircle className="w-5 h-5 mr-2 text-primary" />
                  Live Chat
                </DropdownMenuItem>
                <DropdownMenuItem className="capitalize w-full text-primary">
                  <LuFileQuestion className="w-5 h-5 mr-2 text-primary" />
                  FAQ
                </DropdownMenuItem>
                <DropdownMenuItem className="capitalize w-full text-primary">
                  <LuShield className="w-5 h-5 mr-2 text-primary" />
                  Privacy Policy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeButton className="hover:bg-gray-100 hover:text-primary" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50 pr-2">
              <Button
                className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
              >
                <LuUser className="w-5 h-5 mr-1 text-primary" />
                Sign in
              </Button>
            </div>
            <CartButton className="hover:bg-gray-100 hover:text-primary" />
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
              <Button className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary" size="icon" aria-label="Open menu">
                <LuMenu className="w-6 h-6 text-primary" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-6 flex flex-col gap-4 w-full max-w-xs">
              <NavSearch className="mb-2" />
              <NavLinkButton
                href="/"
                label="Home"
                icon={<LuHouse className="w-5 h-5 mr-1 text-primary" />}
                active={pathname === "/"}
                className=""
              />
              <NavLinkButton
                href="/products"
                label="Products"
                icon={<LuWine className="w-5 h-5 mr-1" />}
                active={pathname.startsWith("/products")}
                className=""
              />
              <NavLinkButton
                href="/favorites"
                label="Favorites"
                icon={<LuHeart className="w-5 h-5 mr-1" />}
                active={pathname.startsWith("/favorites")}
                className=""
              />
              <NavLinkButton
                href="/orders"
                label="Orders"
                icon={<HiOutlineShoppingBag className="w-5 h-5 mr-1" />}
                active={pathname.startsWith("/orders")}
                className=""
              />
              <Button
                className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
              >
                <LuPhone className="w-5 h-5 text-primary" />
                Customer Service
              </Button>
              <Button
                className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
              >
                <LuCircleHelp className="w-5 h-5 text-primary" />
                Help
              </Button>
              <Button
                className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
              >
                <LuShield className="w-5 h-5 text-primary" />
                Privacy Policy
              </Button>
              <ModeButton className="" />
              <Button
                className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
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
  icon: React.ReactElement<{ className?: string }>;
  active?: boolean;
  className?: string;
}) {
  const iconWithColor = React.cloneElement(icon, {
    className: clsx(
      icon.props.className ?? "",
      "text-primary"
    ),
  });
  return (
    <Button
      className={
        className +
        " flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
        (active ? "bg-gray-200 text-primary border-gray-400" : "")
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
          className={className + " flex items-center text-primary border border-primary/20"}
        >
          <span className="relative flex items-center mr-1">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100 text-primary" />
          </span>
          <span>Mode</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="text-primary border border-primary/20">
        <DropdownMenuItem onClick={() => setTheme("light")} className="text-primary">Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="text-primary">Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="text-primary">System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Stub CartButton (icon + text, no cart logic)
function CartButton({ className = "" }: { className?: string }) {
  return (
    <Button className={"flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " + className}>
      <HiOutlineShoppingBag className="w-5 h-5 text-primary" />
      Cart
    </Button>
  );
}

export default Navbar;
