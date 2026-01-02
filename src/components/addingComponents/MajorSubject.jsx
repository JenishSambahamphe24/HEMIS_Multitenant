import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Grid,
  Typography,
  TextField,
  CardContent,
  Paper,
  Button,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import axios from "axios";
import toast from "react-hot-toast";
import EditMajorSubject from "./EditMajorSubject";
import { useSelector } from "react-redux";
import { getCollegePrograms } from "../../services/services";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const MajorSubject = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      programId: "",
      majorSubjectName: "",
      remarks: "",
    },
  });

  const [getMajorData, setGetMajorData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedMajorId, setSelectedMajorId] = useState(null);
  const [programs, setPrograms] = useState([]);

  const { currentUser } = useSelector((state) => state.user);
  const campusId = currentUser?.institution?.id;

  const fetchData = async () => {
    try {
      const config = getAuthConfigSafe();
      const response = await axios.get(`${backendUrl}/MajorSubject`, config);
      setGetMajorData(response.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch major subjects");
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await getCollegePrograms();
      setPrograms(response);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch programs");
    }
  };

  useEffect(() => {
    fetchData();
    fetchPrograms();
  }, []);

  const onSubmit = async (data) => {
    try {
      const config = getAuthConfigSafe();
      const formData = {
        campusId: campusId || 0,
        programMgmtId: parseInt(data.programId),
        majorSubjectName: (data.majorSubjectName || "").trim(),
        remarks: data.remarks || "",
        status: true,
      };
      await axios.post(`${backendUrl}/MajorSubject`, formData, config);
      toast.success("Major subject added successfully!");

      reset({
        programId: "",
        majorSubjectName: "",
        remarks: "",
      });

      fetchData();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("Major Subject already exists!");
      } else {
        toast.error("Failed to add data!");
      }
    }
  };

  const handleEditClick = (majorId) => {
    setSelectedMajorId(majorId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchData();
  };

  const tableHeaders = [
    { label: "S.No." },
    { label: "Program Name", width: "30%" },
    { label: "Group/program  ID" },
    { label: "Group/Program " },
    { label: "Details" },
    { label: "Status" },
    { label: "Action" },
  ];

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={5} sx={{ borderRadius: "20px" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", color: "#2A629A" }}
              >
                Group/Program Major Management
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="programId"
                      control={control}
                      rules={{ required: "Program is required" }}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          size="small"
                          error={!!errors.programId}
                        >
                          <InputLabel id="program-label">Program</InputLabel>
                          <Select
                            {...field}
                            labelId="program-label"
                            label="Program"
                          >
                            {programs.map((program) => (
                              <MenuItem key={program.id} value={program.id}>
                                {program.programName}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.programId && (
                            <Typography variant="caption" color="error">
                              {errors.programId.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      {...register("majorSubjectName", {
                        required: "Major Subject Name is required",
                      })}
                      size="small"
                      label="Group/program major"
                      fullWidth
                      error={!!errors.majorSubjectName}
                      helperText={errors.majorSubjectName?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      {...register("remarks")}
                      size="small"
                      label="Remarks"
                      fullWidth
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
                    style={{ backgroundColor: "#007aff", color: "#inherit" }}
                  >
                    Submit
                  </Button>
                </Grid>
              </form>
            </CardContent>
          </Paper>
        </Grid>

        {/* Table Section */}
        <Grid item sm={10} margin="10px">
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", color: "#2A629A" }}
          >
            List of Group/Program Major
          </Typography>
          <TableContainer>
            <Table
              style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
            >
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableCell
                      key={index}
                      className="px-2 py-0"
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        width: header.width || "auto",
                      }}
                    >
                      <h1 className="text-[12px]">{header.label}</h1>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: "white" }}>
                {getMajorData.length > 0 &&
                  getMajorData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "5px" }}
                      >
                        {data.programName}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.id}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.majorSubjectName || "-"}
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
                        style={{
                          border: "1px solid #ddd",
                          display: "flex",
                          justifyContent: "center",
                          padding: "8px",
                        }}
                      >
                        <Button
                          onClick={() => handleEditClick(data.id)}
                          className="inline-block rounded  hover:bg-blue-400 hover:bg-opacity-10 px-6 py-[2px] text-[#2b6eb5] text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Edit Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="lg"
        >
          <EditMajorSubject
            id={selectedMajorId}
            onClose={() => setOpenEditDialog(false)}
            onUpdate={handleUpdate}
            programs={programs}
            campusId={campusId}
          />
        </Dialog>
      </Grid>
    </>
  );
};

export default MajorSubject;

