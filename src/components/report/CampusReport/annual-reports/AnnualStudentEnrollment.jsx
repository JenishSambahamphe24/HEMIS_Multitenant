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
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
    FileDownload,
    InsertDriveFile,
} from "@mui/icons-material";
import "jspdf-autotable";
import { getFiscalYearById } from "../../../../services/services";

const testData = [
    {
        "faculty": "Humanities and Social Sciences",
        "level": "Bachelor",
        "program": "Bachelor in Arts",
        "semesterCounts": [
            {
                "semester": "First",
                "genderCounts": {
                    "male": 6,
                    "female": 4,
                    "others": 0,
                    "total": 10
                },
                "ethnicCounts": {
                    "EDJ": 3,
                    "Chhetri": 2,
                    "Brahman": 1,
                    "Madhesi": 0,
                    "Dalit": 3,
                    "Muslim": 0,
                    "Tharu": 0,
                    "Janajati": 4,
                    "ethnicOthers": 0,
                    "ethnicTotals": 10,
                }
            },
            {
                "semester": "Second",
                "genderCounts": {
                    "male": 5,
                    "female": 5,
                    "others": 1,
                    "total": 11
                },
                "ethnicCounts": {
                    "EDJ": 3,
                    "Chhetri": 3,
                    "Brahman": 2,
                    "Madhesi": 1,
                    "Dalit": 2,
                    "Muslim": 0,
                    "Tharu": 1,
                    "Janajati": 2,
                    "Others": 0,
                    "ethnicOthers": 0,
                    "ethnicTotals": 10,
                }
            }
        ]
    },
    {
        "faculty": "Humanities and Social Sciences",
        "level": "Master",
        "program": "Master in Sociology",
        "semesterCounts": [
            {
                "semester": "First",
                "genderCounts": {
                    "male": 8,
                    "female": 6,
                    "others": 0,
                    "total": 14
                },
                "ethnicCounts": {
                    "EDJ": 4,
                    "Chhetri": 4,
                    "Brahman": 3,
                    "Madhesi": 1,
                    "Dalit": 2,
                    "Muslim": 1,
                    "Tharu": 1,
                    "Janajati": 2,
                    "Others": 0,
                    "ethnicOthers": 0,
                    "ethnicTotals": 10,
                }
            },
            {
                "semester": "Second",
                "genderCounts": {
                    "male": 7,
                    "female": 8,
                    "others": 1,
                    "total": 16
                },
                "ethnicCounts": {
                    "EDJ": 8,
                    "Chhetri": 5,
                    "Brahman": 4,
                    "Madhesi": 2,
                    "Dalit": 3,
                    "Muslim": 0,
                    "Tharu": 1,
                    "Janajati": 1,
                    "ethnicOthers": 0,
                    "ethnicTotals": 10,
                }
            }
        ]
    }
]

const AnnualStudentEnrollment = ({ fiscalYear }) => {
    const rearrangedData = testData.flatMap((item) =>
        item.semesterCounts.map((semester) => ({
            faculty: item.faculty,
            level: item.level,
            semester: semester.semester,
            program: item.program,
            male: semester.genderCounts.male,
            female: semester.genderCounts.female,
            others: semester.genderCounts.others,
            total: semester.genderCounts.total,
            ...semester.ethnicCounts,
        }))
    );

    const uniqueLevels = [...new Set(rearrangedData.map((data) => data.level))];
    const uniquePrograms = [...new Set(rearrangedData.map((data) => data.program))];
    const [selectedProgram, setSelectedProgram] = useState(() =>
        uniquePrograms.length > 0 ? uniquePrograms[0] : "All"
    );
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [anchorEl, setAnchorEl] = useState(null);
    const [rows, setRows] = useState([]);

    const filteredRows = rows.filter((row) => {
        return (
            (selectedProgram === "All" || row.program === selectedProgram) &&
            (selectedLevel === "All" || row.level === selectedLevel)
        );
    });

    const totals = filteredRows.reduce((acc, item) => {
        acc.male += item.male;
        acc.female += item.female;
        acc.others += item.others;
        acc.total += item.total;
        acc.EDJ += item.EDJ;
        acc.Chhetri += item.Chhetri; acc.Chhetri += item.Chhetri;
        acc.Brahman += item.Brahman;
        acc.Janajati += item.Janajati;
        acc.Madhesi += item.Madhesi;
        acc.Muslim += item.Muslim;
        acc.Tharu += item.Tharu;
        acc.Dalit += item.Dalit;
        acc.ethnicOthers += item.ethnicOthers;
        acc.ethnicTotals += item.ethnicTotals;
        acc.Brahman += item.Brahman;
        acc.Janajati += item.Janajati;
        acc.Madhesi += item.Madhesi;
        acc.Muslim += item.Muslim;
        acc.Tharu += item.Tharu;
        acc.Dalit += item.Dalit;
        acc.ethnicOthers += item.ethnicOthers;
        acc.ethnicTotals += item.ethnicTotals;
        return acc;
    }, {
        male: 0,
        female: 0,
        others: 0,
        total: 0,
        EDJ: 0,
        Chhetri: 0,
        Brahman: 0,
        Madhesi: 0,
        Dalit: 0,
        Muslim: 0,
        Tharu: 0,
        Janajati: 0,
        ethnicOthers: 0,
        ethnicTotals: 0
    });

    useEffect(() => {
        setRows(rearrangedData)
    }, [])

    const exportToExcel = () => {
        const headers = [
            [
                "S.No.",
                "Semester",
                "Male",
                "Female",
                "Others",
                "Total",
                "EDJ",
                "Chhetri",
                "Brahman",
                "Madhesi",
                "Dalit",
                "Muslim",
                "Tharu",
                "Janajati",
                "Others",
                "Ethnic Total",
            ],
        ];
        const rows = filteredRows.map((row, index) => [
            index + 1,
            row.semester,
            row.male,
            row.female,
            row.others,
            row.total,
            row.EDJ,
            row.Chhetri,
            row.Brahman,
            row.Madhesi,
            row.Dalit,
            row.Muslim,
            row.Tharu,
            row.Janajati,
            row.ethnicOthers,
            row.ethnicTotals,
        ]);
        const grandTotal = [
            "",
            "Grand Total",
            totals.male,
            totals.female,
            totals.others,
            totals.total,
            totals.EDJ,
            totals.Chhetri,
            totals.Brahman,
            totals.Madhesi,
            totals.Dalit,
            totals.Muslim,
            totals.Tharu,
            totals.Janajati,
            totals.ethnicOthers,
            totals.ethnicTotals,
        ];
        const wsData = [...headers, ...rows, grandTotal];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Enrollment Data");
        XLSX.writeFile(wb, "enrollment_data.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const headers = [
            [
                "S.No.",
                "Semester",
                "Male",
                "Female",
                "Others",
                "Total",
                "EDJ",
                "Chhetri",
                "Brahman",
                "Madhesi",
                "Dalit",
                "Muslim",
                "Tharu",
                "Janajati",
                "Others",
                "Ethnic Total",
            ],
        ];
        const rows = filteredRows.map((row, index) => [
            index + 1,
            row.semester,
            row.male,
            row.female,
            row.others,
            row.total,
            row.EDJ,
            row.Chhetri,
            row.Brahman,
            row.Madhesi,
            row.Dalit,
            row.Muslim,
            row.Tharu,
            row.Janajati,
            row.ethnicOthers,
            row.ethnicTotals,
        ]);
        const grandTotal = [
            "",
            "Grand Total",
            totals.male,
            totals.female,
            totals.others,
            totals.total,
            totals.EDJ,
            totals.Chhetri,
            totals.Brahman,
            totals.Madhesi,
            totals.Dalit,
            totals.Muslim,
            totals.Tharu,
            totals.Janajati,
            totals.ethnicOthers,
            totals.ethnicTotals,
        ];

        const tableData = [...rows, grandTotal];
        doc.autoTable({
            head: headers,
            body: tableData,
            styles: {
                lineColor: "#c2c2c2", 
                lineWidth: 0.2,       
                cellPadding: 1,       
            },
            headStyles: {
                fontSize: 8,          
                fillColor: [41, 128, 185], 
                textColor: 255,      
                halign: "center",     
            },
            bodyStyles: {
                fontSize: 7,        
            },
            footStyles: {
                fontSize: 8,          
            },
            theme: "striped",        
            margin: { top: 10 },    
        });
        doc.save("institutions_status.pdf");
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
            <Box sx={{ marginTop:'10px',marginBottom: "5px", display: "flex", gap: 2 }}>
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
                            uniqueLevels.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ maxWidth: "30%" }} size="small">
                    <InputLabel>Select Program</InputLabel>
                    <Select
                        size="small"
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 2,
                        }}
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        label="Select Program"
                    >
                        <MenuItem value="All">All programs</MenuItem>
                        {
                            uniquePrograms.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <Grid container justifyContent="right">
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<FileDownload />}
                        onClick={handleClick}
                        style={{ marginBottom: "10px" }}
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
                                size="small"
                                variant="contained"
                                color="primary"
                                sx={{ backgroundColor: "#5FAD41" }}
                                startIcon={<InsertDriveFile />}
                                onClick={exportToExcel}
                                fullWidth
                                style={{ marginBottom: "10px" }}
                            >
                                Excel
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                sx={{ backgroundColor: "#272727" }}
                                startIcon={<InsertDriveFile />}
                                onClick={exportToPDF}
                                fullWidth
                            >
                                PDF
                            </Button>
                        </Box>
                    </Popover>
                </Grid>
            </Box>

            <Typography my={1} fontWeight='bold' ml={1} >Student Enrollment in F.Y. {fiscalYear} in Bachelor Level  </Typography>
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
                                Semester
                            </TableCell>

                            <TableCell
                                colSpan={4}
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
                                colSpan={10}
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
                                Total
                            </TableCell>

                            {[
                                "EDJ",
                                "Chhetri",
                                "Brahman",
                                "Madhesi",
                                "Dalit",
                                "Muslim",
                                "Tharu",
                                "Janajati",
                                "Others",
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
                                        {row.semester}
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
                                        {row.total}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.EDJ}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.Chhetri}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.Brahman}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.Madhesi}
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
                                        {row.Muslim}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.Tharu}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.Janajati}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.ethnicOthers}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.ethnicTotals}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableRow style={{ backgroundColor: "#c2c2c2" }}>
                        <TableCell
                            colSpan={2}
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                                fontWeight: "bold",
                            }}
                        >
                            Grand Total
                        </TableCell>
                        {
                            Object.entries(totals).map(([key, value], index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        border: "1px solid #ddd",
                                        padding: "4px",
                                        textAlign: "right",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {value}
                                </TableCell>
                            ))
                        }
                    </TableRow>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AnnualStudentEnrollment;
