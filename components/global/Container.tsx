import { cn } from "@/lib/utils";

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Use grid for 15%-70%-15% layout on md+ screens
        "w-full grid grid-cols-1 md:grid-cols-[15%_70%_15%]",
        className
      )}
    >
      {/* Left empty space (or sidebar on products page) */}
      <div className="hidden md:block" />
      {/* Main content */}
      <div className="w-full">{children}</div>
      {/* Right empty space */}
      <div className="hidden md:block" />
    </div>
  );
}

export default Container;
