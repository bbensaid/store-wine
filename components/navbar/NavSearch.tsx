"use client";
import { Input } from "../ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import clsx from "clsx";

function NavSearch({ className = "" }: { className?: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`/products?${params.toString()}`);
  }, 300);

  return (
    <Input
      type="search"
      placeholder="Search wines..."
      className={clsx(
        "w-full dark:bg-muted focus-visible:ring-accent focus-visible:border-accent text-primary placeholder:text-primary",
        className
      )}
      value={search}
      onChange={(e) => {
        const value = e.target.value;
        setSearch(value);
        handleSearch(value);
      }}
    />
  );
}

export default NavSearch;
