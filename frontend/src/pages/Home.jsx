import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import ParticlesBackground from "../components/ParticlesBackground";
import EnhancedBackground from "../components/EnhancedBackground";
import SuccessStories from "../components/SuccessStories";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    { icon: "📹", title: "WebRTC Video & Voice", desc: "Private, peer-to-peer HD calling with crystal audio and zero lag" },
    { icon: "✅", title: "Verified Profiles", desc: "100% authentic background checked singles and genuine profiles" },
    { icon: "💬", title: "Real-Time Messaging", desc: "Instant private messaging powered by Socket.io with zero delay" },
    { icon: "🎯", title: "Compatibility Scoring", desc: "Intelligent compatibility based on lifestyle, values & habits" },
    { icon: "💎", title: "Direct Connections", desc: "Express interest, receive mutual matches, and connect safely" },
    { icon: "🔒", title: "Privacy First", desc: "Granular photo visibility and full control over your contact details" }
  ];

  const benefits = [
    { emoji: "🛡️", title: "Verified Profiles", desc: "Multi-tier identity verification" },
    { emoji: "📹", title: "WebRTC HD Calling", desc: "Private face-to-face video & voice" },
    { emoji: "💬", title: "Instant Chat", desc: "Real-time messaging with read receipts" },
    { emoji: "🎯", title: "Compatibility Matching", desc: "Shared values & lifestyle alignment" },
    { emoji: "🔒", title: "Privacy Controls", desc: "Your personal data is always protected" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced progressive background with split complementary colors */}
      <EnhancedBackground baseHue={220} intensity="medium" />

      {/* Legacy gradient for fallback */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#2373E7]/10 via-white to-[#E723C1]/10 -z-10" />

      <ParticlesBackground />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4">
                <span
                  className="px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, var(--c1), var(--c2))",
                    color: "white",
                  }}
                >
                  ✨ Verified & Authentic Matchmaking
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 text-gray-900">
                Find Your
                <span
                  className="block mt-2"
                  style={{
                    background: "linear-gradient(135deg, var(--c1), var(--c3), var(--c5))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Perfect Match
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of genuine singles and happy families who found lifelong love through
                our trusted matrimonial platform. Your soulmate is just a step away! 💕
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-block px-8 py-4 rounded-xl text-white font-bold text-lg shadow-2xl transform transition-all duration-300"
                    style={{
                      background: "linear-gradient(135deg, var(--c1), var(--c3), var(--c5))",
                      boxShadow: "0 20px 40px rgba(35, 115, 231, 0.3)",
                    }}
                  >
                    Get Started Free →
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="inline-block px-8 py-4 rounded-xl font-bold text-lg border-2 hover:shadow-lg transition-all duration-300"
                    style={{
                      borderColor: "var(--c3)",
                      color: "var(--c3)",
                      backgroundColor: "rgba(111, 35, 231, 0.05)",
                    }}
                  >
                    Login
                  </Link>
                </motion.div>
              </div>

              {/* Stats with hover animations */}
              <div className="grid grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ scale: 1.08 }}
                  className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm"
                >
                  <p className="text-3xl font-extrabold" style={{ color: "var(--c1)" }}>
                    10K+
                  </p>
                  <p className="text-sm font-medium text-gray-600 mt-1">Verified Members</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.08 }}
                  className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm"
                >
                  <p className="text-3xl font-extrabold" style={{ color: "var(--c3)" }}>
                    100%
                  </p>
                  <p className="text-sm font-medium text-gray-600 mt-1">Privacy Safe</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.08 }}
                  className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm"
                >
                  <p className="text-3xl font-extrabold" style={{ color: "var(--c5)" }}>
                    2.5K+
                  </p>
                  <p className="text-sm font-medium text-gray-600 mt-1">Happy Couples</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Interactive Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Floating gradient blob behind card */}
              <motion.div
                className="absolute -top-10 -right-10 w-72 h-72 rounded-full filter blur-3xl opacity-30 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, var(--c1), var(--c3), var(--c5))",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Why Choose MatrioMoney?
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-rose-600">
                    Trusted
                  </span>
                </div>

                <ul className="space-y-4">
                  {benefits.map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-3 cursor-pointer group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.08 }}
                      whileHover={{ x: 8 }}
                    >
                      <motion.span
                        className="text-2xl flex-shrink-0"
                        whileHover={{ scale: 1.3, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {item.emoji}
                      </motion.span>
                      <div className="group-hover:translate-x-1 transition-transform">
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section ("Everything You Need") */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, var(--c1), var(--c4))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Modern communication standards tailored specifically for matrimonial integrity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 hover:-translate-y-2 cursor-pointer"
                whileHover={{ scale: 1.03 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, var(--c${(index % 5) + 1}), var(--c${((index + 2) % 5) + 1}))`,
                  }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, var(--c1), var(--c3), var(--c5))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🎉 Love Stories That Inspire
            </h2>
            <p className="text-xl text-gray-600">Real couples, real happiness</p>
          </motion.div>
          <SuccessStories limit={6} showPagination={false} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-12 text-center text-white shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--c1), var(--c2), var(--c3), var(--c4), var(--c5))",
            }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />

            {/* Floating particles effect */}
            <motion.div
              className="absolute top-5 left-1/4 w-2 h-2 rounded-full bg-white/40"
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            <motion.div
              className="absolute top-10 right-1/4 w-1.5 h-1.5 rounded-full bg-white/40"
              animate={{
                y: [0, -25, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.5,
              }}
            />

            <div className="relative z-10">
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Ready to Find Your Life Partner?
              </motion.h2>
              <motion.p
                className="text-xl mb-8 opacity-90"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Join thousands of success stories today!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-block px-10 py-4 bg-white rounded-xl font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl"
                  style={{ color: "var(--c3)" }}
                >
                  Create Free Account →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
