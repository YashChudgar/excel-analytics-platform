import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub, FaChevronRight } from 'react-icons/fa';

const Breadcrumb = () => (
  <motion.nav
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-sm font-medium text-blue-800 mb-8"
    aria-label="Breadcrumb"
  >
    <ol className="flex flex-wrap items-center space-x-2 sm:space-x-3">
      <li>
        <a href="/" className="text-blue-700 hover:text-purple-700 transition-colors font-semibold">
          Home
        </a>
      </li>
      <li>
        <FaChevronRight className="text-blue-400 text-xs" />
      </li>
      <li>
        <span className="text-blue-900 font-bold">Contact</span>
      </li>
    </ol>
  </motion.nav>
);

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message }),
});


      const data = await response.json();
      alert(data.message);
      e.target.reset();
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 px-4 py-10 pt-25">
      {/* ✅ Breadcrumb Section */}
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start"
      >
        {/* Left Side - Contact Info */}
        <div className="space-y-6 text-blue-800">
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="text-lg text-blue-700">We’d love to hear your thoughts, questions, or ideas. Reach out anytime!</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaPhone className="text-blue-600" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600" />
              <span>support@excellytics.ai</span>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-500" />
              <span>Ahmedabad, Gujarat, India</span>
            </div>
            <div className="flex items-center gap-4 text-lg mt-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700"><FaGithub /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-blue-700">Send us a message</h2>
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:opacity-90 transition"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Contact;
