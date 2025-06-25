// export default Footer;
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaChartBar,
  FaPaperPlane,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gray-900 text-white px-4 py-10 mt-auto"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <div className="flex items-center mb-4">
            <FaChartBar className="text-indigo-500 text-2xl mr-2" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-900 text-transparent bg-clip-text">
              Excellytics
            </h2>
          </div>
          <p className="text-sm text-white/80 mb-2">Your Excel. Smarter.</p>
          <p className="text-sm text-white/80">
            Transform your spreadsheets into powerful analytics dashboards with our no-code platform.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-white/80">
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#use-cases" className="hover:text-white">Use Cases</a></li>
            <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
            {/* <li><a href="#pricing" className="hover:text-white">Pricing</a></li> */}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-white/80">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            {/* <li><a href="/blog" className="hover:text-white">Blog</a></li> */}
            <li><a href="/careers" className="hover:text-white">Careers</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
          <p className="text-sm text-white/80 mb-3">Subscribe to our newsletter for the latest updates and insights.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex items-center space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 rounded-lg text-sm text-white bg-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
        <p>© {new Date().getFullYear()} Excellytics. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaTwitter />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaYoutube />
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

