class MockWebSocketServer {
  private clients: Set<WebSocket> = new Set();

  start() {
    // Simulierte Marktdaten alle 2 Sekunden
    setInterval(() => {
      this.broadcast({
        channel: 'prices',
        payload: {
          instrumentId: 'ES1!',
          price: 4000 + Math.random() * 10,
          timestamp: Date.now()
        }
      });
    }, 2000);

    // Simulierte Position Updates alle 5 Sekunden
    setInterval(() => {
      this.broadcast({
        channel: 'position-updates',
        payload: {
          id: '1',
          instrumentId: 'ES1!',
          entryPrice: 4000,
          currentPrice: 4000 + Math.random() * 10,
          direction: 'LONG',
          size: 1,
          pnl: Math.random() * 100 - 50,
          status: 'OPEN'
        }
      });
    }, 5000);
  }

  broadcast(data: any) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  addClient(ws: WebSocket) {
    this.clients.add(ws);
    ws.onclose = () => this.clients.delete(ws);
  }
}

export const mockServer = new MockWebSocketServer();
mockServer.start(); // Server beim Import starten 