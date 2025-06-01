import { cn } from "@/lib/utils";

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="w-full">
      <div
        className={cn(
          // Mobile: full width with small padding
          "w-full px-4",
          // Desktop: exact 70% with 15% on each side
          "md:w-[70%] md:mx-auto",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default Container;
