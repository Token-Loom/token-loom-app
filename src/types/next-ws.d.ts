declare module 'next-ws' {
  export interface WebSocket extends globalThis.WebSocket {
    close(code?: number, reason?: string): void
  }

  export interface Request {
    url: string
    headers: Headers
  }

  export interface WebSocketServer {
    on(event: 'connection', callback: (ws: WebSocket, req: Request) => void): void
    handleRequest: (req: Request) => Promise<Response>
  }

  export function createWebSocketServer(): WebSocketServer
}
