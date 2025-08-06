import { FaStar } from "react-icons/fa";
import { fetchProductReviews } from "@/utils/actions";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ReviewsListProps {
  wineId: number;
}

async function ReviewsList({ wineId }: ReviewsListProps) {
  const reviews = await fetchProductReviews(wineId.toString());

  if (reviews.length === 0) {
    return (
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Customer Reviews</h3>
        <p className="text-gray-600">No reviews yet. Be the first to review this wine!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Customer Reviews ({reviews.length})
      </h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start gap-3">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={review.authorImageUrl || "https://via.placeholder.com/40x40/8b0015/ffffff?text=U"}
                  alt={review.authorName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              
              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-primary">{review.authorName}</span>
                  {review.vintage && (
                    <span className="text-sm text-gray-500">({review.vintage})</span>
                  )}
                </div>
                
                {/* Rating Stars */}
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                
                {/* Date */}
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ReviewsList; 