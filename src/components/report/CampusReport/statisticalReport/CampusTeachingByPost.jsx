import React, { useState, useEffect } from "react";
import {
    Grid,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Popover,
    Box,
} from "@mui/material";
import { FileDownload, InsertDriveFile, PictureAsPdf } from "@mui/icons-material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { fetchTeacherReportByJoiningType } from "../../reportApi";


function CampusTeachingByPost({ fiscalId }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [apiData, setApiData] = useState([]);

    const fetchData = async () => {
        const response = await fetchTeacherReportByJoiningType(fiscalId)
        if (response) {
            const transformData = response ? response.reports.map(item => ({
                university: item.university,
                teachers: {
                    permanent: item.positions?.permanent || 0,
                    temporary: item.positions?.temporary || 0,
                    contract: item.positions?.contract || 0,
                    partTime: item.positions?.partTime || 0,
                    total: item?.total || 0
                }
            })) : []
            setApiData(transformData)
        } else {
            setApiData([])
        }
    }
    useEffect(() => {
        fetchData()
    }, [fiscalId])

    const rowGrandTotal = apiData.reduce(
        (acc, item) => {
            Object.keys(item.teachers).forEach((key) => {
                acc[key] = (acc[key] || 0) + item.teachers[key];
            });
            return acc;
        },
        {}
    );

    // Export to Excel
    const exportToExcel = () => {
        const header = [["S.No.", "University", "Permanent", "Temporary", "Part-time", "Total"]];
        const data = apiData.map((item, index) => [
            index + 1,
            item.university,
            item.teachers.permanent,
            item.teachers.temporary,
            item.teachers.partTime,
            item.teachers.total,
        ]);
        const grandTotalRow = [
            "Grand Total",
            "",
            rowGrandTotal.permanent,
            rowGrandTotal.temporary,
            rowGrandTotal.partTime,
            rowGrandTotal.total,
        ];

        const ws = XLSX.utils.aoa_to_sheet([...header, ...data, grandTotalRow]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Teachers By Contract");
        XLSX.writeFile(wb, "teachers_by_contract.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        const columns = ["S.No.", "University", "Permanent", "Temporary", "Part-time", "Total"];
        const data = apiData.map((item, index) => [
            index + 1,
            item.university,
            item.teachers.permanent,
            item.teachers.temporary,
            item.teachers.partTime,
            item.teachers.contract,
            item.teachers.total,
        ]);
        const grandTotalRow = [
            "Grand Total",
            "",
            rowGrandTotal.permanent,
            rowGrandTotal.temporary,
            rowGrandTotal.partTime,
            rowGrandTotal.contract,
            rowGrandTotal.total,
        ];
        // doc.autoTable(columns, [...data, grandTotalRow]);
        doc.autoTable({
            head: [columns],
            body: [...data, grandTotalRow],
            styles: {
                lineColor: "#c2c2c2", 
                lineWidth: 0.2,       
                cellPadding: 1,       
            },
            headStyles: {
               fontSize:8
            },
            bodyStyles: {
               fontSize:7
            },
        });
        doc.save("teachers_by_contract.pdf");
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
            <Grid container justifyContent="right">
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
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
                            variant="contained"
                            sx={{ backgroundColor: "#272727" }}
                            startIcon={<PictureAsPdf />}
                            onClick={exportToPDF}
                            fullWidth
                        >
                            PDF
                        </Button>
                    </Box>
                </Popover>
            </Grid>
            <TableContainer sx={{ border: "1px solid #ddd" }}>
                <Table>
                    <TableHead style={{ backgroundColor: "#2A629A" }}>
                        <TableRow>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    textAlign: "center",
                                    width: '1rem'
                                }}
                            >S.No.</TableCell>
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    textAlign: "center",
                                    width: '1rem'
                                }}>University</TableCell>
                            <TableCell
                                colSpan={4}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    textAlign: "center",
                                    width: '1rem'
                                }}
                            >Joining Type</TableCell>

                            <TableCell
                                rowSpan={2}
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    textAlign: "center",
                                    width: '1rem'
                                }}
                            >Total</TableCell>
                        </TableRow>
                        <TableRow >

                            <TableCell sx={{
                                border: "1px solid #ddd",
                                color: "#ffffff",
                                textAlign: "center",
                                width: '1rem'
                            }}>Permanent</TableCell>
                            <TableCell sx={{
                                border: "1px solid #ddd",
                                color: "#ffffff",
                                textAlign: "center",
                                width: '1rem'
                            }}>Temporary</TableCell>
                            <TableCell sx={{
                                border: "1px solid #ddd",
                                color: "#ffffff",
                                textAlign: "center",
                                width: '1rem'
                            }}>Part-time</TableCell>
                            <TableCell sx={{
                                border: "1px solid #ddd",
                                color: "#ffffff",
                                textAlign: "center",
                                width: '1rem'
                            }}>Contract</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiData.map((item, index) => (
                            <TableRow key={item.university}>
                                <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                                <TableCell sx={{
                                    border: "1px solid #ddd",
                                    color: "black",
                                    textAlign: "left",
                                }}>
                                    {item.university}
                                </TableCell>
                                <TableCell sx={{
                                    textAlign: "right",
                                    border: "1px solid #ddd",
                                }}>{item.teachers.permanent}</TableCell>
                                <TableCell sx={{ textAlign: "right", border: '1px solid #ddd' }}>{item.teachers.temporary}</TableCell>
                                <TableCell sx={{ textAlign: "right", border: '1px solid #ddd' }}>{item.teachers.partTime}</TableCell>
                                <TableCell sx={{ textAlign: "right", border: '1px solid #ddd' }}>{item.teachers.contract}</TableCell>
                                <TableCell sx={{ textAlign: "right", border: '1px solid #ddd' }}>{item.teachers.total}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                            <TableCell colSpan={2} sx={{ textAlign: "right", fontWeight: "bold" }}>
                                Grand Total
                            </TableCell>
                            <TableCell sx={{ textAlign: "right", border: '1px solid #ddd' }}>{rowGrandTotal.permanent}</TableCell>
                            <TableCell sx={{ textAlign: "right", border: '1px solid #ddd' }}>{rowGrandTotal.temporary}</TableCell>
                            <TableCell sx={{ textAlign: "right", border: '1px solid #ddd' }}>{rowGrandTotal.partTime}</TableCell>
                            <TableCell sx={{ textAlign: "right", border: '1px solid #ddd' }}>{rowGrandTotal.contract}</TableCell>
                            <TableCell sx={{ textAlign: "right", border: '1px solid #ddd' }}>{rowGrandTotal.total}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default CampusTeachingByPost;