import { getReciverSocketId, io } from "../socket/socket.js";
import Conversation from "../models/conversation.model.js";
import Messages from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Messages({
      senderId,
      receiverId,
      message,
    });

    if (conversation) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();

    await Promise.all([conversation.save(), newMessage.save()]);

    const recieverSocketId = getReciverSocketId(receiverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const user = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [user, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage controller: ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
