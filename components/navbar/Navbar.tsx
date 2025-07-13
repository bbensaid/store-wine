"use client";
import Link from "next/link";
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
} from "react-icons/lu";
import { SunIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Cinzel } from "next/font/google";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

function Navbar() {
  const [winesOpen, setWinesOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <nav className="sticky top-0 z-50 border-b-1 border-t-1 border-red-800 h-14 flex items-center w-full px-0">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center ">
          <div className="w-12 h-12">
            <img
              src="/images/logo.png"
              alt="Wine Store Logo"
              className="w-full h-full"
            />
          </div>
          <span className={`${cinzel.className} text-xl text-red-800 font-semibold mr-6`}>
            VINEFOX
          </span>
        </Link>
      </div>

      {/* Desktop Center content */}
      <div className="hidden md:flex items-center gap-4 px-4 flex-1 justify-between">
        {/* Home button */}
        <Button 
          variant="outline"
          className={`${pathname === "/" ? "bg-accent text-accent-foreground" : ""} ${cinzel.className}`}
          asChild
        >
          <Link href="/">
            <LuHouse className="w-4 h-4 mr-0" />
            Home
          </Link>
        </Button>

        {/* Search */}
        <div className="flex-auto max-w-xl">
          <NavSearch />
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-4">
          <DropdownMenu open={winesOpen} onOpenChange={setWinesOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className={`${winesOpen || pathname.startsWith("/products") || pathname.startsWith("/favorites") ? "bg-accent text-accent-foreground" : ""} ${cinzel.className}`}
              >
                <LuWine className="w-4 h-4 mr-2" />
                Wines
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/products" className="flex items-center">
                  <LuWine className="w-4 h-4 mr-2" />
                  All Wines
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/favorites" className="flex items-center">
                  <LuHeart className="w-4 h-4 mr-2" />
                  Favorites
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline"
            className={`${pathname.startsWith("/orders") ? "bg-accent text-accent-foreground" : ""} ${cinzel.className}`}
            asChild
          >
            <Link href="/orders">
              <HiOutlineShoppingBag className="w-4 h-4 mr-2" />
              Orders
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={`hidden lg:flex ${cinzel.className}`}>
            <LuPhone className="w-4 h-4 mr-2" />
            Customer Service
          </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <LuMail className="w-4 h-4 mr-2" />
                Email Support
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LuMessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LuFileQuestion className="w-4 h-4 mr-2" />
                FAQ
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LuShield className="w-4 h-4 mr-2" />
                Privacy Policy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className={cinzel.className}>
            <SunIcon className="h-4 w-4 mr-2" />
            Mode
          </Button>

          <Button variant="outline" className={cinzel.className}>
            <HiOutlineShoppingBag className="w-4 h-4 mr-2" />
            Cart
          </Button>

          <Button variant="outline" className={cinzel.className}>
            <LuUser className="w-4 h-4 mr-0" />
            Sign in
          </Button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center gap-2">
        <Button variant="outline" className={cinzel.className}>
          <HiOutlineShoppingBag className="w-5 h-5" />
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <LuMenu className="w-6 h-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-6">
            <NavSearch className="mb-4" />
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline"
                className={`${pathname === "/" ? "bg-accent text-accent-foreground" : ""} ${cinzel.className}`}
                asChild
              >
                <Link href="/" className="justify-start">
                  <LuHouse className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button 
                variant="outline"
                className={`${pathname.startsWith("/products") ? "bg-accent text-accent-foreground" : ""} ${cinzel.className}`}
                asChild
              >
                <Link href="/products" className="justify-start">
                  <LuWine className="w-4 h-4 mr-2" />
                  Products
                </Link>
              </Button>
              <Button 
                variant="outline"
                className={`${pathname.startsWith("/favorites") ? "bg-accent text-accent-foreground" : ""} ${cinzel.className}`}
                asChild
              >
                <Link href="/favorites" className="justify-start">
                  <LuHeart className="w-4 h-4 mr-2" />
                  Favorites
                </Link>
              </Button>
              <Button 
                variant="outline"
                className={`${pathname.startsWith("/orders") ? "bg-accent text-accent-foreground" : ""} ${cinzel.className}`}
                asChild
              >
                <Link href="/orders" className="justify-start">
                  <HiOutlineShoppingBag className="w-4 h-4 mr-2" />
                  Orders
                </Link>
              </Button>
              <Button variant="outline" className={`justify-start ${cinzel.className}`}>
                <LuPhone className="w-4 h-4 mr-2" />
                Customer Service
              </Button>
              <Button variant="outline" className={`justify-start ${cinzel.className}`}>
                <LuCircleHelp className="w-4 h-4 mr-2" />
                Help
              </Button>
              <Button variant="outline" className={`justify-start ${cinzel.className}`}>
                <LuShield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
              <Button variant="outline" className={`justify-start ${cinzel.className}`}>
                <SunIcon className="h-4 w-4 mr-2" />
                Mode
              </Button>
              <Button variant="outline" className={`justify-start ${cinzel.className}`}>
                <LuUser className="w-4 h-4 mr-2" />
                Sign in
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}

export default Navbar;
