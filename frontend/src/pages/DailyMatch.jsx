import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const DailyMatch = () => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [swiped, setSwiped] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyMatch();
  }, []);

  const fetchDailyMatch = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `/api/daily-match/daily-match/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.swipedToday) {
        setError("You've already swiped today. Come back tomorrow!");
        setSwiped(true);
      } else {
        setMatch(response.data.match);
      }
    } catch (err) {
      setError(err.response?.data?.message || "No matches available");
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(
        `/api/daily-match/daily-match/${userId}/swipe`,
        {
          matchedUserId: match._id,
          action,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setSwiped(true);
      setError(
        action === "like"
          ? "✨ You liked this match!"
          : "👋 Profile passed"
      );
    } catch (err) {
      setError("Failed to record swipe");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Finding your perfect match...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Daily Match 💕
          </h1>
          <p className="text-gray-600">One perfect match every day</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {match && !swiped ? (
            <motion.div
              key="match-card"
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-96 bg-gradient-to-b from-pink-200 to-purple-200 overflow-hidden">
                <img
                  src={match.photos?.[0] || "/default-avatar.png"}
                  alt={match.name}
                  className="w-full h-full object-cover"
                />
                {/* Match Score Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow-lg"
                >
                  <span className="text-sm font-bold text-gray-800">
                    {match.matchScore}%
                  </span>
                  <span>🔥</span>
                </motion.div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Profile Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {match.name}
                  </h2>
                  <span className="text-2xl">{match.age}</span>
                </div>

                <p className="text-pink-600 font-semibold mb-1">
                  {match.profession}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  📍 {match.location}
                </p>

                <p className="text-gray-700 mb-6 line-clamp-3">
                  {match.bio}
                </p>

                {/* Match Reason */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 mb-6"
                >
                  <p className="text-sm text-gray-700">
                    <strong>Why we matched:</strong> {match.matchScore}% compatible
                    on location, interests, and values
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <button
                    onClick={() => handleSwipe("pass")}
                    className="py-3 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-all duration-300 hover:scale-105"
                  >
                    👋 Pass
                  </button>
                  <button
                    onClick={() => handleSwipe("like")}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    💕 Like
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                {error?.includes("liked") ? "✨" : "🎉"}
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error?.includes("liked")
                  ? "Match Liked! 💕"
                  : "Come Back Tomorrow"}
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyMatch;
