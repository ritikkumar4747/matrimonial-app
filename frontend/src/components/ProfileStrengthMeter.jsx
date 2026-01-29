import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

const ProfileStrengthMeter = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfileData(null);
      setLoading(false);
      return;
    }
    fetchProfileStrength();
  }, [userId]);

  const fetchProfileStrength = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/profile-strength/${userId}`);
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile strength:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  const { score, percentage, level, breakdown, suggestions } = profileData;

  const getStrengthColor = (score) => {
    if (score >= 80) return "from-green-400 to-emerald-500";
    if (score >= 60) return "from-blue-400 to-cyan-500";
    if (score >= 40) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-rose-500";
  };

  const getStrengthLabel = (level) => {
    const labels = {
      excellent: "Perfect! 🌟",
      good: "Great Profile 👍",
      fair: "Getting Better 📈",
      poor: "Build it up 💪"
    };
    return labels[level] || "Keep Going!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">📊 Profile Strength</h3>
        <span className={`text-3xl font-bold bg-gradient-to-r ${getStrengthColor(score)} bg-clip-text text-transparent`}>
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getStrengthColor(score)} shadow-lg`}
          />
        </div>
      </div>

      {/* Strength Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-base font-semibold text-gray-700 mb-6 text-center"
      >
        {getStrengthLabel(level)}
      </motion.p>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-lg border ${
            breakdown.photos.status === "complete"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
              : breakdown.photos.status === "partial"
              ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Photos</span>
            <span className="text-xs font-bold text-gray-600">{breakdown.photos.score}/{breakdown.photos.max}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(breakdown.photos.score / breakdown.photos.max) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-lg border ${
            breakdown.basicInfo.status === "complete"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
              : breakdown.basicInfo.status === "partial"
              ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Basic Info</span>
            <span className="text-xs font-bold text-gray-600">{breakdown.basicInfo.score}/{breakdown.basicInfo.max}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(breakdown.basicInfo.score / breakdown.basicInfo.max) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-lg border ${
            breakdown.detailedInfo.status === "complete"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
              : breakdown.detailedInfo.status === "partial"
              ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Details</span>
            <span className="text-xs font-bold text-gray-600">{breakdown.detailedInfo.score}/{breakdown.detailedInfo.max}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(breakdown.detailedInfo.score / breakdown.detailedInfo.max) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-4 rounded-lg border ${
            breakdown.verification.status === "complete"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Verified</span>
            <span className="text-xs font-bold text-gray-600">{breakdown.verification.score}/{breakdown.verification.max}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(breakdown.verification.score / breakdown.verification.max) * 100}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>💡</span> Get to 100%:
          </h4>
          <div className="space-y-2">
            {suggestions.map((sug, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex justify-between items-start p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-gray-700 font-medium">{sug}</p>
                <span className="text-lg">→</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileStrengthMeter;
