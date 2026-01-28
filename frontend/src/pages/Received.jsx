import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Received() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const res = await API.get("/interest/received");
      setList(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const update = async (id, status) => {
    try {
      await API.put(`/interest/${id}`, { status });
      setList(list.filter(i => i._id !== id));
      const message = status === "accepted" 
        ? "✅ Interest accepted! You can now chat." 
        : "❌ Interest rejected.";
      alert(message);
    } catch (err) {
      alert("Failed to update interest");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="section-title">Received Interests</h1>
        <p className="text-gray-600 text-lg">
          {list.length} {list.length === 1 ? 'person' : 'people'} showed interest in you
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💌</div>
          <h3 className="text-2xl font-bold text-gray-700">No interests yet</h3>
          <p className="text-gray-500 mt-2">Complete your profile to get more visibility</p>
          <Link to="/profile" className="btn-primary mt-6 inline-block">
            Update Profile
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((interest, index) => (
            <motion.div
              key={interest._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-xl"
            >
              {/* Profile Image */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {interest.from.photo ? (
                    <img 
                      src={`http://localhost:5000${interest.from.photo}`} 
                      alt={interest.from.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    interest.from.name?.[0]
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{interest.from.name}</h3>
                  <p className="text-sm text-gray-500">
                    {interest.from.city} • {interest.from.profession}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => update(interest._id, "accepted")}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  ✓ Accept
                </button>
                <button
                  onClick={() => update(interest._id, "rejected")}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  ✗ Reject
                </button>
              </div>

              <Link
                to={`/profile/${interest.from._id}`}
                className="block text-center mt-3 text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                View Full Profile →
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
