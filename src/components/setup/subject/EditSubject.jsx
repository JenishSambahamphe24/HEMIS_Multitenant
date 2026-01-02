import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { blue } from "@mui/material/colors";
import { getSubjectBySubjectId } from "../../dashboard/services/service";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import { config } from "@config";
import { use } from "react";

const EditSubjectDialog = ({
  open,
  onClose,
  subjectId,
  programData,
  onUpdate,
  year,
  semester,
}) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [subjectData, setSubjectData] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedSubjectType, setSelectedSubjectType] = useState("");
  const [fetchedGroups, setFetchedGroups] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const fetchRegSubjectData = async () => {
    try {
      const response = await getSubjectBySubjectId(subjectId);
      const fetchedGroups = response?.majorSubjectIds;
      setFetchedGroups(fetchedGroups);
      setSubjectData(response);
    } catch (error) {
      console.error("Error fetching subject data:", error);
    }
  };

  useEffect(() => {
    if (open) fetchRegSubjectData();
  }, [subjectId, open]);

  useEffect(() => {
    if (fetchedGroups && Array.isArray(fetchedGroups)) {
      setSelectedGroups(fetchedGroups.map((id) => id.toString()));
    }
  }, [fetchedGroups]);

  useEffect(() => {
    if (subjectData) {
      reset({
        programId: subjectData.programId,
        subjectName: subjectData.subjectName,
        subjectType: subjectData.subjectType,
        shortName: subjectData.shortName,
        semester: subjectData.semester,
        year: subjectData.year,
        code: subjectData.code,
        alias: subjectData.alias || "",
        detail: subjectData.remarks || "",
      });
      setSelectedSemester(subjectData.semester);
      setSelectedYear(subjectData.year);
      setSelectedSubjectType(subjectData.subjectType);
    }
  }, [subjectData, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("id", subjectId);
      formData.append("programId", data.programId);
      formData.append("subjectName", data.subjectName);
      formData.append("subjectType", data.subjectType);
      formData.append("shortName", data.shortName);
      formData.append("semester", selectedSemester || "");
      formData.append("year", selectedYear || "");
      formData.append("code", data.code);
      formData.append("alias", data.alias || "");
      formData.append("remarks", data.detail || "");

      selectedGroups?.forEach((id) =>
        formData.append("majorSubjectIds", parseInt(id))
      );

      const auth = getAuthConfigSafe();
      auth.headers["Content-Type"] = "multipart/form-data";

      const response = await axios.patch(
        `${backendUrl}/Subject/${subjectId}`,
        formData,
        auth
      );

      if (response.status === 200) {
        toast.success("Subject updated successfully");
        onUpdate();
        onClose();
      } else {
        toast.error("Failed to update subject");
      }
    } catch (err) {
      console.log("Error updating subject:", err);
      toast.error("Subject update failed");
    }
  };

  const programType = subjectData?.program?.programType;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent>
        <Typography
          variant="h6"
          color={blue[700]}
          textAlign={"center"}
          padding={2}
        >
          Edit Subject
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="programId" required>
                  Program Name
                </InputLabel>
                <Select
                  {...register("programId", { required: true })}
                  id="programId"
                  size="small"
                  name="programId"
                  fullWidth
                  disabled
                  label="Program Name"
                  value={subjectData?.programId || ""}
                >
                  {programData.length > 0 &&
                    programData.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.programName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                {...register("subjectName", { required: true })}
                id="subjectName"
                size="small"
                name="subjectName"
                label="Subject Name"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel required={programType === "annual"}>Year</InputLabel>
                <Select
                  {...register("year")}
                  id="year"
                  size="small"
                  disabled={programType !== "annual"}
                  fullWidth
                  value={selectedYear || ""}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                >
                  <MenuItem disabled value="">
                    Select Year
                  </MenuItem>
                  {year &&
                    year.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel required={programType === "semester"}>
                  Semester
                </InputLabel>
                <Select
                  {...register("semester")}
                  id="semester"
                  size="small"
                  disabled={programType !== "semester"}
                  fullWidth
                  value={selectedSemester || ""}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  label="Semester"
                >
                  <MenuItem disabled value="">
                    Select Semester
                  </MenuItem>
                  {semester &&
                    semester.map((sem) => (
                      <MenuItem key={sem} value={sem}>
                        {sem}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                required
                {...register("shortName", { required: true })}
                id="shortName"
                size="small"
                label="Short Name"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                required
                {...register("code", { required: true })}
                id="code"
                size="small"
                label="Code"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="subjectType" required>
                  Subject Type
                </InputLabel>
                <Select
                  {...register("subjectType", { required: true })}
                  id="subjectType"
                  size="small"
                  fullWidth
                  value={selectedSubjectType}
                  onChange={(e) => setSelectedSubjectType(e.target.value)}
                  label="Subject Type"
                >
                  <MenuItem value="Compulsory">Compulsory</MenuItem>
                  <MenuItem value="Elective">Elective</MenuItem>
                </Select>
              </FormControl>

            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                {...register("alias")}
                id="alias"
                size="small"
                label="Alias"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                {...register("detail")}
                id="detail"
                size="small"
                label="Details"
                fullWidth
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button onClick={onClose} color="error">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubjectDialog;
