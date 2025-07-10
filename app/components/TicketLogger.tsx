'use client'

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Ticket, Send, Clock, User, AlertCircle } from 'lucide-react';
import ParticleSystem from './ParticleSystem';

interface TicketLoggerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TICKET_CATEGORIES = [
  { value: 'technical', label: 'Technical Issue', icon: '🔧', color: 'text-blue-600' },
  { value: 'account', label: 'Account Problem', icon: '👤', color: 'text-green-600' },
  { value: 'billing', label: 'Billing Query', icon: '💳', color: 'text-purple-600' },
  { value: 'general', label: 'General Inquiry', icon: '💬', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent Issue', icon: '🚨', color: 'text-red-600' }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
];

export default function TicketLogger({ isOpen, onClose }: TicketLoggerProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    contactEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const generateTicketNumber = () => {
    const prefix = 'TK';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTicketNumber = generateTicketNumber();
    setTicketNumber(newTicketNumber);
    
    // Store ticket in localStorage for demo purposes
    const ticketData = {
      ...formData,
      ticketNumber: newTicketNumber,
      status: 'open',
      createdAt: new Date().toISOString(),
      estimatedResponse: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
    };
    
    const existingTickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    existingTickets.push(ticketData);
    localStorage.setItem('userTickets', JSON.stringify(existingTickets));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setShowParticles(true);
    
    // Reset form after showing success
    setTimeout(() => {
      resetForm();
      onClose();
    }, 4000);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      priority: 'medium',
      description: '',
      contactEmail: ''
    });
    setShowSuccess(false);
    setTicketNumber('');
  };

  const selectedCategory = TICKET_CATEGORIES.find(cat => cat.value === formData.category);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}>
        <DialogContent className="max-w-lg mx-auto bg-white border-2 border-[#CE0622]/20 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
              <Ticket className="w-6 h-6 text-[#CE0622]" />
              Log a Support Ticket
            </DialogTitle>
          </DialogHeader>
          
          {showSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-6xl animate-bounce">🎫</div>
              <h3 className="text-2xl font-bold text-[#CE0622]">Ticket Created!</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="font-semibold">Ticket Number: <span className="text-[#CE0622]">#{ticketNumber}</span></p>
                <p className="text-sm text-gray-600">Expected response within 2 hours</p>
              </div>
              <p className="text-gray-600">We'll get back to you soon!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {/* Ticket Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  Issue Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Brief description of your issue"
                  className="border-gray-300 focus:border-[#CE0622]"
                  required
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-[#CE0622]">
                    <SelectValue placeholder="Select issue category">
                      {selectedCategory && (
                        <div className="flex items-center gap-2">
                          <span>{selectedCategory.icon}</span>
                          <span>{selectedCategory.label}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Level */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-[#CE0622]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_LEVELS.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <span className={priority.color}>{priority.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Contact Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="your.email@example.com"
                  className="border-gray-300 focus:border-[#CE0622]"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Detailed Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Please provide as much detail as possible about your issue..."
                  className="min-h-[100px] border-gray-300 focus:border-[#CE0622] resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!formData.title || !formData.category || !formData.description || isSubmitting}
                className="w-full bg-[#CE0622] hover:bg-[#8a1829] text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Ticket...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Ticket
                  </div>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ParticleSystem
        trigger={showParticles}
        type="celebration"
        onComplete={() => setShowParticles(false)}
      />
    </>
  );
}