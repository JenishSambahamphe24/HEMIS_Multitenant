import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { getResearchPubDetail } from "../../CampusServices";

const ResearchPublications = ({ index, sNo }) => {
  const [data, setData] = useState([])
  const fetchData = async () => {
    const response = await getResearchPubDetail()
    if (response) {
      setData(response.filter(item => item.activityType === 'Publication'))
    } else {
      setData([])
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Box >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "black"}}
      >
        {`${index}.${sNo}`} Researcher Publications
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small" sx={{ border: "1px solid black" }}>
          {/* Header */}
          <TableHead style={{ backgroundColor: "#2A629A", color: 'white' }}>
            <TableRow>
              <TableCell
                colSpan={8}
                align="center"
                sx={{ border: "1px solid black", fontWeight: "bold", color: 'white' }}
              >
                Publications
              </TableCell>
            </TableRow>
            <TableRow>
              {[
                "SNo",
                "Name",
                "Post",
                "Faculty",
                "Publication Title",
                "Publication Date",
                "Name of journals",
                "Remark*",
              ].map((header, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "#f0f0f0" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>

            {
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {
                      index + 1
                    }
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.employeeName}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.postName}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.teachingFacultyName}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.activityTitle}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.publishedDate}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >

                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    {item.remarks}
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Note */}
      <Box sx={{ marginTop: "5px", padding: "10px" }}>
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", color: "black" }}
        >
          *: Please mention whether the publication is Research Report or published refereed Journals/professional Journals/other Journal.
        </Typography>
      </Box>
    </Box>
  );
};

export default ResearchPublications;