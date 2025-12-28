'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import PartySocket from 'partysocket';
import { ClientMessage, ServerMessage, RoomState, Player } from './types';
import { Category } from './puzzles';
import { partyLogger as logger } from './logger';

const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'localhost:1999';

interface UsePartySocketOptions {
  roomId: string;
  onRoomState?: (state: RoomState, words: string[]) => void;
  onPlayerJoined?: (player: Player) => void;
  onPlayerLeft?: (playerId: string) => void;
  onPlayerSelected?: (playerId: string, words: string[]) => void;
  onGuessResult?: (correct: boolean, category?: Category, isOneAway?: boolean, strikes?: number) => void;
  onGameOver?: (won: boolean, categories: Category[]) => void;
  onError?: (message: string) => void;
}

export function usePartySocket({
  roomId,
  onRoomState,
  onPlayerJoined,
  onPlayerLeft,
  onPlayerSelected,
  onGuessResult,
  onGameOver,
  onError,
}: UsePartySocketOptions) {
  const socketRef = useRef<PartySocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const hasJoinedRef = useRef(false);

  // Store callbacks in refs to avoid re-running effect
  const callbacksRef = useRef({
    onRoomState,
    onPlayerJoined,
    onPlayerLeft,
    onPlayerSelected,
    onGuessResult,
    onGameOver,
    onError,
  });

  // Update refs when callbacks change
  useEffect(() => {
    callbacksRef.current = {
      onRoomState,
      onPlayerJoined,
      onPlayerLeft,
      onPlayerSelected,
      onGuessResult,
      onGameOver,
      onError,
    };
  });

  // Send message helper
  const send = useCallback((message: ClientMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      logger.debug({ type: message.type }, 'Sending message');
      socketRef.current.send(JSON.stringify(message));
    } else {
      logger.warn({ type: message.type }, 'Cannot send: socket not open');
    }
  }, []);

  // Actions
  const join = useCallback((playerId: string, username: string) => {
    if (hasJoinedRef.current) {
      logger.debug('Already joined, skipping');
      return;
    }
    hasJoinedRef.current = true;
    send({ type: 'join', playerId, username });
  }, [send]);

  const select = useCallback((words: string[]) => {
    send({ type: 'select', words });
  }, [send]);

  const submit = useCallback(() => {
    send({ type: 'submit' });
  }, [send]);

  const startGame = useCallback((mode: 'coop' | 'competitive', teamCount?: number) => {
    send({ type: 'startGame', mode, teamCount });
  }, [send]);

  const newGame = useCallback(() => {
    send({ type: 'newGame' });
  }, [send]);

  // Connect on mount - only depends on roomId
  useEffect(() => {
    if (!roomId) return;

    logger.info({ roomId, host: PARTYKIT_HOST }, 'Connecting to PartyKit');
    hasJoinedRef.current = false;

    const socket = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomId,
    });

    socketRef.current = socket;

    socket.addEventListener('open', () => {
      logger.info({ roomId }, 'Connected to PartyKit');
      setIsConnected(true);
    });

    socket.addEventListener('close', () => {
      logger.info({ roomId }, 'Disconnected from PartyKit');
      setIsConnected(false);
      hasJoinedRef.current = false;
    });

    socket.addEventListener('error', () => {
      logger.error({ roomId }, 'PartyKit connection error');
    });

    socket.addEventListener('message', (event) => {
      try {
        const message: ServerMessage = JSON.parse(event.data);
        logger.debug({ type: message.type }, 'Received message');
        const callbacks = callbacksRef.current;

        switch (message.type) {
          case 'roomState':
            callbacks.onRoomState?.(message.state, message.puzzle.words);
            break;

          case 'playerJoined':
            callbacks.onPlayerJoined?.(message.player);
            break;

          case 'playerLeft':
            callbacks.onPlayerLeft?.(message.playerId);
            break;

          case 'playerReconnecting':
            // Handle in room state update
            break;

          case 'playerReconnected':
            callbacks.onPlayerJoined?.(message.player);
            break;

          case 'playerSelected':
            callbacks.onPlayerSelected?.(message.playerId, message.words);
            break;

          case 'guessResult':
            callbacks.onGuessResult?.(
              message.correct,
              message.category as Category | undefined,
              message.isOneAway,
              message.strikes
            );
            break;

          case 'gameOver':
            callbacks.onGameOver?.(message.won, message.categories as Category[]);
            break;

          case 'error':
            callbacks.onError?.(message.message);
            break;

          case 'pong':
            // Heartbeat response
            break;
        }
      } catch (error) {
        logger.error({ error }, 'Failed to parse message');
      }
    });

    // Heartbeat
    const heartbeat = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => {
      clearInterval(heartbeat);
      socket.close();
      socketRef.current = null;
    };
  }, [roomId]); // Only roomId as dependency

  return {
    isConnected,
    join,
    select,
    submit,
    startGame,
    newGame,
  };
}
