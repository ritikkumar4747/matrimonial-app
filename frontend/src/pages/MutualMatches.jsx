import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import { getAssetUrl } from "../utils/apiConfig";

export default function MutualMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await API.get("/interest/mutual");
      setMatches(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="section-title">Mutual Matches 💑</h1>
        <p className="text-gray-600 text-lg">
          {matches.length} mutual {matches.length === 1 ? 'match' : 'matches'} • You both liked each other!
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-2xl font-bold text-gray-700">No mutual matches yet</h3>
          <p className="text-gray-500 mt-2">Keep exploring and sending interests!</p>
          <Link to="/matches" className="btn-primary mt-6 inline-block">
            Discover Matches
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              {/* Profile Photo */}
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-5xl font-bold overflow-hidden shadow-lg">
                  {user.photo ? (
                    <img
                      src={getAssetUrl(user.photo)}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.[0]
                  )}
                </div>
              </div>

              {/* User Info */}
              <h3 className="text-xl font-bold text-center text-gray-800">
                {user.name}
              </h3>
              <p className="text-center text-gray-600 mt-1">
                {user.city} • {user.profession}
              </p>

              {/* Matched Badge */}
              <div className="flex justify-center mt-4">
                <span className="badge bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  ✓ Matched
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Link
                  to={`/profile/${user._id}`}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300"
                >
                  View Profile
                </Link>
                <Link
                  to={`/chat/${user._id}`}
                  className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                  title="Start Chat"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </Link>
              </div>
              
              {/* Call Buttons */}
              <div className="flex gap-2 mt-3">
                <Link
                  to={`/chat/${user._id}?call=audio`}
                  className="flex-1 py-2 px-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  title="Audio Call"
                >
                  <span className="text-lg">📞</span>
                  <span className="text-sm font-medium">Call</span>
                </Link>
                <Link
                  to={`/chat/${user._id}?call=video`}
                  className="flex-1 py-2 px-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                  title="Video Call"
                >
                  <span className="text-lg">🎥</span>
                  <span className="text-sm font-medium">Video</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
