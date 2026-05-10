export interface IWsServerPort {
  broadcast(message: string): void;
  broadcastToRoom(room: string, message: string): void;
}
