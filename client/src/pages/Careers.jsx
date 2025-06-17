import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronRight, FaUserTie, FaLaptopCode, FaBrain, FaBug } from 'react-icons/fa';

const breadcrumbVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Careers = () => {
  const roles = [
    {
      icon: <FaLaptopCode className="text-blue-600 text-3xl mb-3" />,
      title: 'Frontend Developer',
      description: 'React + Tailwind experience required. Build beautiful and scalable UI components.',
    },
    {
      icon: <FaBrain className="text-blue-600 text-3xl mb-3" />,
      title: 'AI Engineer',
      description: 'Experience with OpenAI, NLP, or predictive analytics. Build smart systems.',
    },
    {
      icon: <FaBug className="text-indigo-600 text-3xl mb-3" />,
      title: 'QA Tester',
      description: 'Detail-oriented individuals to test UI and backend workflows thoroughly.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 px-4 py-20 pt-25">
      {/* ✅ Animated Breadcrumb */}
      <motion.nav
        variants={breadcrumbVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto mb-8 text-sm font-medium text-blue-800"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-2 sm:space-x-3">
          <li>
            <a href="/" className="text-blue-700 hover:text-purple-700 font-semibold">Home</a>
          </li>
          <li>
            <FaChevronRight className="text-blue-400 text-xs" />
          </li>
          <li>
            <span className="text-blue-900 font-bold">Careers</span>
          </li>
        </ol>
      </motion.nav>

      {/* ✅ Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Join Our Team</h1>
        <p className="text-lg text-gray-700 mb-4">
          We're building the future of intelligent data analytics — beautifully designed and powerful.
        </p>
        <p className="text-gray-600">
          At Excellytics, we believe in innovation, collaboration, and empowering people with the right tools.
        </p>
      </motion.div>

      {/* ✅ Job Cards Section */}
      <motion.div
        className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        {roles.map((role, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-transform hover:scale-105 text-center"
          >
            {role.icon}
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">{role.title}</h3>
            <p className="text-blue-600 text-sm">{role.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ✅ CTA Section */}
      <motion.div
        className="max-w-4xl mx-auto mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Want to Work With Us?</h2>
        <p className="text-blue-700 mb-4">
          We're always on the lookout for talented minds. If you’re passionate about tech and data, send us your resume!
        </p>
        <p className="text-lg font-medium text-blue-600">
          📩 careers@excellytics.ai
        </p>
      </motion.div>
    </div>
  );
};

export default Careers;
