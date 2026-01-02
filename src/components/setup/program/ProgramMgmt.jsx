import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Button,
  Select,
  MenuItem,
  InputLabel,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  FormControl,
  Dialog,
  TablePagination,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { postProgram } from "../../../services/services";
import EditProgramMgmt from "./EditProgramMgmt";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const ProgramMgmt = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [getProgramData, setGetProgramData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [getLevelData, setGetLevelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const { currentUser } = useSelector((state) => state.user);
  const universityId =
    currentUser.type === "Uni" ? currentUser.institution.id : 0;
  const campusId =
    currentUser.type === "college" ? currentUser.institution.id : 0;
  const fetchProgramData = async () => {
    try {
      const config = getAuthConfigSafe()
      const programData = await axios.get(
        `${backendUrl}/ProgramMgmt/GetAllPrograms/${universityId}`,
        config
      );
      setGetProgramData(programData.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchData = async () => {
    try {
      const config = getAuthConfigSafe()
      const facultyData = await axios.get(
        `${backendUrl}/Faculty/GetAllFaculties/${universityId}`,
        config
      );

      const levelData = await axios.get(
        `${backendUrl}/Level/GetAllLebel/${universityId}`,
        config
      );
      setFacultyData(facultyData.data);
      setGetLevelData(levelData.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProgramData();
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = {
        universityId: universityId || 0,
        campusId: campusId || 0,
        duration: data.duration,
        programType: data.programType,
        levelId: data.levelId,
        facultyId: data.facultyId,
        programName: data.programName.trim(),
        shortName: data.shortName.trim(),
        code: data.code,
        alias: data.alias || "",
        remarks: data.remarks || "",
        status: data.status,
      };
      await postProgram(formData);
      fetchProgramData();
      fetchProgramData();
      toast.success("Data Added successfully");
      reset();
      fetchProgramData();
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          toast.error("Program already exists!");
        } else {
          toast.error(
            `Failed to add data: ${err.response.data.message || "Unknown error"
            }`,

          );
        }
      } else {
        toast.error("Network error or unexpected error occurred");
      }
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = (programId) => {
    setSelectedProgramId(programId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchProgramData();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPrograms = getProgramData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      <Grid item xs={false} md={2} />
      <Grid item xs={12} md={12}>
        <Paper elevation={5} sx={{ borderRadius: "20px" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", color: "#2A629A" }}
            >
              Program Management
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="facultyId" required>
                      Faculty Name
                    </InputLabel>
                    <Select
                      required
                      {...register("facultyId", { required: true })}
                      id="facultyId"
                      size="small"
                      name="facultyId"
                      label="Faculty Name"
                      fullWidth
                      autoComplete="given-name"
                      error={!!errors.facultyId}
                      helperText={errors.facultyId ? "Faculty is required" : ""}
                    >
                      {facultyData.length > 0 ? (
                        facultyData.map((data) => (
                          <MenuItem value={data.id} key={data.id}>
                            {data.facultyName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Faculty Data</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="levelId" required>
                      Level Name
                    </InputLabel>
                    <Select
                      required
                      {...register("levelId", { required: true })}
                      id="levelId"
                      size="small"
                      name="levelId"
                      label="Level Name"
                      fullWidth
                      error={!!errors.levelId}
                      helperText={errors.levelId ? "Level is required" : ""}
                    >
                      {getLevelData.length > 0 ? (
                        getLevelData.map((data) => (
                          <MenuItem value={data.id} key={data.id}>
                            {data.levelName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Level Data</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="programType" required>
                      Program Type
                    </InputLabel>
                    <Select
                      required
                      {...register("programType", { required: true })}
                      id="programType"
                      size="small"
                      name="programType"
                      label="Program Type"
                      fullWidth
                      error={!!errors.programType}
                      helperText={
                        errors.programType ? "Program Type is required" : ""
                      }
                    >
                      <MenuItem value="semester">Semester</MenuItem>
                      <MenuItem value="annual">Annual</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    required
                    id="duration"
                    {...register("duration", { required: true })}
                    name="duration"
                    size="small"
                    type="number"
                    label="Duration"
                    fullWidth
                    error={!!errors.duration}
                    helperText={errors.duration ? "Duration is required" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    {...register("programName", { required: true })}
                    id="programName"
                    size="small"
                    name="programName"
                    label="Program Name"
                    fullWidth
                    error={!!errors.programName}
                    helperText={
                      errors.programName ? "Program Name is required" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    required
                    id="shortName"
                    {...register("shortName", { required: true })}
                    name="shortName"
                    size="small"
                    label="Short Name"
                    fullWidth
                    error={!!errors.shortName}
                    helperText={
                      errors.shortName ? "Short Name is required" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    {...register("code")}
                    id="code"
                    size="small"
                    name="code"
                    label="Code"
                    fullWidth
                    error={!!errors.code}
                    helperText={errors.code ? "Code is required" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    {...register("alias")}
                    id="alias"
                    name="alias"
                    size="small"
                    label="Alias"
                    fullWidth
                    error={!!errors.alias}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("remarks")}
                    id="remarks"
                    name="remarks"
                    size="small"
                    label="Remarks"
                    fullWidth
                    error={!!errors.remarks}
                    helperText={errors.remarks}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  margin: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: "#1976d2",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#1565c0",
                    },
                    padding: "6px 12px",
                    borderRadius: 2,
                  }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Grid>
            </form>
          </CardContent>
        </Paper>

        <Grid margin="10px">
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", color: "#2A629A" }}
          >
            Program List
          </Typography>
          <TableContainer>
            <Table
              style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
            >
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    S.No
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Program Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Faculty Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Level Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Program Type
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Duration
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Code
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Alias
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Details
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: 'white' }}>
                {paginatedPrograms.length > 0 ? (
                  paginatedPrograms.map((data, index) => (
                    <TableRow key={data.id}>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.programName}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.facultyName || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.levelName || "N/A"}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.programType}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.duration}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.code}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.alias || "-"}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.remarks || "-"}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.status ? (
                          <span style={{ color: "green" }}>Active</span>
                        ) : (
                          <span style={{ color: "red" }}>Inactive</span>
                        )}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                          }}
                          onClick={() => handleEditClick(data.id)}
                        >
                          <EditNoteIcon /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} style={{ textAlign: "center" }}>
                      No Programs Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15, 25]}
            component="div"
            count={getProgramData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
      >
        <EditProgramMgmt
          id={selectedProgramId}
          onClose={() => setOpenEditDialog(false)}
          onUpdate={handleUpdate}
        />
      </Dialog>

    </Grid>
  );
};

export default ProgramMgmt;
