"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createFeedback } from "@/services/feedback-service";

interface FeedbackModalProps {
  restaurantId: string;
  onClose: () => void;
}

export default function FeedbackModal({ restaurantId, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createFeedback({
        restaurantId,
        rating,
        comment,
      });
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      alert("Erreur lors de l'envoi de l'avis");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center animate-fade-in">
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="text-xl font-bold text-gray-900">Merci pour votre avis !</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b bg-blue-50">
          <h3 className="text-xl font-bold text-gray-900">Votre avis nous intéresse</h3>
          <p className="text-sm text-gray-600">Comment s&apos;est passée votre expérience ?</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition-transform active:scale-90 ${
                  star <= rating ? "grayscale-0" : "grayscale opacity-30"
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Un petit commentaire (optionnel)..."
              className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-32"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose} type="button">
              Plus tard
            </Button>
            <Button variant="primary" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
