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
import { getTeachersByDepartments } from "./CampusServices";

const TeacherByDepartment = () => {
    const [rows, setRows] = useState([])
    const fetchData = async () => {
        const response = await getTeachersByDepartments();

        if (response) {
            setRows(response)
        } else {
            setRows([])
        }
    };
    useEffect(() => {
        fetchData()
    }, [])
    const [anchorEl, setAnchorEl] = useState(null);

    const exportToExcel = () => {
        const excelData = [
            [
                "S.No.",
                "Department",
                "Male",
                "Female",
                "Others",
                "Total Teachers",
                "Total Students",
            ],
            ...rows.map((row, index) => {
                return [
                    index + 1,
                    row.position,
                    row.male,
                    row.female,
                    row.other,
                    row.total,
                ];
            }),
        ];
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Teaching Staff Data");
        XLSX.writeFile(wb, "Teaching_Staff_Data.xlsx");
    };
    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableHead = [
            [
                "S.No.",
                "Department",
                "Male",
                "Female",
                "Others",
                "Total Teachers",
            ],
        ];
        const tableBody = rows.map((row, index) => {
            const ratio =
                row.totalStudents !== 0 && row.total !== 0
                    ? (row.totalStudents / row.total).toFixed(2)
                    : "0";
            return [
                index + 1,
                row.position,
                row.male,
                row.female,
                row.other,
                row.total,
            ];
        });

        doc.autoTable({
            head: tableHead,
            body: tableBody,
            styles: {
                lineColor: "#c2c2c2",
                lineWidth: 0.2,
                cellPadding: 1,
            },
            headStyles: {
                fontSize: 12,
                fillColor: [42, 98, 154],
                textColor: "#ffffff",
            },
            bodyStyles: {
                fontSize: 10,
            },
        });

        doc.save("Teaching_Staff_Data.pdf");
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
                                Department
                            </TableCell>

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
                                Total Teachers
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            rows.map((item, index) => {
                                const ratio =
                                    item.totalStudents !== 0 && item.total !== 0
                                        ? (item.totalStudents / item.total).toFixed(2)
                                        : "0";

                                return (
                                    <TableRow key={index}>
                                        <TableCell
                                            sx={{
                                                border: "1px solid #c2c2c2",
                                                padding: "4px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {index !== rows.length - 1 ? index + 1 : ""}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                border: "1px solid #c2c2c2",
                                                padding: "4px",
                                                textAlign: "left",
                                            }}
                                        >
                                            {item.position}
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
                                            {item.other}
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
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TeacherByDepartment;