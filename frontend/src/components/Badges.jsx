import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

const Badges = ({ userId }) => {
  const [badges, setBadges] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBadges([]);
      setProgress(null);
      setLoading(false);
      return;
    }
    fetchBadges();
    fetchProgress();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      const response = await API.get(`/badges/${userId}`);
      setBadges(response.data);
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await API.get(`/badges/${userId}/progress`);
      setProgress(response.data);
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: "bg-gray-100 border-gray-300",
      uncommon: "bg-blue-100 border-blue-300",
      rare: "bg-purple-100 border-purple-300",
      epic: "bg-amber-100 border-amber-300",
    };
    return colors[rarity] || colors.common;
  };

  const rarityEmoji = {
    common: "⚪",
    uncommon: "🔵",
    rare: "💜",
    epic: "👑",
  };

  if (loading) {
    return <div className="text-center py-8">Loading badges...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          🏆 Achievements
        </h3>
        <p className="text-sm text-gray-600">
          Earn badges by completing activities
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge._id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.1 }}
            className={`p-3 rounded-lg text-center border-2 cursor-pointer transition-all ${getRarityColor(badge.rarity)}`}
            title={badge.description}
          >
            <div className="text-2xl mb-1">{badge.title?.split(" ")[badge.title.split(" ").length - 1] || "🎖️"}</div>
            <p className="text-xs font-semibold text-gray-800 line-clamp-2">
              {badge.title}
            </p>
            <span className="text-xs text-gray-600">
              {rarityEmoji[badge.rarity]}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Next Achievements */}
      {progress && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">
            🎯 Unlock Next Badges
          </h4>
          <div className="space-y-3">
            {/* Likes Progress */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  👍 Popular
                </span>
                <span className="text-sm font-bold text-gray-600">
                  {progress.likesReceived}/5
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.likesReceived / 5) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>

            {/* Messages Progress */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  💬 Great Talker
                </span>
                <span className="text-sm font-bold text-gray-600">
                  {progress.messagesExchanged}/50
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(progress.messagesExchanged / 50) * 100}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>

            {/* Daily Streak */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  🔥 On Fire
                </span>
                <span className="text-sm font-bold text-gray-600">
                  {progress.dailyStreak} day streak
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((progress.dailyStreak / 7) * 100, 100)}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Badges;
