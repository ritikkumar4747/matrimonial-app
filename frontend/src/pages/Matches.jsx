import { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Matches() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: "",
    religion: "",
    city: "",
    minAge: "",
    maxAge: "",
    education: "",
    sortBy: "matchScore"
  });
  const [requestStatus, setRequestStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMatches();
  }, [filters, currentPage]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: currentPage,
        limit: 12
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => 
        (params[key] === "" || params[key] === undefined) && delete params[key]
      );

      const { data } = await API.get("/profile/all", { params });
      setUsers(data.users || data);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return fetchMatches();
    
    try {
      setLoading(true);
      const { data } = await API.get("/profile/search", {
        params: { query: searchQuery, gender: filters.gender }
      });
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const sendInterest = async (userId) => {
    try {
      await API.post("/interest/send", { toUserId: userId });
      setRequestStatus(prev => ({ ...prev, [userId]: "pending" }));
      alert("Interest sent successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send interest");
    }
  };

  const getMatchColor = (score) => {
    if (score >= 85) return "from-green-500 to-emerald-600";
    if (score >= 70) return "from-blue-500 to-indigo-600";
    if (score >= 55) return "from-purple-500 to-pink-600";
    if (score >= 40) return "from-orange-500 to-yellow-600";
    return "from-gray-500 to-gray-600";
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="section-title">Discover Your Perfect Match</h1>
        <p className="text-gray-600 text-lg">
          AI-powered matching • {users.length} profiles found
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-8"
      >
        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name, profession, city..."
            className="input-field flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <select
            className="input-field"
            value={filters.gender}
            onChange={(e) => setFilters({...filters, gender: e.target.value})}
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            className="input-field"
            value={filters.religion}
            onChange={(e) => setFilters({...filters, religion: e.target.value})}
          >
            <option value="">All Religions</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Christian">Christian</option>
            <option value="Sikh">Sikh</option>
            <option value="Buddhist">Buddhist</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="City"
            className="input-field"
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
          />

          <input
            type="number"
            placeholder="Min Age"
            className="input-field"
            value={filters.minAge}
            onChange={(e) => setFilters({...filters, minAge: e.target.value})}
          />

          <input
            type="number"
            placeholder="Max Age"
            className="input-field"
            value={filters.maxAge}
            onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
          />

          <select
            className="input-field"
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          >
            <option value="matchScore">Best Match</option>
            <option value="recent">Recent</option>
            <option value="views">Popular</option>
          </select>
        </div>
      </motion.div>

      {/* Matches Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-2xl font-bold text-gray-700">No matches found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="match-card group"
              >
                {/* Profile Image */}
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
                  {user.photo ? (
                    <img
                      src={`http://localhost:5000${user.photo}`}
                      alt={user.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                  
                  {/* Match Score Badge */}
                  {user.matchScore !== undefined && (
                    <div className="absolute top-4 right-4">
                      <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getMatchColor(user.matchScore)} text-white font-bold text-sm shadow-lg`}>
                        {user.matchScore}% Match
                      </div>
                    </div>
                  )}

                  {/* Verified Badge */}
                  {user.verified && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        Verified
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 hover:text-primary-600 transition-colors">
                        {user.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {calculateAge(user.dob)} years
                      </p>
                    </div>
                    {user.isPremium && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ Premium
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {user.profession && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{user.profession}</span>
                      </div>
                    )}
                    
                    {user.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{user.city}</span>
                      </div>
                    )}
                    
                    {user.education && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        <span className="truncate">{user.education}</span>
                      </div>
                    )}

                    {user.religion && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="truncate">{user.religion}</span>
                      </div>
                    )}
                  </div>

                  {/* Match Label */}
                  {user.matchLabel && (
                    <div className="mb-4">
                      <span className={`badge ${
                        user.matchScore >= 85 ? 'badge-success' : 
                        user.matchScore >= 70 ? 'bg-blue-100 text-blue-800' : 
                        'badge-warning'
                      }`}>
                        {user.matchLabel}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/profile/${user._id}`}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => sendInterest(user._id)}
                      disabled={requestStatus[user._id] === "pending"}
                      className={`p-2 rounded-xl transition-colors ${
                        requestStatus[user._id] === "pending"
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-pink-100 text-pink-600 hover:bg-pink-200"
                      }`}
                      title={requestStatus[user._id] === "pending" ? "Request sent" : "Send Interest"}
                    >
                      {requestStatus[user._id] === "pending" ? (
                        <span className="text-sm font-semibold">Sent</span>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 rounded-xl bg-white shadow disabled:opacity-50 hover:shadow-lg transition-all"
              >
                ← Previous
              </button>
              
              <span className="text-gray-600 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 rounded-xl bg-white shadow disabled:opacity-50 hover:shadow-lg transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
