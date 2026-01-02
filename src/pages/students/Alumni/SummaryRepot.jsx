import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TableFooter,
  Button,
  Tooltip,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import {config} from '@config';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderRight: "1px solid #e0e0e0",
  "&:last-child": {
    borderRight: "none",
  },
  padding: theme.spacing(1),
  fontSize: "1.1rem",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5),
    fontSize: "0.9rem",
  },
}));

const HeaderTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: "1.3rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
  },
}));

const TotalTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,

  fontSize: "1.3rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
}));

const calculateRatio = (male, female, other) => {
  const m = Math.max(0, Math.round(male));
  const f = Math.max(0, Math.round(female));
  const o = Math.max(0, Math.round(other));

  const total = m + f + o;
  if (total === 0) return "0:0:0";

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  const commonDivisor = gcd(gcd(m, f), o);

  return `${m / commonDivisor}:${f / commonDivisor}:${o / commonDivisor}`;
};

const getAuthToken = () => {
  try {
    const localStorageData = JSON.parse(
      localStorage.getItem("persist:root") || "{}"
    );
    if (localStorageData.user) {
      const userState = JSON.parse(localStorageData.user);
      return userState.currentUser?.tokenString || null;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};

const AlumniSummaryReport = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [totals, setTotals] = useState({
    totalMale: 0,
    totalFemale: 0,
    totalOther: 0,
    grandTotal: 0,
  });

  const fetchAlumniSummary = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await axios.get(`${backendUrl}/Graduation`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, 
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);

      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout. Please check your connection.");
      } else {
        throw new Error("Failed to fetch alumni data. Please try again.");
      }
    }
  };

  const processAlumniData = (data) => {

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format received from server");
    }

    const batchMap = new Map();

    data.forEach((alumni) => {
   
      const batch = alumni.passedYear?.toString() || "Unknown";
      const gender = alumni.gender?.toLowerCase() || "other";

      if (!batchMap.has(batch)) {
        batchMap.set(batch, {
          male: 0,
          female: 0,
          other: 0,
          batch: batch,
        });
      }

      const batchData = batchMap.get(batch);
      switch (gender) {
        case "male":
          batchData.male += 1;
          break;
        case "female":
          batchData.female += 1;
          break;
        default:
          batchData.other += 1;
      }
    });

 
    const transformedData = Array.from(batchMap.values()).sort((a, b) => {
      if (a.batch === "Unknown") return 1;
      if (b.batch === "Unknown") return -1;
      return a.batch.localeCompare(b.batch);
    });


    const totalMale = transformedData.reduce(
      (sum, batch) => sum + batch.male,
      0
    );
    const totalFemale = transformedData.reduce(
      (sum, batch) => sum + batch.female,
      0
    );
    const totalOther = transformedData.reduce(
      (sum, batch) => sum + batch.other,
      0
    );
    const grandTotal = totalMale + totalFemale + totalOther;

    setTotals({ totalMale, totalFemale, totalOther, grandTotal });
    setAlumniData(transformedData);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAlumniSummary();
      processAlumniData(data);
    } catch (err) {
      console.error("Failed to fetch alumni summary:", err);
      setError(err.message || "Failed to load alumni data. Please try again.");
      setAlumniData([]);
      setTotals({
        totalMale: 0,
        totalFemale: 0,
        totalOther: 0,
        grandTotal: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const exportToExcel = () => {
    try {
      const exportData = alumniData.map((batch) => {
        const batchTotal = batch.male + batch.female + batch.other;
        const fullRatio = calculateRatio(batch.male, batch.female, batch.other);
        const mfRatio =
          batch.female > 0 ? (batch.male / batch.female).toFixed(2) : "N/A";

        return {
          "Batch Year": batch.batch,
          Male: batch.male,
          Female: batch.female,
          Other: batch.other,
          Total: batchTotal,
          "Gender Ratio (M:F:O)": fullRatio,
          "Gender Ratio (M:F)": mfRatio === "N/A" ? mfRatio : `${mfRatio}:1`,
        };
      });

      exportData.push({
        "Batch Year": "Grand Total",
        Male: totals.totalMale,
        Female: totals.totalFemale,
        Other: totals.totalOther,
        Total: totals.grandTotal,
        "Gender Ratio (M:F:O)": calculateRatio(
          totals.totalMale,
          totals.totalFemale,
          totals.totalOther
        ),
        "Gender Ratio (M:F)":
          totals.totalFemale > 0
            ? `${(totals.totalMale / totals.totalFemale).toFixed(2)}:1`
            : "N/A",
      });

      const ws = XLSX.utils.json_to_sheet(exportData);


      const colWidths = [
        { wch: 15 },
        { wch: 10 }, 
        { wch: 10 }, 
        { wch: 10 }, 
        { wch: 10 }, 
        { wch: 20 }, 
        { wch: 20 }, 
      ];
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Alumni Summary");
      XLSX.writeFile(wb, "Alumni_Summary_Report.xlsx");

      setExportDialogOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      setError("Failed to export data. Please try again.");
    }
  };

  const tableHeaders = [
    "Batch Year",
    "Male",
    "Female",
    "Other",
    "Total",
    "Gender Ratio (M:F:O)",
    "Gender Ratio (M:F)",
  ];

  const shouldHideColumn = (index) => {
    if (isSmallScreen && index >= 4) return true;
    if (isMobile && index >= 5) return true;
    return false;
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, overflow: "auto" }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
        spacing={2}
      >
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                backgroundColor: "#f5f5f5",
                padding: { xs: 1, sm: 1.5 },
                borderRadius: 1,
                textAlign: "center",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                width: "100%",
                maxWidth: "500px",
              }}
            >
              Alumni Student Report by Batch
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Tooltip title="Refresh data">
            <IconButton
              onClick={handleRetry}
              sx={{ mr: 1 }}
              color="primary"
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={() => setExportDialogOpen(true)}
              disabled={loading || alumniData.length === 0}
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
              }}
              size={isSmallScreen ? "small" : "medium"}
            >
              Export Excel
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      ) : alumniData.length === 0 ? (
        <Alert severity="info">No alumni data available.</Alert>
      ) : (
        <>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              maxWidth: "100%",
              overflowX: "auto",
            }}
          >
            <Table
              sx={{
                minWidth: 650,
                borderCollapse: "collapse",
              }}
              aria-label="alumni summary table"
              size={isSmallScreen ? "small" : "medium"}
            >
              <TableHead>
                <TableRow>
                  {tableHeaders.map(
                    (header, index) =>
                      !shouldHideColumn(index) && (
                        <HeaderTableCell key={index}>{header}</HeaderTableCell>
                      )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {alumniData.map((batch, index) => {
                  const batchTotal = batch.male + batch.female + batch.other;
                  const fullRatio = calculateRatio(
                    batch.male,
                    batch.female,
                    batch.other
                  );
                  const mfRatio =
                    batch.female > 0
                      ? (batch.male / batch.female).toFixed(2)
                      : "N/A";

                  return (
                    <TableRow
                      key={batch.batch}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#fafafa",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                    >
                      <StyledTableCell>{batch.batch}</StyledTableCell>
                      <StyledTableCell>{batch.male}</StyledTableCell>
                      <StyledTableCell>{batch.female}</StyledTableCell>
                      <StyledTableCell>{batch.other}</StyledTableCell>
                      <StyledTableCell>{batchTotal}</StyledTableCell>
                      {!shouldHideColumn(5) && (
                        <StyledTableCell>{fullRatio}</StyledTableCell>
                      )}
                      {!shouldHideColumn(6) && (
                        <StyledTableCell>
                          {mfRatio === "N/A" ? mfRatio : `${mfRatio}:1`}
                        </StyledTableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TotalTableCell>Grand Total</TotalTableCell>
                  <TotalTableCell>{totals.totalMale}</TotalTableCell>
                  <TotalTableCell>{totals.totalFemale}</TotalTableCell>
                  <TotalTableCell>{totals.totalOther}</TotalTableCell>
                  <TotalTableCell>{totals.grandTotal}</TotalTableCell>
                  {!shouldHideColumn(5) && (
                    <TotalTableCell>
                      {calculateRatio(
                        totals.totalMale,
                        totals.totalFemale,
                        totals.totalOther
                      )}
                    </TotalTableCell>
                  )}
                  {!shouldHideColumn(6) && (
                    <TotalTableCell>
                      {totals.totalFemale > 0
                        ? `${(totals.totalMale / totals.totalFemale).toFixed(
                            2
                          )}:1`
                        : "N/A"}
                    </TotalTableCell>
                  )}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          {(isMobile || isSmallScreen) && (
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, textAlign: "center" }}
            >
              Scroll horizontally to view all data
            </Typography>
          )}
        </>
      )}

      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      >
        <DialogTitle>Export Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to export the alumni data to Excel?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button onClick={exportToExcel} variant="contained" color="success">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AlumniSummaryReport;
