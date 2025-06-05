import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Menu,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { styled } from "@mui/material/styles";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line as ChartLine, Bar, Pie } from "react-chartjs-2";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ChartTooltip = ({ position, xValue, yValue }) => {
  return (
    <Html position={position}>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          color: "#333",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(4px)",
          transform: "translate(-50%, -100%)",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <div
          style={{ fontWeight: "bold", marginBottom: "4px", color: "#1976d2" }}
        >
          Data Point
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div>
            <span style={{ color: "#666" }}>X: </span>
            {xValue}
          </div>
          <div>
            <span style={{ color: "#666" }}>Y: </span>
            {yValue}
          </div>
        </div>
      </div>
    </Html>
  );
};

const ChartPoints = ({ data, labels, minValue, maxValue, scale }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const pointsRef = useRef([]);

  return (
    <group>
      {data.map((value, index) => {
        const x = (index / (data.length - 1)) * 5 - 2.5;
        const y = (value - minValue) * scale - 2.5;
        const z = 0;

        return (
          <group key={index}>
            <mesh
              position={[x, y, z]}
              onPointerOver={() => setHoveredPoint(index)}
              onPointerOut={() => setHoveredPoint(null)}
              ref={(el) => (pointsRef.current[index] = el)}
            >
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshStandardMaterial
                color={hoveredPoint === index ? "#1976d2" : "#4caf50"}
                emissive={hoveredPoint === index ? "#1976d2" : "#4caf50"}
                emissiveIntensity={hoveredPoint === index ? 0.3 : 0}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Add connecting lines between points */}
            {index < data.length - 1 && (
              <line>
                <bufferGeometry attach="geometry" />
                <lineBasicMaterial
                  attach="material"
                  color="rgba(76, 175, 80, 0.3)"
                  linewidth={1}
                />
              </line>
            )}
            {hoveredPoint === index && (
              <ChartTooltip
                position={[x, y + 0.3, z]}
                xValue={labels[index]}
                yValue={value}
              />
            )}
          </group>
        );
      })}
    </group>
  );
};

const ExcelAnalytics = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [completeData, setCompleteData] = useState(null);
  const [selectedXAxis, setSelectedXAxis] = useState("");
  const [selectedYAxis, setSelectedYAxis] = useState("");
  const [chartStyle, setChartStyle] = useState("line");
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("2d");
  const [is3D, setIs3D] = useState(false);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const [fileId, setFileId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get fileId from URL if present
    const params = new URLSearchParams(window.location.search);
    const fileIdParam = params.get("fileId");
    if (fileIdParam) {
      setFileId(fileIdParam);
      fetchFileData(fileIdParam);
    }
  }, []);

  const loadFileData = async (url, fileName) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
        raw: false,
        defval: null,
      });

      if (!jsonData || jsonData.length === 0) {
        throw new Error("No data found in Excel file");
      }

      const headers = jsonData[0] || [];
      const previewRows = jsonData.slice(1, 6);
      const completeRows = jsonData.slice(1);

      const previewDataObj = {
        headers,
        rows: previewRows,
        totalRows: jsonData.length - 1,
        totalColumns: headers.length,
        fileName: fileName,
      };

      const completeDataObj = {
        headers,
        rows: completeRows,
        totalRows: jsonData.length - 1,
        totalColumns: headers.length,
        fileName: fileName,
      };

      setPreviewData(previewDataObj);
      setCompleteData(completeDataObj);
    } catch (error) {
      console.error("Error loading file data:", error);
      setError(error.message || "Error loading file data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFileData = async (fileId) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`/api/user/files/${fileId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const fileData = response.data;

      if (!fileData) {
        throw new Error("No file data received");
      }

      // Set the file data
      setUploadedFile(fileData);

      // Load the file data for analysis
      await loadFileData(fileData.cloudinaryUrl, fileData.originalName);
    } catch (error) {
      console.error("Error fetching file data:", error);
      setError(error.response?.data?.error || "Error loading file data");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log("File selected:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });

      // Check if file is an Excel file
      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(selectedFile);
        setError("");

        // Read and preview the Excel file
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            // Get the first sheet
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

            // Convert to JSON with header option
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
              header: 1,
              raw: false,
              defval: null,
            });

            // Get column headers (first row)
            const headers = jsonData[0] || [];

            // Get preview data (first 5 rows)
            const previewRows = jsonData.slice(1, 6);

            // Store complete data
            const completeRows = jsonData.slice(1);

            setPreviewData({
              headers,
              rows: previewRows,
              totalRows: jsonData.length - 1,
              totalColumns: headers.length,
              fileName: selectedFile.name,
            });

            setCompleteData({
              headers,
              rows: completeRows,
              totalRows: jsonData.length - 1,
              totalColumns: headers.length,
              fileName: selectedFile.name,
            });
          } catch (error) {
            console.error("Error reading Excel file:", error);
            setError("Error reading Excel file");
          }
        };
        reader.readAsArrayBuffer(selectedFile);
      } else {
        setError("Please upload an Excel file (.xlsx or .xls)");
        setFile(null);
        setPreviewData(null);
        setCompleteData(null);
      }
    }
  };

  const handleXAxisChange = (event) => {
    setSelectedXAxis(event.target.value);
  };

  const handleYAxisChange = (event) => {
    setSelectedYAxis(event.target.value);
  };

  const handleChartStyleChange = (event, newStyle) => {
    if (newStyle !== null) {
      setChartStyle(newStyle);
    }
  };

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
      setIs3D(newType === "3d");
    }
  };

  const generateChartData = () => {
    if (!completeData || !selectedXAxis || !selectedYAxis) return;

    const xIndex = completeData.headers.indexOf(selectedXAxis);
    const yIndex = completeData.headers.indexOf(selectedYAxis);

    if (xIndex === -1 || yIndex === -1) return;

    // Convert data to numbers and filter out invalid values
    const labels = completeData.rows.map((row) => row[xIndex]);
    const data = completeData.rows.map((row) => {
      const value = parseFloat(row[yIndex]);
      return isNaN(value) ? 0 : value;
    });

    console.log("Chart Data:", { labels, data }); // Debug log

    const chartConfig = {
      labels,
      datasets: [
        {
          label: `${selectedYAxis} vs ${selectedXAxis}`,
          data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    };

    setChartData(chartConfig);

    // Update file analysis timestamp
    if (fileId) {
      axios
        .post(
          `/api/user/files/${fileId}/analyze`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("Analysis timestamp updated:", response.data);
        })
        .catch((error) => {
          console.error("Error updating analysis timestamp:", error);
        });
    }
  };

  const render3DChart = () => {
    if (!chartData) return null;

    const data = chartData.datasets[0].data;
    const labels = chartData.labels;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    const scale = range === 0 ? 1 : 5 / range;

    return (
      <div
        style={{
          width: "100%",
          height: "400px",
          background: "linear-gradient(to bottom, #ffffff, #f5f5f5)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: "transparent" }}
        >
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
          />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.6} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          <ChartPoints
            data={data}
            labels={labels}
            minValue={minValue}
            maxValue={maxValue}
            scale={scale}
          />
          <gridHelper
            args={[5, 10, "rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.1)"]}
            position={[0, -2.5, 0]}
          />
        </Canvas>
      </div>
    );
  };

  const handleDownloadClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const downloadAsPNG = async () => {
    if (!chartContainerRef.current) return;

    try {
      // Show loading state
      setUploading(true);

      // Wait for the next render cycle
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(chartContainerRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Create download link
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `chart-${timestamp}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PNG:", error);
      setError("Error downloading chart as PNG. Please try again.");
    } finally {
      setUploading(false);
      handleDownloadClose();
    }
  };

  const downloadAsPDF = async () => {
    if (!chartContainerRef.current) return;

    try {
      // Show loading state
      setUploading(true);

      // Wait for the next render cycle
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(chartContainerRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      // Save PDF
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      pdf.save(`chart-${timestamp}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError("Error downloading chart as PDF. Please try again.");
    } finally {
      setUploading(false);
      handleDownloadClose();
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    console.log("Rendering Chart:", chartData);

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `${selectedYAxis} vs ${selectedXAxis}`,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    if (is3D) {
      return render3DChart();
    }

    switch (chartStyle) {
      case "line":
        return (
          <ChartLine ref={chartRef} data={chartData} options={chartOptions} />
        );
      case "bar":
        return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
      case "pie":
        return <Pie ref={chartRef} data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to upload files");
      setUploading(false);
      return;
    }

    try {
      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Upload response:", response.data);

      setSuccess("File uploaded successfully!");
      setUploadedFile(response.data.data);
      setFileId(response.data.data.id);
      setFile(null);
      setPreviewData(null);
      // Reset file input
      document.getElementById("file-upload").value = "";
    } catch (err) {
      console.error("Upload error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      if (err.response?.status === 401) {
        setError("Please log in to upload files");
      } else {
        setError(err.response?.data?.message || "Error uploading file");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Main Upload Card */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Excel Analytics
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <Typography variant="body1" paragraph>
          Upload your Excel files for analysis. We support .xlsx and .xls
          formats.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                mb: 2,
              }}
            >
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                disabled={uploading}
              >
                Choose Excel File
                <VisuallyHiddenInput
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {uploadedFile && (
              <Alert severity="info" sx={{ mb: 2 }}>
                File uploaded successfully!{" "}
                <Link href={uploadedFile.cloudinaryUrl} target="_blank">
                  View File
                </Link>
              </Alert>
            )}

            {/* Preview in main card (before upload) */}
            {previewData && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  File Preview
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Rows: {previewData.totalRows} | Total Columns:{" "}
                  {previewData.totalColumns}
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ maxHeight: 400, overflow: "auto" }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        {previewData.headers.map((header, index) => (
                          <TableCell key={index} sx={{ fontWeight: "bold" }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewData.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {previewData.headers.map((_, colIndex) => (
                            <TableCell key={colIndex}>
                              {row[colIndex] || ""}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Showing first 5 rows of {previewData.totalRows} total rows
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file || uploading}
              sx={{ mt: 2 }}
            >
              {uploading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Uploading...
                </>
              ) : (
                "Upload File"
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Chart Configuration Card */}
      {completeData && (
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Chart Configuration
          </Typography>
          <Typography variant="body1" paragraph>
            Select columns to visualize your data. Choose one column for the
            X-axis and one for the Y-axis.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="x-axis-label">X-Axis Column</InputLabel>
                <Select
                  labelId="x-axis-label"
                  id="x-axis-select"
                  value={selectedXAxis}
                  label="X-Axis Column"
                  onChange={handleXAxisChange}
                >
                  {completeData.headers.map((header, index) => (
                    <MenuItem key={index} value={header}>
                      {header}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="y-axis-label">Y-Axis Column</InputLabel>
                <Select
                  labelId="y-axis-label"
                  id="y-axis-select"
                  value={selectedYAxis}
                  label="Y-Axis Column"
                  onChange={handleYAxisChange}
                >
                  {completeData.headers.map((header, index) => (
                    <MenuItem key={index} value={header}>
                      {header}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Chart Type
            </Typography>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              aria-label="chart type"
              sx={{ mb: 2 }}
            >
              <ToggleButton value="2d" aria-label="2d chart">
                2D
              </ToggleButton>
              <ToggleButton value="3d" aria-label="3d chart">
                3D
              </ToggleButton>
            </ToggleButtonGroup>

            {!is3D && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Chart Style
                </Typography>
                <ToggleButtonGroup
                  value={chartStyle}
                  exclusive
                  onChange={handleChartStyleChange}
                  aria-label="chart style"
                >
                  <ToggleButton value="line" aria-label="line chart">
                    Line
                  </ToggleButton>
                  <ToggleButton value="bar" aria-label="bar chart">
                    Bar
                  </ToggleButton>
                  <ToggleButton value="pie" aria-label="pie chart">
                    Pie
                  </ToggleButton>
                </ToggleButtonGroup>
              </>
            )}
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedXAxis || !selectedYAxis}
              onClick={generateChartData}
            >
              Generate Chart
            </Button>
          </Box>
        </Paper>
      )}

      {/* Chart Display Card */}
      {chartData && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Chart Visualization
            </Typography>
            {!is3D && (
              <Box>
                <IconButton
                  onClick={handleDownloadClick}
                  color="primary"
                  aria-label="download chart"
                  disabled={uploading}
                >
                  {uploading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <DownloadIcon />
                  )}
                </IconButton>
                <Menu
                  anchorEl={downloadAnchorEl}
                  open={Boolean(downloadAnchorEl)}
                  onClose={handleDownloadClose}
                >
                  <MenuItem onClick={downloadAsPNG} disabled={uploading}>
                    Download as PNG
                  </MenuItem>
                  <MenuItem onClick={downloadAsPDF} disabled={uploading}>
                    Download as PDF
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
          <Box
            ref={chartContainerRef}
            sx={{
              height: "400px",
              width: "100%",
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "4px",
            }}
          >
            {renderChart()}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default ExcelAnalytics;
