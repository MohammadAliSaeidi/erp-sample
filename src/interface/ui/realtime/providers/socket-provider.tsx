"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import type { Socket } from "socket.io-client";
import { getWsSessionAction } from "@/src/interface/actions/auth/get-ws-session.action";
import {
  createSocketClient,
  joinItemRoom,
  joinStoreRoom,
  leaveItemRoom,
  leaveStoreRoom,
} from "@/src/infrastructure/ws/create-socket-client";

type SocketContextValue = {
  socket: Socket | null;
  isConnected: boolean;
  storeId: string | null;
  adminId: string | null;
  joinStore: (storeId: string) => void;
  leaveStore: (storeId: string) => void;
  joinItem: (storeId: string, itemId: string) => void;
  leaveItem: (storeId: string, itemId: string) => void;
};

const SocketContext = createContext<SocketContextValue | null>(null);

type SocketProviderProps = PropsWithChildren<{
  storeSlug: string;
}>;

export function SocketProvider({ children, storeSlug }: SocketProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const joinedStoreRef = useRef<string | null>(null);
  const joinedItemsRef = useRef<Set<string>>(new Set());
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);

  const rejoinRooms = useCallback((activeSocket: Socket, activeStoreId: string) => {
    joinStoreRoom(activeSocket, activeStoreId);
    joinedStoreRef.current = activeStoreId;

    for (const itemId of joinedItemsRef.current) {
      joinItemRoom(activeSocket, activeStoreId, itemId);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const connect = async () => {
      const sessionResult = await getWsSessionAction(storeSlug);
      if (cancelled || !sessionResult.ok) return;

      const { token, storeId: sessionStoreId, adminId: sessionAdminId } =
        sessionResult.data;

      setStoreId(sessionStoreId);
      setAdminId(sessionAdminId);

      const nextSocket = createSocketClient(token);
      socketRef.current = nextSocket;
      setSocket(nextSocket);

      nextSocket.on("connect", () => {
        setIsConnected(true);
        rejoinRooms(nextSocket, sessionStoreId);
      });

      nextSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      nextSocket.connect();
    };

    void connect();

    return () => {
      cancelled = true;
      const activeSocket = socketRef.current;
      if (activeSocket) {
        if (joinedStoreRef.current) {
          leaveStoreRoom(activeSocket, joinedStoreRef.current);
        }
        for (const itemId of joinedItemsRef.current) {
          if (joinedStoreRef.current) {
            leaveItemRoom(activeSocket, joinedStoreRef.current, itemId);
          }
        }
        activeSocket.removeAllListeners();
        activeSocket.disconnect();
        socketRef.current = null;
      }
      joinedStoreRef.current = null;
      joinedItemsRef.current.clear();
      setSocket(null);
      setIsConnected(false);
    };
  }, [rejoinRooms, storeSlug]);

  const joinStore = useCallback((nextStoreId: string) => {
    const activeSocket = socketRef.current;
    if (!activeSocket) return;

    if (joinedStoreRef.current && joinedStoreRef.current !== nextStoreId) {
      leaveStoreRoom(activeSocket, joinedStoreRef.current);
    }

    joinStoreRoom(activeSocket, nextStoreId);
    joinedStoreRef.current = nextStoreId;
  }, []);

  const leaveStore = useCallback((nextStoreId: string) => {
    const activeSocket = socketRef.current;
    if (!activeSocket) return;

    leaveStoreRoom(activeSocket, nextStoreId);
    if (joinedStoreRef.current === nextStoreId) {
      joinedStoreRef.current = null;
    }
  }, []);

  const joinItem = useCallback((nextStoreId: string, itemId: string) => {
    const activeSocket = socketRef.current;
    if (!activeSocket) return;

    joinItemRoom(activeSocket, nextStoreId, itemId);
    joinedItemsRef.current.add(itemId);
  }, []);

  const leaveItem = useCallback((nextStoreId: string, itemId: string) => {
    const activeSocket = socketRef.current;
    if (!activeSocket) return;

    leaveItemRoom(activeSocket, nextStoreId, itemId);
    joinedItemsRef.current.delete(itemId);
  }, []);

  const value = useMemo<SocketContextValue>(
    () => ({
      socket,
      isConnected,
      storeId,
      adminId,
      joinStore,
      leaveStore,
      joinItem,
      leaveItem,
    }),
    [socket, isConnected, storeId, adminId, joinStore, leaveStore, joinItem, leaveItem],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
