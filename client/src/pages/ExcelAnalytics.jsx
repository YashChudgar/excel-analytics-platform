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
import Skeleton from '@mui/material/Skeleton';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { styled } from "@mui/material/styles";
import axiosInstance from "../api/axiosInstance";
import * as XLSX from "xlsx";
import ReactSelect  from "react-select";
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
import { motion } from "framer-motion";
import { Line as ChartLine, Bar, Pie } from "react-chartjs-2";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import DashboardLayout from "../components/DashboardLayout";
import { toast } from "react-toastify";
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

// Styled components with theme colors
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 600,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow:
      "0 6px 8px -1px rgb(0 0 0 / 0.15), 0 3px 6px -2px rgb(0 0 0 / 0.15)",
  },
}));



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
    <div className="bg-white/95 text-slate-800 px-4 py-3 rounded-lg text-sm pointer-events-none whitespace-nowrap shadow-lg border border-black/10 backdrop-blur-sm transform -translate-x-1/2 -translate-y-full transition-all duration-200 ease-in-out">
      <div className="font-bold mb-1 text-indigo-600">Data Point</div>
      <div className="flex flex-col gap-1">
        <div>
          <span className="text-slate-500">X: </span>
          {xValue}
        </div>
        <div>
          <span className="text-slate-500">Y: </span>
          {yValue}
        </div>
      </div>
    </div>
  </Html>
);

};

const ChartPoints = ({ data, labels, minValue, maxValue, scale }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

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
              scale={hoveredPoint === index ? 1.2 : 1}
            >
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshStandardMaterial
                color={hoveredPoint === index ? "#4f46e5" : "#10b981"}
                emissive={hoveredPoint === index ? "#4f46e5" : "#10b981"}
                emissiveIntensity={hoveredPoint === index ? 0.3 : 0}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>

            {/* Line to next point */}
            {index < data.length - 1 && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      x,
                      y,
                      z,
                      (index + 1) / (data.length - 1) * 5 - 2.5,
                      (data[index + 1] - minValue) * scale - 2.5,
                      0,
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#10b981" linewidth={1} />
              </line>
            )}

            {/* 3D Tooltip using Html */}
            {hoveredPoint === index && (
              <Html
                position={[x, y + 0.3, z]}
                center
                style={{
                  background: "white",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  color: "#111827",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {labels[index]}: {value}
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

const ExcelAnalytics = () => {
  // State variables
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
  const [fileId, setFileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChartConfig, setShowChartConfig] = useState(false);
const [customFilename, setCustomFilename] = useState("");
const [showWatermark, setShowWatermark] = useState(true);
const [isDarkMode, setIsDarkMode] = useState(false);

  // Refs
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
useEffect(() => {
  console.log("🧪 chartType changed:", chartType);
}, [chartType]);

// Animated Camera Component
const AnimatedCamera = () => {
  const cameraRef = useRef();
  useFrame(({ camera }) => {
    // Smooth entrance animation (z to 8)
    if (camera.position.z > 8) {
      camera.position.z -= 0.1;
    }
  });
  return null;
};

  // Handlers
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log("File selected:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });

      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(selectedFile);
        setError("");

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
              header: 1,
              raw: false,
              defval: null,
            });

            const headers = jsonData[0] || [];
            const previewRows = jsonData.slice(1, 6);
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
    setChartType(newType); // "2d" or "3d"
  }
};


  const handleDownloadClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

 // Helper to wait for canvas rendering stability
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const downloadAsPNG = async () => {
  if (!chartContainerRef.current) return;

  try {
    setUploading(true);
    await delay(100); // Wait for animations or rendering to settle

    const canvas = await html2canvas(chartContainerRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");

    const baseName =
      customFilename?.trim() || `${selectedYAxis}_vs_${selectedXAxis}` || "chart";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    link.download = `${baseName}-${timestamp}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("📊 Chart downloaded as PNG!");
  } catch (error) {
    console.error("❌ Error downloading PNG:", error);
    setError("Error downloading chart as PNG. Please try again.");
  } finally {
    setUploading(false);
    handleDownloadClose();
  }
};


const downloadAsPDF = async () => {
  if (!chartContainerRef.current) return;

  try {
    setUploading(true);
    await delay(100); // Let animations complete

    const canvas = await html2canvas(chartContainerRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

// Safely set filename
const baseName =
  customFilename?.trim() || `${selectedYAxis}_vs_${selectedXAxis}` || "chart";
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

// Save the PDF with the filename
pdf.save(`${baseName}-${timestamp}.pdf`);

toast.success("Chart downloaded successfully!");

  } catch (error) {
    console.error("❌ Error downloading PDF:", error);
    setError("Error downloading chart as PDF. Please try again.");
  } finally {
    setUploading(false);
    handleDownloadClose();
  }
};


const generateChartData = () => {
  if (!completeData || !selectedXAxis || !selectedYAxis) return;

  const xIndex = completeData.headers.indexOf(selectedXAxis);
  const yIndex = completeData.headers.indexOf(selectedYAxis);

  if (xIndex === -1 || yIndex === -1) return;

  let labels = completeData.rows.map((row) => row[xIndex]);
  let data = completeData.rows.map((row) => {
    const value = parseFloat(row[yIndex]);
    return isNaN(value) ? 0 : value;
  });

  console.log("Selected X:", selectedXAxis);
  console.log("Selected Y:", selectedYAxis);
  console.log("Labels:", labels);
  console.log("Data:", data);

  // ✅ If chart is pie, limit data to top 10 items
  if (chartStyle === "pie") {
    const topN = 10;

    labels = labels.slice(0, topN);
    data = data.slice(0, topN);
  }

  const chartConfig = {
    labels,
    datasets: [
      {
        label: `${selectedYAxis} vs ${selectedXAxis}`,
        data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)", // for line/bar — will be styled later for pie
      },
    ],
  };

  setChartData(chartConfig);
  console.log("✅ Chart config set:", chartConfig);

  // Update analysis timestamp
  if (fileId) {
    axiosInstance
      .post(
        `/user/files/${fileId}/analyze`,
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

    const response = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Upload response:", response.data);

    const uploaded = response?.data?.upload;
    if (!uploaded || !uploaded.cloudinaryUrl || !uploaded._id) {
      throw new Error("Unexpected response format from server");
    }

    // Clear any previous error
    setError("");
    // setSuccess("File uploaded successfully!");
    setUploadedFile(uploaded);
    setFileId(uploaded._id);
    setFile(null);
    setPreviewData(null);
    setShowChartConfig(true); // Show chart config after successful upload
    const fileInput = document.getElementById("file-upload");
    if (fileInput) fileInput.value = "";

  } catch (err) {
    console.error("Upload error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });

    // Clear previous success if error occurs
    setSuccess("");

    if (err.response?.status === 401) {
      setError("Please log in to upload files");
    } else {
      setError(err.response?.data?.message || err.message || "Error uploading file");
    }
  } finally {
    setUploading(false);
  }
};


const watermarkPlugin = {
  id: "customWatermark",
  beforeDraw: (chart) => {
    const { width, height, ctx } = chart;
    ctx.save();
    ctx.font = "bold italic 40px sans-serif";
    ctx.fillStyle = "rgba(203, 213, 225, 0.08)"; // slate-200 with opacity
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.fillText("Excellytics", 0, 0);
    ctx.restore();
  },
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
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(0, 0, 0, 0.07)",
      }}
    >
      <Canvas camera={{ position: [0, 2, 12], fov: 60 }}>
        <AnimatedCamera />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={3}
          maxDistance={20}
        />

        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />

        {/* Axis Helper (optional for debugging) */}
        {/* <axesHelper args={[5]} /> */}

        <ChartPoints
          data={data}
          labels={labels}
          minValue={minValue}
          maxValue={maxValue}
          scale={scale}
        />

        {/* Grid Base */}
        <gridHelper args={[10, 20]} position={[0, -2.5, 0]} />
      </Canvas>
    </div>
  );
};




// plugins: [watermarkPlugin]
const renderChart = () => {
  console.log("📊 Rendering chart with data:", chartData);

  if (
    !chartData ||
    !chartData.labels ||
    !chartData.datasets ||
    chartData.labels.length === 0 ||
    chartData.datasets.length === 0
  ) {
    return <div className="text-gray-500 text-center">No data to display.</div>;
  }

  // 1. Get canvas context for gradient
  const canvas = chartRef.current?.canvas || chartRef.current;
  const ctx = canvas?.getContext("2d");
  let gradient = null;
  if (ctx && (chartStyle === "line" || chartStyle === "bar")) {
    gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "#4f46e5");
    gradient.addColorStop(1, "#a78bfa");
  }

  // 2. Responsive font sizing
  const isMobile = window.innerWidth < 768;
  const titleFontSize = isMobile ? 16 : 20;
  const labelFontSize = isMobile ? 12 : 14;

  // 3. Chart options (animations, interactivity, tooltips, legend, scales)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeOutQuart" },
    interaction: { mode: "index", intersect: false },
    hover: { mode: "nearest", intersect: true },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 12,
          color: "#4B5563",
          font: { size: labelFontSize, weight: "bold" },
        },
      },
      font: {
        size: 14,
        weight: "bold",
        color: isDarkMode ? "#F3F4F6" : "#4B5563",
      },
      title: {
        display: true,
        text: `${selectedYAxis} vs ${selectedXAxis}`,
        font: { size: titleFontSize, weight: "bold" },
        color: "#1F2937",
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        borderColor: "#6B7280",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        usePointStyle: true,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6B7280", font: { size: 12 } },
        grid: { color: "#E5E7EB" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#6B7280", font: { size: 12 } },
        grid: { color: "#E5E7EB" },
      },
    },
  };

  // 4. Color palette
  const palette = [
    "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981",
    "#3B82F6", "#F43F5E", "#A855F7", "#22D3EE", "#84CC16"
  ];

  // 5. Trim pie chart to max 10 entries
  let adjustedChartData = chartData;
  if (chartStyle === "pie" && chartData.labels.length > 10) {
    adjustedChartData = {
      labels: chartData.labels.slice(0, 10),
      datasets: chartData.datasets.map(ds => ({
        ...ds,
        data: ds.data.slice(0, 10),
      })),
    };
  }

  // 6. Styled dataset
  const styledData = {
    ...adjustedChartData,
    datasets: adjustedChartData.datasets.map((ds, i) => {
      const baseColor = palette[i % palette.length];
      const isPie = chartStyle === "pie";
      const isLine = chartStyle === "line";
      const isBar = chartStyle === "bar";

      if (isPie) {
        console.log("🧁 Pie slice colors:", ds.data.map((_, j) => palette[j % palette.length]));
      }

      return {
        ...ds,
        ...(isPie && {
          backgroundColor: ds.data.map((_, j) => palette[j % palette.length]),
          borderColor: "#fff",
          borderWidth: 2,
          hoverOffset: 10,
        }),
        ...(isLine && {
          backgroundColor: gradient || `${baseColor}33`,
          borderColor: baseColor,
          borderWidth: 3,
          pointBackgroundColor: "#fff",
          pointBorderColor: baseColor,
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 9,
          pointHoverBackgroundColor: baseColor,
          pointHoverBorderColor: "#fff",
          fill: true,
          tension: 0.4,
        }),
        ...(isBar && {
          backgroundColor: gradient || baseColor,
          borderColor: baseColor,
          borderWidth: 2,
        }),
      };
    }),
  };

  console.log("🎨 Styled Data:", styledData);

  // 7. 3D fallback
 if (chartType === "3d") return render3DChart();


  const commonProps = {
    data: styledData,
    options: chartOptions,
    plugins: showWatermark ? [watermarkPlugin] : [],
  };

  // 8. Final Chart Render
  return (
    <motion.div
      key={`${selectedXAxis}-${selectedYAxis}-${chartStyle}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full bg-white p-4 rounded-xl shadow-md transition ease-in-out flex items-center justify-center"
    >

      {chartType === "2d" && (
  <>
    {chartStyle === "line" && <ChartLine {...commonProps} />}
    {chartStyle === "bar" && <Bar {...commonProps} />}
    {chartStyle === "pie" && <Pie {...commonProps} />}
  </>
)}
    </motion.div>
  );
};


{uploading ? (
  <Skeleton className="w-full h-[400px] rounded-xl" />
) : (
  renderChart()
)}

//   const render3DChart = () => {
//   if (!chartData) return null;

//   const data = chartData?.datasets?.[0]?.data || [];
//   const labels = chartData?.labels || [];

//   const maxValue = Math.max(...data);
//   const minValue = Math.min(...data);
//   const range = maxValue - minValue;
//   const scale = range === 0 ? 1 : 5 / range;

//   return (
//     <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md border border-black/10 bg-gradient-to-br from-slate-50 to-slate-200">
//       <Canvas camera={{ position: [0, 2, 10], fov: 60 }} style={{ background: "transparent" }}>
//         <OrbitControls
//           enablePan={true}
//           enableZoom={true}
//           enableRotate={true}
//           minDistance={3}
//           maxDistance={20}
//         />
//         <ambientLight intensity={0.6} />
//         <pointLight position={[10, 10, 10]} intensity={0.6} />
//         <pointLight position={[-10, -10, -10]} intensity={0.3} />
//         <ChartPoints data={data} labels={labels} minValue={minValue} maxValue={maxValue} scale={scale} />
//         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
//           <planeGeometry args={[100, 100]} />
//           <meshStandardMaterial color="#e5e7eb" />
//         </mesh>
//       </Canvas>
//     </div>
//   );
// };


  const selectOptions =
  completeData?.headers?.map((header) => ({
    value: header,
    label: header,
  })) || [];


  return (
  <DashboardLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8">
      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-700 mb-4">
          Excel Analytics
        </h1>

        {loading && (
          <div className="flex justify-center my-6">
            <CircularProgress sx={{ color: "#4f46e5" }} />
          </div>
        )}

        <p className="text-slate-500 mb-4">
          Upload your Excel files for analysis. We support .xlsx and .xls formats.
        </p>

        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-gradient-to-br from-slate-50 to-slate-200 mb-4">
          <StyledButton
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={uploading}
            sx={{
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
              },
            }}
          >
            Choose Excel File
            <VisuallyHiddenInput
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
          </StyledButton>

          {file && (
            <p className="text-sm text-slate-500 mt-3">Selected file: {file.name}</p>
          )}
        </div>

        {error && !success && (
  <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
    {error}
  </div>
)}

{success && !error && (
  <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
    {success}
  </div>
)}


        {uploadedFile && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4">
            File uploaded successfully!{" "}
            <a
              href={uploadedFile.cloudinaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline"
            >
              View File
            </a>
          </div>
        )}

        {/* Preview Table */}
        {previewData && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-1">File Preview</h2>
            <p className="text-sm text-slate-500 mb-3">
              Total Rows: {previewData.totalRows} | Total Columns: {previewData.totalColumns}
            </p>

            <div className="overflow-auto max-h-[400px] rounded-2xl shadow">
              <table className="min-w-full text-sm text-left text-slate-700">
                <thead className="bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800 font-bold">
                  <tr>
                    {previewData.headers.map((header, index) => (
                      <th key={index} className="px-4 py-2">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="even:bg-slate-50">
                      {previewData.headers.map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-2 text-slate-600">
                          {row[colIndex] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Showing first 5 rows of {previewData.totalRows} total rows
            </p>
          </div>
        )}

        <StyledButton
          variant="contained"
          onClick={handleUpload}
          disabled={!file || uploading}
          sx={{
            marginTop: "1rem",
            background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
            },
          }}
        >
          {uploading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1, color: "#ffffff" }} />
              Uploading...
            </>
          ) : (
            "Upload File"
          )}
        </StyledButton>
      </div>

      {/* Chart Configuration */}
      {completeData?.headers && showChartConfig && (
  <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
    <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-700 mb-2">
      Chart Configuration
    </h2>

    <p className="text-slate-500 mb-4">
      Select columns to visualize your data. Choose one column for the X-axis and one for the Y-axis.
    </p>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  {/* X-axis Select */}
  <div>
    <label className="block text-slate-600 mb-1">X-Axis Column</label>
    <ReactSelect
      options={selectOptions}
      value={selectOptions.find((opt) => opt.value === selectedXAxis)}
      onChange={(selectedOption) => setSelectedXAxis(selectedOption.value)}
      className="react-select-container text-sm"
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          cursor: "pointer",
        }),
        option: (base, state) => ({
          ...base,
          cursor: "pointer",
          backgroundColor: state.isFocused ? "#eef2ff" : "white",
          color: "black",
        }),
      }}
    />
  </div>

  {/* Y-axis Select */}
  <div>
    <label className="block text-slate-600 mb-1">Y-Axis Column</label>
    <ReactSelect
      options={selectOptions}
      value={selectOptions.find((opt) => opt.value === selectedYAxis)}
      onChange={(selectedOption) => setSelectedYAxis(selectedOption.value)}
      className="react-select-container text-sm"
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          cursor: "pointer",
        }),
        option: (base, state) => ({
          ...base,
          cursor: "pointer",
          backgroundColor: state.isFocused ? "#eef2ff" : "white",
          color: "black",
        }),
      }}
    />
  </div>
</div>



    <div className="mb-6">
      <h3 className="text-slate-800 font-medium mb-2">Chart Type</h3>
      <div className="flex gap-4">
        {["2d", "3d"].map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${
              chartType === type
                ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white"
                : "text-slate-500 border-slate-200"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>
    </div>

{chartType === "2d" && (
  <div className="mb-6">
    <h3 className="text-slate-800 font-medium mb-2">Chart Style</h3>
    <div className="flex gap-4">
      {["line", "bar", "pie"].map((style) => (
        <button
          key={style}
          onClick={() => setChartStyle(style)}
          className={`px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${
            chartStyle === style
              ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white"
              : "text-slate-500 border-slate-200"
          }`}
        >
          {style.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
)}


    <div className="text-center">
      <StyledButton
        variant="contained"
        disabled={!selectedXAxis || !selectedYAxis}
        onClick={generateChartData}
        sx={{
          background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
          },
        }}
      >
        Generate Chart
      </StyledButton>
    </div>
  </div>
)}


      {/* Chart Display Section */}
     {chartData && (
  <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-700">
        Chart Visualization
      </h2>

      {/* Download Icon */}
      {chartType === "2d" && (
        <div>
          <IconButton
            onClick={handleDownloadClick}
            sx={{
              color: "#4f46e5",
              "&:hover": { background: "rgba(79, 70, 229, 0.1)" },
            }}
            disabled={uploading}
          >
            {uploading ? (
              <CircularProgress size={24} sx={{ color: "#4f46e5" }} />
            ) : (
              <DownloadIcon />
            )}
          </IconButton>

          {/* Download Menu */}
          <Menu
            anchorEl={downloadAnchorEl}
            open={Boolean(downloadAnchorEl)}
            onClose={handleDownloadClose}
            PaperProps={{
              sx: {
                borderRadius: "8px",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              },
            }}
          >
            <MenuItem onClick={downloadAsPNG} disabled={uploading}>
              Download as PNG
            </MenuItem>
            <MenuItem onClick={downloadAsPDF} disabled={uploading}>
              Download as PDF
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>

    {/* ✅ Custom Filename Input */}
    {chartType === "2d" && (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Custom Filename
      </label>
      <input
        type="text"
        value={customFilename}
        onChange={(e) => setCustomFilename(e.target.value)}
        placeholder="Enter filename"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    )}

    {/* ✅ Chart Container */}
    <div
      ref={chartContainerRef}
      className="w-full h-[70vh] md:h-[70vh] bg-white p-6 rounded-2xl shadow-inner flex items-center justify-center"
    >
      
      {renderChart()}
    </div>
  </div>
)}
    </div>
  </DashboardLayout>
);

};

export default ExcelAnalytics;
