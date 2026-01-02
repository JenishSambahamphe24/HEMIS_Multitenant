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
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';


const StudentList = ({
  studentData,
  programId,
  semester,
  year,
  examscheduleId,
}) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [checkedStudents, setCheckedStudents] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate()

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
      const allStudents = studentData.reduce((acc, student) => {
        acc[student.id] = true;
        return acc;
      }, {});
      setCheckedStudents(allStudents);
    } else {
      setCheckedStudents({});
    }
  };

  const handleDialogOpen = () => {
    const selectedCount = Object.values(checkedStudents).filter(Boolean).length;
    if (selectedCount > 0) {
      setOpenDialog(true);
    } else {
      toast.error("Please select at least one student");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    handleDialogClose();
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
      };
      await axios.post(`${backendUrl}/BulkExamAttend`, payload, config);
      toast.success("Submission successful");
      setCheckedStudents({});
      setSelectAll(false);
      navigate('/pass-rate-management/exam-appeared')
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed");
    }
  };

  const selectedCount = Object.values(checkedStudents).filter(Boolean).length;

  return (
    <TableContainer>
      <Table>
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
              Appeared in exam (year/semester)
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody style={{ backgroundColor: 'white' }}>
          {studentData.length > 0 ? (
            [...studentData]
              .sort((a, b) => {
                const fullNameA = [a.firstName, a.middleName, a.lastName].filter(Boolean).join(" ");
                const fullNameB = [b.firstName, b.middleName, b.lastName].filter(Boolean).join(" ");
                return fullNameA.localeCompare(fullNameB);
              })
              .map((student, index) => (
                <TableRow key={student.id} hover>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    <Checkbox
                      checked={selectAll || checkedStudents[student.id] || false}
                      onChange={(e) => handleCheck(e, student.id)}
                    />
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {[student.firstName, student.middleName, student.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.phoneNumber}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.rollNoManual}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.batchNameNepali}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.programName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd", padding: "4px" }}>
                    {student.year
                      ? `${student.year} Year`
                      : `${student.semester} Semester`}
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" color="textSecondary">
                  Please Search The Students
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Grid container justifyContent={"center"} sx={{ margin: "5px", gap: 2 }}>

        <Button variant="contained" onClick={handleDialogOpen}>
          Submit Appear
        </Button>
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want Save <span style={{ color: blue[700], fontWeight: 700 }}>{selectedCount} student(s) </span>as appeared?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="outlined" size="small" onClick={handleDialogClose}>Cancel</Button>
          <Button size="small" onClick={handleSubmit} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default StudentList;
