import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const PassFailStudentEntry = ({
  studentData,
  programId,
  semester,
  year,
  examscheduleId,
}) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [checkedStudents, setCheckedStudents] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [uniqueStudents, setUniqueStudents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const uniqueStudentMap = {};
    studentData.forEach((student) => {
      if (!uniqueStudentMap[student.id]) {
        uniqueStudentMap[student.id] = student;
      }
    });

    const filtered = Object.values(uniqueStudentMap);
    setUniqueStudents(filtered);

    setCheckedStudents({});
    setSelectAll(false);
  }, [studentData]);

  const handleCheck = (event, studentId) => {
    setCheckedStudents((prev) => ({
      ...prev,
      [studentId]: event.target.checked,
    }));
    setSelectAll(false);
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      const allStudents = uniqueStudents.reduce((acc, student) => {
        acc[student.id] = true;
        return acc;
      }, {});
      setCheckedStudents(allStudents);
    } else {
      setCheckedStudents({});
    }
  };

  const handleSubmit = async () => {
    const selectedStudentIds = Object.keys(checkedStudents).filter(
      (studentId) => checkedStudents[studentId]
    );

    if (selectedStudentIds.length > 0) {
      // Open the confirmation dialog
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one student");
    }
  };

  const confirmSubmit = async () => {
    // This function will be called when the user confirms the submission in the dialog
    const selectedStudentIds = Object.keys(checkedStudents).filter(
      (studentId) => checkedStudents[studentId]
    );

    try {
      const config = getAuthConfigSafe()
      const yearValue = year || null;
      const semesterValue = semester || null;
      const payload = {
        examScheduleId: examscheduleId,
        programManagementId: programId,
        semester: semesterValue || null,
        year: yearValue || null,
        studentId: selectedStudentIds.map(Number),
        isAppeared: true,
        isPass: true,
      };

      const response = await axios.post(
        `${backendUrl}/BulkExamAttend/CreatePassStudent`,
        payload,
        config
      );

      toast.success("Submission Successful");
      navigate('/pass-rate-management/exam-appeared')
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(
        "Failed to submit: " +
        (error.response?.data?.message || "Unknown error")
      );
    } finally {
      // Close the dialog whether the submission was successful or not
      setDialogOpen(false);
    }
  };

  const cancelSubmit = () => {
    // This function will be called when the user cancels the submission
    setDialogOpen(false); // Close the dialog
  };

  const selectedCount = Object.keys(checkedStudents).filter(
    (id) => checkedStudents[id]
  ).length;

  return (
    <TableContainer>
      <Table size="small">
        <TableHead sx={{ bgcolor: "primary.main" }}>
          <TableRow>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                  textAlign: "center",
                }}
              />
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              S.No
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Full Name
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Phone Number
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Roll No
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Batch
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Program
            </TableCell>
            <TableCell
              style={{
                color: "#FFFFFF",
                border: "1px solid #ddd",
                padding: "4px",
                textAlign: "center",
              }}
            >
              Passed in (Semester/Year)
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody style={{ backgroundColor: 'white' }}>
          {uniqueStudents.length > 0 ? (
            [...uniqueStudents]
              .sort((a, b) => {
                const fullNameA = [a.firstName, a.middleName, a.lastName]
                  .filter(Boolean)
                  .join(" ");
                const fullNameB = [b.firstName, b.middleName, b.lastName]
                  .filter(Boolean)
                  .join(" ");
                return fullNameA.localeCompare(fullNameB);
              })
              .map((student, index) => (
                <TableRow key={student.id} hover>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    <Checkbox
                      checked={
                        selectAll || checkedStudents[student.id] || false
                      }
                      onChange={(e) => handleCheck(e, student.id)}
                    />
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {[student.firstName, student.middleName, student.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.phoneNumber}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.rollNoManual}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.batchNameNepali}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.programName}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {student.year
                      ? `${student?.year} Year`
                      : `${student?.semester} Semester`}
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" color="textSecondary">
                  Please Search the Students
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Grid container justifyContent={"center"}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ margin: 2 }}
          disabled={
            Object.keys(checkedStudents).filter((id) => checkedStudents[id])
              .length === 0
          }
        >
          Submit Passed
        </Button>
      </Grid>
      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={cancelSubmit}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          {"Confirm Submission"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            Are you sure you want to submit the selected{" "}
            <span style={{ color: blue[700], fontWeight: 700 }}>
              {selectedCount} students{" "}
            </span>
            as passed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="small"
            onClick={cancelSubmit}
            color="error"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={confirmSubmit}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default PassFailStudentEntry;
