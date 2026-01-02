import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

const testData = [
    {
        "level": "Bachelor",
        data: [
            {
                program: "Bachelor in Arts",
                totalAppeared: 22,
                totalPassed: 20,
                male: {
                    totalAppeared: 12,
                    totalPassed: 12
                },
                female: {
                    totalAppeared: 10,
                    totalPassed: 8
                },
                otherGender: {
                    totalAppeared: 0,
                    totalPassed: 0
                },
                edj: {
                    totalAppeared: 0,
                    totalPassed: 0
                },
                chhetri: {
                    totalAppeared: 3,
                    totalPassed: 0
                },
                brahman: {
                    totalAppeared: 6,
                    totalPassed: 5
                },
                dalit: {
                    totalAppeared: 2,
                    totalPassed: 2
                },
                muslim: {
                    totalAppeared: 3,
                    totalPassed: 3
                },
                madhesi: {
                    totalAppeared: 2,
                    totalPassed: 2
                },
                janajati: {
                    totalAppeared: 4,
                    totalPassed: 4
                },
                otherEthnicity: {
                    totalAppeared: 1,
                    totalPassed: 1
                }
            },
            {
                program: "Bachelor in science",
                totalAppeared: 22,
                totalPassed: 20,
                male: {
                    totalAppeared: 12,
                    totalPassed: 12
                },
                female: {
                    totalAppeared: 10,
                    totalPassed: 8
                },
                otherGender: {
                    totalAppeared: 0,
                    totalPassed: 0
                },
                edj: {
                    totalAppeared: 0,
                    totalPassed: 0
                },
                chhetri: {
                    totalAppeared: 3,
                    totalPassed: 0
                },
                brahman: {
                    totalAppeared: 6,
                    totalPassed: 5
                },
                dalit: {
                    totalAppeared: 2,
                    totalPassed: 2
                },
                muslim: {
                    totalAppeared: 3,
                    totalPassed: 3
                },
                madhesi: {
                    totalAppeared: 2,
                    totalPassed: 2
                },
                janajati: {
                    totalAppeared: 4,
                    totalPassed: 4
                },
                otherEthnicity: {
                    totalAppeared: 1,
                    totalPassed: 1
                }
            },
        ]
    },
    {
        "level": "Masters",
        data: [
            {
                program: "Masters in Arts",
                totalAppeared: 22,
                totalPassed: 20,
                male: {
                    totalAppeared: 12,
                    totalPassed: 12
                },
                female: {
                    totalAppeared: 10,
                    totalPassed: 8
                },
                otherGender: {
                    totalAppeared: 0,
                    totalPassed: 0
                },
                edj: {
                    totalAppeared: 0,
                    totalPassed: 0
                },
                chhetri: {
                    totalAppeared: 3,
                    totalPassed: 0
                },
                brahman: {
                    totalAppeared: 6,
                    totalPassed: 5
                },
                dalit: {
                    totalAppeared: 2,
                    totalPassed: 2
                },
                muslim: {
                    totalAppeared: 3,
                    totalPassed: 3
                },
                madhesi: {
                    totalAppeared: 2,
                    totalPassed: 2
                },
                janajati: {
                    totalAppeared: 4,
                    totalPassed: 4
                },
                otherEthnicity: {
                    totalAppeared: 1,
                    totalPassed: 1
                }
            },
            {
                program: "Masters in science",
                totalAppeared: 22,
                totalPassed: 20,
                male: {
                    totalAppeared: 12,
                    totalPassed: 12
                },
                female: {
                    totalAppeared: 10,
                    totalPassed: 8
                },
                otherGender: {
                    totalAppeared: 0,
                    totalPassed: 0
                },
                edj: {
                    totalAppeared: 0,
                    totalPassed: 0
                },
                chhetri: {
                    totalAppeared: 3,
                    totalPassed: 0
                },
                brahman: {
                    totalAppeared: 6,
                    totalPassed: 5
                },
                dalit: {
                    totalAppeared: 2,
                    totalPassed: 2
                },
                muslim: {
                    totalAppeared: 3,
                    totalPassed: 3
                },
                madhesi: {
                    totalAppeared: 2,
                    totalPassed: 2
                },
                janajati: {
                    totalAppeared: 4,
                    totalPassed: 4
                },
                otherEthnicity: {
                    totalAppeared: 1,
                    totalPassed: 1
                }
            },
        ]
    },
]

const PassedStdReport = ({ fiscalYear }) => {
    const [rows, setRows] = useState([])
    const [anchorEl, setAnchorEl] = useState(null);

    const mappedData = testData.flatMap((item) =>
        item.data.map((student) => ({
            level: item.level,
            program: student.program,
            totalAppeared: student.totalAppeared,
            totalPassed:student.totalPassed,
            maleAppeared: student.male.totalAppeared,
            malePassed: student.male.totalPassed,
            femaleAppeared: student.female.totalAppeared,
            femalePassed: student.female.totalPassed,
            otherGenderAppeared: student.otherGender.totalAppeared,
            otherGenderPassed: student.otherGender.totalPassed,
            edjAppeared: student.edj.totalAppeared,
            edjPassed: student.edj.totalPassed,
            chhetriAppeared: student.chhetri.totalAppeared,
            chhetriPassed: student.chhetri.totalPassed,
            brahmanAppeared: student.brahman.totalAppeared,
            brahmanPassed: student.brahman.totalPassed,
            dalitAppeared: student.dalit.totalAppeared,
            dalitPassed: student.dalit.totalPassed,
            muslimAppeared: student.muslim.totalAppeared,
            muslimPassed: student.muslim.totalPassed,
            madhesiAppeared: student.madhesi.totalAppeared,
            madhesiPassed: student.madhesi.totalPassed,
            janajatiAppeared: student.janajati.totalAppeared,
            janajatiPassed: student.janajati.totalPassed,
            otherEthnicityAppeared: student.otherEthnicity.totalAppeared,
            otherEthnicityPassed: student.otherEthnicity.totalPassed,
            tharuAppeared: student.tharu?.totalAppeared || 0,
            tharuPassed: student.tharu?.totalPassed || 0,
        }))
    );
 
    useEffect(() => {
        setRows(mappedData)
    }, [])


    // const totals = rows.reduce((acc, item) => {
    //     acc.male += item.male;
    //     acc.female += item.female;
    //     acc.others += item.others;
    //     acc.total += item.total;
    //     acc.EDJ += item.EDJ;
    //     acc.Chhetri += item.Chhetri; acc.Chhetri += item.Chhetri;
    //     acc.Brahman += item.Brahman;
    //     acc.Janajati += item.Janajati;
    //     acc.Madhesi += item.Madhesi;
    //     acc.Muslim += item.Muslim;
    //     acc.Tharu += item.Tharu;
    //     acc.Dalit += item.Dalit;
    //     acc.ethnicOthers += item.ethnicOthers;
    //     acc.ethnicTotals += item.ethnicTotals;
    //     acc.Brahman += item.Brahman;
    //     acc.Janajati += item.Janajati;
    //     acc.Madhesi += item.Madhesi;
    //     acc.Muslim += item.Muslim;
    //     acc.Tharu += item.Tharu;
    //     acc.Dalit += item.Dalit;
    //     acc.ethnicOthers += item.ethnicOthers;
    //     acc.ethnicTotals += item.ethnicTotals;
    //     return acc;
    // }, {
    //     male: 0,
    //     female: 0,
    //     others: 0,
    //     total: 0,
    //     EDJ: 0,
    //     Chhetri: 0,
    //     Brahman: 0,
    //     Madhesi: 0,
    //     Dalit: 0,
    //     Muslim: 0,
    //     Tharu: 0,
    //     Janajati: 0,
    //     ethnicOthers: 0,
    //     ethnicTotals: 0
    // });
    // const exportToExcel = () => {
    //     const headers = [
    //         [
    //             "S.No.",
    //             "Semester",
    //             "Male",
    //             "Female",
    //             "Others",
    //             "Total",
    //             "EDJ",
    //             "Chhetri",
    //             "Brahman",
    //             "Madhesi",
    //             "Dalit",
    //             "Muslim",
    //             "Tharu",
    //             "Janajati",
    //             "Others",
    //             "Ethnic Total",
    //         ],
    //     ];
    //     const rows = filteredRows.map((row, index) => [
    //         index + 1,
    //         row.semester,
    //         row.male,
    //         row.female,
    //         row.others,
    //         row.total,
    //         row.EDJ,
    //         row.Chhetri,
    //         row.Brahman,
    //         row.Madhesi,
    //         row.Dalit,
    //         row.Muslim,
    //         row.Tharu,
    //         row.Janajati,
    //         row.ethnicOthers,
    //         row.ethnicTotals,
    //     ]);
    //     const grandTotal = [
    //         "",
    //         "Grand Total",
    //         totals.male,
    //         totals.female,
    //         totals.others,
    //         totals.total,
    //         totals.EDJ,
    //         totals.Chhetri,
    //         totals.Brahman,
    //         totals.Madhesi,
    //         totals.Dalit,
    //         totals.Muslim,
    //         totals.Tharu,
    //         totals.Janajati,
    //         totals.ethnicOthers,
    //         totals.ethnicTotals,
    //     ];
    //     const wsData = [...headers, ...rows, grandTotal];
    //     const ws = XLSX.utils.aoa_to_sheet(wsData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "Enrollment Data");
    //     XLSX.writeFile(wb, "enrollment_data.xlsx");
    // };

    // const exportToPDF = () => {
    //     const doc = new jsPDF();
    //     const headers = [
    //         [
    //             "S.No.",
    //             "Semester",
    //             "Male",
    //             "Female",
    //             "Others",
    //             "Total",
    //             "EDJ",
    //             "Chhetri",
    //             "Brahman",
    //             "Madhesi",
    //             "Dalit",
    //             "Muslim",
    //             "Tharu",
    //             "Janajati",
    //             "Others",
    //             "Ethnic Total",
    //         ],
    //     ];
    //     const rows = filteredRows.map((row, index) => [
    //         index + 1,
    //         row.semester,
    //         row.male,
    //         row.female,
    //         row.others,
    //         row.total,
    //         row.EDJ,
    //         row.Chhetri,
    //         row.Brahman,
    //         row.Madhesi,
    //         row.Dalit,
    //         row.Muslim,
    //         row.Tharu,
    //         row.Janajati,
    //         row.ethnicOthers,
    //         row.ethnicTotals,
    //     ]);
    //     const grandTotal = [
    //         "",
    //         "Grand Total",
    //         totals.male,
    //         totals.female,
    //         totals.others,
    //         totals.total,
    //         totals.EDJ,
    //         totals.Chhetri,
    //         totals.Brahman,
    //         totals.Madhesi,
    //         totals.Dalit,
    //         totals.Muslim,
    //         totals.Tharu,
    //         totals.Janajati,
    //         totals.ethnicOthers,
    //         totals.ethnicTotals,
    //     ];

    //     const tableData = [...rows, grandTotal];
    //     doc.autoTable({
    //         head: headers,
    //         body: tableData,
    //         styles: {
    //             lineColor: "#c2c2c2",
    //             lineWidth: 0.2,
    //             cellPadding: 1,
    //         },
    //         headStyles: {
    //             fontSize: 8,
    //             fillColor: [41, 128, 185],
    //             textColor: 255,
    //             halign: "center",
    //         },
    //         bodyStyles: {
    //             fontSize: 7,
    //         },
    //         footStyles: {
    //             fontSize: 8,
    //         },
    //         theme: "striped",
    //         margin: { top: 10 },
    //     });
    //     doc.save("institutions_status.pdf");
    // };
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
            <Box sx={{ marginTop: '10px', marginBottom: "5px", display: "flex", gap: 2 }}>
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
                                // onClick={exportToExcel}
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
                                // onClick={exportToPDF}
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
                                rowSpan={3}
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
                                rowSpan={3}
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
                                rowSpan={3}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Total appeared
                            </TableCell>
                            <TableCell
                                rowSpan={3}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Total passed
                            </TableCell>
                            <TableCell
                                colSpan={6}
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
                                colSpan={18}
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
                                colSpan={2}
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
                                colSpan={2}
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
                                colSpan={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Others
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
                                    colSpan={2}
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
                    
                            {Array(9).fill(0).map((_, index) => (
                                <>
                                    <TableCell
                                        key={`ethnicity-appeared-${index}`}
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
                                        key={`ethnicity-passed-${index}`}
                                        sx={{
                                            border: "1px solid #ddd",
                                            color: "#ffffff",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Passed
                                    </TableCell>
                                </>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.level}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.program}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.totalAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.totalPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.maleAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.malePassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.femaleAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.femalePassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.otherGenderAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.otherGenderPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.edjAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.edjPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.chhetriAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.chhetriPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.brahmanAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.brahmanPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.madhesiAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.madhesiPassed}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.dalitAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.dalitPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.muslimAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.muslimPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.tharuAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.tharuPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.janajatiAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.janajatiPassed}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.otherEthnicityAppeared}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {row.otherEthnicityPassed}
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
                        {/* {
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
                        } */}
                    </TableRow>
                </Table>
            </TableContainer>
        </div>
    );
};

export default PassedStdReport;
