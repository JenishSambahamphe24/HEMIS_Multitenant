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
import { getNonTeachingReportBySection } from "./CampusServices";

const NonTeachingBySection = ({ fiscalId }) => {
    const [rows, setRows] = useState([])
    const fetchData = async () => {
        const response = await getNonTeachingReportBySection(fiscalId);
        if (response) {
            setRows(response.sort((a,b) => a.position.localeCompare(b.position)))
        } else {
            setRows([])
        }
    };
    useEffect(() => {
        fetchData()
    }, [fiscalId])
    const [anchorEl, setAnchorEl] = useState(null);

    const totals = rows.reduce((acc, row) => {
        acc.male += row.male;
        acc.female += row.female;
        acc.other += row.other;
        acc.total += row.total;
        return acc;
    }, { male: 0, female: 0, other: 0, total: 0 });

    const exportToExcel = () => {
        const excelData = [
            [
                "S.No.",
                "Position",
                "Male",
                "Female",
                "Others",
                "Total",
            ],
            ...rows.map((row, index) => [
                index + 1,
                row.position,
                row.male,
                row.female,
                row.others,
                row.total,
            ]),
            [
                "", 
                "Grand Total",
                totals.male,
                totals.female,
                totals.other,
                totals.total,
            ],
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
                "Position",
                "Male",
                "Female",
                "Others",
                "Total",
            ],
        ];
        const tableBody = rows.map((row, index) => [
            index + 1,
            row.position,
            row.male,
            row.female,
            row.others,
            row.total,
        ]);
        tableBody.push([
            "",
            "Grand Total",
            totals.male,
            totals.female,
            totals.other,
            totals.total,
        ]);
        doc.autoTable({
            head: tableHead,
            body: [...tableBody],
            styles: {
                lineColor: "#c2c2c2",
                lineWidth: 0.2,
                cellPadding: 1,
            },
            headStyles: {
                fontSize: 12,
                fillColor: [42, 98, 154], // Match your table header color
                textColor: "#ffffff",
            },
            bodyStyles: {
                fontSize: 10
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
                                Section
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
                            </TableCell>   <TableCell
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
                            ))
                        }
                        <TableRow >
                            <TableCell
                                colSpan={2}
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Grand Total
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.male}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.female}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.other}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.total}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default NonTeachingBySection;