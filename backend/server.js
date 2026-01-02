import express from 'express';
import dotenv from 'dotenv';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  //   connect deepgram after client connection

  const deepgram = new WebSocket(
    'wss://api.deepgram.com/v2/listen?model=flux-general-en&encoding=linear16&sample_rate=16000',
    ['token', process.env.DEEPGRAM_API_KEY]
  );

  //   Deepgram event handlers
  deepgram.on('open', () => {
    console.log('Deepgram connection opened');
  });

  deepgram.on('message', (data) => {
    console.log('Deepgram message received:', data.toString());
    ws.send(data.toString());
  });

  ws.on('message', (data) => {
    deepgram.send(data);
  });

  ws.on('close', () => {
    if (deepgram.readyState === WebSocket.OPEN) {
      deepgram.close();
    }
  });

  ws.on('error', () => {});
});

server.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
