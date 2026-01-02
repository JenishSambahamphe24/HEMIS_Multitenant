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
    MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";
import { FileDownload, InsertDriveFile } from "@mui/icons-material";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { getDropoutOfLast5FY } from "../../../services/services";

const DropOutByFiscal = () => {
    const [selectedFaculty, setSelectedFaculty] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [anchorEl, setAnchorEl] = useState(null);
    const [apiData, setApiData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await getDropoutOfLast5FY();
            if (response && Array.isArray(response)) {
                setApiData(response);
            } else {
                setApiData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setApiData([]); // fallback
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fiscalYears = [
        ...new Set(
            (apiData || []).flatMap(item =>
                (item?.fiscalData || [])
                    .map(fiscal => {
                        const year = fiscal?.year;

                        if (typeof year !== "string") return null;
                        if (!/^\d{4}\/\d{2}$/.test(year)) return null;

                        return year;
                    })
                    .filter(Boolean)
            )
        )
    ].sort((a, b) => {
        const aYear = Number(a.split("/")[0]);
        const bYear = Number(b.split("/")[0]);

        return aYear - bYear;
    });

    const processData = () => {
        return (apiData || []).map(item => {
            const rowData = {
                program: item?.programName || "N/A",
                level: item?.level || "N/A",
                faculty: item?.faculty || "N/A",
            };

            (fiscalYears || []).forEach(year => {
                const fiscalData = (item?.fiscalData || []).find(fd => fd?.year === year);
                rowData[year] = fiscalData ? fiscalData.count : "0";
            });

            return rowData;
        });
    };

    const rows = processData() || [];
    const facultyNames = [...new Set(rows.map(item => item.faculty).filter(Boolean))];
    const levelNames = [...new Set(rows.map(item => item.level).filter(Boolean))];

    const filteredRows = rows.filter(row => {
        return (
            (selectedFaculty === "All" || row.faculty === selectedFaculty) &&
            (selectedLevel === "All" || row.level === selectedLevel)
        );
    });

    const calculateTotals = () => {
        const totals = {};
        (fiscalYears || []).forEach(year => {
            totals[year] = (filteredRows || []).reduce((sum, row) => {
                return sum + (parseInt(row?.[year] || 0) || 0);
            }, 0);
        });
        return totals;
    };

    const totals = calculateTotals();

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const exportToExcel = () => {
        if (!filteredRows?.length) return;

        const worksheet = XLSX.utils.json_to_sheet([]);
        const headers = ["S.No.", "Program", ...fiscalYears];
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        filteredRows.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.program || "N/A",
                ...fiscalYears.map(year => row?.[year] || 0)
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 2}` });
        });

        const totalsRow = ["", "Total", ...fiscalYears.map(year => totals?.[year] || 0)];
        XLSX.utils.sheet_add_aoa(worksheet, [totalsRow], { origin: `A${filteredRows.length + 2}` });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DropoutData");
        XLSX.writeFile(workbook, "DropoutData.xlsx");
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? "export-popover" : undefined;

    return (
        <div>
            {/* Filters */}
            <Box sx={{ marginBottom: "5px", display: "flex", gap: 2 }}>
                <FormControl fullWidth sx={{ maxWidth: "30%" }} size="small">
                    <InputLabel>Select Level</InputLabel>
                    <Select
                        size="small"
                        sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        label="Select Level"
                    >
                        <MenuItem value="All">All Level</MenuItem>
                        {levelNames.map((item, index) => (
                            <MenuItem key={index} value={item}>{item}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ maxWidth: "30%" }} size="small">
                    <InputLabel>Select Faculty</InputLabel>
                    <Select
                        size="small"
                        sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                        value={selectedFaculty}
                        onChange={(e) => setSelectedFaculty(e.target.value)}
                        label="Select Faculty"
                    >
                        <MenuItem value="All">All Faculty</MenuItem>
                        {facultyNames.map((item, index) => (
                            <MenuItem key={index} value={item}>{item}</MenuItem>
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
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
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

            {/* Table */}
            <TableContainer sx={{ border: "1px solid #ddd" }}>
                <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
                    <TableHead style={{ backgroundColor: "#2A629A" }}>
                        <TableRow>
                            <TableCell sx={{ border: "1px solid #ddd", color: "#ffffff", padding: "4px", textAlign: "center" }} rowSpan={2}>
                                S.No.
                            </TableCell>
                            <TableCell sx={{ border: "1px solid #ddd", color: "#ffffff", padding: "4px", textAlign: "center" }} rowSpan={2}>
                                Program
                            </TableCell>
                            <TableCell sx={{ border: "1px solid #ddd", color: "#ffffff", padding: "4px", textAlign: "center" }} colSpan={fiscalYears.length}>
                                Last 5 fiscal years
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {fiscalYears.map((year, index) => (
                                <TableCell key={index} sx={{ border: "1px solid #ddd", color: "#ffffff", padding: "4px", textAlign: "center" }}>
                                    {year}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    {filteredRows.length > 0 ? (
                        <TableBody>
                            {filteredRows.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ border: "1px solid #c2c2c2", padding: "4px" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ border: "1px solid #c2c2c2", padding: "4px" }}>
                                        {item.program || "N/A"}
                                    </TableCell>
                                    {fiscalYears.map((year, yearIndex) => (
                                        <TableCell key={yearIndex} sx={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "right" }}>
                                            {item?.[year] || 0}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            <TableRow sx={{ backgroundColor: "#c2c2c2" }}>
                                <TableCell colSpan={2} sx={{ border: "1px solid #ddd", padding: "4px", textAlign: "center" }}>
                                    Grand Total
                                </TableCell>
                                {fiscalYears.map((year, yearIndex) => (
                                    <TableCell key={yearIndex} sx={{ border: "1px solid #ddd", padding: "4px", textAlign: "right" }}>
                                        {totals?.[year] || 0}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={fiscalYears.length + 2} style={{ textAlign: "center" }}>
                                    No Dropout students
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
        </div>
    );
};


export default DropOutByFiscal;