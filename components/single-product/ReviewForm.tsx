"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FaStar } from "react-icons/fa";
import { createReviewAction, updateReviewAction, fetchUserReview } from "@/utils/actions";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ReviewFormProps {
  wineId: number;
}

export default function ReviewForm({ wineId }: ReviewFormProps) {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [vintage, setVintage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  if (!isSignedIn) {
    return (
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Write a Review</h3>
        <p className="text-gray-600">Please sign in to write a review.</p>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating' });
      return;
    }
    if (!comment.trim()) {
      setMessage({ type: 'error', text: 'Please write a comment' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    
    try {
      let result;
      
      if (isEditing && existingReview) {
        result = await updateReviewAction({
          reviewId: existingReview.id,
          rating,
          comment: comment.trim(),
          vintage: vintage.trim() || undefined,
          pathname,
        });
      } else {
        result = await createReviewAction({
          wineId,
          rating,
          comment: comment.trim(),
          authorName: user?.fullName || user?.firstName || "Anonymous",
          authorImageUrl: user?.imageUrl || "",
          vintage: vintage.trim() || undefined,
          pathname,
        });
      }
      
      if (result.error) {
        if (result.existingReview) {
          // User has existing review, offer to edit
          setExistingReview(result.existingReview);
          setRating(result.existingReview.rating);
          setComment(result.existingReview.comment);
          setVintage(result.existingReview.vintage || "");
          setIsEditing(true);
          setMessage({ 
            type: 'error', 
            text: 'You have already reviewed this wine. You can edit your review below.' 
          });
        } else {
          setMessage({ type: 'error', text: result.error });
        }
      } else if (result.success) {
        // Reset form
        setRating(0);
        setComment("");
        setVintage("");
        setExistingReview(null);
        setIsEditing(false);
        setMessage({ type: 'success', text: result.message || 'Review submitted successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold text-primary mb-4">
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border-2 shadow-lg ${
          message.type === 'success' 
            ? 'border-green-300 bg-green-50 text-green-800' 
            : 'border-red-300 bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.type === 'success' ? 'Success!' : 'Error'}
              </p>
              <p className={`text-sm mt-1 ${
                message.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-2xl transition-colors"
              >
                <FaStar
                  className={`${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Vintage (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vintage (Optional)
          </label>
          <Input
            type="text"
            value={vintage}
            onChange={(e) => setVintage(e.target.value)}
            placeholder="e.g., 2018"
            className="w-full"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review *
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this wine..."
            rows={4}
            className="w-full"
            required
          />
        </div>

        <div className="flex gap-2">
          {isEditing && (
            <Button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setExistingReview(null);
                setRating(0);
                setComment("");
                setVintage("");
                setMessage(null);
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel Edit
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className="flex-1"
          >
            {isSubmitting ? "Submitting..." : (isEditing ? "Update Review" : "Submit Review")}
          </Button>
        </div>
      </form>
    </Card>
  );
} 