import Logo from "./Logo";
import LinksDropdown from "./LinksDropdown";
import DarkMode from "./DarkMode";
import CartButton from "./CartButton";
import NavSearch from "./NavSearch";
import Container from "../global/Container";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Container>
        <div className="flex flex-col gap-4 py-4 sm:py-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-2 sm:hidden">
              <CartButton />
              <DarkMode />
              <LinksDropdown />
            </div>
          </div>

          <div className="w-full sm:w-auto sm:max-w-xs">
            <NavSearch />
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <CartButton />
            <DarkMode />
            <LinksDropdown />
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
