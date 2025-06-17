import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronRight, FaChartBar, FaBrain, FaCloudUploadAlt, FaShieldAlt } from 'react-icons/fa';

const breadcrumbVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const featureCards = [
  {
    icon: <FaChartBar className="text-indigo-600 text-3xl mb-2" />,
    title: '2D & 3D Visualization',
    desc: 'Easily turn data into beautiful 2D and 3D interactive charts using Chart.js and Three.js.',
  },
  {
    icon: <FaBrain className="text-blue-600 text-3xl mb-2" />,
    title: 'AI-Powered Insights',
    desc: 'Get summarized insights automatically using GPT-based summarization for quicker decisions.',
  },
  {
    icon: <FaCloudUploadAlt className="text-blue-600 text-3xl mb-2" />,
    title: 'Seamless Uploads',
    desc: 'Upload Excel files in seconds with real-time feedback and structured parsing.',
  },
  {
    icon: <FaShieldAlt className="text-indigo-700 text-3xl mb-2" />,
    title: 'Admin Controls',
    desc: 'Admin dashboard with user control, upload history, and role-based access.',
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-indigo-200 px-4 py-20 pt-25">
      {/* ✅ Breadcrumb */}
      <motion.nav
        variants={breadcrumbVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto mb-8 text-sm font-medium text-indigo-800"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-2 sm:space-x-3">
          <li>
            <a href="/" className="text-indigo-700 hover:text-purple-700 font-semibold">Home</a>
          </li>
          <li>
            <FaChevronRight className="text-indigo-400 text-xs" />
          </li>
          <li>
            <span className="text-indigo-900 font-bold">About</span>
          </li>
        </ol>
      </motion.nav>

      {/* ✅ Main Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">About Excellytics</h1>
        <p className="text-lg text-blue-700 mb-6">
          Excellytics is an advanced analytics platform designed to empower users with seamless data visualization tools.
          Upload your Excel files, choose dimensions, and visualize insights in interactive 2D and 3D charts.
        </p>
        <p className="text-blue-700">
          With AI-powered summarization, historical upload tracking, and admin-level controls, Excellytics caters to
          individuals, teams, and enterprises looking to unlock the full potential of their data.
        </p>
      </motion.div>

      {/* ✅ Features Section */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        {featureCards.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, scale: 0.9, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-transform hover:scale-105 text-center"
          >
            {feature.icon}
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ✅ Footer Mission Section */}
      <motion.div
        className="max-w-4xl mx-auto mt-20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Our Mission</h2>
        <p className="text-blue-600 text-lg">
          We aim to simplify data storytelling for everyone—from startups to enterprises. Whether you're a student,
          analyst, or executive, Excellytics helps you **transform Excel data into decisions**.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
