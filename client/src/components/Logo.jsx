import React from "react";
import { Box } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const Logo = ({ size = 32, color = "primary" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "8px",
        background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
        color: "white",
        mr: 1,
      }}
    >
      <AnalyticsIcon sx={{ fontSize: size * 0.7 }} />
    </Box>
  );
};

export default Logo;
