import {
  Button,
  capitalize,
  Grid,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { blue } from "@mui/material/colors";
import axios from "axios";
import { Link } from "react-router-dom";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

export default function ExternalExamScheduleList() {
  const backendUrl = config.VITE_BACKEND_URL;
  const [moduleData, setModuleData] = useState([]);

  const fetchData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(`${backendUrl}/ExamSchedule`, config);
      setModuleData(
        response.data?.data?.filter(
          (data) => data && data.examType === "external"
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        padding={2}
      >
        <Grid item xs>
          <Typography variant="h6" color={blue[700]} textAlign="center">
            Manage the student appeared in Exam.
          </Typography>
        </Grid>
        {/* <Grid item>
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{
              bgcolor: "#1976d2",
              color: "white",
              "&:hover": {
                bgcolor: "#1565c0",
              },
              padding: "6px 12px",
              borderRadius: 2,
            }}
            startIcon={<AddIcon />}
            component={Link}
            to={"/exam-management/exam-schedule"}
          >
            Schedule Exam
          </Button>
        </Grid> */}
      </Grid>

      <Grid justifyContent={"center"}>
        <Grid item xs={12} md={8}>
          <TableContainer sx={{ borderRadius: 2 }}>
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
                    Exam Type
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Exam Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Exam Start Date (BS)
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    Exam End Date (BS)
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
              <TableBody sx={{ bgcolor: "white" }}>
                {moduleData.length > 0 &&
                  moduleData
                    .sort((a, b) => a.programName.localeCompare(b.programName))
                    .map((data, index) => {
                      const today = new Date();
                      const startDate = new Date(data.dateFrom);
                      const endDate = new Date(data.dateTo);

                      let status;
                      if (today < startDate) {
                        status = "Active";
                      } else if (today >= startDate && today <= endDate) {
                        status = "Running";
                      } else {
                        status = "Finished";
                      }

                      const oneWeekBeforeEndDate = new Date(endDate);
                      oneWeekBeforeEndDate.setDate(endDate.getDate() - 7);

                      const isNew =
                        today >= oneWeekBeforeEndDate && today <= endDate;

                      return (
                        <TableRow key={data.id}>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {index + 1}
                            {isNew && (
                              <NewReleasesIcon
                                sx={{
                                  fontSize: 16,
                                  color: "red",
                                  marginLeft: 1,
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {data?.programName}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {capitalize(data?.type || "")}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {data.examName}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {data?.dateFromNepali}
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {data?.dateToNepali}
                          </TableCell>

                          <TableCell
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <span
                              style={{
                                color:
                                  status === "Active"
                                    ? "green"
                                    : status === "Running"
                                      ? "orange"
                                      : "gray",
                              }}
                            >
                              {status}
                            </span>
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #ddd",
                              padding: "4px",
                              display: "flex",
                              gap: "2px",
                            }}
                          >
                            {/* <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            sx={{
                              bgcolor: "#1976d2",
                              color: "white",
                              "&:hover": {
                                bgcolor: "#1565c0",
                              },
                              borderRadius: 2,
                              fontSize: "10px",
                            }}
                            component={Link}
                            to={`/exam-management/exam-routine?examschedule=${data.id}`}
                          >
                            Add Routine
                          </Button> */}
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{
                                borderRadius: 2,
                                fontSize: "10px",
                              }}
                              component={Link}
                              to={`/pass-rate-management/student-appear?examschedule=${data.id}`}
                            >
                              Update Exam Appeared
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              sx={{
                                bgcolor: "#1976d2",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "#1565c0",
                                },
                                borderRadius: 2,
                                fontSize: "10px",
                              }}
                              component={Link}
                              to={`/pass-rate-management/student-result-entry?examschedule=${data.id}`}
                            >
                              Update Exam Passed
                            </Button>
                            {/* <Button
                            size="small"
                            color="primary"
                            sx={{
                              borderRadius: 2,
                              fontSize: "10px",
                            }}
                            onClick={() => handleEditClick(data.id)}
                            variant="outlined"
                            startIcon={<EditNoteIcon />}
                          >
                            Edit
                          </Button> */}
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Typography color="grey" fontSize={13} padding={2}>
        Note: Kindly navigate to the Exam Management Module to create or update
        the exam schedule if the desired exam is not listed.
      </Typography>
      {/* <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth="lg"
      >
        {selectedId && (
          <EditExamSchedule
            selectedId={selectedId}
            onClose={handleClose}
            onUpdate={handleUpdate}
          />
        )}
      </Dialog> */}
    </>
  );
}
