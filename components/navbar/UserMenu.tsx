import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import { LuUser } from "react-icons/lu";

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="capitalize px-3 py-2 md:px-4 md:py-2 text-base md:text-lg flex items-center gap-2 text-primary border border-primary/20"
        >
          <LuUser className="w-6 h-6 mr-1 text-primary" />
          <span>User</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="text-primary">
        <SignedOut>
          <DropdownMenuItem className="text-primary">
            <SignInButton mode="modal">
              <button className="w-full text-left text-primary">Sign in</button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-primary">
            <SignUpButton mode="modal">
              <button className="w-full text-left text-primary">Sign up</button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>
        <SignedIn>
          <DropdownMenuItem className="text-primary">
            <SignOutButton>
              <button className="w-full text-left text-primary">Sign out</button>
            </SignOutButton>
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
