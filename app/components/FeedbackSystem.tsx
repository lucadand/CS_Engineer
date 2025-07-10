'use client'

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Star, Send, ThumbsUp, ThumbsDown, Heart, Zap } from 'lucide-react';
import ParticleSystem from './ParticleSystem';

interface FeedbackSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_REACTIONS = [
  { emoji: '😊', label: 'Great', color: 'text-green-500' },
  { emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
  { emoji: '😞', label: 'Poor', color: 'text-red-500' },
  { emoji: '🔥', label: 'Amazing', color: 'text-orange-500' },
  { emoji: '💯', label: 'Perfect', color: 'text-purple-500' }
];

export default function FeedbackSystem({ isOpen, onClose }: FeedbackSystemProps) {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    // Trigger small particle effect for star selection
    setShowParticles(true);
  };

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    // Trigger feedback particle effect
    setShowParticles(true);
  };

  const handleSubmit = async () => {
    if (selectedRating === 0 && !selectedEmoji) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store feedback in localStorage for demo purposes
    const feedbackData = {
      rating: selectedRating,
      emoji: selectedEmoji,
      feedback,
      timestamp: new Date().toISOString()
    };
    
    const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));
    
    setIsSubmitting(false);
    setShowThankYou(true);
    setShowParticles(true);
    
    // Reset form after showing thank you
    setTimeout(() => {
      setSelectedRating(0);
      setSelectedEmoji('');
      setFeedback('');
      setShowThankYou(false);
      onClose();
    }, 3000);
  };

  const resetForm = () => {
    setSelectedRating(0);
    setSelectedEmoji('');
    setFeedback('');
    setShowThankYou(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}>
        <DialogContent className="max-w-md mx-auto bg-white border-2 border-[#CE0622]/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-[#CE0622]" />
              How was your experience?
            </DialogTitle>
          </DialogHeader>
          
          {showThankYou ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-[#CE0622]">Thank You!</h3>
              <p className="text-gray-600">Your feedback helps us improve our service</p>
              <div className="flex justify-center">
                <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div>
            </div>
          ) : (
            <CardContent className="space-y-6 p-6">
              {/* Star Rating */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 text-center">Rate your experience</h4>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= selectedRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 hover:text-yellow-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji Reactions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 text-center">Quick reaction</h4>
                <div className="flex justify-center gap-3">
                  {EMOJI_REACTIONS.map((reaction) => (
                    <button
                      key={reaction.emoji}
                      onClick={() => handleEmojiClick(reaction.emoji)}
                      className={`p-3 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                        selectedEmoji === reaction.emoji
                          ? 'border-[#CE0622] bg-[#CE0622]/10 scale-110'
                          : 'border-gray-200 hover:border-[#CE0622]/50'
                      }`}
                    >
                      <span className="text-2xl">{reaction.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Feedback */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Additional comments (optional)</h4>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={selectedRating === 0 && !selectedEmoji}
                className="w-full bg-[#CE0622] hover:bg-[#8a1829] text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </div>
                )}
              </Button>
            </CardContent>
          )}
        </DialogContent>
      </Dialog>

      <ParticleSystem
        trigger={showParticles}
        type={showThankYou ? 'celebration' : selectedEmoji ? 'feedback' : 'success'}
        onComplete={() => setShowParticles(false)}
      />
    </>
  );
}