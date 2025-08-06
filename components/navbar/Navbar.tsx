"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
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
  LuStar,
} from "react-icons/lu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Cinzel } from "next/font/google";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { usePathname } from "next/navigation";

import React, { useState } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import UserButtonWrapper from '../auth/UserButtonWrapper';
import CartButton from './CartButton';

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

function Navbar() {
  const pathname = usePathname();
  const [winesOpen, setWinesOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-primary/20 h-16 flex items-center w-full justify-between px-2 sm:px-4 lg:px-6">

      {/* Desktop Logo - hidden on mobile */}
      <div className="hidden md:flex items-center">
        <div className="border border-primary/60 shadow-lg bg-white px-3 md:px-4 py-2 flex items-center rounded-xl transition-all duration-200 hover:shadow-xl hover:border-primary/80">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Wine Store Logo"
              width={32}
              height={32}
              className="h-6 md:h-8 w-auto flex-shrink-0"
            />
            <span
              className={`${cinzel.className} text-sm md:text-lg font-bold tracking-widest text-primary ml-2 whitespace-nowrap`}
            >
              VINEFOX
            </span>
          </Link>
        </div>
      </div>

      {/* Desktop Center content */}
      <div className="hidden md:flex items-center justify-evenly gap-x-2 sm:gap-x-4 lg:gap-x-6 flex-1 px-2 sm:px-4 lg:px-6">
        {/* Home button */}
        <Button
          className={
            "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
            (pathname === "/" || pathname === "" ? "bg-gray-200 text-primary border-gray-400" : "")
          }
          asChild
        >
          <Link href="/">
            <LuHouse className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-primary" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </Button>

        {/* Search */}
        <div className="bg-white flex-auto min-w-0 max-w-md lg:max-w-lg">
          <NavSearch className="w-full h-8 sm:h-10 rounded-md border border-primary/20 pl-3 sm:pl-4 text-sm sm:text-base" />
        </div>

        {/* Nav buttons */}
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
              <LuWine className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="hidden sm:inline">Wines</span>
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
            <DropdownMenuItem asChild className="capitalize w-full text-primary">
              <Link href="/reviews" className="flex items-center gap-2 text-primary">
                <LuStar className="w-5 h-5 text-primary" />
                Reviews
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
            <HiOutlineShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-primary" />
            <span className="hidden sm:inline">Orders</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center gap-1 sm:gap-2 text-primary hidden lg:flex hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base border border-primary/20 bg-white font-normal"
            >
              <LuPhone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="hidden xl:inline">Customer Service</span>
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
        <Button
          className="flex items-center gap-1 sm:gap-2 text-primary hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base border border-primary/20 bg-white font-normal"
        >
          <span className="relative flex items-center mr-1">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
          </span>
          <span className="hidden sm:inline">Mode</span>
        </Button>
        <CartButton />
      </div>

      {/* Desktop Authentication */}
      <div className="hidden md:flex items-center">
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              className="flex items-center gap-1 sm:gap-2 text-primary hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base border border-primary/20 bg-white font-normal"
            >
              <LuUser className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-primary" />
              <span className="hidden sm:inline">Sign in</span>
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButtonWrapper />
        </SignedIn>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center w-full h-16 gap-x-2 px-2">
        <div className="flex items-center border border-primary/60 shadow-lg bg-white px-2 py-1 rounded-xl">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Wine Store Logo"
              width={28}
              height={28}
              className="h-6 w-auto flex-shrink-0"
            />
            <span
              className={`${cinzel.className} text-sm font-bold tracking-widest text-primary ml-1 whitespace-nowrap`}
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
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname === "/" ? "bg-gray-200 text-primary border-gray-400" : "")
              }
              asChild
            >
              <Link href="/">
                <LuHouse className="w-5 h-5 mr-1 text-primary" />
                Home
              </Link>
            </Button>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname.startsWith("/products") ? "bg-gray-200 text-primary border-gray-400" : "")
              }
              asChild
            >
              <Link href="/products">
                <LuWine className="w-5 h-5 mr-1 text-primary" />
                Products
              </Link>
            </Button>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname.startsWith("/favorites") ? "bg-gray-200 text-primary border-gray-400" : "")
              }
              asChild
            >
              <Link href="/favorites">
                <LuHeart className="w-5 h-5 mr-1 text-primary" />
                Favorites
              </Link>
            </Button>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname.startsWith("/reviews") ? "bg-gray-200 text-primary border-gray-400" : "")
              }
              asChild
            >
              <Link href="/reviews">
                <LuStar className="w-5 h-5 mr-1 text-primary" />
                Reviews
              </Link>
            </Button>
            <Button
              className={
                "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
                (pathname.startsWith("/orders") ? "bg-gray-200 text-primary border-gray-400" : "")
              }
              asChild
            >
              <Link href="/orders">
                <HiOutlineShoppingBag className="w-5 h-5 mr-1 text-primary" />
                Orders
              </Link>
            </Button>
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
            <Button
              className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
            >
              <span className="relative flex items-center mr-1">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100 text-primary" />
              </span>
              <span>Mode</span>
            </Button>
                         <SignedOut>
               <SignInButton mode="modal">
                 <Button
                   className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary"
                 >
                   <LuUser className="w-5 h-5 mr-1 text-primary" />
                   Sign in
                 </Button>
               </SignInButton>
             </SignedOut>
             <SignedIn>
               <UserButtonWrapper />
             </SignedIn>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}

export default Navbar;
