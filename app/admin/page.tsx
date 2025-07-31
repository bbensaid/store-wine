import React, { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiOutlineShoppingBag } from "react-icons/hi";

export default function AdminPage() {
  return (
    <Suspense>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="space-y-4">
          <Button asChild>
            <Link href="/admin/sales" className="flex items-center gap-2">
              <HiOutlineShoppingBag className="w-5 h-5" />
              View Sales
            </Link>
          </Button>
        </div>
      </div>
    </Suspense>
  );
}
