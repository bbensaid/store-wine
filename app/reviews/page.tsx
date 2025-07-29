import React from "react";
import Container from "@/components/global/Container";
import { fetchProductReviews } from "@/utils/actions";
import { FaStar } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import prisma from "@/utils/db";

async function ReviewsPage() {
  // Get all reviews with wine information
  const reviews = await prisma.review.findMany({
    include: {
      wine: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">All Reviews</h1>
        
        {reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 text-lg">No reviews yet.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex gap-4">
                  {/* Wine Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={review.wine.images[0]?.url || "https://via.placeholder.com/80x120/8b0015/ffffff?text=Wine"}
                      alt={review.wine.name}
                      width={80}
                      height={120}
                      className="rounded-md object-cover"
                    />
                  </div>
                  
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          {review.wine.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Reviewed by {review.authorName}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating}/5
                      </span>
                    </div>
                    
                    {/* Comment */}
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    
                    {/* Vintage if provided */}
                    {review.vintage && (
                      <p className="text-sm text-gray-500 mt-2">
                        Vintage: {review.vintage}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default ReviewsPage;
