import Interest from "../models/Interest.js";
import User from "../models/User.js";

/* SEND INTEREST */
export const sendInterest = async (req, res) => {
  const { toUserId } = req.body;

  if (!toUserId) return res.status(400).json({ message: "Target required" });

  const exists = await Interest.findOne({
    from: req.user._id,
    to: toUserId
  });

  if (exists) return res.status(400).json({ message: "Already sent" });

  const interest = await Interest.create({
    from: req.user._id,
    to: toUserId
  });

  res.status(201).json(interest);
};

/* RECEIVED */
export const getReceived = async (req, res) => {
  const list = await Interest.find({ to: req.user._id, status: "pending" })
    .populate("from", "name city profession photo");
  res.json(list);
};

/* SENT */
export const getSent = async (req, res) => {
  const list = await Interest.find({ from: req.user._id })
    .populate("to", "name city profession");
  res.json(list);
};

/* UPDATE STATUS */
export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const interest = await Interest.findById(id);
  if (!interest) return res.status(404).json({ message: "Not found" });

  if (interest.to.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });

  interest.status = status;
  await interest.save();

  res.json(interest);
};
export const getMutualMatches = async (req, res) => {
  try {
    // Get all interests where BOTH sides have accepted
    // Case 1: I sent interest AND they sent me interest (both accepted)
    const mutualInterests = await Interest.find({
      from: req.user._id,
      status: "accepted"
    }).populate("to", "name city profession photo verified isPremium dob gender");

    // Get matching interests where they sent me something
    const theirInterests = await Interest.find({
      to: req.user._id,
      status: "accepted"
    }).populate("from", "name city profession photo verified isPremium dob gender");

    // Combine and get unique users
    const mutualUserMap = new Map();

    mutualInterests.forEach(interest => {
      mutualUserMap.set(interest.to._id.toString(), interest.to);
    });

    theirInterests.forEach(interest => {
      mutualUserMap.set(interest.from._id.toString(), interest.from);
    });

    res.json(Array.from(mutualUserMap.values()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET STATUS BETWEEN TWO USERS */
export const getInterestStatus = async (req, res) => {
  const { userId } = req.params;

  const interest = await Interest.findOne({
    $or: [
      { from: req.user._id, to: userId },
      { from: userId, to: req.user._id }
    ]
  });

  if (!interest) {
    return res.json({ exists: false, status: "none", direction: null });
  }

  const direction = interest.from.toString() === req.user._id.toString() ? "sent" : "received";

  return res.json({
    exists: true,
    status: interest.status,
    direction,
    interestId: interest._id
  });
};
