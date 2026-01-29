import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import ProfileStrengthMeter from "../components/ProfileStrengthMeter";
import Badges from "../components/Badges";
import { getAssetUrl } from "../utils/apiConfig";

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const isOwn = !id;
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interestStatus, setInterestStatus] = useState({ status: "none", direction: null });
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    religion: "",
    education: "",
    profession: "",
    city: "",
    state: "",
    height: "",
    maritalStatus: "",
    diet: "",
    smoking: "",
    drinking: "",
    about: ""
  });

  useEffect(() => {
    fetchProfile();
    if (!isOwn) fetchInterestStatus();
  }, [id]);

  const fetchInterestStatus = async () => {
    try {
      const { data } = await API.get(`/interest/status/${id}`);
      setInterestStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (isOwn) {
        const res = await API.get("/profile/me");
        setProfile(res.data);
        setForm(res.data);
      } else {
        const res = await API.get(`/profile/${id}`);
        setProfile(res.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file) => {
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const res = await API.post("/profile/photo", fd);
      setProfile({ ...profile, photo: res.data.photo });
      alert("Photo uploaded successfully!");
    } catch (err) {
      alert("Failed to upload photo");
    }
  };

  const save = async () => {
    try {
      const res = await API.put("/profile/update", form);
      setProfile(res.data);
      setEdit(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const sendInterest = async () => {
    try {
      await API.post("/interest/send", { toUserId: id });
      setInterestStatus({ status: "pending", direction: "sent", exists: true });
      alert("Request sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send interest");
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) return <p>Profile not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Strength Meter - Only for own profile */}
        {isOwn && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <ProfileStrengthMeter userId={currentUser?._id} />
          </motion.div>
        )}

        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                {preview || profile.photo ? (
                  <img
                    src={preview || getAssetUrl(profile.photo)}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name?.[0]
                )}
              </div>
              
              {isOwn && (
                <label className="absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                {profile.verified && (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">✓ Verified</span>
                )}
                {profile.isPremium && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">⭐ Premium</span>
                )}
              </div>
              
              <p className="text-gray-600 text-lg mb-4">
                {calculateAge(profile.dob)} years • {profile.gender} • {profile.city || "Location not set"}
              </p>

              {/* Match Score (for other profiles) */}
              {!isOwn && profile.matchScore !== undefined && (
                <div className="mb-4">
                  <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                    {profile.matchScore}% Match • {profile.matchLabel}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                {isOwn ? (
                  <button 
                    onClick={() => setEdit(!edit)} 
                    className={edit ? "btn-outline" : "btn-primary"}
                  >
                    {edit ? "Cancel" : "✏️ Edit Profile"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={sendInterest}
                      disabled={interestStatus.status === "pending" || interestStatus.status === "accepted"}
                      className={`btn-primary ${
                        interestStatus.status === "pending" || interestStatus.status === "accepted"
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {interestStatus.status === "pending" ? "Request Sent" : "❤️ Send Interest"}
                    </button>
                    {interestStatus.status === "accepted" ? (
                      <a
                        href={`/chat/${id}`}
                        className="btn-secondary"
                      >
                        💬 Message
                      </a>
                    ) : (
                      <button
                        disabled
                        className="btn-secondary opacity-60 cursor-not-allowed"
                        title="Wait for acceptance to chat"
                      >
                        💬 Message
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-2xl font-bold gradient-text mb-4">Personal Information</h2>
            
            {edit ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={form.name || ""}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={form.dob?.split('T')[0] || ""}
                    onChange={e => setForm({ ...form, dob: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={form.gender || ""}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="text"
                    placeholder="e.g., 5'8&quot;"
                    value={form.height || ""}
                    onChange={e => setForm({ ...form, height: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    value={form.maritalStatus || ""}
                    onChange={e => setForm({ ...form, maritalStatus: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="never married">Never Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <select
                    value={form.religion || ""}
                    onChange={e => setForm({ ...form, religion: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow icon="🎂" label="Age" value={calculateAge(profile.dob) + " years"} />
                <InfoRow icon="⚧️" label="Gender" value={profile.gender} />
                <InfoRow icon="📏" label="Height" value={profile.height} />
                <InfoRow icon="💍" label="Marital Status" value={profile.maritalStatus} />
                <InfoRow icon="🕉️" label="Religion" value={profile.religion} />
              </div>
            )}
          </motion.div>

          {/* Professional & Location */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-bold gradient-text mb-4">Professional & Location</h2>
            
            {edit ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <select
                    value={form.education || ""}
                    onChange={e => setForm({ ...form, education: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer"
                    value={form.profession || ""}
                    onChange={e => setForm({ ...form, profession: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Mumbai"
                    value={form.city || ""}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g., Maharashtra"
                    value={form.state || ""}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow icon="🎓" label="Education" value={profile.education} />
                <InfoRow icon="💼" label="Profession" value={profile.profession} />
                <InfoRow icon="📍" label="City" value={profile.city} />
                <InfoRow icon="🗺️" label="State" value={profile.state} />
              </div>
            )}
          </motion.div>

          {/* Lifestyle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-2xl font-bold gradient-text mb-4">Lifestyle</h2>
            
            {edit ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diet</label>
                  <select
                    value={form.diet || ""}
                    onChange={e => setForm({ ...form, diet: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="eggetarian">Eggetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Smoking</label>
                  <select
                    value={form.smoking || ""}
                    onChange={e => setForm({ ...form, smoking: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="no">No</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drinking</label>
                  <select
                    value={form.drinking || ""}
                    onChange={e => setForm({ ...form, drinking: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="no">No</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow icon="🥗" label="Diet" value={profile.diet} />
                <InfoRow icon="🚭" label="Smoking" value={profile.smoking} />
                <InfoRow icon="🍷" label="Drinking" value={profile.drinking} />
              </div>
            )}
          </motion.div>

          {/* About */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-2xl font-bold gradient-text mb-4">About Me</h2>
            
            {edit ? (
              <textarea
                value={form.about || ""}
                onChange={e => setForm({ ...form, about: e.target.value })}
                className="input-field min-h-32"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {profile.about || "No description available."}
              </p>
            )}
          </motion.div>
        </div>

        {/* Match Breakdown (for other profiles) */}
        {!isOwn && profile.matchBreakdown && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card mt-6"
          >
            <h2 className="text-2xl font-bold gradient-text mb-4">Compatibility Breakdown</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(profile.matchBreakdown).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium text-gray-700">{key}</span>
                    <span className="font-bold text-primary-600">{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-600 h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        {edit && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <button onClick={save} className="btn-primary px-12 py-4 text-lg">
              💾 Save Profile
            </button>
          </motion.div>
        )}

        {/* Achievement Badges */}
        {isOwn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Badges userId={currentUser?._id} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper Component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 text-gray-700">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value || "Not specified"}</p>
    </div>
  </div>
);
