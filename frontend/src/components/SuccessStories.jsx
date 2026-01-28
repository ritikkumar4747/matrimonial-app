import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get("/api/success-stories/featured");
      setStories(response.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleLike = async (storyId) => {
    try {
      await axios.post(
        `/api/success-stories/${storyId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Update story likes
      setStories(
        stories.map((s) =>
          s._id === storyId ? { ...s, likes: s.likes + 1 } : s
        )
      );
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-3xl mb-2">💕</div>
        <p className="text-gray-600">Loading success stories...</p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-600">No success stories yet. Be the first!</p>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6">
        <h2 className="text-2xl font-bold text-white">💍 Success Stories</h2>
        <p className="text-pink-100 text-sm mt-1">
          {stories.length} couples found love
        </p>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory._id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="mb-6"
          >
            {/* Couple Info */}
            <div className="flex gap-4 mb-6">
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={currentStory.couple?.photo1 || "/default-avatar.png"}
                alt={currentStory.couple?.name1}
                className="w-16 h-16 rounded-full object-cover border-4 border-pink-200"
              />
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-3xl"
                >
                  💕
                </motion.div>
              </div>
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={currentStory.couple?.photo2 || "/default-avatar.png"}
                alt={currentStory.couple?.name2}
                className="w-16 h-16 rounded-full object-cover border-4 border-pink-200"
              />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {currentStory.couple?.name1} & {currentStory.couple?.name2}
            </h3>

            {/* Meta Info */}
            <div className="flex gap-4 mb-4 text-sm text-gray-600">
              <span>💑 {currentStory.status || "Dating"}</span>
              <span>📍 {currentStory.user1Id?.city || "India"}</span>
            </div>

            {/* Story */}
            <p className="text-gray-700 leading-relaxed mb-4">
              "{currentStory.story}"
            </p>

            {/* Stats */}
            <div className="flex gap-6 py-4 border-t border-b border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-500">
                  {currentStory.likes}
                </p>
                <p className="text-xs text-gray-600">Likes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-500">
                  {currentStory.howTheyMet ? "✨" : "-"}
                </p>
                <p className="text-xs text-gray-600">
                  {currentStory.howTheyMet || "How"}
                </p>
              </div>
              <div className="flex-1 text-right">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLike(currentStory._id)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  💗
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStory}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            ←
          </motion.button>

          <div className="flex gap-1">
            {stories.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? "w-6 bg-pink-500" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStory}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            →
          </motion.button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          {currentIndex + 1} of {stories.length}
        </p>
      </div>
    </motion.div>
  );
};

export default SuccessStories;
