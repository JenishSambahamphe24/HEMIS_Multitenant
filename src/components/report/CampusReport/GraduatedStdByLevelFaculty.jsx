
// 3.9 Report
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
import { useEffect } from "react";
import React, { useState } from "react";
import { FileDownload, InsertDriveFile } from "@mui/icons-material";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { getGraduationDataByGender } from "./CampusServices";
import { getFiscalYearForSelection } from "../../../services/services";
import { useSelector } from "react-redux";

const GraduatedStdByLevelFaculty = () => {
      const { currentUser } = useSelector((state) => state.user);
    const [selectedFaculty, setSelectedFaculty] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [anchorEl, setAnchorEl] = useState(null);
    const [apiData, setApiData] = useState([]);

    const [data, setData] = React.useState([]);
    const [selectedYear, setSelectedYear] = React.useState("");
    const [selectedFiscalYearId, setSelectedFiscalYearId] = React.useState(0);
    const campusId = currentUser.institution.id;
 
    const handleYearChange = (event) => {
        const selectedYearValue = event.target.value;
        const selectedYearItem = data.find(
            (item) => item.yearNepali === selectedYearValue
        );
        setSelectedYear(selectedYearValue);
        setSelectedFiscalYearId(selectedYearItem ? selectedYearItem.id : "");
    };

    useEffect(() => {
        const fetchQueryData = async () => {
            try {
                const fiscalYear = await getFiscalYearForSelection()
                const activeFiscalYear = fiscalYear.find(
                    (item) => item.activeFiscalYear === true
                );
                setData(fiscalYear);
                if (activeFiscalYear) {
                    setSelectedYear(activeFiscalYear.yearNepali);
                    setSelectedFiscalYearId(activeFiscalYear.id);
                } else if (fiscalYear.length > 0) {
                    setSelectedYear(fiscalYear[0].yearNepali);
                    setSelectedFiscalYearId(fiscalYear[0].id);
                }
            } catch (error) {
                console.log(error)
            }
        };
        fetchQueryData()
    }, [])

    const fetchData = async () => {
        const response = await getGraduationDataByGender({fiscalId:selectedFiscalYearId, campusId})
        if (response) {
            setApiData(response)
        } else {
            setApiData([])
        }
    }
    useEffect(() => {
        fetchData()
    }, [selectedFiscalYearId, campusId])

    const rows = apiData.map(item => ({
        level: item.level,
        faculty: item.faculty,
        program: item.program,
        female: item.female,
        male: item.male,
        other: item.others,
        total: item.total
    }));
    const facultyNames = [...new Set(rows.map(item => item.faculty))];

    const levelNames = [...new Set(rows.map(item => item.level))];
    const filteredRows = rows.filter((row) => {
        return (
            (selectedFaculty === "All" || row.faculty === selectedFaculty) &&
            (selectedLevel === "All" || row.level === selectedLevel)
        );
    });

    const totals = filteredRows.reduce(
        (acc, curr) => {
            acc.male += curr.male;
            acc.female += curr.female;
            acc.other += curr.other;
            acc.total += curr.total;
            return acc;
        },
        {
            male: 0,
            female: 0,
            other: 0,
            total: 0,
        }
    );

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const header = [
            [
                "S.No.",
                "Program",
                "Male",
                "Female",
                "Other",
                "Total",
            ],
        ];
        XLSX.utils.sheet_add_aoa(worksheet, header, { origin: "A1" });
        rows.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.program,
                row.male,
                row.female,
                row.other,
                row.total,
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 2}` });
        });
        const totalsRow = [
            "",
            "Total",
            totals.male,
            totals.female,
            totals.other,
            totals.total,
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [totalsRow], { origin: `A${rows.length + 2}` });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CampusTypeByFaculty");
        XLSX.writeFile(workbook, "CampusTypeByFaculty.xlsx");
        handleClose();
    };
    const open = Boolean(anchorEl);
    const id = open ? "export-popover" : undefined;
    return (
        <div>
            <Box sx={{ marginBottom: "5px", display: "flex", gap: 2 }}>
                <FormControl fullWidth sx={{ maxWidth: "20%" }} size="small">
                    <InputLabel>Select Fiscal Year</InputLabel>
                    <Select
                        size="small"
                        label="Select Fiscal Year"
                        value={selectedYear}
                        onChange={handleYearChange}
                    >
                        <MenuItem disabled value="">
                            Select Fiscal Year
                        </MenuItem>
                        {data.map((item) => (
                            <MenuItem key={item.id} value={item.yearNepali}>
                                {item.yearNepali}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
                                colSpan={4}
                            >
                                Gender
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
                                Other
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
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.male}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.female}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.other}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.total}
                                </TableCell>

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
                                {totals.other}
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
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );
};

export default GraduatedStdByLevelFaculty;


