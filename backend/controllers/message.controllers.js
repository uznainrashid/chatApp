import { MessageModel } from "../models/message.js"
// controllers/messageController.js
export const getMessages = async (req, res) => {
  try {
    const { friendId } = req.params; // ZAIN ki ID
    const myId = req.user.id; // Aapki apni ID (Auth Middleware se)

    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: friendId },
        { senderId: friendId, receiverId: myId }
      ]
    }).sort({ timestamp: 1 }); // Purane messages pehle, naye baad mein

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Messages fetch karne mein masla hua" });
  }
};