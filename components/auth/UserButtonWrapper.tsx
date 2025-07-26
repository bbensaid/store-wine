"use client";

import { UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function UserButtonWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <UserButton 
      appearance={{
        elements: {
          avatarBox: "w-8 h-8 sm:w-10 sm:h-10",
          userButtonPopoverCard: "bg-white border border-primary/20 text-primary",
          userButtonPopoverActionButton: "text-primary hover:bg-gray-100",
          userButtonPopoverActionButtonText: "text-primary",
        }
      }}
    />
  );
} 