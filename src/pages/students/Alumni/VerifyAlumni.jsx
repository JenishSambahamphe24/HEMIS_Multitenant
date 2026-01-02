import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Dialog,
  CircularProgress,
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getAllAlumniStudents } from "../../../services/services";
import { getAllAlumniUnverifiedStudents } from "../../../services/services";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AlumniUnverified from "./AlumniUnverified";

const VerifyAlumni = () => {
  const [allAlumnis, setAllAlumnis] = useState([]);
  const [filteredAlumnis, setFilteredAlumnis] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Helper function to sort alumni alphabetically
  const sortAlumnisAlphabetically = (alumnis) => {
    const sorted = [...alumnis].sort((a, b) => {
      // Handle null/undefined values by converting to empty string
      const nameA = String(a.applicantName || "")
        .toLowerCase()
        .trim();
      const nameB = String(b.applicantName || "")
        .toLowerCase()
        .trim();

      // Handle empty names by putting them at the end
      if (nameA === "" && nameB === "") return 0;
      if (nameA === "") return 1;
      if (nameB === "") return -1;

      return nameA.localeCompare(nameB);
    });

    return sorted;
    
  };

  const getAllAlumnis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await  getAllAlumniUnverifiedStudents();
      if (response && Array.isArray(response)) {
        const sortedAlumnis = sortAlumnisAlphabetically(response);
        setAllAlumnis(sortedAlumnis);
        setFilteredAlumnis(sortedAlumnis);
      } else {
        setAllAlumnis([]);
        setFilteredAlumnis([]);
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching alumni:", error);
      setError("Failed to fetch alumni data. Please try again later.");
      setAllAlumnis([]);
      setFilteredAlumnis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAlumnis();
  }, []);

  // Handle search functionality - sorts results alphabetically every time
  useEffect(() => {
    let filtered = allAlumnis;

    if (searchTerm.trim() !== "") {
      filtered = allAlumnis.filter((alumni) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (alumni.applicantName?.toLowerCase() || "").includes(
            searchLower
          ) ||
          (alumni.email?.toLowerCase() || "").includes(searchLower) ||
          (alumni.contactNumber?.toLowerCase() || "").includes(searchLower) ||
          (alumni.program?.toLowerCase() || "").includes(searchLower) ||
          (alumni.registrationNo?.toLowerCase() || "").includes(searchLower)
        );
      });
    }

    // Always sort the results alphabetically
    const sortedFiltered = sortAlumnisAlphabetically(filtered);
    setFilteredAlumnis(sortedFiltered);
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, allAlumnis]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Ensure paginated data is also sorted
  const paginatedAlumnis = filteredAlumnis.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenEditDialog = (alumni) => {
    setSelectedAlumni(alumni);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedAlumni(null);
    getAllAlumnis();
  };

  const formatDate = (dateString) => {
    return dateString ? dateString.split("T")[0] : "N/A";
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        sx={{ position: "relative", maxWidth: "100%", mx: "auto", px: 2 }}
      >
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            color: "primary.main",
            fontSize: "1.75rem",
            fontWeight: "bold",
          }}
        >
          List of unverified Alumni list
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "flex-start" }}>
        <TextField
          placeholder="Search by name, email, phone, program, or reg.no"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 450 }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "100%",
          mx: "auto",
          mt: 3,
          mb: 4,
          boxShadow: 3,
          border: "1px solid #e0e0e0",
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
            flexDirection="column"
          >
            <Typography color="error">{error}</Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={getAllAlumnis}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Table sx={{ tableLayout: "fixed", width: "100%" }}>
              <TableHead
                sx={{
                  backgroundColor: "primary.main",
                  "& th": {
                    color: "common.white",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <TableRow>
                  <TableCell align="center" sx={{ width: "50px" }}>
                    S.No
                  </TableCell>
                  <TableCell sx={{ width: "150px" }}>Full Name</TableCell>
                  <TableCell sx={{ width: "80px" }}>Gender</TableCell>
                  <TableCell sx={{ width: "110px" }}>DOB (B.S)</TableCell>
                  <TableCell sx={{ width: "180px" }}>Email</TableCell>
                  <TableCell sx={{ width: "110px" }}>Phone Number</TableCell>
                  <TableCell sx={{ width: "140px" }}>Program</TableCell>
                  <TableCell sx={{ width: "80px" }}>Enrolled Years</TableCell>
                  <TableCell sx={{ width: "80px" }}>Passed Years</TableCell>
                  <TableCell sx={{ width: "100px" }}>Reg. No</TableCell>
                  <TableCell sx={{ width: "100px" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAlumnis.length > 0 ? (
                  paginatedAlumnis.map((alumni, index) => (
                    <TableRow
                      key={alumni.id || index}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "action.hover",
                        },
                        "& td": {
                          borderRight: "1px solid rgba(224, 224, 224, 1)",
                          color: "text.primary",
                          wordBreak: "break-word",
                        },
                        "&:hover td": {
                          backgroundColor: "action.selected",
                        },
                      }}
                    >
                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontWeight="500"
                          sx={{ wordBreak: "break-word", fontSize: "0.875rem" }}
                        >
                          {alumni.applicantNameEng || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ wordBreak: "break-word", fontSize: "0.875rem" }}
                        >
                          {alumni.gender ? `${alumni.gender}` : ""}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ wordBreak: "break-word", fontSize: "0.875rem" }}
                      >
                        {formatDate(alumni.doBNepali)}
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: "primary.dark",
                            wordBreak: "break-word",
                            fontSize: "0.875rem",
                          }}
                        >
                          {alumni.email || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ wordBreak: "break-word", fontSize: "0.875rem" }}
                        >
                          {alumni.contactNo || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontWeight="500"
                          sx={{ wordBreak: "break-word", fontSize: "0.875rem" }}
                        >
                          {alumni.programName || ""}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ wordBreak: "break-word", fontSize: "0.875rem" }}
                      >
                        {alumni.enrolledYear || ""}
                      </TableCell>
                      <TableCell
                        sx={{ wordBreak: "break-word", fontSize: "0.875rem" }}
                      >
                        {alumni.passedYear || ""}
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontWeight="500"
                          sx={{ wordBreak: "break-word", fontSize: "0.875rem" }}
                        >
                          {alumni.studentRegNo || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Review Alumni">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenEditDialog(alumni)}
                              size="small"
                              sx={{
                                "&:hover": {
                                  backgroundColor: "primary.light",
                                  color: "primary.contrastText",
                                },
                              }}
                            >
                              <RateReviewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {searchTerm
                          ? "No matching alumni found"
                          : "No alumni records found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Add TablePagination component */}
            <TablePagination
              rowsPerPageOptions={[20, 50, 100, 200]}
              component="div"
              count={filteredAlumnis.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: "1px solid rgba(224, 224, 224, 1)",
                "& .MuiTablePagination-toolbar": {
                  padding: "12px 16px",
                },
              }}
            />
          </>
        )}
      </TableContainer>

      <AlumniUnverified
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        alumniData={selectedAlumni}
        onUpdate={getAllAlumnis}
      />
    </Box>
  );
};

export default VerifyAlumni;