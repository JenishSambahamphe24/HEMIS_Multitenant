import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const ValidationTextField = styled(TextField)({
  "& input:valid + fieldset": {
    borderColor: "#c2c2c2",
    borderWidth: 1,
  },
  "& input:valid:focus + fieldset": {
    borderLeftWidth: 4,
    padding: "4px !important",
  },
});

const EditStudentAcademicInfo = ({ studentId }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [academicData, setAcademicData] = useState([]);
  const [transcriptFiles, setTranscriptFiles] = useState([]);
  const [provisionFiles, setProvisionFiles] = useState([]);
  const [migrationFiles, setMigrationFiles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/StuEdu/GetAllStudentEducations`);
        setAcademicData(response.data.filter(data => data && Number(data.studentId) === studentId));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [studentId]);

  const onSubmit = (formData) => {
    if (editIndex !== null) {
      const updatedAcademicData = academicData.map((data, index) =>
        index === editIndex ? formData : data
      );
      setAcademicData(updatedAcademicData);
      clearFileInputs();
      setEditIndex(null);
    } else {
      setAcademicData([...academicData, formData]);
      setTranscriptFiles([...transcriptFiles, null]);
      setProvisionFiles([...provisionFiles, null]);
      setMigrationFiles([...migrationFiles, null]);
    }
    reset();
    toast.success('Data updated successfully.', { autoClose: 1500 });
    setDialogOpen(true);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    const dataToEdit = academicData[index];
    reset(dataToEdit);
  };

  const clearFileInputs = () => {
    setTranscriptFiles((files) => {
      const updatedFiles = [...files];
      updatedFiles[editIndex] = null;
      return updatedFiles;
    });
    setProvisionFiles((files) => {
      const updatedFiles = [...files];
      updatedFiles[editIndex] = null;
      return updatedFiles;
    });
    setMigrationFiles((files) => {
      const updatedFiles = [...files];
      updatedFiles[editIndex] = null;
      return updatedFiles;
    });
  };

  const handleFinalSubmit = async () => {
    const formData = new FormData();
    academicData.forEach((data) => {
      formData.append(`studentId`, studentId);
      formData.append(`educationlevel`, data.educationlevel);
      formData.append(`instituationName`, data.instituationName);
      formData.append(`passedYear`, data.passedYear);
      formData.append(`fullMark`, data.fullMark);
      formData.append(`obtainedMark`, data.obtainedMark);
      formData.append(`gpa`, data.gpa);
      formData.append(`division`, data.division);
      formData.append(`regdNo`, data.regdNo);
      formData.append(`boardOfUniversity`, data.boardOfUniversity);
    });

    try {
      const config = getAuthConfigSafe()
      await axios.patch(`${backendUrl}/StuEdu/${studentId}`, formData, config);
      toast.success('Student successfully updated.', { autoClose: 1500 });
      setAcademicData([]);
      setTranscriptFiles([]);
      setProvisionFiles([]);
      setMigrationFiles([]);
      reset();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleDialogClose = (addMore) => {
    setDialogOpen(false);
  };

  return (
    <Grid component="form" onSubmit={handleSubmit(onSubmit)} >
      <Grid item xs={12}>
        <Typography textAlign="center" variant="subtitle1" sx={{ color: "#636363", mt: ".5rem" }}>
          Previous Academic Info
        </Typography>
      </Grid>
      <Grid container spacing={1} sx={{ m: '10px' }}>
        <Grid item xs={12} sm={3}>
          <Controller
            name="educationlevel"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="educationlevel"
                size="small"
                name="educationlevel"
                label="Education Level"
                fullWidth
                error={!!errors.educationlevel}
                helperText={errors.educationlevel ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Controller
            name="instituationName"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="instituationName"
                size="small"
                name="instituationName"
                label="Institution Name"
                fullWidth
                error={!!errors.instituationName}
                helperText={errors.instituationName ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="passedYear"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="passedYear"
                size="small"
                type="number"
                name="passedYear"
                label="Passed Year"
                fullWidth
                error={!!errors.passedYear}
                helperText={errors.passedYear ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="fullMark"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="fullMark"
                size="small"
                name="fullMark"
                label="Full Mark"
                fullWidth
                InputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                }}
                error={!!errors.fullMark}
                helperText={errors.fullMark ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="obtainedMark"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="obtainedMark"
                size="small"
                type="number"
                name="obtainedMark"
                label="Obtained Mark"
                fullWidth
                error={!!errors.obtainedMark}
                helperText={errors.obtainedMark ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Controller
            name="gpa"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="gpa"
                size="small"
                name="gpa"
                label="GPA"
                fullWidth
                error={!!errors.gpa}
                helperText={errors.gpa ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="division"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="division"
                size="small"
                name="division"
                label="Grade/Division"
                fullWidth
                error={!!errors.division}
                helperText={errors.division ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="regdNo"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="regdNo"
                size="small"
                name="regdNo"
                label="Registration Number"
                fullWidth
                error={!!errors.regdNo}
                helperText={errors.regdNo ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="boardOfUniversity"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                label="Board of University"
                id="boardOfUniversity"
                size="small"
                name="boardOfUniversity"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <InputLabel size="small" shrink required>
              Transcript/Marksheet
            </InputLabel>
            <TextField
              required
              id="transcript"
              type="file"
              size="small"
              variant="standard"
              name="transcript"
              accept="image/*"
              onChange={(e) => {
                const index = academicData.length;
                const files = [...transcriptFiles];
                files[index] = e.target.files[0];
                setTranscriptFiles(files);
              }}
              style={{
                color: "#FFFFFF",
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <InputLabel size="small" shrink required>
              Provisional/character cert.
            </InputLabel>
            <TextField
              id="provision"
              type="file"
              size="small"
              variant="standard"
              name="provision"
              accept="image/*"
              onChange={(e) => {
                const index = academicData.length; // Index of the newly added entry
                const files = [...provisionFiles];
                files[index] = e.target.files[0];
                setProvisionFiles(files);
              }}
              style={{
                color: "#FFFFFF",
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <InputLabel size="small" shrink>
              Migration cert.
            </InputLabel>
            <TextField
              id="migration"
              type="file"
              size="small"
              variant="standard"
              name="migration"
              accept="image/*"
              onChange={(e) => {
                const index = academicData.length; // Index of the newly added entry
                const files = [...migrationFiles];
                files[index] = e.target.files[0];
                setMigrationFiles(files);
              }}
              style={{
                color: "#FFFFFF",
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            size="small"
            onClick={handleFinalSubmit}
            sx={{
              bgcolor: "#2A629A",
              marginBottom: "10px",
              marginLeft: "10px",
            }}
          >
            Update
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table>
            <TableHead style={{ backgroundColor: "#2A629A" }}>
              <TableRow>
                <TableCell style={tableCellStyle}>S.No.</TableCell>
                <TableCell style={tableCellStyle}>Education Level</TableCell>
                <TableCell style={tableCellStyle}>Institution Name</TableCell>
                <TableCell style={tableCellStyle}>Passed Year</TableCell>
                <TableCell style={tableCellStyle}>Full Mark</TableCell>
                <TableCell style={tableCellStyle}>Obtained Mark</TableCell>
                <TableCell style={tableCellStyle}>GPA</TableCell>
                <TableCell style={tableCellStyle}>Grade</TableCell>
                <TableCell style={tableCellStyle}>Registration Number</TableCell>
                <TableCell style={tableCellStyle}>Board of University</TableCell>
                <TableCell style={tableCellStyle}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ backgroundColor: "whitesmoke" }}>
              {academicData.length > 0 && academicData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell style={tableBodyCellStyle}>{index + 1}</TableCell>
                  <TableCell style={tableBodyCellStyle}>{data.educationlevel}</TableCell>
                  <TableCell style={tableBodyCellStyle}>{data.instituationName}</TableCell>
                  <TableCell style={tableBodyCellStyle}>{data.passedYear}</TableCell>
                  <TableCell style={tableBodyCellStyle}>{data.fullMark}</TableCell>
                  <TableCell style={tableBodyCellStyle}>{data.obtainedMark}</TableCell>
                  <TableCell style={tableBodyCellStyle}>{data.gpa}</TableCell>
                  <TableCell style={tableBodyCellStyle}>{data.division}</TableCell>
                  <TableCell style={tableBodyCellStyle}>{data.regdNo}</TableCell>
                  <TableCell style={tableBodyCellStyle}>{data.boardOfUniversity}</TableCell>
                  <TableCell style={tableBodyCellStyle}>
                    <Button onClick={() => handleEditClick(index)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Do you wish to add other information?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Yes
          </Button>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

const tableBodyCellStyle = {
  color: "black",
  border: "1px solid #c2c2c2",
  padding: "8px",
  height: "24px",
  textAlign: "center",
};

const tableCellStyle = {
  color: "whiteSmoke",
  border: "1px solid #c2c2c2",
  padding: "8px",
  height: "24px",
  textAlign: "center",
};

export default EditStudentAcademicInfo;