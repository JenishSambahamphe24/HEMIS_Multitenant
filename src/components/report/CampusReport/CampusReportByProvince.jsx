import React, { useEffect, useState } from "react";
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
}
    from "@mui/material";
import {
    FileDownload,
    PictureAsPdf,
    InsertDriveFile,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getProvinceWiseEnrollment } from "./CampusServices";

function CampusReportByProvince({ fiscalId }) {
    const [apiData, setApiData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const fetchData = async () => {
        const response = await getProvinceWiseEnrollment(fiscalId)
        if (response) {
            const correctedResponse = response.map(item => ({
                ...item,
                facultyName:item.universityName,
            }))
            setApiData(correctedResponse.sort((a,b) => a.facultyName.localeCompare(b.facultyName)))
        } else {
            setApiData([])
        }
    }
    useEffect(() => {
        fetchData();
    }, [fiscalId]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); 
    };

    const handleClose = () => {
        setAnchorEl(null); 
    };
    const open = Boolean(anchorEl);
    const id = open ? "export-popover" : undefined;
    const totals = Array.isArray(apiData)
        ? apiData.reduce(
            (acc, row) => {
                acc.koshi += row.koshi;
                acc.madhesh += row.madesh;
                acc.bagmati += row.bagmati;
                acc.gandaki += row.gandaki;
                acc.lumbini += row.lumbini;
                acc.karnali += row.karnali;
                acc.sudurpaschim += row.sudurpaschim;
                return acc;
            },
            {
                koshi: 0,
                madhesh: 0,
                bagmati: 0,
                gandaki: 0,
                lumbini: 0,
                karnali: 0,
                sudurpaschim: 0,
            }
        )
        : {
            koshi: 0,
            madhesh: 0,
            bagmati: 0,
            gandaki: 0,
            lumbini: 0,
            karnali: 0,
            sudurpaschim: 0,
        };
    const exportToExcel = () => {
        const header = [
            [
                "S.No.",
                "Faculty",
                "Koshi",
                "Madhesh",
                "Bagmati",
                "Gandaki",
                "Lumbini",
                "Karnali",
                "Sudurpashchim",
                "Total"
            ],
        ];

        const data = apiData.map((row, index) => [
            index + 1,
            row.facultyName,
            row.koshi,
            row.madhesh,
            row.bagmati,
            row.gandaki,
            row.lumbini,
            row.karnali,
            row.sudurpaschim,
            row.koshi +
            row.madesh +
            row.bagmati +
            row.gandaki +
            row.lumbini +
            row.karnali +
            row.sudurpaschim,
        ]);
        const grandTotalRow = [
            "",
            "Grand Total",
            totals.koshi,
            totals.madhesh,
            totals.bagmati,
            totals.gandaki,
            totals.lumbini,
            totals.karnali,
            totals.sudurpaschim,
            totals.koshi +
            totals.madhesh +
            totals.bagmati +
            totals.gandaki +
            totals.lumbini +
            totals.karnali +
            totals.sudurpaschim,
        ];
        data.push(grandTotalRow);

        const ws = XLSX.utils.aoa_to_sheet([...header, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Province Wise");
        XLSX.writeFile(wb, "province_wise.xlsx");
    };

    // Export data to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        const columns = [
            "S.No.",
            "Faculty",
            "Koshi",
            "Madhesh",
            "Bagmati",
            "Gandaki",
            "Lumbini",
            "Karnali",
            "Sudurpaschim",
            "Total"
        ];
        const data = apiData.map((row, index) => [
            index + 1,
            row.facultyName,
            row.koshi,
            row.madesh,
            row.bagmati,
            row.gandaki,
            row.lumbini,
            row.karnali,
            row.sudurpaschim,
            row.koshi +
            row.madesh +
            row.bagmati +
            row.gandaki +
            row.lumbini +
            row.karnali +
            row.sudurpaschim,
        ]);
        const grandTotalRow = [
            "",
            "Grand Total",
            totals.koshi,
            totals.madhesh,
            totals.bagmati,
            totals.gandaki,
            totals.lumbini,
            totals.karnali,
            totals.sudurpaschim,
            totals.koshi +
            totals.madhesh +
            totals.bagmati +
            totals.gandaki +
            totals.lumbini +
            totals.karnali +
            totals.sudurpaschim,
        ];
        data.push(grandTotalRow);
        doc.autoTable({
            head: [columns],
            body: data,
            styles: {
                lineColor: "#c2c2c2",
                lineWidth: 0.2,
                cellPadding: 1,
            },
            headStyles: {
                fontSize: 8
            },
            bodyStyles: {
                fontSize: 7
            },
        });
        doc.save("province_wise.pdf");
    };


    return (
        <div>
            <Grid container justifyContent="right">
                <Button
                    variant="contained"
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
                            >
                                Koshi
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Madhesh
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Bagmati
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Gandaki
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Lumbini
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Karnali
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Sudurpashchim
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
                        {apiData.map((row, index) => {
                            const rowTotal =
                                row.koshi +
                                row.madesh +
                                row.bagmati +
                                row.gandaki +
                                row.lumbini +
                                row.karnali +
                                row.sudurpaschim;

                            return (
                                <TableRow key={row.sn}>
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
                                        {row.facultyName}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.koshi}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.madesh}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.bagmati}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.gandaki}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.lumbini}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.karnali}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.sudurpaschim}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            border: "1px solid #c2c2c2",
                                            padding: "4px",
                                            textAlign: "right",
                                        }}
                                    >
                                        {rowTotal}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>

                    {/* Grand Total Row */}
                    <TableRow style={{ backgroundColor: "#c2c2c2" }}>
                        <TableCell
                            colSpan={2}
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "center",
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
                            {totals.koshi}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.madhesh}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.bagmati}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.gandaki}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.lumbini}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.karnali}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.sudurpaschim}
                        </TableCell>
                        <TableCell
                            sx={{
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "right",
                            }}
                        >
                            {totals.koshi +
                                totals.madhesh +
                                totals.bagmati +
                                totals.gandaki +
                                totals.lumbini +
                                totals.karnali +
                                totals.sudurpaschim}
                        </TableCell>
                    </TableRow>
                </Table>
            </TableContainer>
        </div>
    )
}

export default CampusReportByProvince