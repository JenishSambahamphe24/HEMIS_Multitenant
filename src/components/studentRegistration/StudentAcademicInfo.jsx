import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
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
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FileUploader from "../Reusable-component/FileUploader";
import { getAuthConfigSafe } from "../../utils/dateUtils";
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

const StudentAcademicInfo = ({ studentId }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [academicData, setAcademicData] = useState([]);
  const [transcriptFiles, setTranscriptFiles] = useState([]);
  const [provisionFiles, setProvisionFiles] = useState([]);
  const [migrationFiles, setMigrationFiles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentFileUploads, setCurrentFileUploads] = useState({
    transcript: null,
    provision: null,
    migration: null,
  });
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm();


  const resetFileUploaders = () => {
    // Reset the current file uploads
    setCurrentFileUploads({
      transcript: null,
      provision: null,
      migration: null,
    });

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = "";
    });
  };

  const onSubmit = (formData) => {
    if (editIndex !== null) {
      const updatedAcademicData = [...academicData];
      updatedAcademicData[editIndex] = formData;
      setAcademicData(updatedAcademicData);

      if (currentFileUploads.transcript) {
        const updatedTranscriptFiles = [...transcriptFiles];
        updatedTranscriptFiles[editIndex] = currentFileUploads.transcript;
        setTranscriptFiles(updatedTranscriptFiles);
      }

      if (currentFileUploads.provision) {
        const updatedProvisionFiles = [...provisionFiles];
        updatedProvisionFiles[editIndex] = currentFileUploads.provision;
        setProvisionFiles(updatedProvisionFiles);
      }

      if (currentFileUploads.migration) {
        const updatedMigrationFiles = [...migrationFiles];
        updatedMigrationFiles[editIndex] = currentFileUploads.migration;
        setMigrationFiles(updatedMigrationFiles);
      }

      setEditIndex(null);
    } else {
      setAcademicData([...academicData, formData]);

      setTranscriptFiles([...transcriptFiles, currentFileUploads.transcript]);
      setProvisionFiles([...provisionFiles, currentFileUploads.provision]);
      setMigrationFiles([...migrationFiles, currentFileUploads.migration]);
    }

    reset();
    resetFileUploaders();
    setDialogOpen(true);
  };

  const handleFileChange = (type, file) => {
    setCurrentFileUploads((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const handleDialogClose = (addMore) => {
    setDialogOpen(false);
    if (addMore) {
      setFocus("educationLevel");
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    const dataToEdit = academicData[index];
    reset(dataToEdit);

    setCurrentFileUploads({
      transcript: null,
      provision: null,
      migration: null,
    });
  };

  const handleFinalSubmit = async () => {
    if (academicData.length === 0) {
      toast.error("Please add at least one academic record", {
        autoClose: 1500,
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();

    academicData.forEach((data, index) => {
      formData.append(`dtos[${index}].studentId`, studentId);
      formData.append(
        `dtos[${index}].educationLevel`,
        data.educationLevel || ""
      );
      formData.append(
        `dtos[${index}].instituationName`,
        data.institutionName || ""
      );
      formData.append(`dtos[${index}].passedYear`, data.passedYear || "");
      formData.append(`dtos[${index}].fullMark`, data.fullMark || "");
      formData.append(`dtos[${index}].obtainedMark`, data.obtainedMark || "");
      formData.append(`dtos[${index}].gpa`, data.gpa || "");
      formData.append(`dtos[${index}].grade`, data.grade || "");
      formData.append(`dtos[${index}].regdNo`, data.regdNo || "");
      formData.append(
        `dtos[${index}].boardOfUniversity`,
        data.boardOfUniversity || ""
      );

      // Only append files if they exist
      if (transcriptFiles[index]) {
        formData.append(`transcriptFiles[${index}]`, transcriptFiles[index]);
      }
      if (provisionFiles[index]) {
        formData.append(`provFiles[${index}]`, provisionFiles[index]);
      }
      if (migrationFiles[index]) {
        formData.append(`migrationFiles[${index}]`, migrationFiles[index]);
      }
    });

    try {
      const config = getAuthConfigSafe()
      const response = await axios.post(
        `${backendUrl}/StuEdu`,
        formData,
        config
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Student academic information successfully saved.", {
          autoClose: 1500,
        });
        navigate("/student-management/verified-students");
        setAcademicData([]);
        setTranscriptFiles([]);
        setProvisionFiles([]);
        setMigrationFiles([]);
        resetFileUploaders();
        reset();
      } else {
        toast.error("Failed to save academic information. Please try again.", {
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error(
        error.response?.data?.message ||
        "An error occurred while saving information",
        { autoClose: 1500 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (index) => {
    // Remove item at index
    setAcademicData(academicData.filter((_, i) => i !== index));
    setTranscriptFiles(transcriptFiles.filter((_, i) => i !== index));
    setProvisionFiles(provisionFiles.filter((_, i) => i !== index));
    setMigrationFiles(migrationFiles.filter((_, i) => i !== index));

    // If editing the item being deleted, cancel edit mode
    if (editIndex === index) {
      setEditIndex(null);
      reset();
      resetFileUploaders();
    } else if (editIndex !== null && editIndex > index) {
      // Adjust editIndex if needed
      setEditIndex(editIndex - 1);
    }
  };

  return (
    <Grid component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container mt=".7rem" spacing={1}>
        <Grid item xs={12} sm={3}>
          <Controller
            name="educationLevel"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="educationLevel"
                size="small"
                name="educationLevel"
                label="Education Level"
                fullWidth
                error={!!errors.educationLevel}
                helperText={errors.educationLevel ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Controller
            name="institutionName"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="institutionName"
                size="small"
                name="institutionName"
                label="Institution Name"
                fullWidth
                error={!!errors.institutionName}
                helperText={errors.institutionName ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="passedYear"
            control={control}
            defaultValue=""
            rules={{
              required: "Required",
              pattern: {
                value: /^\d{4}$/,
                message: "Please enter a valid 4-digit year",
              },
            }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="passedYear"
                size="small"
                type="text"
                name="passedYear"
                label="Passed Year"
                fullWidth
                InputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  onInput: (e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4);
                  },
                }}
                error={!!errors.passedYear}
                helperText={
                  errors.passedYear
                    ? errors.passedYear.message || "Required"
                    : ""
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="fullMark"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="fullMark"
                size="small"
                name="fullMark"
                label="Full GPA/Full Mark"
                fullWidth
                InputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="obtainedMark"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="obtainedMark"
                size="small"
                type="text"
                name="obtainedMark"
                label="Obtained Mark"
                fullWidth
                InputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="gpa"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="gpa"
                size="small"
                name="gpa"
                label="Obtained GPA/Percentage"
                fullWidth
                error={!!errors.gpa}
                helperText={errors.gpa ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="grade"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="grade"
                size="small"
                name="grade"
                label="Obtained Grade/Division"
                fullWidth
                error={!!errors.grade}
                helperText={errors.grade ? "Required" : ""}
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
        <Grid item xs={12} sm={3}>
          <Controller
            name="boardOfUniversity"
            control={control}
            defaultValue=""
            rules={{ required: "Required" }}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                label="Board of University"
                id="boardOfUniversity"
                size="small"
                name="boardOfUniversity"
                fullWidth
                error={!!errors.boardOfUniversity}
                helperText={errors.boardOfUniversity ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormControl>
            <FileUploader
              onFileChange={(file) => handleFileChange("transcript", file)}
              name="transcript"
              placeHolder="Transcript file (pdf)"
              accept=".pdf"
              key={`transcript-${editIndex !== null ? editIndex : "new"}`}
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormControl>
            <FileUploader
              onFileChange={(file) => handleFileChange("provision", file)}
              name="provision"
              placeHolder="Provision certificate image"
              accept="image/*"
              key={`provision-${editIndex !== null ? editIndex : "new"}`}
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormControl>
            <FileUploader
              onFileChange={(file) => handleFileChange("migration", file)}
              name="migration"
              placeHolder="Migration certificate image"
              accept="image/*"
              key={`migration-${editIndex !== null ? editIndex : "new"}`}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleSubmit(onSubmit)()}
            sx={{
              marginBottom: "10px",
            }}
          >
            {editIndex !== null ? "Update" : "Add"}
          </Button>
          {editIndex !== null && (
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => {
                setEditIndex(null);
                reset();
                resetFileUploaders();
              }}
              sx={{
                marginBottom: "10px",
                marginLeft: "10px",
              }}
            >
              Cancel
            </Button>
          )}
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
                <TableCell style={tableCellStyle}>
                  Registration Number
                </TableCell>
                <TableCell style={tableCellStyle}>
                  Board of University
                </TableCell>
                <TableCell style={tableCellStyle}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ backgroundColor: "whitesmoke" }}>
              {academicData.length > 0 ? (
                academicData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell style={tableBodyCellStyle}>
                      {index + 1}
                    </TableCell>
                    <TableCell style={tableBodyCellStyle}>
                      {data.educationLevel}
                    </TableCell>
                    <TableCell style={tableBodyCellStyle}>
                      {data.institutionName}
                    </TableCell>
                    <TableCell style={tableBodyCellStyle}>
                      {data.passedYear}
                    </TableCell>
                    <TableCell style={tableBodyCellStyle}>
                      {data.fullMark}
                    </TableCell>
                    <TableCell style={tableBodyCellStyle}>
                      {data.obtainedMark}
                    </TableCell>
                    <TableCell style={tableBodyCellStyle}>{data.gpa}</TableCell>
                    <TableCell style={tableBodyCellStyle}>
                      {data.grade}
                    </TableCell>
                    <TableCell style={tableBodyCellStyle}>
                      {data.regdNo}
                    </TableCell>
                    <TableCell style={tableBodyCellStyle}>
                      {data.boardOfUniversity}
                    </TableCell>
                    <TableCell style={tableBodyCellStyle}>
                      <Button
                        onClick={() => handleEditClick(index)}
                        color="primary"
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(index)}
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} style={{ textAlign: "center" }}>
                    No academic records added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid container direction="row" alignItems="flex-start">
        <Grid item xs={12}>
          {academicData.length > 0 && (
            <Button
              type="button"
              variant="contained"
              size="small"
              sx={{
                bgcolor: "#2A629A",
                marginBottom: "10px",
                marginLeft: "10px",
                mt: "15px",
                position: "relative",
                pointerEvents: loading ? "none" : "auto",
                opacity: loading ? 0.6 : 1,
              }}
              onClick={handleFinalSubmit}
              endIcon={
                loading ? <CircularProgress size={24} color="inherit" /> : null
              }
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          )}
        </Grid>
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

export default StudentAcademicInfo;
