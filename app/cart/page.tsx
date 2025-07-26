import React from "react";
import { getCurrentUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function CartPage() {
  const userId = await getCurrentUserId()
  
  if (!userId) {
    redirect('/sign-in')
  }
  return <div>CartPage</div>;
}


