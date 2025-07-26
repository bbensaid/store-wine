import React from "react";
import Container from "@/components/global/Container";
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  return (
    <Container>
      <div>OrdersPage</div>
    </Container>
  );
}
