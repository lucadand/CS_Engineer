'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { QrCode, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import TicketLogger from './TicketLogger';
import FeedbackSystem from './FeedbackSystem';

interface CSEngineerProps {
  engineer: {
    engineerName: string;
    status?: string;
    availableAt?: Date | null;
  } | null;
}

function getAfterHoursMessage(now: Date) {
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const hour = now.getHours();
  const min = now.getMinutes();
  // Friday after 18:00, all Saturday, all Sunday, Monday before 08:00
  if (
    (day === 5 && hour >= 18) ||
    day === 6 ||
    day === 0 ||
    (day === 1 && hour < 8)
  ) {
    return 'See you on Monday at 09:00 ☺️';
  }
  // Any other weekday after 18:00
  if (hour >= 18) {
    return 'See you tomorrow at 09:00 ☺️';
  }
  return null;
}

export default function CardCSEngineer({ engineer }: CSEngineerProps) {
  const [engineerName, setEngineerName] = useState(engineer?.engineerName || 'Not Assigned');
  const [status, setStatus] = useState(engineer?.status || 'available');
  const [availableAt, setAvailableAt] = useState<Date | null>(engineer?.availableAt || null);
  const [now, setNow] = useState(new Date());
  const [showTicketLogger, setShowTicketLogger] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Check if there's a name in localStorage
    const storedName = localStorage.getItem('csEngineerName');
    if (storedName) {
      setEngineerName(storedName);
    }

    // Check if there's a status in localStorage
    const storedStatus = localStorage.getItem('csEngineerStatus');
    if (storedStatus) {
      setStatus(storedStatus);
    }

    // Check if there's an availability time in localStorage
    const storedAvailableAt = localStorage.getItem('csEngineerAvailableAt');
    if (storedAvailableAt) {
      setAvailableAt(new Date(storedAvailableAt));
    }

    // Update time every minute
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Format the availability time
  const formatAvailableAt = (date: Date | null) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // After-hours logic
  const afterHoursMsg = getAfterHoursMessage(now);
  const isWeekend = now.getDay() === 0 || now.getDay() === 6; // Sunday = 0, Saturday = 6
  const statusColor = afterHoursMsg || status === 'busy'
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-green-100 text-green-800';

  // Determine indicator color
  let indicatorColor = '';
  if (afterHoursMsg || status !== 'available') {
    // Use custom red for indicator
    indicatorColor = '';
  } else {
    indicatorColor = 'bg-green-600';
  }

  return (
    <Card className="max-w-md w-full shadow-xl relative">
      <CardHeader className="text-center pb-4 space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-800">👋 Sawubona, Nandoca</CardTitle>
        <CardDescription className="text-lg text-gray-700">Your CS Engineer is:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-[#CE0622] text-white rounded-lg p-6 flex justify-center items-center">
          <p className="text-3xl font-bold text-center w-full">{engineerName}</p>
        </div>
        
        {/* Barci Busy Image - Only show during weekdays when status is busy */}
        {status === 'busy' && !afterHoursMsg && !isWeekend && (
          <div className="flex justify-center py-2">
            <img
              src="/Barci busy.png"
              alt="Barci is busy"
              className="w-32 h-32 object-contain"
            />
          </div>
        )}
        
        <div className={`p-4 rounded-lg flex flex-col items-center justify-center ${statusColor}`}>
          {afterHoursMsg ? (
            <div className="flex items-center gap-2">
              <p className="font-semibold text-center">
                {afterHoursMsg}
              </p>
              <span
                className={`ml-2 h-3 w-3 rounded-full animate-pulse border-2 border-white shadow ${indicatorColor}`}
                style={afterHoursMsg || status !== 'available' ? { backgroundColor: '#CE0622' } : {}}
                aria-label="Status is up-to-date"
                title="Status is up-to-date"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-semibold text-center">
                Status: {status === 'available' ? 'Available' : 'Busy'}
              </p>
              <span
                className={`ml-2 h-3 w-3 rounded-full animate-pulse border-2 border-white shadow ${indicatorColor}`}
                aria-label="Status is up-to-date"
                title="Status is up-to-date"
              />
            </div>
          )}
          {(!afterHoursMsg && status === 'busy' && availableAt) && (
            <p className="text-sm mt-1 text-center">
              Available again at: {formatAvailableAt(availableAt)}
            </p>
          )}
        </div>
        {/* QR Code Placeholder */}
        <div className="flex flex-col items-center">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white shadow-inner flex flex-col items-center justify-center cursor-pointer hover:border-[#CE0622] hover:bg-[#CE0622]/5 transition-all duration-200"
            onClick={() => window.open('https://nandoscentralsupport.zendesk.com/hc/en-gb/requests/new', '_blank')}
          >
            <QrCode className="w-12 h-12 text-gray-400" />
          </div>
          <span className="mt-2 text-xs text-gray-500 font-medium">Click to log a real ticket</span>
        </div>
        
        {/* Interactive Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setShowTicketLogger(true)}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-4 text-sm transition-all duration-200 hover:scale-105"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Demo Ticket
          </Button>
          <Button
            onClick={() => setShowFeedback(true)}
            variant="outline"
            className="flex-1 border-[#CE0622] text-[#CE0622] hover:bg-[#CE0622] hover:text-white font-medium py-4 text-sm transition-all duration-200 hover:scale-105"
          >
            <Star className="w-4 h-4 mr-2" />
            Feedback
          </Button>
        </div>
      </CardContent>
      
      <TicketLogger 
        isOpen={showTicketLogger} 
        onClose={() => setShowTicketLogger(false)} 
      />
      
      <FeedbackSystem 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
      />
    </Card>
  );
}