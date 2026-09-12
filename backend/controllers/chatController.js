import Message from "../models/Message.js";
import Interest from "../models/Interest.js";

const ensureMutualAccepted = async (userId, otherId) => {
  const mutual = await Interest.findOne({
    $or: [
      { from: userId, to: otherId, status: "accepted" },
      { from: otherId, to: userId, status: "accepted" }
    ]
  });
  return Boolean(mutual);
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const allowed = await ensureMutualAccepted(req.user._id, userId);
    if (!allowed) return res.status(403).json({ message: "Chat available only after mutual acceptance" });

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .populate("sender", "name photo")
    .populate("receiver", "name photo")
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiver, text, to } = req.body;
    const receiverId = receiver || to;

    const allowed = await ensureMutualAccepted(req.user._id, receiverId);
    if (!allowed) return res.status(403).json({ message: "Chat available only after mutual acceptance" });

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "name photo")
      .populate("receiver", "name photo");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
