import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileStrengthMeter from "../components/ProfileStrengthMeter";
import Badges from "../components/Badges";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const storySteps = [
    { emoji: "💌", title: "You sent a heartfelt interest", detail: "to someone who matches your vibe" },
    { emoji: "✨", title: "They noticed you", detail: "and peeked at your profile" },
    { emoji: "💗", title: "Mutual spark", detail: "they’re thinking about saying yes" },
    { emoji: "🎉", title: "Chat unlocked", detail: "start a beautiful conversation" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2373E7]/10 via-white to-[#E723C1]/10 p-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur shadow-2xl border border-white/60 mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2373E7]/15 via-[#6F23E7]/20 to-[#E723C1]/15" />
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">Love Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight" style={{
              background: 'linear-gradient(135deg, var(--c1), var(--c3), var(--c5))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Your story is unfolding beautifully
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
              Keep the energy flowing—send interests, accept sparks, and unlock chats. Your perfect partner could be one click away.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/daily-match" className="px-6 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all" style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)'
              }}>💳 Daily Match</Link>
              <Link to="/matches" className="btn-primary">Explore Matches</Link>
              <Link to="/matches/mutual" className="btn-secondary">View Mutuals</Link>
              <Link to="/profile" className="btn-outline">Polish Profile</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-80">
            {[{ label: "New Matches", value: "12", gradient: "linear-gradient(135deg, #22c55e, #10b981)" },
              { label: "Mutual Interests", value: "5", gradient: "linear-gradient(135deg, #3b82f6, #6366f1)" },
              { label: "Requests Sent", value: "8", gradient: "linear-gradient(135deg, #a855f7, #ec4899)" },
              { label: "Chats Unlocked", value: "3", gradient: "linear-gradient(135deg, #f97316, #f59e0b)" }].map((stat) => (
              <div key={stat.label} className="rounded-2xl p-4 text-white shadow-lg" style={{
                background: stat.gradient
              }}>
                <p className="text-xs uppercase tracking-wide opacity-80">{stat.label}</p>
                <p className="text-2xl font-black mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storyline */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/60">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📖</span>
            <h2 className="text-2xl font-bold text-gray-800">Your Love Story</h2>
          </div>
          <div className="space-y-4">
            {storySteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-white to-[#f5f5ff] border border-white/80 shadow-sm">
                <div className="text-2xl">{step.emoji}</div>
                <div>
                  <p className="font-semibold text-gray-800">{step.title}</p>
                  <p className="text-sm text-gray-600">{step.detail}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">Step {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/60 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎧</span>
            <div>
              <p className="text-lg font-semibold">Set the mood</p>
              <p className="text-sm text-gray-600">Play a cozy lo-fi or romantic playlist while you chat.</p>
            </div>
          </div>
          <Link to="/matches" className="btn-primary w-full text-center">Find Matches</Link>
          <Link to="/matches/mutual" className="btn-secondary w-full text-center">See Mutual Sparks</Link>
          <Link to="/received" className="btn-outline w-full text-center">Review Requests</Link>
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2325E7]/10 via-white to-[#E723C1]/10 text-sm text-gray-700">
            Tip: Only start messaging when a request is accepted. A little anticipation makes the first chat sweeter. 💕
          </div>
        </div>
      </div>

      {/* Profile Strength Meter */}
      {user && (
        <div className="mt-10">
          <ProfileStrengthMeter userId={user._id} />
        </div>
      )}

      {/* Achievement Badges */}
      {user && (
        <div className="mt-10">
          <Badges userId={user._id} />
        </div>
      )}
    </div>
  );
}
