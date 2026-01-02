import { useEffect, useState, useMemo } from "react";
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
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { SaveAlt as ExportIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { blue } from "@mui/material/colors";
import EditGraduationModule from "./EditGraduationModule";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const GraduationModuleTable = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [graduationData, setGraduationData] = useState([]);
  const [allGraduationData, setAllGraduationData] = useState([]); 
  const [fiscalYears, setFiscalYears] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectedGraduationId, setSelectedGraduationId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const fetchGraduationData = async () => {
    try {
      const config = getAuthConfigSafe();
      const fiscalYearResponse = await axios.get(
        `${backendUrl}/FiscalYear`,
        config
      );
      const response = await axios.get(
        `${backendUrl}/Graduation/GetGraduationApplicationsStudent`,
        config
      );
      setGraduationData(response.data);
      setAllGraduationData(response.data);
      setFiscalYears(fiscalYearResponse.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGraduationData();
  }, []);

  const filteredData = useMemo(() => {
    return allGraduationData.filter((data) => {
      const fiscalYearMatch = selectedFiscalYear
        ? data.fiscalYear?.id === selectedFiscalYear
        : true;

      const searchMatch = searchTerm
        ? (data.student?.firstName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (data.student?.middleName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (data.student?.lastName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (data.student?.nepaliName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (data.studentRegNo?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (data.symbolNoUniversity?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (data.student?.rollNo?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          )
        : true;

      return fiscalYearMatch && searchMatch;
    });
  }, [allGraduationData, selectedFiscalYear, searchTerm]);

  const handleFiscalYearChange = (event) => {
    const fiscalYearId = event.target.value;
    setSelectedFiscalYear(fiscalYearId);
    // No need to fetch data again, just use filtering
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
  };

  const handleExportGraduation = (student) => {
    navigate(
      `/graduation-management/character-certificate/${student?.student?.id}`,
      {
        state: { studentData: student },
      }
    );
  };

  const handleEditClick = (graduationId) => {
    setSelectedGraduationId(graduationId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchGraduationData();
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant={"h5"}
            textAlign={"center"}
            color={blue[800]}
            sx={{ mt: "2rem", mb: "2rem" }}
          >
            Graduated Student List
          </Typography>

          <Grid container spacing={3}>
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
                    <em>All Years</em>
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
                label="Search by Name, Reg No, Symbol No, Roll No"
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
          <TableContainer sx={{ borderRadius: 2, overflowX: "auto" }}>
            <Table
              style={{
                borderCollapse: "collapse",
                border: "1px solid #ddd",
                tableLayout: "fixed",
              }}
            >
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  <TableCell
                    style={{
                      width: "40px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    S.N
                  </TableCell>
                  <TableCell
                    style={{
                      width: "120px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Applicant Name (English)
                  </TableCell>
                  <TableCell
                    style={{
                      width: "100px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Applicant Name (Nepali)
                  </TableCell>
                  <TableCell
                    style={{
                      width: "85px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    DOB
                  </TableCell>
                  <TableCell
                    style={{
                      width: "130px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    style={{
                      width: "100px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Faculty
                  </TableCell>
                  <TableCell
                    style={{
                      width: "90px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Program
                  </TableCell>
                  <TableCell
                    style={{
                      width: "70px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Enrolled year
                  </TableCell>
                  <TableCell
                    style={{
                      width: "70px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Passed year
                  </TableCell>
                  <TableCell
                    style={{
                      width: "80px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Fiscal year
                  </TableCell>
                  <TableCell
                    style={{
                      width: "90px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    University Issue No
                  </TableCell>
                  <TableCell
                    style={{
                      width: "110px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Student Registration No.
                  </TableCell>
                  <TableCell
                    style={{
                      width: "60px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Symbol No.
                  </TableCell>
                  <TableCell
                    style={{
                      width: "90px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Campus Roll No.
                  </TableCell>
                  <TableCell
                    style={{
                      width: "100px",
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody sx={{ bgcolor: "white" }}>
                {filteredData.length > 0 ? (
                  filteredData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell
                        style={{
                          width: "40px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "center",
                          wordWrap: "break-word",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "120px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.student?.firstName} {data.student?.middleName}{" "}
                        {data.student?.lastName}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "120px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.applicantNameNep}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "90px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data?.student?.doBBS
                          ? data?.student?.doBBS?.slice(0, 10)
                          : ""}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "140px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.email}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "100px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.facultyName}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "100px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.shortName || data?.programShortName}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "80px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.enrolledYear}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "80px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.passedYear}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "80px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.fiscalYear?.yearNepali}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "100px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.universityIssueNo}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "120px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.studentRegNo}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "80px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.symbolNoUniversity}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "100px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                          wordWrap: "break-word",
                        }}
                      >
                        {data.student?.rollNo}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "160px",
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            onClick={() => handleEditClick(data)}
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{
                              borderRadius: 1,
                              minWidth: "60px",
                              fontSize: "0.7rem",
                              padding: "4px 6px",
                            }}
                          >
                            <EditNoteIcon sx={{ fontSize: "16px", mr: 0.5 }} />{" "}
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleExportGraduation(data)}
                            variant="contained"
                            startIcon={<ExportIcon sx={{ fontSize: "16px" }} />}
                            size="small"
                            sx={{
                              bgcolor: "#1976d2",
                              color: "white",
                              "&:hover": {
                                bgcolor: "#1565c0",
                              },
                              padding: "4px 8px",
                              borderRadius: 1,
                              minWidth: "80px",
                              fontSize: "0.7rem",
                            }}
                          >
                            Generate
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={14} style={{ textAlign: "center" }}>
                      <Typography variant="h6" color="textSecondary">
                        No Data Available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="lg"
        >
          <EditGraduationModule
            data={selectedGraduationId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default GraduationModuleTable;
