import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { getAssetUrl } from "../utils/apiConfig";

export default function Gallery() {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const isOwn = !id;
  const isFeed = !id; // If no ID in URL, show feed
  const userId = id || currentUser?._id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(-1);
  const [caption, setCaption] = useState("");
  const [viewMode, setViewMode] = useState("feed"); // "feed" or "my"

  useEffect(() => {
    fetchPosts();
  }, [userId, viewMode]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let endpoint;
      
      if (isFeed && viewMode === "feed") {
        endpoint = "/gallery/feed"; // All mutually matched users
      } else if (isFeed && viewMode === "my") {
        endpoint = "/gallery/my"; // Only my posts
      } else {
        endpoint = `/gallery/${userId}`; // Specific user
      }
      
      const { data } = await API.get(endpoint);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (err.response?.status === 403) {
        alert("You can only view gallery of mutually matched users");
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(0);
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("caption", caption);

      const { data } = await API.post("/gallery/upload", fd);
      setPosts((prev) => [data, ...prev]);
      setCaption("");
      alert("Photo uploaded successfully!");
    } catch (err) {
      alert("Failed to upload photo");
      console.error(err);
    } finally {
      setUploadingIndex(-1);
    }
  };

  const deletePost = async (postId) => {
    if (!confirm("Delete this post?")) return;
    try {
      await API.delete(`/gallery/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      alert("Post deleted");
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isFeed ? "📸 Gallery" : "📸 User Gallery"}
          </h1>
          <p className="text-gray-600">
            {isFeed
              ? "Explore moments from your matches"
              : "View their beautiful moments"}
          </p>

          {/* View Mode Toggle (only for own gallery) */}
          {isFeed && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setViewMode("feed")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "feed"
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                🌟 Feed
              </button>
              <button
                onClick={() => setViewMode("my")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "my"
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                📷 My Posts
              </button>
            </div>
          )}
        </motion.div>

        {/* Upload Section - Only for My Posts */}
        {isFeed && viewMode === "my" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-dashed border-primary-300"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Post</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center w-full">
                <label className="w-full px-6 py-8 border-2 border-dashed border-primary-300 rounded-xl cursor-pointer hover:bg-primary-50 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-primary-500 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPhoto}
                    className="hidden"
                    disabled={uploadingIndex !== -1}
                  />
                </label>
              </div>

              <input
                tFeed && viewMode === "feed"
                ? "No posts from your matches yet"
                : isFeed && viewMode === "my"="text"
                placeholder="Add a caption... (optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </motion.div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow"
          >
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500">
              {isOwn
                ? "Start by uploading your first photo!"
                : "This gallery is empty"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {posts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={getAssetUrl(post.photo)}
                    alt={post.caption}
                   viewMode === "my" && post.user?._id === currentUser?._id && (
                    <button
                      onClick={() => deletePost(post._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Delete post"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                {/* User Info (for feed view) */}
                {viewMode === "feed" && post.user && (
                  <div className="p-3 border-b border-gray-200 flex items-center gap-3">
                    <img
                      src={getAssetUrl(post.user.photo)}
                      alt={post.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold text-gray-800">
                      {post.user.name}
                    </span>
                  </div>
                )}button>
                  )}
                </div>

                {post.caption && (
                  <div className="p-4 border-t border-gray-200">
                    <p className="text-gray-700">{post.caption}</p>
                  </div>
                )}

                <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
