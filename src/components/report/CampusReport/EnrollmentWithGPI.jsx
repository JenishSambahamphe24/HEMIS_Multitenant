
// 3.9 Report
import {
  Box,
  Button,
  Grid,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import React, { useState } from "react";
import { FileDownload, InsertDriveFile } from "@mui/icons-material";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { getStudentByFacultyForGPI, getStudentByLevelForGPI } from "../../dashboard/services/service";

const EnrollmentWithGPI = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [levelData, setLevelData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStudentByFacultyForGPI()
      if (response) {
        setFacultyData(response)
      } else {
        setFacultyData([])
      }
      const levelResponse = await getStudentByLevelForGPI()
      if (levelResponse) {
        setLevelData(levelResponse)
      } else {
        setLevelData([])
      }
    }
    fetchData()
  }, [])

  const facultyRows = facultyData.map((item, index) => ({
    faculty: item.title,
    male: item.male,
    female: item.female,
    others: item.other,
    gpi: item.female != 0 && item.male != 0 ? (item.female / item.male).toFixed(2) : "0.00",
    total: item.total,
  }))

  const facultyTotals = facultyRows.reduce(
    (acc, curr) => {
      acc.male += curr.male;
      acc.female += curr.female;
      acc.other += curr.others;
      acc.total += curr.total;
      return acc;
    },
    {
      male: 0,
      female: 0,
      other: 0,
      total: 0,
    }
  );
  facultyTotals.gpi = facultyTotals.female != 0 ? (facultyTotals.female / facultyTotals.male).toFixed(2) : "0.00"

  const levelRows = levelData.map((item, index) => ({
    level: item.title,
    male: item.male,
    female: item.female,
    others: item.other,
    gpi: item.female != 0 && item.male != 0 ? (item.female / item.male).toFixed(2) : "0.00",
    total: item.total,
  }))

  const levelTotals = levelRows.reduce(
    (acc, curr) => {
      acc.male += curr.male;
      acc.female += curr.female;
      acc.other += curr.others;
      acc.total += curr.total;
      return acc;
    },
    {
      male: 0,
      female: 0,
      other: 0,
      total: 0,
    }
  );
  levelTotals.gpi = levelTotals.female != 0 ? (levelTotals.female / levelTotals.male).toFixed(2) : "0.00"

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportFacultyToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    const header = [["S.No.", "Faculty", "Male", "Female", "Others", "GPI", "Total"]];
    XLSX.utils.sheet_add_aoa(worksheet, header, { origin: "A1" });
    facultyRows.forEach((row, index) => {
      const rowData = [
        index + 1,
        row.faculty,
        row.male || 0,
        row.female || 0,
        row.gpi || 0,
        row.others || 0,
        row.total || 0,
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 2}` });
    });
    const totalsRow = ["", "Total", facultyTotals.male, facultyTotals.female, facultyTotals.other, facultyTotals.gpi, facultyTotals.total];
    XLSX.utils.sheet_add_aoa(worksheet, [totalsRow], { origin: `A${facultyRows.length + 2}` });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty_with_GPI_Report");
    XLSX.writeFile(workbook, "Faculty_with_GPI_Report.xlsx");
    handleClose();
  };

  const exportLevelToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    const header = [["S.No.", "Level", "Male", "Female", "Others", "GPI", "Total"]];
    XLSX.utils.sheet_add_aoa(worksheet, header, { origin: "A1" });
    levelRows.forEach((row, index) => {
      const rowData = [
        index + 1,
        row.level,
        row.male || 0,
        row.female || 0,
        row.gpi || 0,
        row.others || 0,
        row.total || 0,
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 2}` });
    });
    const totalsRow = ["", "Total", levelTotals.male, levelTotals.female, levelTotals.other, levelTotals.gpi, levelTotals.total];
    XLSX.utils.sheet_add_aoa(worksheet, [totalsRow], { origin: `A${facultyRows.length + 2}` });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Level_With_GPI_Report");
    XLSX.writeFile(workbook, "Level_With_GPI_Report.xlsx");
    handleClose();
  };
  const open = Boolean(anchorEl);
  const id = open ? "export-popover" : undefined;
  return (
    <Grid container gap='5px'>
      <Grid item sm={12} md={5.8}>
        <Box sx={{ marginBottom: "5px", display: "flex", gap: 2 }}>
          <Grid container justifyContent="right">
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<FileDownload />}
              onClick={handleClick}
            >
              Export
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box sx={{ padding: "10px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ backgroundColor: "#5FAD41" }}
                  startIcon={<InsertDriveFile />}
                  onClick={exportFacultyToExcel}
                  fullWidth
                >
                  Excel
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
                  colSpan={5}
                >
                  Gender
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
                  Other
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    color: "#ffffff",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  GPI
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
              {facultyRows.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'left',
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'left',
                    }}
                  >
                    {item.faculty}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.male}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.female}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.others}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.gpi}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.total}
                  </TableCell>

                </TableRow>

              ))}
              <TableRow sx={{ backgroundColor: "#c2c2c2" }}>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                  colSpan={2}
                >
                  Grand Total
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {facultyTotals.male}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {facultyTotals.female}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {facultyTotals.other}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {facultyTotals.gpi}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {facultyTotals.total}
                </TableCell>
              </TableRow>
            </TableBody>

          </Table>
        </TableContainer>
      </Grid>
      <Grid item sm={12} md={5.8}>
        <Box sx={{ marginBottom: "5px", display: "flex", gap: 2 }}>
          <Grid container justifyContent="right">
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<FileDownload />}
              onClick={handleClick}
            >
              Export
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box sx={{ padding: "10px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ backgroundColor: "#5FAD41" }}
                  startIcon={<InsertDriveFile />}
                  onClick={exportLevelToExcel}
                  fullWidth
                >
                  Excel
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
                  Level
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    color: "#ffffff",
                    padding: "4px",
                    textAlign: "center",
                  }}
                  colSpan={5}
                >
                  Gender
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
                  Other
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    color: "#ffffff",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  GPI
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
              {levelRows.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'left',
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'left',
                    }}
                  >
                    {item.level}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.male}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.female}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.others}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.gpi}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #c2c2c2",
                      padding: "4px",
                      textAlign: 'right',
                    }}
                  >
                    {item.total}
                  </TableCell>

                </TableRow>

              ))}
              <TableRow sx={{ backgroundColor: "#c2c2c2" }}>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                  colSpan={2}
                >
                  Grand Total
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {levelTotals.male}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {levelTotals.female}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {levelTotals.other}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {levelTotals.gpi}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {levelTotals.total}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default EnrollmentWithGPI;


