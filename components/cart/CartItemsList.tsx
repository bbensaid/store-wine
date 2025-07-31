import { Card } from "@/components/ui/card";
import { FirstColumn, SecondColumn, FourthColumn } from "./CartItemColumns";
import ThirdColumn from "./ThirdColumn";
import { CartItemWithWine } from "@/utils/types";

function CartItemsList({ 
  cartItems, 
  onCartUpdate 
}: { 
  cartItems: CartItemWithWine[];
  onCartUpdate: () => void;
}) {
  return (
    <div>
      {cartItems.map((cartItem) => {
        const { id, amount } = cartItem;
        const { id: wineId, name, price, region } = cartItem.wine;
        const image = cartItem.wine.images[0]?.url || cartItem.wine.image || "https://via.placeholder.com/80x120/8b0015/ffffff?text=Wine";
        
        return (
          <Card
            key={id}
            className="flex flex-col gap-y-4 md:flex-row flex-wrap p-6 mb-8 gap-x-4"
          >
            <FirstColumn image={image} name={name} />
            <SecondColumn name={name} region={region.name} wineId={wineId} />
            <ThirdColumn id={id} quantity={amount} onCartUpdate={onCartUpdate} />
            <FourthColumn price={price} />
          </Card>
        );
      })}
    </div>
  );
}

export default CartItemsList;