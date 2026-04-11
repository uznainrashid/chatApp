import jwt from 'jsonwebtoken';
import chatHandlers from './chatHandler.js';

const onlineUsers = new Map();

export const socketManager = (io) => {
  // Middleware: Connection se pehle hi token check kar lo
  io.use((socket, next) => {
    const token = socket.handshake.headers.authorization;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN); 
      socket.userId = decoded.id;
      socket.name = decoded.name; // User info ko socket object mein attach kar di
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection',  (socket) => {
    console.log(`User Connected: ${socket.name} (Socket ID:${socket.id})`);

    // User ko uski apni ID ke room mein join karwayein
    socket.join(socket.userId);
    onlineUsers.set(socket.userId, socket.id);

    // Handlers register karein
    chatHandlers(io, socket, onlineUsers);

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      console.log(` User Disconnected: ${socket.name}`);
    });
  });
};