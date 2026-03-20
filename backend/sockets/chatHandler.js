import { MessageModel } from "../models/message.js";

 const chatHandlers = async (io, socket, onlineUsers) => {
  // 1. Message bhenje ki logic
 socket.on('send-private-message', async (data) => {

    const { recipientId, message } = data; 
    const senderId = socket.userId; // Ensure karein ke socketManager mein userId set ho rahi hai

    try {
        const newMessage = new MessageModel({
            senderId: senderId,    // Agar ye undefined hai toh error aayega
            receiverId: recipientId, // Agar ye undefined hai toh error aayega
            message: message,
            timestamp: new Date()
        });
        
        // Validation check
        if(!senderId || !recipientId) {
            return console.error("Error: senderId or recipientId is missing!");
        }

        await newMessage.save();
        io.to(recipientId).emit('receive-private-message', {
          ...newMessage._doc, // Database ka sara data
    senderId: senderId,
        });
        console.log("Recipient:", recipientId);
console.log("Online Users:", onlineUsers);

    } catch (err) {
        console.error("Mongoose Save Error:", err.message);
    }
});
// "typing" event ka handler
socket.on('typing', (data) => {
  socket.to(data.recipientId).emit('display-typing', { userId: socket.userId });
});
// "stop-typing" event ka handler
socket.on('stop-typing', (data) => {
  socket.to(data.recipientId).emit('hide-typing', { userId: socket.userId });
});
};

export default chatHandlers;