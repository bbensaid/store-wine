"use client";
import Container from "../global/Container";
import NavSearch from "./NavSearch";
import { Suspense } from "react";
import Logo from "./Logo";
import CartButton from "./CartButton";
import LinksDropdown from "./LinksDropdown";
import DarkMode from "./DarkMode";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Container className="flex flex-col sm:flex-row  sm:justify-between sm:items-center flex-wrap gap-4 py-8">
        <Logo />
        <Suspense>
          <NavSearch />
        </Suspense>
        <div className="flex gap-4 items-center ">
          <CartButton />
          <DarkMode />
          <LinksDropdown />
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
