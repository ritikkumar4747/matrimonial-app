import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer({ onOpenChatbot }) {
  const quickLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms & Conditions', href: '#terms' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Blog', href: '#blog' }
  ];

  const helpLinks = [
    { label: 'Contact Support', href: '#support' },
    { label: 'Report Issue', href: '#report' },
    { label: 'Request Feature', href: '#feature' },
    { label: 'Safety Tips', href: '#safety' }
  ];

  const contactChannels = [
    { icon: '📧', label: 'Email', value: 'support@matriomoney.com', href: 'mailto:support@matriomoney.com' },
    { icon: '📱', label: 'Phone', value: '+1 (800) MATRIO-1', href: 'tel:+18006287461' },
    { icon: '💬', label: 'Live Chat', value: 'Available 24/7', href: '#chat', onClick: onOpenChatbot },
    { icon: '🏢', label: 'Address', value: 'San Francisco, CA', href: '#address' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-300 mt-24 border-t border-gray-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <motion.div 
          className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white text-2xl font-bold mb-4">
              💕 MatrioMoney
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              AI-powered matchmaking platform built for meaningful connections. Finding your perfect match has never been easier.
            </p>
            <div className="flex gap-4">
              <motion.a 
                href="#twitter" 
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-white transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                𝕏
              </motion.a>
              <motion.a 
                href="#facebook" 
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-500 flex items-center justify-center text-white transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                f
              </motion.a>
              <motion.a 
                href="#instagram" 
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-500 flex items-center justify-center text-white transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                📷
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-6 text-lg flex items-center gap-2">
              🔗 Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Help & Support */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-6 text-lg flex items-center gap-2">
              🆘 Help & Support
            </h4>
            <ul className="space-y-3">
              {helpLinks.map((link, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Details */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-6 text-lg flex items-center gap-2">
              📞 Contact Us
            </h4>
            <div className="space-y-4">
              {contactChannels.map((channel, idx) => (
                <motion.button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    if (channel.onClick) {
                      channel.onClick();
                    } else if (channel.href.startsWith('mailto:') || channel.href.startsWith('tel:')) {
                      window.location.href = channel.href;
                    }
                  }}
                  className="w-full text-left p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600"
                  whileHover={{ translateY: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <p className="text-sm font-semibold text-white">{channel.icon} {channel.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{channel.value}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-800"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-white text-xl font-bold mb-2">📧 Stay Updated</h3>
              <p className="text-gray-400 text-sm">Get dating tips, success stories, and special offers delivered to your inbox.</p>
            </div>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
              <motion.button 
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold text-sm hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div 
          className="border-t border-gray-800 px-6 py-8"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} MatrioMoney. All rights reserved. 💑</p>
            <div className="flex gap-6 text-xs">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
