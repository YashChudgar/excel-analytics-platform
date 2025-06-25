import React, {useEffect} from "react";
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
import { motion, useAnimation } from "framer-motion";
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
  const testimonials = [
  { name: "Alice Johnson", role: "Data Analyst", company: "TechNova", rating: 5, comment: "Excellytics helped us streamline our reporting process drastically.", avatar: "/images/avatar1.jpg" },
  { name: "David Lee", role: "Project Manager", company: "InnoCore", rating: 4, comment: "An intuitive tool with powerful charting features. Highly recommend!", avatar: "/images/avatar2.jpg" },
  { name: "Emily Rodriguez", role: "Marketing Director", company: "Growth Marketing", rating: 5, comment: "Finally, a tool that makes data visualization accessible to everyone. The integration with our existing tools is seamless.", avatar: "/images/avatar3.jpg" },
  { name: "Carlos Mendez", role: "Operations Head", company: "LogistiCore", rating: 5, comment: "Game-changing tool for handling large Excel datasets effortlessly!", avatar: "/images/avatar4.jpg" },
  { name: "Priya Sharma", role: "Marketing Analyst", company: "BrightEdge", rating: 4, comment: "The 3D charts gave our presentations a whole new look.", avatar: "/images/avatar5.jpg" },
  { name: "Liam O'Connor", role: "Team Lead", company: "Fintract", rating: 5, comment: "We onboarded the whole team in minutes. Super user-friendly.", avatar: "/images/avatar6.jpg" },
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

  const controls = useAnimation();

  useEffect(() => {
    const animate = async () => {
      while (true) {
        await controls.start({
          x: "-50%", // only half, because we duplicate the list
          transition: { duration: 20, ease: "linear" },
        });
        // Reset to start
        controls.set({ x: "0%" });
      }
    };
    animate();
  }, [controls]);

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
                className="cursor-pointer py-3 px-6 text-lg rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-900 hover:from-indigo-900 hover:to-indigo-600 transition"
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


{/* SVG Divider with Tailwind-Matching Gradient */}
  <div className="relative bg-[#eef2ff]">
  <svg
    className="w-full h-24 md:h-32 lg:h-40 animate-fade-in"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#eef2ff"
      filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05))"
      d="M0,224L48,208C96,192,192,160,288,144C384,128,480,128,576,133.3C672,139,768,149,864,154.7C960,160,1056,160,1152,160C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </svg>
</div>





     {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-md">
      Why Excellytics?
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white border-l-4 border-indigo-500/80 rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-2 p-6 flex flex-col h-full"
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
      <section id="use-cases" className="py-20 bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-md">
      Use Cases
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {useCases.map((useCase, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white border-l-4 border-indigo-500/80 rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-2 p-6 flex flex-col h-full"
        >
          <div className="text-indigo-600 mb-4 h-12 flex items-center">
            {useCase.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2 min-h-[2.5em]">
            {useCase.title}
          </h3>
          <p className="text-gray-600 flex-grow min-h-[4.8em]">
            {useCase.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>



      {/* How It Works Section */}
<section id="how-it-works" className="py-20 bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-md">
      How It Works
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative bg-white border-l-4 border-indigo-500/80 rounded-2xl p-6 pt-10 shadow-lg hover:shadow-2xl transform transition-transform hover:-translate-y-2 flex flex-col items-center text-center h-full"
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
<div className="py-20 pb-28 bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-200">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-md">
    Trusted by Teams and Professionals Worldwide
  </h2>

  <div className="relative w-full overflow-hidden">
    <motion.div
      className="flex gap-8 w-max pt-4 pb-6"
      animate={controls}
      initial={{ x: "0%" }}
    >
      {[...testimonials, ...testimonials].map((testimonial, index) => (
        <motion.div
  key={index}
  className="relative bg-white min-w-[300px] max-w-sm rounded-3xl p-6 shadow-lg hover:shadow-indigo-300 transition-transform hover:-translate-y-2 border-t-4 border-b-4 border-transparent border-t-indigo-500 border-b-purple-500"
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  viewport={{ once: true }}
>
  {/* Decorative Quote Icon */}
  <div className="absolute -top-5 left-4 text-indigo-400 text-4xl opacity-10">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-10 h-10" viewBox="0 0 24 24">
      <path d="M7.17 6.17A5.94 5.94 0 0 1 12 4c1.73 0 3.29.73 4.41 1.91A6 6 0 0 1 20 10c0 3.31-2.69 6-6 6h-2v2h2c4.42 0 8-3.58 8-8 0-2.21-.89-4.21-2.34-5.66A7.932 7.932 0 0 0 12 2c-2.14 0-4.09.84-5.66 2.34A7.932 7.932 0 0 0 4 10c0 2.21.89 4.21 2.34 5.66A7.932 7.932 0 0 0 12 18c1.66 0 3.19-.51 4.41-1.39L17 16h-2v-2h2c-3.31 0-6-2.69-6-6 0-1.65.67-3.15 1.76-4.24A5.94 5.94 0 0 1 12 4a6.06 6.06 0 0 1-4.83 2.17z"/>
    </svg>
  </div>

  {/* Rating */}
  <div className="mb-3">
    <Rating value={testimonial.rating} readOnly />
  </div>

  {/* Comment */}
  <p className="italic text-gray-700 bg-indigo-50 p-3 rounded-lg mb-6 leading-relaxed">
    “{testimonial.comment}”
  </p>

  {/* Avatar and User Info */}
  <div className="flex items-center gap-4 mt-auto">
    <motion.div
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.3 }}
  className={`rounded-full p-1 ring-4 bg-white avatar-wrapper
    ${
      testimonial.role.includes("Manager")
        ? "ring-emerald-500"
        : testimonial.role.includes("Analyst")
        ? "ring-indigo-500"
        : testimonial.role.includes("Director")
        ? "ring-purple-500"
        : testimonial.role.includes("Lead")
        ? "ring-blue-500"
        : "ring-black-400"
    }`}
>
  <div className="w-12 h-12 rounded-full overflow-hidden relative group hover:animate-[pulse_1.5s_ease-in-out_infinite]">
    <Avatar
      src={testimonial.avatar}
      alt={testimonial.name}
      sx={{ width: "100%", height: "100%" }}
      className="bg-indigo-100"
    />
  </div>
</motion.div>


    <div>
      <p className="font-semibold text-indigo-700">{testimonial.name}</p>
      <p className="text-sm text-gray-500">
        {testimonial.role} at <span className="text-blue-700 font-medium">{testimonial.company}</span>
      </p>
    </div>
  </div>
</motion.div>

      ))}
    </motion.div>
  </div>
</div>


     {/* CTA Section */}
<div id="contact" className="py-20 bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-200">
  <div className="max-w-2xl mx-auto px-6 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
        Ready to Unlock the Power of Excel?
      </h2>
      <p className="text-lg text-blue-600 mb-6 leading-relaxed">
        Join teams transforming spreadsheets into business intelligence dashboards.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/register")}
          className="cursor-pointer py-3 px-8 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-900 hover:from-indigo-900 hover:to-indigo-600 transition"
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
