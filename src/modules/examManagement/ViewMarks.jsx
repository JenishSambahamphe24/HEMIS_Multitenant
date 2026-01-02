import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

export default function ViewMarks() {
  const backendUrl = config.VITE_BACKEND_URL;
  const [moduleData, setModuleData] = useState([]);
  const { id } = useParams();
  const examId = id;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(`${backendUrl}/MarksEntry`, config);
        setModuleData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Grid justifyContent={"center"}>
        <Grid item xs={12} md={8}>
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
                    rowSpan={2}
                  >
                    S.No
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    rowSpan={2}
                  >
                    Student Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    rowSpan={2}
                  >
                    Symbol Number
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    rowSpan={2}
                  >
                    Exam Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    rowSpan={2}
                  >
                    Subject Name
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    align="center"
                    colSpan={3}
                  >
                    Theory Marks
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    align="center"
                    colSpan={3}
                  >
                    practical Marks
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    rowSpan={2}
                  >
                    Total Marks
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    rowSpan={2}
                  >
                    Remarks
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    align="center"
                  >
                    Full Marks
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    align="center"
                  >
                    Pass Marks
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    align="center"
                  >
                    Obtained Marks
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    align="center"
                  >
                    Full Marks
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    align="center"
                  >
                    Pass Marks{" "}
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                    align="center"
                  >
                    Obtained Marks
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: "white" }}>
                {moduleData.length > 0 &&
                  moduleData.map((data, index) => {
                    const obtainedMarks =
                      data?.subjectExamSchedule?.examType === "practical"
                        ? data.practicalMarks
                        : data.theoreticalMarks;
                    const passMarks =
                      data.subjectExamSchedule?.theoreticalPassMarks;

                    let status = obtainedMarks < passMarks ? "Fail" : "Pass";

                    return (
                      <TableRow key={data.id}>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.student?.firstName} {data.student?.middleName}{" "}
                          {data.student?.lastName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.rollNo}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.examSchedule?.examName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.subject?.subjectName}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.subjectExamSchedule?.theoreticalFullMarks}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.subjectExamSchedule?.theoreticalPassMarks}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {obtainedMarks}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.subjectExamSchedule?.practicalFullMark}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {data.subjectExamSchedule?.practicalPassMark}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {obtainedMarks}
                        </TableCell>
                        <TableCell
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {obtainedMarks}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            color: status === "Pass" ? "green" : "red",
                          }}
                        >
                          {status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}
