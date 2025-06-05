import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { motion } from "framer-motion";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Check if file is xls or xlsx
      if (
        selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload only Excel files (.xls or .xlsx)");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess("File uploaded successfully!");
      setFile(null);
      // Reset file input
      document.getElementById("file-input").value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" gutterBottom>
        Upload Excel File
      </Typography>

      <Box
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          mb: 2,
          backgroundColor: "rgba(0, 0, 0, 0.02)",
        }}
      >
        <input
          id="file-input"
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="file-input">
          <Button
            component="span"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={uploading}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": {
                backgroundColor: "#3730a3",
              },
            }}
          >
            Choose File
          </Button>
        </label>

        {file && (
          <Typography sx={{ mt: 2 }}>Selected file: {file.name}</Typography>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || uploading}
        fullWidth
        sx={{
          backgroundColor: "#4f46e5",
          "&:hover": {
            backgroundColor: "#3730a3",
          },
        }}
      >
        {uploading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Upload File"
        )}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Paper>
  );
};

export default FileUpload;
