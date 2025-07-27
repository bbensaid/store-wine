import { FaStar } from "react-icons/fa";
import { getAverageRating } from "@/utils/actions";

interface ProductRatingProps {
  wineId: number;
}

async function ProductRating({ wineId }: ProductRatingProps) {
  const { average, count } = await getAverageRating(wineId);

  const className = `flex gap-1 items-center text-md mt-1 mb-4 text-primary`;
  const countValue = count > 0 ? `(${count}) reviews` : "(No reviews yet)";
  
  return (
    <span className={className}>
      <FaStar className="w-3 h-3 text-primary" />
      {average > 0 ? average : "No rating"} {countValue}
    </span>
  );
}

export default ProductRating;
