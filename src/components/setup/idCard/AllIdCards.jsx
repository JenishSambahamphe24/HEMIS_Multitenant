import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  FormHelperText,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import BikramSambatDateInput from "../../DateField/DateInputField";
import ClearIcon from "@mui/icons-material/Clear";
import { Landscape, Portrait, OriginalJMC } from "./IdComponent";
import PrintIcon from "@mui/icons-material/Print";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import { getSignaturedEmpById } from "../../../services/services";
import error_img from "../../../assets/error_img.png";
import { config } from '@config';
import { useBulkIdPrint } from "../../report/CampusReport/statisticalReport/components/pdfHelpers";



const AllIdCards = () => {
  
//for navigation to next page
const navigate = useNavigate();

  const backendUrl = config.VITE_BACKEND_URL;
  const uploadURL = config.VITE_UPLOAD_URL;
  const baseUrl = config.VITE_BASE_URL;
  const [firstSignature, setFirstSignature] = useState([]);
  const [loading, setLoading] = useState(false);
  const { studentId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const componentRef = useRef(null);

  const phoneNo = `${currentUser?.institution?.contactNo1 || ""}`;
  const campusName = currentUser?.institution?.campusName;
  const [collegeFirstName, ...collegeRemaining] =
    currentUser?.institution?.campusName.split(" ");
  const collegeSecond = collegeRemaining.join(" ");
  const localLevel = currentUser?.institution?.localLevel;
  const district = currentUser?.institution?.district;
  const logo = currentUser?.institution?.logo;
  const uniName = currentUser?.institution?.university?.name;
  const collegeAddress = currentUser?.institution.locality;

  const [students, setStudents] = useState([]);
  const [orientation, setOrientation] = useState("landscape");
  const [cardMode, setCardMode] = useState("standard");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [batchOptions, setBatchOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [filteredProgramOptions, setFilteredProgramOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [shouldFetchStudents, setShouldFetchStudents] = useState(false);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validityDateNep, setValidityDateNep] = useState("");
  const [issueDateNep, setIssueDateNep] = useState("");
  const [bulkUpdateLoading, setBulkUpdateLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const getCommonProps = () => ({
    baseUrl,
    logo,
    uniName,
    campusName,
    localLevel,
    district,
    phoneNo,
    uploadURL,
    campusId: currentUser?.institution?.id,
    stdPhoto: null,
    firstSignature,
    error_img,
    collegeFirstName,
    collegeSecond,
    collegeAddress,
  });

  useEffect(() => {
    const fetchSignatures = async () => {
      const response = await getSignaturedEmpById();
      setFirstSignature(response.find((item) => item.index === 1));
    };
    fetchSignatures();
  }, []);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const config = getAuthConfigSafe();
        const [batchRes, programsRes] = await Promise.all([
          axios.get(`${backendUrl}/Batch`, config),
          axios.get(`${backendUrl}/ProgramMgmt/GetCollegePrograms`, config),
        ]);

        setBatchOptions(batchRes.data);
        setProgramOptions(programsRes.data);

        const uniqueLevels = [
          ...new Map(
            programsRes.data.map((item) => [
              item.levelId,
              { id: item.levelId, name: item.levelName },
            ])
          ).values(),
        ];

        setLevelOptions(uniqueLevels);
        if (studentId) {
          setShouldFetchStudents(true);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilterOptions();
  }, [studentId]);

  useEffect(() => {
    if (selectedLevel) {
      const filtered = programOptions.filter(
        (program) => program.levelId.toString() === selectedLevel.toString()
      );
      setFilteredProgramOptions(filtered);
      if (
        selectedProgram &&
        !filtered.find(
          (p) => p.programId.toString() === selectedProgram.toString()
        )
      ) {
        setSelectedProgram("");
      }
    } else {
      setFilteredProgramOptions(programOptions);
    }
  }, [selectedLevel, programOptions, selectedProgram]);

  useEffect(() => {
    if (shouldFetchStudents) {
      const fetchStudents = async () => {
        try {
          setLoading(true);
          const config = getAuthConfigSafe();
          const params = new URLSearchParams();
          if (selectedBatch) params.append("batchId", selectedBatch);
          if (selectedProgram) params.append("programId", selectedProgram);
          params.append("page", page);
          params.append("pageSize", rowsPerPage);

          const response = await axios.get(
            `${backendUrl}/Student/GetIdCard?${params.toString()}`,
            config
          );
          const sortedStudents = response.data.students.sort((a, b) => a.id - b.id);
          setStudents(sortedStudents); 
          setTotalItems(response.data.totalRecords);
          setTotalPages(Math.ceil(response.data.totalRecords / rowsPerPage));
          setSelectedStudents([]); 
        } catch (error) {
          console.error("Error fetching students:", error);
          showSnackbar("Error fetching students", "error");
        } finally {
          setLoading(false);
        }
      };

      fetchStudents();
    }
  }, [
    shouldFetchStudents,
    page,
    studentId,
    selectedBatch,
    selectedLevel,
    selectedProgram,
    rowsPerPage,
  ]);


  const convertIsoToAD = (isoDate) => {
    if (!isoDate) return null;
    try {
      const [datePart] = isoDate.split("T");
      return datePart;
    } catch (error) {
      console.error("Error converting ISO to AD:", error);
      return null;
    }
  };

  const convertIsoToDisplay = (isoDate) => {
    if (!isoDate) return "";
    const adDate = convertIsoToAD(isoDate);
    if (!adDate) return "";
    return adDate.replace(/-/g, "/");
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    if (students.length > 0) {
      setShouldFetchStudents(true);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    setShouldFetchStudents(true);
  };

  const handlePrint = useBulkIdPrint({ orientation, componentRef });

  const handleClearFilters = () => {
    setSelectedBatch("");
    setSelectedLevel("");
    setSelectedProgram("");
    setPage(1);
  };

  const toggleCardMode = () => {
    setCardMode(cardMode === "standard" ? "compact" : "standard");
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allStudentIds = students.map((student) => student.id);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const isAllSelected = students.length > 0 && selectedStudents.length === students.length;
  const isIndeterminate = selectedStudents.length > 0 && selectedStudents.length < students.length;

  const handleOpenDialog = () => {
    if (selectedStudents.length === 0) {
      showSnackbar("Please select students first", "warning");
      return;
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setValidityDateNep("");
    setIssueDateNep("");
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleBulkUpdate = async () => {
    if (!selectedProgram) {
      showSnackbar("Please select a program first", "error");
      return;
    }

    if (!issueDateNep || !validityDateNep) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    try {
      setBulkUpdateLoading(true);
      const config = getAuthConfigSafe();
      const validityDateEng = convertIsoToAD(validityDateNep);
      const issueDateNepFormatted = convertIsoToDisplay(issueDateNep);
      const validityDateNepFormatted = convertIsoToDisplay(validityDateNep);

      if (!validityDateEng) {
        showSnackbar("Invalid validity date format", "error");
        return;
      }

      const payload = {
        campusId: currentUser?.institution?.id,
        programMgmtId: parseInt(selectedProgram),
        issueDateNep: issueDateNepFormatted,
        validityDateEng: validityDateEng,
        validityDateNep: validityDateNepFormatted,
        generationType: "Bulk",
        studentIds: selectedStudents
      };

      await axios.post(
        `${backendUrl}/IdCardInfo/bulk-by-students`,
        payload,
        config
      );

      showSnackbar(`Successfully updated ${selectedStudents.length} ID cards`, "success");

      //wait a bit so user sees the toast, then navigate
     setTimeout(() => {
      handleCloseDialog();
      setSelectedStudents([]);
      
      setShouldFetchStudents(true);
      navigate("/student-management/generated-id-cards");
    }, 1200); 
    } catch (error) {
      console.error("Error updating ID cards:", error);
      showSnackbar(
        error.response?.data?.message || "Error updating ID cards",
        "error"
      );
    } finally {
      setBulkUpdateLoading(false);
    }
  };
  const renderCard = (student) => {
    const commonProps = {
      ...getCommonProps(),
      stdPhoto: student?.studentProfile?.ppSizePhoto,
    };

    const isSelected = selectedStudents.includes(student.id);

    return (
      <Box key={student.id} sx={{ position: "relative" }}>
        <Checkbox
          checked={isSelected}
          size="small"
          onChange={() => handleSelectStudent(student.id)}
          sx={{
            position: "absolute",
            top: 4,
            right: 1,
            zIndex: 10,
            bgcolor: "white",
            borderRadius: 1,
            "&:hover": { bgcolor: "white" },
          }}
          className="no-print"
        />
        {orientation === "landscape" && (
          <Landscape student={student} {...commonProps} />
        )}
        {orientation === "portrait" && (
          <Portrait student={student} {...commonProps} />
        )}
        {orientation === "jmcOriginal" && (
          <OriginalJMC student={student} {...commonProps} />
        )}
      </Box>
    );
  };

  return (
    <Card sx={{ mb: 2, overflow: "visible" }}>
      <CardContent>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: 500, color: "#0046b5" }}
          className="no-print"
        >
          Student ID Cards
        </Typography>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="no-print"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Orientation</InputLabel>
              <Select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                label="Orientation"
              >
                <MenuItem value="landscape">Landscape</MenuItem>
                <MenuItem value="portrait">Portrait</MenuItem>
                <MenuItem value="jmcOriginal">JMC</MenuItem>
              </Select>
            </FormControl>

            <Tooltip
              title={
                cardMode === "standard"
                  ? "Switch to compact view"
                  : "Switch to standard view"
              }
            >
              <IconButton onClick={toggleCardMode} color="primary">
                {cardMode === "standard" ? (
                  <ViewCompactIcon />
                ) : (
                  <ViewModuleIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CalendarTodayIcon />}
              onClick={handleOpenDialog}
              sx={{
                borderColor: "#0046b5",
                color: "#0046b5",
                "&:hover": {
                  borderColor: "#003694",
                  bgcolor: "rgba(0, 70, 181, 0.04)"
                },
              }}
            >
              Add Validity Date ({selectedStudents.length})
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{
                bgcolor: "#0046b5",
                "&:hover": { bgcolor: "#003694" },
              }}
            >
              Print ID Cards
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} className="no-print" />

        <Grid container spacing={2} sx={{ mb: 3 }} className="no-print">
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Batch</InputLabel>
              <Select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                label="Batch"
              >
                <MenuItem value="">All</MenuItem>
                {batchOptions.map((batch) => (
                  <MenuItem key={batch.id} value={batch.id}>
                    {batch.batchNepali}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Level</InputLabel>
              <Select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setSelectedProgram("");
                }}
                label="Level"
              >
                <MenuItem value="">All</MenuItem>
                {levelOptions.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select level first</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth size="small" disabled={!selectedLevel}>
              <InputLabel>Program</InputLabel>
              <Select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                label="Program"
              >
                <MenuItem value="">All</MenuItem>
                {filteredProgramOptions.map((program) => (
                  <MenuItem key={program.programId} value={program.programId}>
                    {program.programName} ({program.shortName})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Programs for selected level</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleApplyFilters}
                sx={{ height: "40px" }}
              >
                Apply
              </Button>
              <Tooltip title="Clear filters">
                <IconButton
                  onClick={handleClearFilters}
                  sx={{
                    height: "40px",
                    width: "40px",
                    border: "1px solid rgba(0,0,0,0.23)",
                    color: "text.secondary",
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", my: 4 }}
            className="no-print"
          >
            <CircularProgress />
          </Box>
        ) : students.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }} className="no-print">
            <Typography variant="body1" color="text.secondary">
              {shouldFetchStudents
                ? "No students found matching your criteria"
                : "Use the filters above and click Apply to view students"}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }} className="no-print">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
              />
              <Typography variant="body2" color="text.secondary">
                Select All
              </Typography>
              <Chip
                label={`${selectedStudents.length} selected | Showing ${students?.length} of ${totalItems} students`}
                variant="outlined"
                size="small"
              />
            </Box>

            <Grid
              container
              columnGap="20px"
              rowGap="20px"
              ref={componentRef}
              className="print-container"
            >
              {students?.map((student) => renderCard(student))}
            </Grid>

            <Box
              sx={{ display: "flex", justifyContent: "right", mt: 3 }}
              className="no-print"
            >
              <Box>
                <FormControl size="small" fullWidth>
                  <Select
                    variant="standard"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    displayEmpty
                    sx={{
                      backgroundColor: "whitesmoke",
                      borderColor: "lightgray",
                      borderRadius: 1,
                      width: "150px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "lightgray",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "blue",
                      },
                      "& .MuiSelect-select": {
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                      },
                      "& .MuiSelect-icon": {
                        fontSize: "1rem",
                      },
                    }}
                  >
                    <MenuItem value={25}>
                      <em>rows per page</em>
                    </MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={200}>200</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                sx={{ ml: "40px" }}
              />
            </Box>
          </>
        )}
      </CardContent>

      {/* Bulk Update Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Validity Date for {selectedStudents.length} Students</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            {!selectedProgram && (
              <Alert severity="warning">
                Please select a program from the filters above before adding validity dates.
              </Alert>
            )}

            <BikramSambatDateInput
              label="Issue Date (Nepali)"
              name="issueDateNep"
              value={issueDateNep}
              onChange={(isoDate) => setIssueDateNep(isoDate)}
              required
              size="small"
              fullWidth
            />

            <BikramSambatDateInput
              label="Validity Date (Nepali)"
              name="validityDateNep"
              value={validityDateNep}
              onChange={(isoDate) => setValidityDateNep(isoDate)}
              required
              size="small"
              fullWidth
            />

            {/* {validityDateNep && (
              // <Alert severity="info">
              //   English Date: {convertIsoToAD(validityDateNep) || "Invalid date"}
              // </Alert>
            )} */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={bulkUpdateLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkUpdate}
            variant="contained"
            disabled={bulkUpdateLoading || !selectedProgram}
            sx={{
              bgcolor: "#0046b5",
              "&:hover": { bgcolor: "#003694" },
            }}
          >
            {bulkUpdateLoading ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};
export default AllIdCards;