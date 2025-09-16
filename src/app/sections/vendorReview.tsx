"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
  getVendorReviews,
  createVendorReview,
  deleteVendorReview,
} from "@/app/(protected)/actions/review";
import { toast } from "react-toastify";
import { AlertCircle, CheckCircle, MessageSquare, Trash, ChevronDown, ChevronUp } from "lucide-react";

type Review = {
  id: number;
  user: number;
  vendor: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
};

type VendorReviewProps = {
  vendorId: number;
  onReviewStatsChange?: (averageRating: number, reviewCount: number) => void;
};

export default function VendorReview({
  vendorId,
  onReviewStatsChange,
}: VendorReviewProps) {
  const [userId, setUserId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);

  const getCookieValue = (key: string): string | null => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${key}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  useEffect(() => {
    const cookieUserId = getCookieValue("user_id");
    if (cookieUserId) setUserId(Number(cookieUserId));
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchReviews() {
      if (!vendorId) return;
      setLoading(true);
      setError("");
      try {
        const { data, error: fetchError } = await getVendorReviews(vendorId);
        if (fetchError) {
          setError(fetchError);
        } else {
          const sortedReviews = (data || []).sort((a: Review, b: Review) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setReviews(sortedReviews);
          // Initially show only 3 reviews or all if less than 3
          setVisibleReviews(sortedReviews.slice(0, 3));

          if (data && onReviewStatsChange) {
            const total = data.length;
            const avg =
              total > 0
                ? data.reduce((sum: number, r: Review) => sum + r.rating, 0) / total
                : 0;
            onReviewStatsChange(Number(avg.toFixed(1)), total);
          }
        }
      } catch {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();

    return () => {
      abortController.abort();
    };
  }, [vendorId, onReviewStatsChange]);

  // Update visible reviews when showAllReviews changes
  useEffect(() => {
    if (showAllReviews) {
      setVisibleReviews(reviews);
    } else {
      setVisibleReviews(reviews.slice(0, 3));
    }
  }, [showAllReviews, reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("You must be logged in to submit a review.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }

    try {
      const { data, error: submitError } = await createVendorReview(vendorId, { rating, comment });
      if (submitError) {
        setError(submitError);
        return;
      }

      toast.success("Review submitted successfully!");

      const newReview = {
        id: data.id,
        user: data.user,
        vendor: vendorId,
        rating: data.rating,
        comment: data.comment,
        created_at: data.created_at,
        user_name: data.user_name,
        user_email: data.user_email,
      };

      const updatedReviews = [newReview, ...reviews]; // Add to beginning for chronological order
      setReviews(updatedReviews);

      if (onReviewStatsChange) {
        const total = updatedReviews.length;
        const avg =
          total > 0
            ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) / total
            : 0;
        onReviewStatsChange(Number(avg.toFixed(1)), total);
      }

      setRating(0);
      setComment("");
    } catch {
      setError("Failed to submit review.");
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteId === null) return;

    try {
      const { error, msg } = await deleteVendorReview(confirmDeleteId);

      if (error) {
        toast.error(error);
      } else {
        toast.success(msg || "Review deleted successfully!");
        const updated = reviews.filter((r) => r.id !== confirmDeleteId);
        setReviews(updated);

        if (onReviewStatsChange) {
          const total = updated.length;
          const avg =
            total > 0 ? updated.reduce((sum, r) => sum + r.rating, 0) / total : 0;
          onReviewStatsChange(Number(avg.toFixed(1)), total);
        }
      }
    } catch {
      toast.error("An unexpected error occurred while deleting the review");
    }

    setConfirmDeleteId(null);
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-secondary">Vendor Reviews</h2>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6 mb-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading reviews...</p>
          </div>
        ) : visibleReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <>
            {visibleReviews.map((review) => (
              <div key={review.id} className="rounded-lg hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 p-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center font-medium">
                        {review.user_name?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800">
                          {review.user_name || "Anonymous"}
                        </p>
                        {review.user_email && (
                          <p className="text-xs text-gray-500">{review.user_email}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 ml-10 mt-1">
                      {new Date(review.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium text-yellow-700">
                        {review.rating}
                      </span>
                    </div>
                    {userId === review.user && (
                      <button
                        onClick={() => setConfirmDeleteId(review.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete review"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-gray-700 ml-10">{review.comment}</p>
              </div>
            ))}

            {reviews.length > 3 && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="flex items-center text-primary hover:text-primary font-medium text-sm"
                >
                  {showAllReviews ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      View More ({reviews.length - 3} more reviews)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Form */}
      {userId ? (
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setRating(star);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${star <= rating
                        ? "bg-yellow-100 text-yellow-500"
                        : "bg-white text-gray-400 hover:bg-gray-100"
                      }`}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  >
                    <Star className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this vendor..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Review
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-800">
            Please <a href="/login" className="underline font-medium hover:text-yellow-900">log in</a> to leave a review.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Delete Review</h3>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}