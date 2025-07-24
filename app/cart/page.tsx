import React from "react";
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function CartPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  return <div>CartPage</div>;
}

export default CartPage;
