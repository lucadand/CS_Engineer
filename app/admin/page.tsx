'use client'

import { useState } from 'react';
import { assignCSEngineer } from '@/app/actions/csEngineer';

export default function AdminPage() {
  const [engineerName, setEngineerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignCSEngineer(engineerName, new Date(date));
      setMessage('CS Engineer assigned successfully!');
      setEngineerName('');
    } catch (error) {
      setMessage('Failed to assign CS Engineer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#CE0622] to-black p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Assign CS Engineer
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Engineer Name</label>
            <input
              type="text"
              value={engineerName}
              onChange={(e) => setEngineerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#CE0622] text-white py-2 px-4 rounded hover:bg-[#8a1829] transition-colors"
          >
            Assign Engineer
          </button>
        </form>
        
        {message && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  );
} 