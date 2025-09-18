"use client";

import { useState, useEffect } from "react";
import { Star, Trash, ChevronDown, ChevronUp, AlertCircle, CheckCircle, MessageSquare } from "lucide-react";
import {
  getProductReviews,
  createProductReview,
  deleteProductReview,
  createVendorReply,
  updateVendorReply,
  deleteVendorReply,
} from "@/app/(protected)/actions/review";
import { toast } from "react-toastify";

// Types
type VendorReply = {
  id: number;
  vendor_name: string;
  reply: string;
  created_at: string;
};

type Review = {
  id: number;
  user_name?: string;
  user_email?: string;
  rating: number;
  comment: string;
  created_at: string;
  vendor_reply?: VendorReply;
};

type Props = {
  productId: number;
  userRole: "user" | "vendor" | "superadmin";
  onReviewStatsChange?: (avgRating: number, totalReviews: number) => void;
};

export default function ProductReview({
  productId,
  userRole,
  onReviewStatsChange,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [newReply, setNewReply] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);

  // Separate loading states for different operations
  const [replyLoading, setReplyLoading] = useState<Record<number, boolean>>({});
  const [updateLoading, setUpdateLoading] = useState<Record<number, boolean>>({});
  const [deleteReplyLoading, setDeleteReplyLoading] = useState<Record<number, boolean>>({});
  const [deleteReviewLoading, setDeleteReviewLoading] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const abortController = new AbortController();
    async function fetchReviews() {
      if (!productId) return;
      setLoading(true);
      setError("");
      try {
        const { data, error: fetchError } = await getProductReviews(productId);
        console.log("Fetched reviews:", data);
        if (fetchError) {
          setError(fetchError);
        } else {
          setReviews(data || []);
          setVisibleReviews(data?.slice(0, 3) || []);

          if (data && onReviewStatsChange) {
            const total = data.length;
            const avg =
              total > 0
                ? data.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / total
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
    return () => abortController.abort();
  }, [productId, onReviewStatsChange]);

  // Update visible reviews when toggled
  useEffect(() => {
    if (showAllReviews) setVisibleReviews(reviews);
    else setVisibleReviews(reviews.slice(0, 3));
  }, [showAllReviews, reviews]);

  // Submit customer review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }

    try {
      const { data, error: submitError } = await createProductReview(productId, {
        rating,
        comment,
      });
      if (submitError) {
        // Handle forbidden/invalid request errors
        if (submitError.includes('403') || submitError.includes('forbidden') || submitError.includes('not authorized')) {
          toast.error("Invalid request - You are not authorized to perform this action");
        } else if (submitError.includes('400') || submitError.includes('bad request')) {
          toast.error("Invalid request - Please check your input and try again");
        } else {
          toast.error(submitError);
        }
        setError(submitError);
        return;
      }
      toast.success("Review submitted successfully!");
      const updatedReviews = [...reviews, data];
      setReviews(updatedReviews);

      if (onReviewStatsChange) {
        const total = updatedReviews.length;
        const avg = total > 0 ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
        onReviewStatsChange(Number(avg.toFixed(1)), total);
      }

      setRating(0);
      setComment("");
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to submit review.";
      toast.error("Invalid request - " + errorMsg);
      setError(errorMsg);
    }
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (confirmDeleteId === null) return;
    setDeleteReviewLoading(true);
    try {
      const { error, msg } = await deleteProductReview(confirmDeleteId);
      if (error) {
        // Handle forbidden/invalid request errors
        if (error.includes('403') || error.includes('forbidden') || error.includes('not authorized')) {
          toast.error("Invalid request - You are not authorized to delete this review");
        } else if (error.includes('400') || error.includes('bad request')) {
          toast.error("Invalid request - Unable to delete this review");
        } else {
          toast.error(error);
        }
      } else {
        toast.success(msg || "Review deleted successfully!");
        const updated = reviews.filter((r) => r.id !== confirmDeleteId);
        setReviews(updated);

        if (onReviewStatsChange) {
          const total = updated.length;
          const avg = total > 0 ? updated.reduce((sum, r) => sum + r.rating, 0) / total : 0;
          onReviewStatsChange(Number(avg.toFixed(1)), total);
        }
      }
    } catch (err: any) {
      toast.error("Invalid request - " + (err?.message || "Failed to delete review"));
    } finally {
      setDeleteReviewLoading(false);
      setConfirmDeleteId(null);
    }
  };

  // Vendor reply handlers
  const handleReply = async (reviewId: number) => {
    const replyText = newReply[reviewId]?.trim();
    if (!replyText) {
      toast.error("Please enter a reply message");
      return;
    }

    setReplyLoading({ ...replyLoading, [reviewId]: true });
    try {
      const res = await createVendorReply(reviewId, replyText);
      console.log("Reply response:", res);
      if (res.error) {
        // Handle forbidden/invalid request errors
        if (res.error.includes('403') || res.error.includes('forbidden') || res.error.includes('not authorized')) {
          toast.error("Invalid request - You are not authorized to reply to this review");
        } else if (res.error.includes('400') || res.error.includes('bad request')) {
          toast.error("Invalid request - Unable to post reply. Please try again.");
        } else {
          toast.error(res.error);
        }
      } else {
        setNewReply({ ...newReply, [reviewId]: "" });
        toast.success("Reply posted successfully!");
        refreshReviews();
      }
    } catch (err: any) {
      toast.error("Invalid request - " + (err?.message || "Failed to post reply"));
    } finally {
      setReplyLoading({ ...replyLoading, [reviewId]: false });
    }
  };

  const handleUpdateReply = async (replyId: number, reviewId: number) => {
    const replyText = newReply[reviewId]?.trim();
    if (!replyText) {
      toast.error("Please enter a reply message");
      return;
    }

    setUpdateLoading({ ...updateLoading, [reviewId]: true });
    try {
      const res = await updateVendorReply(replyId, replyText);

      if (res.error) {
        // Handle forbidden/invalid request errors
        if (res.error.includes('403') || res.error.includes('forbidden') || res.error.includes('not authorized')) {
          toast.error("Invalid request - You are not authorized to update this reply");
        } else if (res.error.includes('400') || res.error.includes('bad request')) {
          toast.error("Invalid request - Unable to update reply. Please try again.");
        } else {
          toast.error(res.error);
        }
      } else {
        setNewReply({ ...newReply, [reviewId]: "" });
        toast.success("Reply updated successfully!");
        refreshReviews();
      }
    } catch (err: any) {
      toast.error("Invalid request - " + (err?.message || "Failed to update reply"));
    } finally {
      setUpdateLoading({ ...updateLoading, [reviewId]: false });
    }
  };

  const handleDeleteReply = async (replyId: number, reviewId: number) => {
    setDeleteReplyLoading({ ...deleteReplyLoading, [reviewId]: true });
    try {
      const res = await deleteVendorReply(replyId);

      if (res.error) {
        // Handle forbidden/invalid request errors
        if (res.error.includes('403') || res.error.includes('forbidden') || res.error.includes('not authorized')) {
          toast.error("Invalid request - You are not authorized to delete this reply");
        } else if (res.error.includes('400') || res.error.includes('bad request')) {
          toast.error("Invalid request - Unable to delete reply. Please try again.");
        } else {
          toast.error(res.error);
        }
      } else {
        toast.success("Reply deleted successfully!");
        refreshReviews();
      }
    } catch (err: any) {
      toast.error("Invalid request - " + (err?.message || "Failed to delete reply"));
    } finally {
      setDeleteReplyLoading({ ...deleteReplyLoading, [reviewId]: false });
    }
  };

  const refreshReviews = async () => {
    try {
      const { data } = await getProductReviews(productId);
      setReviews(data || []);
    } catch (err: any) {
      toast.error("Failed to refresh reviews");
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-primary">Customer Reviews</h2>

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
        {visibleReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-10 w-10" />
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
                      <p className="font-semibold text-gray-800">
                        {review.user_name || "Anonymous"}
                      </p>
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
                    {/* Allow both users and superadmins to delete reviews */}
                    {(userRole === "user" || userRole === "superadmin") && (
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

                {/* Review Comment */}
                <p className="mt-3 text-gray-700 ml-10">{review.comment}</p>

                {/* Vendor Reply */}
                {review.vendor_reply ? (
                  <div className="ml-10 mt-3 border-l-2 pl-3 text-sm">
                    <p className="font-semibold text-blue-600">{review.vendor_reply.vendor_name} (Vendor)</p>
                    <p>{review.vendor_reply.reply}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.vendor_reply.created_at).toLocaleDateString()}
                    </p>

                    {/* Allow vendors and superadmins to manage replies */}
                    {(userRole === "vendor" || userRole === "superadmin") && (
                      <div className="flex gap-2 mt-2">
                        <input
                          value={newReply[review.id] ?? ""}
                          onChange={(e) => setNewReply({ ...newReply, [review.id]: e.target.value })}
                          placeholder="Edit reply..."
                          className="border px-2 py-1 rounded w-full"
                        />
                        <button
                          onClick={() => handleUpdateReply(review.vendor_reply!.id, review.id)}
                          className="bg-primary text-white px-3 py-1 rounded"
                          disabled={updateLoading[review.id]}
                        >
                          {updateLoading[review.id] ? "Updating..." : "Update"}
                        </button>
                        <button
                          onClick={() => handleDeleteReply(review.vendor_reply!.id, review.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          disabled={deleteReplyLoading[review.id]}
                        >
                          {deleteReplyLoading[review.id] ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Allow vendors and superadmins to reply to reviews
                  (userRole === "vendor" || userRole === "superadmin") && (
                    <div className="ml-10 mt-3 flex gap-2">
                      <input
                        value={newReply[review.id] ?? ""}
                        onChange={(e) => setNewReply({ ...newReply, [review.id]: e.target.value })}
                        placeholder="Write a reply..."
                        className="border px-2 py-1 rounded w-full"
                      />
                      <button
                        onClick={() => handleReply(review.id)}
                        className="bg-secondary text-white px-3 py-1 rounded"
                        disabled={replyLoading[review.id]}
                      >
                        {replyLoading[review.id] ? "Posting..." : "Reply"}
                      </button>
                    </div>
                  )
                )}
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

      {/* Review Form (customers only) */}
      {userRole === "user" && (
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${star <= rating
                      ? "bg-yellow-100 text-yellow-500"
                      : "bg-white text-gray-400 hover:bg-gray-100"
                      }`}
                    aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
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
            <p className="mb-6 text-gray-600">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={deleteReviewLoading}
              >
                {deleteReviewLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}