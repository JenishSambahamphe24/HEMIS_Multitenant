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
import { getEnrollmentByEcobelts } from "./CampusServices";

const ProgramByEcoBelts = ({ fiscalId }) => {
    const [selectedFaculty, setSelectedFaculty] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [anchorEl, setAnchorEl] = useState(null);
    const [apiData, setApiData] = useState([]);

    useEffect(() => {
    const fetchData = async() => {
        const response = await getEnrollmentByEcobelts(fiscalId)
        if(response){
            setApiData(response)
        } else {
            setApiData([])
        }
    };
    fetchData()
    }, [fiscalId])

    const mappedRow = apiData.map((item) =>
        item.programs.map((program) => ({
            faculty: item.faculty,
            level: item.level,
            program: program.program,
            hillMale: program.students.Hill.male,
            hillFemale: program.students.Hill.female,
            hillOthers: program.students.Hill.other,
            hillTotal: program.students.Hill.total,
            mountainMale: program.students.Mountain.male,
            mountainFemale: program.students.Mountain.female,
            mountainOthers: program.students.Mountain.other,
            mountainTotal: program.students.Mountain.total,
            teraiMale: program.students.Tarai.male,
            teraiFemale: program.students.Tarai.female,
            teraiOthers: program.students.Tarai.other,
            teraiTotal: program.students.Tarai.total,
        }))
    ).flat();

    const rows = mappedRow.sort((a,b) => a.program.localeCompare(b.program))
    
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
            acc.hillMale += curr.hillMale;
            acc.hillFemale += curr.hillFemale;
            acc.hillOthers += curr.hillOthers;
            acc.hillTotal += curr.hillTotal;

            acc.mountainMale += curr.mountainMale;
            acc.mountainFemale += curr.mountainFemale;
            acc.mountainOthers += curr.mountainOthers;
            acc.mountainTotal += curr.mountainTotal;

            acc.teraiMale += curr.teraiMale;
            acc.teraiFemale += curr.teraiFemale;
            acc.teraiOthers += curr.teraiOthers;
            acc.teraiTotal += curr.teraiTotal;
            acc.grandTotal += curr.teraiTotal + curr.mountainTotal + curr.hillTotal;
            return acc;
        },
        {
            hillMale: 0,
            hillFemale: 0,
            hillOthers: 0,
            hillTotal: 0,
            mountainMale: 0,
            mountainFemale: 0,
            mountainOthers: 0,
            mountainTotal: 0,
            teraiMale: 0,
            teraiFemale: 0,
            teraiOthers: 0,
            teraiTotal: 0,
            grandTotal: 0
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
                "Faculty",
                "Mountain-Male",
                "Mountain-Female",
                "Mountain-Other",
                "Mountain-Total",
                "Hill-Male",
                "Hill-Female",
                "Hill-Other",
                "Hill-Total",
                "Terai-Male",
                "Terai-Female",
                "Terai-Other",
                "Terai-Total",
                "Total",
            ],
        ];
        XLSX.utils.sheet_add_aoa(worksheet, header, { origin: "A1" });
        rows.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.campusType,
                row.mountainMale,
                row.mountainFemale,
                row.mountainOther,
                row.mountainTotal,
                row.hillMale,
                row.hillFemale,
                row.hillOther,
                row.hillTotal,
                row.teraiMale,
                row.teraiFemale,
                row.teraiOther,
                row.teraiTotal,
                row.mountainTotal + row.hillTotal + row.teraiTotal,
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 2}` });
        });
        const totalsRow = [
            "",
            "Total",
            totals.mountainMale,
            totals.mountainFemale,
            totals.mountainOther,
            totals.mountainTotal,
            totals.hillMale,
            totals.hillFemale,
            totals.hillOther,
            totals.hillTotal,
            totals.teraiMale,
            totals.teraiFemale,
            totals.teraiOther,
            totals.teraiTotal,
            totals.grandTotal,
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
                                rowSpan={3}
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
                                rowSpan={3}
                            >
                                Program
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
                                colSpan={4}
                            >
                                Mountain
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
                                Hill
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
                                Terai
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
                                Total
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
                        {filteredRows.map((row, index) => (
                            <TableRow key={row.id}>
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
                                        textAlign: "right",
                                    }}
                                >
                                    {row.mountainMale}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.mountainFemale}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.mountainOthers}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.mountainTotal}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.hillMale}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.hillFemale}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.hillOthers}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.hillTotal}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.teraiMale}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.teraiFemale}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.teraiOthers}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.teraiTotal}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.mountainTotal + row.hillTotal + row.teraiTotal}
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
                                {totals.mountainMale}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.mountainFemale}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.mountainOthers}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.mountainTotal}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.hillMale}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.hillFemale}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.hillOthers}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.hillTotal}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.teraiMale}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.teraiFemale}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.teraiOthers}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.teraiTotal}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    textAlign: "right",
                                }}
                            >
                                {totals.grandTotal}
                            </TableCell>
                        </TableRow>
                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    );
};

export default ProgramByEcoBelts;
