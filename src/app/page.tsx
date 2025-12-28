'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from '@/stores/gameStore';
import { UsernameModal } from '@/components/UsernameModal';

export default function Home() {
  const router = useRouter();
  const { localPlayer, setUsername } = useGameStore();
  const [roomCode, setRoomCode] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'join' | null>(null);

  const handleCreateRoom = () => {
    if (!localPlayer) {
      setPendingAction('create');
      setShowUsernameModal(true);
      return;
    }

    const newRoomId = uuidv4().slice(0, 8).toUpperCase();
    router.push(`/game/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) return;

    if (!localPlayer) {
      setPendingAction('join');
      setShowUsernameModal(true);
      return;
    }

    router.push(`/game/${roomCode.trim().toUpperCase()}`);
  };

  const handleUsernameSubmit = (username: string) => {
    setUsername(username);
    setShowUsernameModal(false);

    if (pendingAction === 'create') {
      const newRoomId = uuidv4().slice(0, 8).toUpperCase();
      router.push(`/game/${newRoomId}`);
    } else if (pendingAction === 'join' && roomCode.trim()) {
      router.push(`/game/${roomCode.trim().toUpperCase()}`);
    }

    setPendingAction(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Title */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-[var(--color-yellow)] via-[var(--color-green)] to-[var(--color-purple)] bg-clip-text text-transparent">
            Konnexions
          </h1>
          <p className="text-lg opacity-70">
            A multiplayer word puzzle game
          </p>
        </div>

        {/* Player greeting */}
        {localPlayer && (
          <div className="text-center text-sm opacity-70">
            Playing as <span className="font-semibold">{localPlayer.username}</span>
            <button
              onClick={() => setShowUsernameModal(true)}
              className="ml-2 underline hover:opacity-80"
            >
              change
            </button>
          </div>
        )}

        {/* Create room */}
        <div className="bg-[var(--background-card)] rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center">Create a Room</h2>
          <button
            onClick={handleCreateRoom}
            className="w-full py-4 rounded-xl bg-[var(--color-purple)] text-[var(--background)]
                       font-bold text-lg hover:opacity-90 transition-opacity"
          >
            New Game
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--background-card)]" />
          <span className="text-sm opacity-50">or</span>
          <div className="flex-1 h-px bg-[var(--background-card)]" />
        </div>

        {/* Join room */}
        <div className="bg-[var(--background-card)] rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center">Join a Room</h2>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter room code..."
            className="w-full px-4 py-3 rounded-xl bg-[var(--background)] text-[var(--foreground)]
                       placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]
                       text-center text-xl tracking-widest uppercase"
            maxLength={8}
          />
          <button
            onClick={handleJoinRoom}
            disabled={!roomCode.trim()}
            className="w-full py-4 rounded-xl bg-[var(--color-green)] text-[var(--background)]
                       font-bold text-lg hover:opacity-90 transition-opacity
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Game
          </button>
        </div>

        {/* How to play */}
        <div className="text-center text-sm opacity-50 space-y-1">
          <p>Find 4 groups of 4 words that share a connection</p>
          <p>Work together in Co-op or race in Competitive mode</p>
        </div>
      </div>

      {/* Username modal */}
      <UsernameModal
        isOpen={showUsernameModal}
        onSubmit={handleUsernameSubmit}
      />
    </main>
  );
}
