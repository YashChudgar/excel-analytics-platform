import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  Link,
  useTheme,
} from "@mui/material";
import {
  LinkedIn,
  Twitter,
  YouTube,
  Send,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";

const Footer = () => {
  const [email, setEmail] = useState("");
  const theme = useTheme();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.grey[900],
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AnalyticsIcon
                sx={{ color: "primary.main", fontSize: 32, mr: 1 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Excellytics
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mb: 2, opacity: 0.8, color: "white" }}
            >
              Your Excel. Smarter.
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, opacity: 0.8, color: "white" }}
            >
              Transform your spreadsheets into powerful analytics dashboards
              with our no-code platform.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600, color: "white" }}
            >
              Product
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#features"
                color="inherit"
                underline="hover"
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                Features
              </Link>
              <Link
                href="#use-cases"
                color="inherit"
                underline="hover"
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                Use Cases
              </Link>
              <Link
                href="#how-it-works"
                color="inherit"
                underline="hover"
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                color="inherit"
                underline="hover"
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                Pricing
              </Link>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600, color: "white" }}
            >
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="/about"
                color="inherit"
                underline="hover"
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                About Us
              </Link>
              <Link
                href="/blog"
                color="inherit"
                underline="hover"
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                Blog
              </Link>
              <Link
                href="/careers"
                color="inherit"
                underline="hover"
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                Careers
              </Link>
              <Link
                href="/contact"
                color="inherit"
                underline="hover"
                sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: 600, color: "white" }}
            >
              Stay Updated
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, opacity: 0.8, color: "white" }}
            >
              Subscribe to our newsletter for the latest updates and insights.
            </Typography>
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{ display: "flex", gap: 1 }}
            >
              <TextField
                size="small"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                  },
                }}
              />
              <IconButton
                type="submit"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8, color: "white" }}>
            © {new Date().getFullYear()} Excellytics. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton
              component="a"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "white",
                opacity: 0.8,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "white",
                opacity: 0.8,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              component="a"
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "white",
                opacity: 0.8,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <YouTube />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
