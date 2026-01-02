import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
    Popover,
    Button,
    Grid,
} from "@mui/material";

import React, { useState, useEffect } from "react";
import {
    FileDownload,
    InsertDriveFile,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { getStudentsForAnnexReport } from "../reportApi";

const DetailEnrollmentInProgram = ({ fiscalId }) => {
    const [selectedFaculty, setSelectedFaculty] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [anchorEl, setAnchorEl] = useState(null);
    const [rows, setRows] = useState([]);

    const fetchData = async () => {
        const response = await getStudentsForAnnexReport(fiscalId);
        if (response) {
            const reStructuredResponse = response.map((item) => ({
                universityName: item.universityName,
                province: item.province,
                district: item.district,
                localLevel: item.localLevel,
                campus: item.campus,
                faculty: item.faculty,
                level: item.level,
                program: item.program,
                gpi: item.male != 0 && item.female != 0 ? (item.female / item.male).toFixed(2) : 0.00,
                male: item.male,
                female: item.female,
                others: item.others,
                total: item.total,
                campusType: item.campusType,
                universityType: item.universityType,
                ...item,
                ethnicGroup: item.ethinicGroup ? Object.keys(item.ethinicGroup).reduce((acc, key) => {
                    acc[key.trim()] = item.ethinicGroup[key];
                    return acc;
                }, {}) : {},

                ethnicTotalInCampus: Object.values(item.ethinicGroup).reduce(
                    (total, value) => total + value,
                    0
                ),
            }));
            setRows(reStructuredResponse);
        } else {
            setRows([])
        }
    };

    useEffect(() => {
        fetchData();
    }, [fiscalId]);

    const filteredRows = rows.filter((row) => {
        return (
            (selectedFaculty === "All" || row.faculty === selectedFaculty) &&
            (selectedLevel === "All" || row.level === selectedLevel)
        );
    });

    const facultyNames = [...new Set(rows.map(item => item.faculty))];
    const levelNames = [...new Set(rows.map(item => item.level))];

    const totals = filteredRows.reduce(
        (acc, row) => {
            acc.male += row.male;
            acc.female += row.female;
            acc.others += row.others;
            acc.total += row.male + row.female + row.others;
            acc.Brahman += row.ethnicGroup.Brahman;
            acc.Dalit += row.ethnicGroup.Dalit;
            acc.Muslim += row.ethnicGroup.Muslim;
            acc.Tharu += row.ethnicGroup.Tharu;
            acc.Janajati += row.ethnicGroup.Janajati;
            acc.Others += row.ethnicGroup.Others;
            acc.Madhesi += row.ethnicGroup.Madhesi;
            acc.Chhetri += row.ethnicGroup.Chhetri;
            acc.ethnicTotalInCampus += row.ethnicTotalInCampus;
            return acc;
        },
        {
            male: 0,
            female: 0,
            others: 0,
            total: 0,
            Brahman: 0,
            Dalit: 0,
            Muslim: 0,
            Tharu: 0,
            Janajati: 0,
            Others: 0,
            Madhesi: 0,
            Chhetri: 0,
            ethnicTotalInCampus: 0
        }
    );

    totals.gpi = totals.female !== 0
        ? (totals.female / totals.male).toFixed(2)
        : "0.00";

    const exportToExcel = () => {
        const headers = [
            ["S.No.", "Program Name", "Level", "Faculty", "Gender", "", "", "", "", "", "Ethnicity", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "Male", "Female", "Others", "GPI", "Total", "Brahman", "Dalit", "Muslim", "Tharu", "Janajati", "Others", "Madhesi", "Chhetri", "Total"]
        ];

        const rows = filteredRows.map((row, index) => [
            index + 1,
            row.program,
            row.level,
            row.faculty,
            row.male,
            row.female,
            row.others,
            row.gpi,
            row.male + row.female + row.others,
            row.ethnicGroup.Brahman || 0,
            row.ethnicGroup.Dalit || 0,
            row.ethnicGroup.Muslim || 0,
            row.ethnicGroup.Tharu || 0,
            row.ethnicGroup.Janajati || 0,
            row.ethnicGroup.Others || 0,
            row.ethnicGroup.Madhesi || 0,
            row.ethnicGroup.Chhetri || 0,
            row.ethnicTotalInCampus,
        ]);

        const grandTotal = [
            "Grand Total", "", "", "", totals.male, totals.female, totals.others,totals.gpi, totals.male + totals.female + totals.others,
            totals.Brahman, totals.Dalit, totals.Muslim, totals.Tharu, totals.Janajati, totals.Others, totals.Madhesi, totals.Chhetri,
            totals.ethnicTotalInCampus
        ];
        const wsData = [...headers, ...rows, grandTotal];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Enrollment Data");
        XLSX.writeFile(wb, "enrollment_data.xlsx");
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
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
            <TableContainer sx={{ border: "1px solid #ddd", overflowX: 'scroll' }}>
                <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
                    <TableHead style={{ backgroundColor: "#2A629A" }}>
                        <TableRow>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                S.No.
                            </TableCell>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Program Name
                            </TableCell>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Level
                            </TableCell>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Faculty
                            </TableCell>
                            <TableCell
                                colSpan={5}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Gender
                            </TableCell>
                            <TableCell
                                colSpan={9}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Ethnicity
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
                                others
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
                            {[
                                "Brahman",
                                "Dalit",
                                "Muslim",
                                "Tharu",
                                "Janajati",
                                "Others",
                                "Madhesi",
                                "Chhetri",
                            ].map((item, index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        border: "1px solid #ddd",
                                        color: "#ffffff",
                                        padding: "4px",
                                        textAlign: "center",
                                    }}
                                >
                                    {item}
                                </TableCell>
                            ))}
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
                        {filteredRows.map((row, index) => {
                            const totalStudents = row.male + row.female;
                            return (
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
                                        {row.program}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "left",
                                        }}
                                    >
                                        {row.level}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "left",
                                        }}
                                    >
                                        {row.faculty}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.male}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.female}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.others}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.gpi}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {totalStudents}
                                    </TableCell>
                                    {Object.entries(row.ethnicGroup).map(
                                        ([key, value], index) => (
                                            <TableCell
                                                key={index}
                                                sx={{
                                                    border: "1px solid #c2c2c2",
                                                    padding: "4px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {row.ethnicGroup[key]}
                                            </TableCell>
                                        )
                                    )}
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.ethnicTotalInCampus}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableRow style={{ backgroundColor: "#c2c2c2" }}>
                        <TableCell
                            colSpan={4}
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                                fontWeight: "bold",
                            }}
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
                            {totals.male}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.female}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.others}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.gpi}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.total}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.Brahman}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.Dalit}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.Muslim}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.Tharu}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.Janajati}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.Others}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.Madhesi}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.Chhetri}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.ethnicTotalInCampus}
                        </TableCell>
                    </TableRow>
                </Table>
            </TableContainer>
        </div>
    );
};

export default DetailEnrollmentInProgram;
