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
  const userId = isOwn ? currentUser?._id : id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(-1);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const endpoint = isOwn ? "/gallery/my" : `/gallery/${userId}`;
      const { data } = await API.get(endpoint);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
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
            {isOwn ? "📸 My Gallery" : "📸 Gallery"}
          </h1>
          <p className="text-gray-600">
            {isOwn
              ? "Share your moments. Let others see the real you!"
              : "Explore their beautiful moments"}
          </p>
        </motion.div>

        {/* Upload Section - Own Profile Only */}
        {isOwn && (
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
                type="text"
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
                    className="w-full h-64 object-cover"
                  />
                  {isOwn && (
                    <button
                      onClick={() => deletePost(post._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Delete post"
                    >
                      🗑️
                    </button>
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
