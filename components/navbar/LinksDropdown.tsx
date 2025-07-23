import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuAlignLeft } from "react-icons/lu";
import { Button } from "../ui/button";
import { links } from "@/utils/links";
import { useRouter } from "next/navigation";

function LinksDropdown({ active = false }: { active?: boolean }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={
            "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
            (active ? "bg-gray-200 text-primary border-gray-400" : "")
          }
        >
          <LuAlignLeft className="w-6 h-6 mr-1 text-primary" />
          <span className="hidden sm:inline">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 bg-white border border-primary/20 text-primary"
        align="start"
        sideOffset={10}
      >
        {links.map((link) => (
          <DropdownMenuItem
            key={link.href}
            onSelect={() => router.push(link.href)}
            className="capitalize w-full text-primary"
          >
            {link.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;
