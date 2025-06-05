import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontSize: { xs: "6rem", md: "8rem" },
              fontWeight: 700,
              mb: 2,
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </Typography>
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 4,
              color: "text.secondary",
            }}
          >
            Oops! Page Not Found
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 6,
              color: "text.secondary",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
              sx={{
                py: 2,
                px: 4,
                fontSize: "1.1rem",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                },
              }}
            >
              Return Home
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFound;
