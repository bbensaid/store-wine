import { notFound } from "next/navigation";
import SectionTitle from "@/components/global/SectionTitle";
import { fetchSingleOrder } from "@/utils/actions";
import { formatCurrency, formatDate } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await fetchSingleOrder(params.id);
  
  if (!order) {
    notFound();
  }

  const { id, products, orderTotal, tax, shipping, createdAt, email, orderItems } = order;

  return (
    <>
      <SectionTitle text={`Order #${id.slice(0, 8)}`} />
      <div className="mt-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-medium">{id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{formatDate(createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="font-medium">{products}</p>
              </div>
            </div>

            {/* Order Items */}
            {orderItems && orderItems.length > 0 ? (
              <div>
                <h3 className="font-medium mb-3">Items Purchased</h3>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.wine.name}</h4>
                        <p className="text-sm text-gray-600">{item.wine.region.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price)}</p>
                        <p className="text-sm text-gray-600">
                          Total: {formatCurrency(item.price * item.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-medium mb-3">Items Purchased</h3>
                <p className="text-gray-500 text-sm">
                  Order details for items purchased before order tracking was implemented. 
                  Total items: {products}
                </p>
              </div>
            )}
            
            {/* Order Summary */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderTotal - tax - shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(orderTotal)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default OrderDetailsPage; 