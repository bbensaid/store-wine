"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import SectionTitle from "@/components/global/SectionTitle";
import { formatCurrency, formatDate } from "@/utils/format";

function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        console.log('Orders API response:', data);
        // Ensure data is an array
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleRowClick = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  return (
    <>
      <SectionTitle text="Your Orders" />
      <div>
        <Table>
          <TableCaption>Total orders : {orders.length}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Products</TableHead>
              <TableHead>Order Total</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const { id, products, orderTotal, tax, shipping, createdAt } = order;

              return (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(id)}
                >
                  <TableCell>{products}</TableCell>
                  <TableCell>{formatCurrency(orderTotal)}</TableCell>
                  <TableCell>{formatCurrency(tax)}</TableCell>
                  <TableCell>{formatCurrency(shipping)}</TableCell>
                  <TableCell>{formatDate(createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default OrdersPage;
