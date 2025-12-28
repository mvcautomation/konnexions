'use client';

import { useState } from 'react';

interface UsernameModalProps {
  onSubmit: (username: string) => void;
  isOpen: boolean;
}

export function UsernameModal({ onSubmit, isOpen }: UsernameModalProps) {
  const [username, setUsername] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length >= 2 && trimmed.length <= 20) {
      onSubmit(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background-card)] rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Join Game</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-3 rounded-xl bg-[var(--background)] text-[var(--foreground)]
                       placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-purple)]"
            autoFocus
            maxLength={20}
          />
          <button
            type="submit"
            disabled={username.trim().length < 2}
            className="w-full mt-4 px-4 py-3 rounded-xl bg-[var(--color-purple)] text-[var(--background)]
                       font-semibold disabled:opacity-50 disabled:cursor-not-allowed
                       hover:opacity-90 transition-opacity"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
