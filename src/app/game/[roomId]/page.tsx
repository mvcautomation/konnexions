'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { usePartySocket } from '@/lib/usePartySocket';
import { Grid } from '@/components/Grid';
import { PlayerList } from '@/components/PlayerList';
import { StrikeCounter } from '@/components/StrikeCounter';
import { GameControls } from '@/components/GameControls';
import { GameOver } from '@/components/GameOver';
import { ModeSelector } from '@/components/ModeSelector';
import { UsernameModal } from '@/components/UsernameModal';
import { Category } from '@/lib/puzzles';
import { RoomState, Player, GameMode } from '@/lib/types';
import { uiLogger as logger } from '@/lib/logger';

export default function GameRoom() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const {
    localPlayer,
    setUsername,
    roomState,
    setRoomState,
    updatePlayer,
    updatePlayerStatus,
    updatePlayerSelection,
    selectedWords,
    puzzleWords,
    solvedCategories,
    isShaking,
    lastMessage,
    toggleWord,
    setSelectedWords,
    setPuzzleWords,
    addSolvedCategory,
    setSolvedCategories,
    setShaking,
    setLastMessage,
    clearSelection,
    resetGame,
    canSubmit,
    getConsensusStatus,
  } = useGameStore();

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [gameOverData, setGameOverData] = useState<{
    won: boolean;
    categories: Category[];
  } | null>(null);
  const [strikes, setStrikes] = useState(0);

  // Party socket callbacks
  const handleRoomState = useCallback((state: RoomState, words: string[]) => {
    logger.info({ roomId: state.roomId, playerCount: Object.keys(state.players).length }, 'Room state received');
    setRoomState(state);

    if (state.gameStarted && words.length > 0) {
      // Filter out solved words
      const solvedWords = state.solvedCategories.flatMap(theme => {
        // We need to look up the full category to get words
        // For now, use the words from state
        return [];
      });
      setPuzzleWords(words);
      setStrikes(state.strikes);
    }
  }, [setRoomState, setPuzzleWords]);

  const handlePlayerJoined = useCallback((player: Player) => {
    logger.info({ playerId: player.id, username: player.username }, 'Player joined');
    updatePlayer(player);
  }, [updatePlayer]);

  const handlePlayerLeft = useCallback((playerId: string) => {
    logger.info({ playerId }, 'Player left');
    updatePlayerStatus(playerId, 'disconnected');
  }, [updatePlayerStatus]);

  const handlePlayerSelected = useCallback((playerId: string, words: string[]) => {
    logger.debug({ playerId, wordCount: words.length }, 'Player selection updated');
    updatePlayerSelection(playerId, words);
  }, [updatePlayerSelection]);

  const handleGuessResult = useCallback((
    correct: boolean,
    category?: Category,
    isOneAway?: boolean,
    newStrikes?: number
  ) => {
    if (correct && category) {
      addSolvedCategory(category);
      setLastMessage(`${category.theme}`);
    } else {
      if (isOneAway) {
        setLastMessage('One away...');
      } else {
        setLastMessage('Not quite, try again');
      }
      setShaking(true);
      setTimeout(() => setShaking(false), 500);

      if (newStrikes !== undefined) {
        setStrikes(newStrikes);
      }
    }

    // Clear message after delay
    setTimeout(() => setLastMessage(null), 2000);
  }, [addSolvedCategory, setLastMessage, setShaking]);

  const handleGameOver = useCallback((won: boolean, categories: Category[]) => {
    logger.info({ won }, 'Game over');
    setGameOverData({ won, categories });
  }, []);

  const handleError = useCallback((message: string) => {
    logger.error({ message }, 'Server error');
    setLastMessage(message);
    setTimeout(() => setLastMessage(null), 3000);
  }, [setLastMessage]);

  // Connect to party
  const { isConnected, join, select, submit, startGame, newGame } = usePartySocket({
    roomId,
    onRoomState: handleRoomState,
    onPlayerJoined: handlePlayerJoined,
    onPlayerLeft: handlePlayerLeft,
    onPlayerSelected: handlePlayerSelected,
    onGuessResult: handleGuessResult,
    onGameOver: handleGameOver,
    onError: handleError,
  });

  // Check if we need username
  useEffect(() => {
    if (!localPlayer && isConnected) {
      setShowUsernameModal(true);
    } else if (localPlayer && isConnected) {
      join(localPlayer.id, localPlayer.username);
    }
  }, [localPlayer, isConnected, join]);

  // Sync local selection to server
  useEffect(() => {
    if (isConnected && roomState?.gameStarted) {
      select(selectedWords);
    }
  }, [selectedWords, isConnected, roomState?.gameStarted, select]);

  const handleUsernameSubmit = (username: string) => {
    setUsername(username);
    setShowUsernameModal(false);
  };

  const handleWordClick = (word: string) => {
    if (!roomState?.gameStarted) return;
    toggleWord(word);
  };

  const handleSubmit = () => {
    if (canSubmit()) {
      submit();
    }
  };

  const handleShuffle = () => {
    const shuffled = [...puzzleWords].sort(() => Math.random() - 0.5);
    setPuzzleWords(shuffled);
  };

  const handleStartGame = (mode: GameMode, teamCount?: number) => {
    startGame(mode, teamCount);
  };

  const handleNewGame = () => {
    setGameOverData(null);
    resetGame();
    newGame();
  };

  const handleBackToLobby = () => {
    resetGame();
    router.push('/');
  };

  // Get consensus info for co-op
  const consensusStatus = getConsensusStatus();
  const activePlayers = roomState
    ? Object.values(roomState.players).filter(p => p.connectionStatus === 'connected')
    : [];

  const consensusInfo = roomState?.mode === 'coop' ? {
    aligned: consensusStatus.aligned,
    totalPlayers: activePlayers.length,
    readyPlayers: activePlayers.filter(p =>
      p.selectedWords.length === 4 &&
      [...p.selectedWords].sort().join(',') === [...selectedWords].sort().join(',')
    ).length,
  } : undefined;

  // Determine if this player is the host
  const isHost = localPlayer?.id === roomState?.hostId;

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToLobby}
            className="text-sm opacity-70 hover:opacity-100"
          >
            ← Back
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">Konnexions</h1>
            <div className="text-sm opacity-50 font-mono">Room: {roomId}</div>
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Connection status */}
        {!isConnected && (
          <div className="text-center py-4 text-yellow-400 animate-pulse">
            Connecting...
          </div>
        )}

        {/* Pre-game: Mode selector (host only) */}
        {isConnected && roomState && !roomState.gameStarted && (
          <div className="space-y-4">
            <PlayerList
              players={roomState.players}
              localPlayerId={localPlayer?.id || ''}
            />

            {isHost ? (
              <ModeSelector
                onStart={handleStartGame}
                playerCount={Object.values(roomState.players).filter(
                  p => p.connectionStatus === 'connected'
                ).length}
              />
            ) : (
              <div className="text-center py-8 opacity-70">
                Waiting for host to start the game...
              </div>
            )}
          </div>
        )}

        {/* In-game */}
        {isConnected && roomState?.gameStarted && puzzleWords.length > 0 && (
          <div className="space-y-4">
            {/* Strike counter */}
            <div className="flex justify-center">
              <StrikeCounter strikes={strikes} maxStrikes={4} />
            </div>

            {/* Game grid */}
            <Grid
              words={puzzleWords}
              selectedWords={selectedWords}
              solvedCategories={solvedCategories}
              playerSelections={roomState.players}
              localPlayerId={localPlayer?.id || ''}
              onWordClick={handleWordClick}
              isShaking={isShaking}
            />

            {/* Controls */}
            <GameControls
              selectedCount={selectedWords.length}
              canSubmit={canSubmit()}
              consensusInfo={consensusInfo}
              onSubmit={handleSubmit}
              onShuffle={handleShuffle}
              onDeselect={clearSelection}
              message={lastMessage}
            />

            {/* Player list sidebar on larger screens */}
            <div className="md:fixed md:right-4 md:top-1/2 md:-translate-y-1/2 md:w-48">
              <PlayerList
                players={roomState.players}
                localPlayerId={localPlayer?.id || ''}
              />
            </div>
          </div>
        )}

        {/* Game over modal */}
        {gameOverData && (
          <GameOver
            won={gameOverData.won}
            categories={gameOverData.categories}
            strikes={strikes}
            onNewGame={handleNewGame}
            onBackToLobby={handleBackToLobby}
          />
        )}

        {/* Username modal */}
        <UsernameModal
          isOpen={showUsernameModal}
          onSubmit={handleUsernameSubmit}
        />
      </div>
    </main>
  );
}
