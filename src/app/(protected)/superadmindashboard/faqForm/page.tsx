"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { deleteFAQ, getAllFAQs, updateFAQ } from "@/app/(protected)/actions/faq";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQFormInputs {
  question: string;
  answer: string;
}

export default function FAQFormWithList() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FAQFormInputs>();

  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<number | null>(null);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const res = await getAllFAQs();
      if (res.data) setFaqs(res.data);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const onSubmit = async (data: FAQFormInputs) => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateFAQ(editingId, data);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/faqs/create/`, data);
      }
      reset();
      setEditingId(null);
      await fetchFAQs();
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Operation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setValue("question", faq.question);
    setValue("answer", faq.answer);
  };

  const handleDeleteClick = (id: number) => {
    setFaqToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!faqToDelete) return;
    
    try {
      const res = await deleteFAQ(faqToDelete);
      if (res.error) throw new Error(res.error);
      await fetchFAQs();
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      alert("Failed to delete FAQ. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setFaqToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setFaqToDelete(null);
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this FAQ? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingId ? "Edit FAQ" : "Create New FAQ"}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input
              {...register("question", { required: "Question is required" })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.question ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your question"
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              {...register("answer", { required: "Answer is required" })}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.answer ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Provide the answer"
            />
            {errors.answer && (
              <p className="mt-1 text-sm text-red-600">{errors.answer.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isSubmitting || !isDirty
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting
                ? "Processing..."
                : editingId
                ? "Update FAQ"
                : "Create FAQ"}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">FAQs List</h2>
        </div>
        
        {loading && faqs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No FAQs available.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {faqs.map((faq) => (
              <li key={faq.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(faq.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}