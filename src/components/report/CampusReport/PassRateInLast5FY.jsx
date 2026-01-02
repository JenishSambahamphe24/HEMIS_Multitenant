import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  Popover,
  Autocomplete,
  TextField,
  Grid,
} from "@mui/material";
import { LoadingOverlay } from "@mantine/core";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FileDownload, InsertDriveFile } from "@mui/icons-material";
import { getCampusForSelection } from "../../../services/services";
import { getPassrateOfLast5FY } from "./CampusServices";
import { useSelector } from "react-redux";

const PassRateInLast5FY = ({ roleName }) => {
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCampuses, setAllsampuses] = useState();

  const { currentUser } = useSelector((state) => state.user);
  const campusId = currentUser?.institution?.id;

  const fetchAllCampuses = async () => {
    setLoading(true);
    try {
      const response = await getCampusForSelection(campusId);
      if (response) {
        setAllsampuses(response);
      } else {
        setAllsampuses([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllsampuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCampuses();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getPassrateOfLast5FY(campusId);
      if (response) {
        setApiData(response);
      } else {
        setApiData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campusId]);

  const fiscalYears = [
    ...new Set(
      (apiData || []) // check apiData
        .flatMap(
          (item) =>
            (item?.fiscalData || []) // check item.fiscalData
              .map((fiscal) => fiscal?.year) // check fiscal.year
              .filter(Boolean) // remove undefined/null/empty values
        )
    ),
  ].sort((a, b) => {
    if (!a || !b) return 0; // safety check

    const [aYear] = a.split("/") || [];
    const [bYear] = b.split("/") || [];

    if (!aYear || !bYear) return 0; // skip invalid formats

    return parseInt(aYear) - parseInt(bYear);
  });

  // const fiscalYears = [...new Set(
  //     apiData.flatMap(item => item.fiscalData.map(fiscal => fiscal.year))
  // )].sort((a, b) => {
  //     const [aYear] = a.split('/');
  //     const [bYear] = b.split('/');
  //     return parseInt(aYear) - parseInt(bYear);
  // });

  const processData = () => {
    return apiData.map((item) => {
      const rowData = {
        program: item.programName,
        level: item.level,
        faculty: item.faculty,
      };
      item.fiscalData.forEach((fiscal) => {
        rowData[`${fiscal.year}_appeared`] = fiscal.appeared;
        rowData[`${fiscal.year}_passed`] = fiscal.passed;
        rowData[`${fiscal.year}_passPercentage`] = fiscal.passPercentage;
      });

      return rowData;
    });
  };

  const rows = processData();
  const facultyNames = [...new Set(rows.map((item) => item.faculty))];
  const levelNames = [...new Set(rows.map((item) => item.level))];
  const filteredRows = rows.filter((row) => {
    return (
      (selectedFaculty === "All" || row.faculty === selectedFaculty) &&
      (selectedLevel === "All" || row.level === selectedLevel)
    );
  });

  const calculateTotals = () => {
    const totals = {};

    fiscalYears.forEach((year) => {
      totals[`${year}_appeared`] = filteredRows.reduce((sum, row) => {
        return sum + parseInt(row[`${year}_appeared`] || 0);
      }, 0);

      totals[`${year}_passed`] = filteredRows.reduce((sum, row) => {
        return sum + parseInt(row[`${year}_passed`] || 0);
      }, 0);

      const totalAppeared = totals[`${year}_appeared`];
      const totalPassed = totals[`${year}_passed`];
      totals[`${year}_passPercentage`] =
        totalAppeared > 0 ? Math.round((totalPassed / totalAppeared) * 100) : 0;
    });

    return totals;
  };
  const totals = calculateTotals();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCampusChange = (event, newValue) => {
    const campusId = newValue ? newValue.id : null;
    setCampusId(campusId);
  };
  const selectedCampusObject =
    (allCampuses && allCampuses.find((campus) => campus.id === campusId)) ||
    null;
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([]);

    const mainHeader = ["S.No.", "Program"];
    const subHeader = ["", ""];

    fiscalYears.forEach((year) => {
      mainHeader.push(year, "", "");
      subHeader.push("Appeared", "Passed", "Pass Rate (%)");
    });

    XLSX.utils.sheet_add_aoa(worksheet, [mainHeader], { origin: "A1" });
    XLSX.utils.sheet_add_aoa(worksheet, [subHeader], { origin: "A2" });

    filteredRows.forEach((row, index) => {
      const rowData = [index + 1, row.program];

      fiscalYears.forEach((year) => {
        rowData.push(
          row[`${year}_appeared`] || 0,
          row[`${year}_passed`] || 0,
          row[`${year}_passPercentage`] || 0
        );
      });

      XLSX.utils.sheet_add_aoa(worksheet, [rowData], {
        origin: `A${index + 3}`,
      });
    });

    // Add totals row
    const totalsRow = ["", "Total"];

    fiscalYears.forEach((year) => {
      totalsRow.push(
        totals[`${year}_appeared`],
        totals[`${year}_passed`],
        totals[`${year}_passPercentage`]
      );
    });

    XLSX.utils.sheet_add_aoa(worksheet, [totalsRow], {
      origin: `A${filteredRows.length + 3}`,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PassRateData");
    XLSX.writeFile(workbook, "PassRateData.xlsx");
    handleClose();
  };
  const open = Boolean(anchorEl);
  const id = open ? "export-popover" : undefined;

  return (
    <div>
      <Box sx={{ marginBottom: "5px", display: "flex", gap: 2 }}>
        <FormControl fullWidth sx={{ maxWidth: "30%" }} size="small">
          <InputLabel>Select Level</InputLabel>
          <Select
            size="small"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            label="Select Level"
          >
            <MenuItem value="All">All Level</MenuItem>
            {levelNames.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ maxWidth: "30%" }} size="small">
          <InputLabel>Select Faculty</InputLabel>
          <Select
            size="small"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            label="Select Faculty"
          >
            <MenuItem value="All">All Faculty</MenuItem>
            {facultyNames.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
                onClick={exportToExcel}
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
                Program
              </TableCell>
              {fiscalYears.map((year, index) => (
                <TableCell
                  key={index}
                  sx={{
                    border: "1px solid #ddd",
                    color: "#ffffff",
                    padding: "4px",
                    textAlign: "center",
                  }}
                  colSpan={3}
                >
                  {year}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {fiscalYears.map((year) => (
                <React.Fragment key={`${year}-headers`}>
                  <TableCell
                    sx={{
                      border: "1px solid #ddd",
                      color: "#ffffff",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    Appeared
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #ddd",
                      color: "#ffffff",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    Passed
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #ddd",
                      color: "#ffffff",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    Pass Rate (%)
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          {filteredRows.length > 0 ? (
            <TableBody>
              {filteredRows.map((item, index) => (
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
                    {item.program}
                  </TableCell>
                  {fiscalYears.map((year) => (
                    <React.Fragment key={`${year}-${index}`}>
                      <TableCell
                        sx={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "right",
                        }}
                      >
                        {item[`${year}_appeared`] || 0}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "right",
                        }}
                      >
                        {item[`${year}_passed`] || 0}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "right",
                        }}
                      >
                        {item[`${year}_passPercentage`] || 0}
                      </TableCell>
                    </React.Fragment>
                  ))}
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
                {fiscalYears.map((year) => (
                  <React.Fragment key={`total-${year}`}>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {totals[`${year}_appeared`]}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {totals[`${year}_passed`]}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid #ddd",
                        padding: "4px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {totals[`${year}_passPercentage`]}
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={2 + fiscalYears.length * 3}
                  style={{ textAlign: "center" }}
                >
                  No pass rate data available
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {loading && (
        <LoadingOverlay
          visible={loading}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ color: "#1976d2", type: "bars" }}
        />
      )}
    </div>
  );
};

export default PassRateInLast5FY;
