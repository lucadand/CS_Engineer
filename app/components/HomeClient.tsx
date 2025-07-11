"use client";

import React, { useState, useEffect } from "react";
import CardCSEngineer from "@/app/components/CardCSEngineer";
import EngineerForm from "@/app/components/EngineerForm";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/app/components/ui/dialog";
import { Settings, Pause, Play, Utensils } from "lucide-react";

function formatDateTime(date: Date) {
  return date.toLocaleString('en-GB', {
    hour12: false,
  });
}

export default function HomeClient({ engineer }: { engineer: any }) {
  const [showForm, setShowForm] = useState(false);
  const [forceBusy, setForceBusy] = useState(false);
  const [status, setStatus] = useState<string>('available');
  const [showStatusParticles, setShowStatusParticles] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Get status from localStorage on mount
    const storedStatus = localStorage.getItem('csEngineerStatus');
    if (storedStatus) setStatus(storedStatus);
    // Update time every second
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSetBusy = () => {
    setForceBusy(true);
    setShowForm(true);
  };

  const handleSetOnline = () => {
    localStorage.setItem('csEngineerStatus', 'available');
    localStorage.removeItem('csEngineerAvailableAt');
    setStatus('available');
    window.location.reload();
  };

  const FOOD_EMOJIS = ['🍕', '🍔', '🥪', '🍣', '🍜', '🥗', '🍟', '🌮', '🍩', '🍦', '🍱', '🍛', '🍉', '🍪', '🍿'];

  const handleSetLunch = () => {
    const now = new Date();
    const availableAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    localStorage.setItem('csEngineerStatus', 'busy');
    localStorage.setItem('csEngineerAvailableAt', availableAt.toISOString());
    localStorage.setItem('csEngineerLunch', 'true');
    // Cycle lunch emoji index
    let idx = parseInt(localStorage.getItem('csEngineerLunchEmojiIdx') || '0', 10);
    idx = isNaN(idx) ? 0 : (idx + 1) % FOOD_EMOJIS.length;
    localStorage.setItem('csEngineerLunchEmojiIdx', idx.toString());
    setStatus('busy');
    window.location.reload();
  };

  const handleSettingsClick = () => {
    setForceBusy(false);
    setShowForm((v) => !v);
  };

  const handleCloseModal = () => setShowForm(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#CE0622] to-black relative">
      {/* Date/Time at top left */}
      <div className="absolute top-4 left-4 z-10 text-xs text-gray-500 font-mono select-none bg-white/70 rounded px-3 py-1 shadow">
        {formatDateTime(now)}
      </div>
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {status === 'busy' ? (
          <Button
            size="icon"
            onClick={handleSetOnline}
            className="bg-green-500 hover:bg-green-600 shadow transition-all duration-200 hover:scale-105"
            aria-label="Set Online"
          >
            <Play className="w-6 h-6 text-white" />
          </Button>
        ) : (
          <>
            <Button
              size="icon"
              onClick={handleSetBusy}
              className="bg-yellow-400 hover:bg-yellow-500 shadow transition-all duration-200 hover:scale-105"
              aria-label="Set Busy"
            >
              <Pause className="w-6 h-6 text-white" />
            </Button>
            <Button
              size="icon"
              onClick={handleSetLunch}
              className="bg-orange-400 hover:bg-orange-500 shadow transition-all duration-200 hover:scale-105"
              aria-label="Set Lunch"
            >
              <Utensils className="w-6 h-6 text-white" />
            </Button>
          </>
        )}
        <Button
          size="icon"
          onClick={handleSettingsClick}
          className="bg-white hover:bg-gray-100 shadow transition-all duration-200 hover:scale-105"
          aria-label="Settings"
        >
          <Settings className="w-6 h-6 text-[#CE0622]" />
        </Button>
      </div>
      
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl p-0 border-0 bg-transparent">
          <div className="flex items-center justify-center">
            <EngineerForm onClose={handleCloseModal} forceBusy={forceBusy} />
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <img
            src="/nandos-logo.png"
            alt="Nando's Logo"
            className="w-48 h-auto"
          />
          <CardCSEngineer engineer={engineer} />
        </div>
      </div>
      
    </main>
  );
} 