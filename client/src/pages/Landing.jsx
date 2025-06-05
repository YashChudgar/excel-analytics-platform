import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  Avatar,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
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
  PlayCircle,
  LinkedIn,
  Twitter,
  YouTube,
  Send,
} from "@mui/icons-material";
import Footer from "../components/Footer";

const features = [
  {
    icon: <BarChart sx={{ fontSize: 40 }} />,
    title: "Real-time Visualization",
    description:
      "Turn spreadsheets into dashboards in seconds with dynamic updates and interactive elements.",
  },
  {
    icon: <Psychology sx={{ fontSize: 40 }} />,
    title: "Smart Insights",
    description:
      "Discover trends and patterns with built-in AI-powered analytics and recommendations.",
  },
  {
    icon: <LinkIcon sx={{ fontSize: 40 }} />,
    title: "Seamless Integration",
    description:
      "Works seamlessly with Excel, Google Sheets, and OneDrive for a unified experience.",
  },
  {
    icon: <Group sx={{ fontSize: 40 }} />,
    title: "Collaborative",
    description:
      "Share insights securely with teams and clients with granular permission controls.",
  },
  {
    icon: <CodeOff sx={{ fontSize: 40 }} />,
    title: "No-Code Interface",
    description:
      "Designed for everyone, not just data experts. Start analyzing data in minutes.",
  },
];

const useCases = [
  {
    icon: <BusinessCenter sx={{ fontSize: 40 }} />,
    title: "Business Analysts",
    description:
      "Rapid reporting and visual exploration of complex data sets with interactive dashboards.",
  },
  {
    icon: <Assignment sx={{ fontSize: 40 }} />,
    title: "Project Managers",
    description:
      "Monitor KPIs and progress in real-time with automated project dashboards.",
  },
  {
    icon: <AccountBalance sx={{ fontSize: 40 }} />,
    title: "Accountants",
    description:
      "Create automated financial dashboards and streamline reporting processes.",
  },
  {
    icon: <Campaign sx={{ fontSize: 40 }} />,
    title: "Marketing Teams",
    description:
      "Track campaign performance and visualize marketing metrics across channels.",
  },
  {
    icon: <School sx={{ fontSize: 40 }} />,
    title: "Educators",
    description:
      "Present and explain data clearly in class with interactive visualizations.",
  },
];

const steps = [
  {
    icon: <Upload sx={{ fontSize: 40 }} />,
    title: "Connect Your Data",
    description:
      "Upload your Excel file or connect to cloud storage platforms.",
    number: "01",
  },
  {
    icon: <TableChart sx={{ fontSize: 40 }} />,
    title: "Select Data Range",
    description:
      "Choose the specific data ranges or sheets you want to analyze.",
    number: "02",
  },
  {
    icon: <Dashboard sx={{ fontSize: 40 }} />,
    title: "Generate Dashboards",
    description:
      "Let our AI create beautiful, interactive dashboards instantly.",
    number: "03",
  },
  {
    icon: <Share sx={{ fontSize: 40 }} />,
    title: "Share & Export",
    description:
      "Share with team members or export in various formats with one click.",
    number: "04",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Analyst",
    company: "TechCorp",
    rating: 5,
    comment:
      "Excellytics has transformed how we handle data. The AI insights are incredibly accurate and save us hours of analysis.",
    avatar: "/images/avatar1.jpg",
  },
  {
    name: "Michael Chen",
    role: "Project Manager",
    company: "Innovate Inc",
    rating: 5,
    comment:
      "The real-time dashboards have revolutionized our project tracking. Our stakeholders love the visual reports.",
    avatar: "/images/avatar2.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Growth Marketing",
    rating: 5,
    comment:
      "Finally, a tool that makes data visualization accessible to everyone. The integration with our existing tools is seamless.",
    avatar: "/images/avatar3.jpg",
  },
];

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/images/analytics-bg.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    fontWeight: 800,
                    mb: 2,
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Transform Your Excel Sheets into Smart Dashboards
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "text.secondary",
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  No-code analytics platform to visualize, analyze, and share
                  insights directly from Excel in seconds.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/register")}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: "1.1rem",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="/images/analytics-dashboard.png"
                  alt="Analytics Dashboard"
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "20px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        id="features"
        sx={{
          py: 8,
          backgroundColor: (theme) => theme.palette.grey[50],
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Why Excellytics?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      transition: "transform 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-8px)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 4,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          color: "primary.main",
                          mb: 2,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          minHeight: "2.5em",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.6,
                          flexGrow: 1,
                          minHeight: "4.8em",
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Use Cases Section */}
      <Box
        id="use-cases"
        sx={{
          py: 8,
          backgroundColor: "white",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Use Cases
          </Typography>
          <Grid container spacing={4}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      transition: "all 0.3s ease",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 4,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          color: "primary.main",
                          mb: 2,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {useCase.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          minHeight: "2.5em",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {useCase.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.6,
                          flexGrow: 1,
                          minHeight: "4.8em",
                        }}
                      >
                        {useCase.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box
        id="how-it-works"
        sx={{
          py: 8,
          backgroundColor: (theme) => theme.palette.grey[50],
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      position: "relative",
                      overflow: "visible",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {step.number}
                    </Box>
                    <CardContent
                      sx={{
                        p: 4,
                        pt: 6,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          color: "primary.main",
                          mb: 2,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        align="center"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          minHeight: "2.5em",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        align="center"
                        sx={{
                          lineHeight: 1.6,
                          flexGrow: 1,
                          minHeight: "4.8em",
                        }}
                      >
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: (theme) => theme.palette.grey[50],
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Trusted by Teams and Professionals Worldwide
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 4,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Rating value={testimonial.rating} readOnly />
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          fontStyle: "italic",
                          lineHeight: 1.6,
                          flexGrow: 1,
                          minHeight: "4.8em",
                        }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mt: "auto",
                        }}
                      >
                        <Avatar
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          sx={{ width: 48, height: 48 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role} at {testimonial.company}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        id="contact"
        sx={{
          py: 8,
          backgroundColor: "white",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Ready to Unlock the Power of Excel?
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 4,
                opacity: 0.9,
                lineHeight: 1.6,
              }}
            >
              Join teams transforming spreadsheets into business intelligence
              dashboards.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: "1.1rem",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                  },
                }}
              >
                Sign Up Now
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Landing;
