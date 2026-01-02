import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Typography,
  Box,
  Dialog,
  TablePagination,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { SaveAlt as ExportIcon } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { blue } from "@mui/material/colors";
import EditGraduationForOld from "./EditGraduationModuleForOld";
import { LoadingOverlay } from "@mantine/core";
import DescriptionIcon from "@mui/icons-material/Description";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const GraduationTableOldStudent = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [graduationData, setGraduationData] = useState([]);
  const [filteredGraduationData, setFilteredGraduationData] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectedGraduationId, setSelectedGraduationId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const fetchGraduationData = async () => {
    setLoading(true);
    try {
      const config = getAuthConfigSafe()
      const fiscalYearResponse = await axios.get(`${backendUrl}/FiscalYear`, config);
      const response = await axios.get(`${backendUrl}/Graduation`, config);
      setGraduationData(response.data);
      setFiscalYears(fiscalYearResponse.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraduationData();
  }, []);

  const handleFiscalYearChange = (event) => {
    const fiscalYearId = event.target.value;
    setSelectedFiscalYear(fiscalYearId);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    setPage(0);
  };

 useEffect(() => {
   const filteredData = graduationData.filter((data) => {
     const isFiscalYearMatch =
       !selectedFiscalYear || data.fiscalYearID === selectedFiscalYear;

     // Safe access to name properties with fallbacks
     const nameEng = data.applicantNameEng?.toLowerCase() || "";
     const nameNep = data.applicantNameNep?.toLowerCase() || "";
     const searchTermLower = searchTerm.toLowerCase();

     const isSearchMatch =
       !searchTerm ||
       nameEng.includes(searchTermLower) ||
       nameNep.includes(searchTermLower);

     return isFiscalYearMatch && isSearchMatch;
   });
   setFilteredGraduationData(filteredData);
 }, [graduationData, selectedFiscalYear, searchTerm]);

  const handleExportGraduation = (graduationId) => {
    navigate(`/graduation-management/character-certificate-old/${graduationId}`);
  };

  const handleEditClick = (graduationId) => {
    setSelectedGraduationId(graduationId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchGraduationData();
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // console.log(graduationData)
  return (
    <>
      {loading ? (
        <LoadingOverlay
          visible={loading}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ color: "#1976d2", type: "bars" }}
        />
      ) : (
        <Grid container spacing={3} my="5px">
          <Grid item xs={12}>
            <h1 className="text-[#2b6eb5] text-lg font-medium text-center">
              Graduated Old Student List
            </h1>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="fiscalYearId-label">Fiscal Year</InputLabel>
                  <Select
                    id="fiscalYearId"
                    labelId="fiscalYearId-label"
                    value={selectedFiscalYear}
                    onChange={handleFiscalYearChange}
                    label="Fiscal Year"
                    sx={{ borderRadius: 2, backgroundColor: "white" }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {fiscalYears.map((fy) => (
                      <MenuItem key={fy.id} value={fy.id}>
                        {fy.yearNepali}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Search by Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ borderRadius: 2, backgroundColor: "white" }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TableContainer sx={{ borderRadius: 2 }}>
              <Table
                style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
              >
                <TableHead style={{ backgroundColor: "#2A629A" }}>
                  <TableRow>
                    {[
                      "S.N",
                      "Applicant Name",
                      "Email",
                      "Enrolled Year",
                      "Fiscal Year",
                      "Faculty",
                      "Program",
                      "University Issue No",
                      "Registration No.",
                      "Campus Roll No.",
                      "Action",
                    ].map((header, idx) => (
                      <TableCell
                        key={idx}
                        style={{
                          color: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody sx={{ bgcolor: "white" }}>
                  {filteredGraduationData.length > 0 ? (
                    filteredGraduationData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((data, index) => (
                        <TableRow key={index}>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {data?.applicantNameEng}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {data?.email}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {data?.enrolledYear}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {data?.fiscalYear?.yearNepali}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {data?.facultyName}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {data?.shortName || data?.programShortName} 
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {data.universityIssueNo}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {data.studentRegNo}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            {data?.campusRolNo}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                            }}
                          >
                            <Box sx={{ display: "flex", gap: 1, px: 2 }}>
                              <button
                                onClick={() => handleEditClick(data.id)}
                                className="flex  rounded-lg text-sm  w-20 h-7 bg-[#2B6EB5] text-[#ffffff] justify-center items-center"
                              >
                                <EditNoteIcon fontSize="10px" /> Edit
                              </button>

                              <button
                                onClick={() => handleExportGraduation(data.id)}
                                className="flex  rounded-lg text-sm  w-28 h-7 bg-[#2B6EB5] text-[#ffffff] justify-center items-center"
                              >
                                <ExportIcon fontSize="10px" />
                                Generate
                              </button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} style={{ textAlign: "center" }}>
                        <Typography variant="h6" color="textSecondary">
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination Component */}
              <TablePagination
                rowsPerPageOptions={[50, 100, 200]}
                component="div"
                count={filteredGraduationData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Grid>

          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            maxWidth="lg"
          >
            <EditGraduationForOld
              id={selectedGraduationId}
              onClose={() => setOpenEditDialog(false)}
              onUpdate={handleUpdate}
            />
          </Dialog>
        </Grid>
      )}
    </>
  );
};

export default GraduationTableOldStudent;
