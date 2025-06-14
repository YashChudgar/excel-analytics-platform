import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Psychology,
  Link as LinkIcon,
  Group,
  CodeOff,
  BusinessCenter,
  Assignment,
  AccountBalance,
  Campaign,
  School,
  Upload,
  TableChart,
  Dashboard,
  Share,
} from "@mui/icons-material";
import { Avatar, Rating } from "@mui/material";
import { motion } from "framer-motion";
import Footer from "../components/Footer";


const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart fontSize="large" />, title: "Real-time Visualization", description: "Turn spreadsheets into dashboards in seconds with dynamic updates and interactive elements."
    },
    {
      icon: <Psychology fontSize="large" />, title: "Smart Insights", description: "Discover trends and patterns with built-in AI-powered analytics and recommendations."
    },
    {
      icon: <LinkIcon fontSize="large" />, title: "Seamless Integration", description: "Works seamlessly with Excel, Google Sheets, and OneDrive for a unified experience."
    },
    {
      icon: <Group fontSize="large" />, title: "Collaborative", description: "Share insights securely with teams and clients with granular permission controls."
    },
    {
      icon: <CodeOff fontSize="large" />, title: "No-Code Interface", description: "Designed for everyone, not just data experts. Start analyzing data in minutes."
    },
  ];

  const useCases = [
    { icon: <BusinessCenter fontSize="large" />, title: "Business Analysts", description: "Rapid reporting and visual exploration of complex data sets with interactive dashboards." },
    { icon: <Assignment fontSize="large" />, title: "Project Managers", description: "Monitor KPIs and progress in real-time with automated project dashboards." },
    { icon: <AccountBalance fontSize="large" />, title: "Accountants", description: "Create automated financial dashboards and streamline reporting processes." },
    { icon: <Campaign fontSize="large" />, title: "Marketing Teams", description: "Track campaign performance and visualize marketing metrics across channels." },
    { icon: <School fontSize="large" />, title: "Educators", description: "Present and explain data clearly in class with interactive visualizations." },
  ];

  const steps = [
    { icon: <Upload fontSize="large" />, title: "Connect Your Data", description: "Upload your Excel file or connect to cloud storage platforms.", number: "01" },
    { icon: <TableChart fontSize="large" />, title: "Select Data Range", description: "Choose the specific data ranges or sheets you want to analyze.", number: "02" },
    { icon: <Dashboard fontSize="large" />, title: "Generate Dashboards", description: "Let our AI create beautiful, interactive dashboards instantly.", number: "03" },
    { icon: <Share fontSize="large" />, title: "Share & Export", description: "Share with team members or export in various formats with one click.", number: "04" },
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Business Analyst", company: "TechCorp", rating: 5, comment: "Excellytics has transformed how we handle data. The AI insights are incredibly accurate and save us hours of analysis.", avatar: "/images/avatar1.jpg" },
    { name: "Michael Chen", role: "Project Manager", company: "Innovate Inc", rating: 5, comment: "The real-time dashboards have revolutionized our project tracking. Our stakeholders love the visual reports.", avatar: "/images/avatar2.jpg" },
    { name: "Emily Rodriguez", role: "Marketing Director", company: "Growth Marketing", rating: 5, comment: "Finally, a tool that makes data visualization accessible to everyone. The integration with our existing tools is seamless.", avatar: "/images/avatar3.jpg" },
  ];

  return (
    <>
<div className="relative min-h-screen bg-gradient-to-br from-[#e3edf7] to-[#c7d2e3] overflow-hidden flex items-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/excel_analytics_background.png"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
              Transform Your Excel Sheets into Smart Dashboards
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              No-code analytics platform to visualize, analyze, and share insights directly from Excel in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="py-3 px-6 text-lg rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-900 hover:from-indigo-900 hover:to-indigo-600 transition"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="/images/analytics-dashboard.png"
              alt="Analytics Dashboard"
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </div>
  {/* );
}; */}


     {/* Features Section */}
      <section id="features" className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
            Why Excellytics?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 p-6 flex flex-col justify-between h-full"
              >
                <div className="text-indigo-600 mb-4 h-12 flex items-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 min-h-[2.5em]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 flex-grow min-h-[4.8em]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
            Use Cases
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-md hover:shadow-xl transform transition-transform hover:-translate-y-2 h-full flex flex-col"
              >
                <div className="text-indigo-600 mb-4 h-12 flex items-center">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 min-h-[2.5em] flex items-center">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 flex-grow leading-relaxed min-h-[4.8em]">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white p-6 pt-10 rounded-2xl shadow hover:shadow-lg transition-all h-full flex flex-col items-center text-center"
              >
                <div className="absolute -top-5 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-900 text-white flex items-center justify-center font-bold text-lg shadow">
                  {step.number}
                </div>
                <div className="text-indigo-600 mb-4 h-12 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 min-h-[2.5em]">
                  {step.title}
                </h3>
                <p className="text-gray-600 min-h-[4.8em]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     {/* Testimonials Section */}
        <div className="py-20 bg-gray-100">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
            Trusted by Teams and Professionals Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="mb-4">
                  <Rating value={testimonial.rating} readOnly />
                </div>
                <p className="italic text-gray-700 flex-grow mb-6">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <Avatar src={testimonial.avatar} alt={testimonial.name} sx={{ width: 48, height: 48 }} />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

     {/* CTA Section */}
<div id="contact" className="py-20 bg-white">
  <div className="max-w-2xl mx-auto px-6 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
        Ready to Unlock the Power of Excel?
      </h2>
      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Join teams transforming spreadsheets into business intelligence dashboards.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/register")}
          className="py-3 px-8 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-900 hover:from-indigo-900 hover:to-indigo-600 transition"
        >
          Sign Up Now
        </motion.button>
      </div>
    </motion.div>
  </div>
</div>
<Footer />
</>
  );
};

export default Landing;
