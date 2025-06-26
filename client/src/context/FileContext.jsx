// FileContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Fetch only the logged-in user's files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axiosInstance.get("/user/files", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFiles(res.data.files || res.data); // supports both array and { files: [...] }
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("❌ Failed to fetch your files.");
      }
    };

    if (token) {
      fetchFiles();
    }
  }, [token]);

  // ✅ Fetch parsed data for selected file
  useEffect(() => {
    const fetchFileData = async () => {
      if (!selectedFileId || selectedFileId === "local") {
        setFileData(null);
        return;
      }

      try {
        const res = await axiosInstance.get(`/user/files/${selectedFileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFileData(res.data);
      } catch (err) {
        console.error("Failed to fetch file data", err);
      }
    };

    if (token && selectedFileId) {
      fetchFileData();
    }
  }, [selectedFileId, token]);

  return (
    <FileContext.Provider
      value={{
        files,
        selectedFileId,
        setSelectedFileId,
        fileData,
        setFileData,
        error,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFilesContext = () => useContext(FileContext);
