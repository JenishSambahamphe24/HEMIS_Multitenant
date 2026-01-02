import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Popover,
  Grid
} from "@mui/material";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FileDownload, InsertDriveFile, PictureAsPdf } from "@mui/icons-material";
import { getTeachersByFaculty } from "./CampusServices";

const TeachersByFacultyInCollege = ({ fiscalId }) => {
  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    const response = await getTeachersByFaculty(fiscalId);
    const reArrangedResponse = response.map(item => ({
      title: item.facultyName,
      male: item.maleTeacher,
      female: item.femaleTeacher,
      total: item.totalTeacher,
      others: item.otherTeacher,
      totalStudents: item.totalStudent,
      ratio: (item.totalTeacher && item.totalStudent)
        ? (Number(item.totalStudent) / Number(item.totalTeacher)).toFixed(2)
        : "0.00"
    }));
    if (response) {
      setRows(reArrangedResponse);
    } else {
      setRows([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fiscalId]);

  // Calculate totals for all columns
  const totals = rows.reduce((acc, item) => {
    acc.male += Number(item.male) || 0;
    acc.female += Number(item.female) || 0;
    acc.others += Number(item.others) || 0;
    acc.total += Number(item.total) || 0;
    acc.totalStudents += Number(item.totalStudents) || 0;
    return acc;
  }, {
    male: 0,
    female: 0,
    others: 0,
    total: 0,
    totalStudents: 0
  });

  // Calculate the overall student-teacher ratio
  const totalRatio = totals.total > 0 ? (totals.totalStudents / totals.total).toFixed(2) : "0.00";

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "export-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToExcel = () => {
    const excelData = [
      [
        "S.No.",
        "Teaching Faculty",
        "Male",
        "Female",
        "Others",
        "Total",
        "Total Students",
        "STR (Student / Teacher)"
      ],
      ...rows.map((row, index) => [
        index + 1,
        row.title,
        row.male,
        row.female,
        row.others,
        row.total,
        row.totalStudents,
        row.ratio
      ]),
      [
        "",
        "Grand Total", 
        totals.male, 
        totals.female, 
        totals.others, 
        totals.total,
        totals.totalStudents,
        totalRatio
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teaching Staff Data");
    XLSX.writeFile(wb, "Teaching_Staff_Data.xlsx");
    handleClose();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableHead = [
      [
        "S.No.", 
        "Teaching Faculty", 
        "Male", 
        "Female", 
        "Others", 
        "Total", 
        "Total Students", 
        "STR"
      ]
    ];
    
    const tableBody = rows.map((row, index) => [
      index + 1,
      row.title,
      row.male,
      row.female,
      row.others,
      row.total,
      row.totalStudents,
      row.ratio
    ]);

    tableBody.push([
      "", 
      "Grand Total", 
      totals.male, 
      totals.female, 
      totals.others, 
      totals.total,
      totals.totalStudents,
      totalRatio
    ]);
    
    doc.autoTable({
      head: tableHead,
      body: tableBody,
      styles: {
        lineColor: "#c2c2c2",
        lineWidth: 0.2,
        cellPadding: 1,
      },
      headStyles: {
        fontSize: 8,
        fillColor: [42, 98, 154],
        textColor: "#ffffff",
      },
      bodyStyles: {
        fontSize: 7
      },
      footStyles: {
        fontSize: 8,
        fontStyle: "bold",
        fillColor: [200, 200, 200],
      },
    });

    doc.save("Teaching_Staff_Data.pdf");
    handleClose();
  };

  return (
    <div>
      <Box sx={{ marginBottom: "0px", display: "flex", gap: 2 }}>
        <Grid container justifyContent="right">
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownload />}
            onClick={handleClick}
            style={{ marginBottom: '10px' }}
          >
            Export
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box sx={{ padding: '10px' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: '#5FAD41' }}
                startIcon={<InsertDriveFile />}
                onClick={exportToExcel}
                fullWidth
                style={{ marginBottom: '10px' }}
              >
                Excel
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#272727' }}
                startIcon={<PictureAsPdf />}
                onClick={exportToPDF}
                fullWidth
              >
                PDF
              </Button>
            </Box>
          </Popover>
        </Grid>
      </Box>
      <TableContainer sx={{ border: "1px solid #ddd" }}>
        <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <TableHead style={{ backgroundColor: "#2A629A" }}>
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "#ffffff",
                  padding: "4px",
                  textAlign: "center",
                }}
                rowSpan={2}
              >
                S.No.
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "#ffffff",
                  padding: "4px",
                  textAlign: "center",
                }}
                rowSpan={2}
              >
                Faculty
              </TableCell>

              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "#ffffff",
                  padding: "4px",
                  textAlign: "center",
                }}
                colSpan={4}
              >
                Gender
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "#ffffff",
                  padding: "4px",
                  textAlign: "center",
                }}
                rowSpan={2}
              >
               Total Students
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "#ffffff",
                  padding: "4px",
                  textAlign: "center",
                }}
                rowSpan={2}
              >
                STR (Student / Teacher)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "#ffffff",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                Male
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "#ffffff",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                Female
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "#ffffff",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                Others
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "#ffffff",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rows.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "left",
                    }}
                  >
                    {item.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    {item.male}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    {item.female}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    {item.others}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    {item.total}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    {item.totalStudents}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    {item.ratio}
                  </TableCell>
                </TableRow>
              ))
            }
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid #c2c2c2",
                  padding: "4px",
                  textAlign: "center",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}
                colSpan={2}
              >
                Grand Total
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #c2c2c2",
                  padding: "4px",
                  textAlign: "right",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}
              >
                {totals.male}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #c2c2c2",
                  padding: "4px",
                  textAlign: "right",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}
              >
                {totals.female}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #c2c2c2",
                  padding: "4px",
                  textAlign: "right",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}
              >
                {totals.others}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #c2c2c2",
                  padding: "4px",
                  textAlign: "right",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}
              >
                {totals.total}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #c2c2c2",
                  padding: "4px",
                  textAlign: "right",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}
              >
                {totals.totalStudents}
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #c2c2c2",
                  padding: "4px",
                  textAlign: "right",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}
              >
                {totalRatio}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TeachersByFacultyInCollege;