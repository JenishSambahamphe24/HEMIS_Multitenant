import {
    Box,
    Button,
    Grid,
    Popover,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    FormControl,
    InputLabel,
    TableHead,
    Select,
    TableRow,
    MenuItem,
    Autocomplete,
    TextField
} from "@mui/material";
import { useEffect } from "react";
import React, { useState } from "react";
import { FileDownload, InsertDriveFile } from "@mui/icons-material";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { getGraduationOfLast5FY } from "../../../services/services";

const GradOfLast5FY = () => {
    const [selectedFaculty, setSelectedFaculty] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [anchorEl, setAnchorEl] = useState(null);
    const [apiData, setApiData] = useState([]);
    const [campusId, setCampusId] = useState(0)
    const fetchData = async () => {
        try {
            const response = await getGraduationOfLast5FY(campusId)
            if (response) {
                setApiData(response)
            } else {
                setApiData([])
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [campusId])

    const fiscalYears = [...new Set(
        apiData.flatMap(item => item.fiscalData.map(fiscal => fiscal.year))
    )].sort((a, b) => {
        const [aYear] = a.split('/');
        const [bYear] = b.split('/');
        return parseInt(aYear) - parseInt(bYear);
    });
    const processData = () => {
        return apiData.map(item => {
            const rowData = {
                program: item.programName,
                level: item.level,
                faculty: item.faculty,
            };
            fiscalYears.forEach(year => {
                const fiscalData = item.fiscalData.find(fd => fd.year === year);
                rowData[year] = fiscalData ? fiscalData.count : '0';
            });
            return rowData;
        });
    };

    const rows = processData();

    const facultyNames = [...new Set(rows.map(item => item.faculty))];
    const levelNames = [...new Set(rows.map(item => item.level))];

    const filteredRows = rows.filter((row) => {
        return (
            (selectedFaculty === "All" || row.faculty === selectedFaculty) &&
            (selectedLevel === "All" || row.level === selectedLevel)
        );
    });

    const calculateTotals = () => {
        const totals = {};

        fiscalYears.forEach(year => {
            totals[year] = filteredRows.reduce((sum, row) => {
                return sum + parseInt(row[year] || 0);
            }, 0);
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
    }

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet([]);

        const headers = ["S.No.", "Program", ...fiscalYears];
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        filteredRows.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.program,
                ...fiscalYears.map(year => row[year])
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 2}` });
        });

        const totalsRow = [
            "",
            "Total",
            ...fiscalYears.map(year => totals[year])
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [totalsRow], { origin: `A${filteredRows.length + 2}` });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "GraduatedStudentsByFiscal");
        XLSX.writeFile(workbook, "GraduatedStudentsByFiscal.xlsx");
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
                        {
                            levelNames.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))
                        }
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
                        {
                            facultyNames.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))
                        }
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
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                                colSpan={fiscalYears.length}
                            >
                                Last 5 fiscal years
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {fiscalYears.map((year, index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        border: "1px solid #ddd",
                                        color: "#ffffff",
                                        padding: "4px",
                                        textAlign: "center",
                                    }}
                                >
                                    {year}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.map((item, index) => (
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
                                    {item.program}
                                </TableCell>
                                {fiscalYears.map((year, yearIndex) => (
                                    <TableCell
                                        key={yearIndex}
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: 'right',
                                        }}
                                    >
                                        {item[year]}
                                    </TableCell>
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
                            {fiscalYears.map((year, yearIndex) => (
                                <TableCell
                                    key={yearIndex}
                                    sx={{
                                        border: "1px solid #ddd",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {totals[year]}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default GradOfLast5FY;