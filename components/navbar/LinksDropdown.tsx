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
          variant={active ? undefined : "outline"}
          className={
            (active
              ? "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
              : "border-input text-primary") + " flex items-center"
          }
        >
          <LuAlignLeft className="w-6 h-6 mr-1" />
          <span className="hidden sm:inline">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 bg-white border border-gray-200"
        align="start"
        sideOffset={10}
      >
        {links.map((link) => (
          <DropdownMenuItem
            key={link.href}
            onSelect={() => router.push(link.href)}
            className="capitalize w-full text-red-600"
          >
            {link.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;
