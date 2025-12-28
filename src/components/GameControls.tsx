'use client';

interface GameControlsProps {
  selectedCount: number;
  canSubmit: boolean;
  consensusInfo?: {
    aligned: boolean;
    totalPlayers: number;
    readyPlayers: number;
  };
  onSubmit: () => void;
  onShuffle: () => void;
  onDeselect: () => void;
  disabled?: boolean;
  message?: string | null;
}

export function GameControls({
  selectedCount,
  canSubmit,
  consensusInfo,
  onSubmit,
  onShuffle,
  onDeselect,
  disabled = false,
  message,
}: GameControlsProps) {
  return (
    <div className="space-y-3">
      {/* Message display */}
      {message && (
        <div className="text-center text-sm py-2 px-4 rounded-lg bg-[var(--background-card)] fade-in">
          {message}
        </div>
      )}

      {/* Consensus indicator for co-op */}
      {consensusInfo && consensusInfo.totalPlayers > 1 && (
        <div className="text-center text-sm opacity-70">
          {consensusInfo.aligned ? (
            <span className="text-[var(--color-green)]">Everyone agrees!</span>
          ) : (
            <span>
              {consensusInfo.readyPlayers}/{consensusInfo.totalPlayers} players with same selection
            </span>
          )}
        </div>
      )}

      {/* Control buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={onShuffle}
          disabled={disabled}
          className="px-4 py-2 rounded-xl bg-[var(--background-card)] text-sm font-medium
                     hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          Shuffle
        </button>

        <button
          onClick={onDeselect}
          disabled={disabled || selectedCount === 0}
          className="px-4 py-2 rounded-xl bg-[var(--background-card)] text-sm font-medium
                     hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          Deselect All
        </button>

        <button
          onClick={onSubmit}
          disabled={disabled || !canSubmit}
          className="px-6 py-2 rounded-xl bg-[var(--color-green)] text-[var(--background)]
                     text-sm font-bold hover:opacity-90 transition-opacity
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>

      {/* Selection counter */}
      <div className="text-center text-sm opacity-50">
        {selectedCount}/4 selected
      </div>
    </div>
  );
}
