'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface EngineerFormProps {
  onClose?: () => void;
  forceBusy?: boolean;
}

// Generate time options every 15 minutes from 09:00 to 18:00
const TIME_OPTIONS = Array.from({ length: ((18 - 9) * 4) + 1 }, (_, i) => {
  const hour = 9 + Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

function getNextAvailableTimes() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  // Find the next 15-min interval
  const nextInterval = Math.ceil(currentMinutes / 15) * 15;
  return TIME_OPTIONS.filter((t) => {
    const [h, m] = t.split(':').map(Number);
    const tMinutes = h * 60 + m;
    return tMinutes > currentMinutes;
  });
}

export default function EngineerForm({ onClose, forceBusy }: EngineerFormProps) {
  const [engineerName, setEngineerName] = useState('');
  const [status, setStatus] = useState('available');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [message, setMessage] = useState('');
  const [futureTimes, setFutureTimes] = useState<string[]>(getNextAvailableTimes());

  useEffect(() => {
    if (forceBusy) {
      setStatus('busy');
    }
    // Update available times every minute
    const interval = setInterval(() => setFutureTimes(getNextAvailableTimes()), 60000);
    setFutureTimes(getNextAvailableTimes());
    return () => clearInterval(interval);
  }, [forceBusy]);

  useEffect(() => {
    // Reset selected time to first available when times update
    if (futureTimes.length > 0) setSelectedTime(futureTimes[0]);
  }, [futureTimes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('csEngineerStatus', status);
    if (status === 'busy' && selectedTime) {
      // Store the selected time as availableAt in localStorage (today's date with selected time)
      const now = new Date();
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const availableAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      localStorage.setItem('csEngineerAvailableAt', availableAt.toISOString());
    } else {
      localStorage.removeItem('csEngineerAvailableAt');
    }
    if (!forceBusy) {
      localStorage.setItem('csEngineerName', engineerName);
    }
    setMessage('Engineer information updated successfully!');
    setEngineerName('');
    setSelectedTime(futureTimes[0] || '');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl p-8">
      <h2 className="text-3xl font-bold mb-6" style={{ color: '#E1E9E5' }}>
        {forceBusy ? 'Busy Mode' : 'Update CS Engineer'}
      </h2>
      {!forceBusy && (
        <div className="space-y-2 flex flex-col items-center justify-center">
          <Label htmlFor="engineerName" className="text-lg">Engineer Name</Label>
          <Input
            id="engineerName"
            type="text"
            value={engineerName}
            onChange={(e) => setEngineerName(e.target.value)}
            className="h-12 text-lg text-center text-black"
            required
          />
        </div>
      )}
      {status === 'busy' && (
        <div className="space-y-2 flex flex-col items-center justify-center">
          <Label htmlFor="backIn" className="text-lg" style={{ color: '#E1E9E5' }}>Back at</Label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="h-12 text-lg text-black bg-white text-center">
              <SelectValue placeholder="Select time" className="text-black text-center" />
            </SelectTrigger>
            <SelectContent className="text-black bg-white">
              {futureTimes.map(opt => (
                <SelectItem key={opt} value={opt} className="text-black text-center">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button
        type="submit"
        className="w-full h-12 text-xl font-semibold bg-[#CE0622] hover:bg-[#8a1829] transition-all duration-200 hover:scale-105"
      >
        {forceBusy ? 'Update time' : 'Update Engineer'}
      </Button>
      {message && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center text-lg">
          {message}
        </div>
      )}
    </form>
  );
} 