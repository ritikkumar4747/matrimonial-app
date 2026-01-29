import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

const SmartIcebreakers = ({ matchedUserId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!matchedUserId) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    fetchSuggestions();
  }, [matchedUserId]);

  const fetchSuggestions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const userId = user?._id || user?.id;
      if (!userId || !matchedUserId) {
        setSuggestions([]);
        return;
      }
      const response = await API.get(
        `/icebreakers/suggestions/${userId}?matchedUserId=${matchedUserId}`
      );
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (icebreakerMessage) => {
    try {
      if (!icebreakerMessage || !matchedUserId) {
        console.warn("Missing icebreakerMessage or matchedUserId");
        return;
      }
      
      // Send message via chat API
      await API.post(
        `/chat/send`,
        {
          receiver: matchedUserId,
          text: icebreakerMessage,
        }
      );

      // Track icebreaker usage
      if (suggestions[selectedIndex]) {
        await API.post(
          `/icebreakers/track/${suggestions[selectedIndex]._id}`,
          { converted: true }
        );
      }

      setSent(true);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send icebreaker message. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <p className="text-gray-600">Finding perfect opening lines...</p>
      </div>
    );
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 text-center border-2 border-green-200"
      >
        <div className="text-4xl mb-2">✨</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Message Sent!
        </h3>
        <p className="text-gray-600">Great opener! Fingers crossed for a reply 🤞</p>
      </motion.div>
    );
  }

  const currentSuggestion = suggestions[selectedIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
        <h3 className="text-xl font-bold text-white">
          💬 Smart Icebreaker
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          Personalized based on their interests
        </p>
      </div>

      <div className="p-6">
        {/* Success Rate Badge */}
        {currentSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          >
            ✓ {currentSuggestion.successRate}% success rate
          </motion.div>
        )}

        {/* Message Display */}
        {currentSuggestion && (
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200"
          >
            <p className="text-gray-900 text-lg font-semibold mb-2">
              {currentSuggestion.message}
            </p>
            {currentSuggestion.followUp && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-sm italic"
              >
                Follow up: "{currentSuggestion.followUp}"
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Category Badge */}
        {currentSuggestion && (
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
              #{currentSuggestion.category}
            </span>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          {suggestions.map((_, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedIndex(idx)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                idx === selectedIndex
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedIndex((prev) => (prev + 1) % suggestions.length)}
            className="py-3 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-all"
          >
            👉 More Ideas
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendMessage(currentSuggestion.message)}
            className="py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all shadow-lg"
          >
            ✈️ Send Message
          </motion.button>
        </div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500 text-center mt-4 italic"
        >
          💡 Personalized messages get {currentSuggestion?.successRate || 35}% more responses!
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SmartIcebreakers;
