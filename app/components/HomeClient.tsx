"use client";

import React, { useState, useEffect } from "react";
import CardCSEngineer from "@/app/components/CardCSEngineer";
import EngineerForm from "@/app/components/EngineerForm";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/app/components/ui/dialog";
import { Settings, Pause, Play } from "lucide-react";
import ParticleSystem from "./ParticleSystem";

function formatDateTime(date: Date) {
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function HomeClient({ engineer }: { engineer: any }) {
  const [showForm, setShowForm] = useState(false);
  const [forceBusy, setForceBusy] = useState(false);
  const [status, setStatus] = useState<string>('available');
  const [now, setNow] = useState(new Date());
  const [showStatusParticles, setShowStatusParticles] = useState(false);

  useEffect(() => {
    // Get status from localStorage on mount
    const storedStatus = localStorage.getItem('csEngineerStatus');
    if (storedStatus) setStatus(storedStatus);
    // Update time every minute
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSetBusy = () => {
    setForceBusy(true);
    setShowForm(true);
    setShowStatusParticles(true);
  };

  const handleSetOnline = () => {
    localStorage.setItem('csEngineerStatus', 'available');
    localStorage.removeItem('csEngineerAvailableAt');
    setStatus('available');
    setShowStatusParticles(true);
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
            className="bg-green-500 hover:bg-green-600 shadow"
            aria-label="Set Online"
          >
            <Play className="w-6 h-6 text-white" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={handleSetBusy}
            className="bg-yellow-400 hover:bg-yellow-500 shadow"
            aria-label="Set Busy"
          >
            <Pause className="w-6 h-6 text-white" />
          </Button>
        )}
        <Button
          size="icon"
          onClick={handleSettingsClick}
          className="bg-white hover:bg-gray-100 shadow"
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
      
      <ParticleSystem
        trigger={showStatusParticles}
        type="success"
        onComplete={() => setShowStatusParticles(false)}
      />
    </main>
  );
} 