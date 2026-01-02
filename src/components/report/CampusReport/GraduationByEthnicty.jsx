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
    Autocomplete,
    TextField,
    MenuItem
} from "@mui/material";
import { useEffect } from "react";
import React, { useState } from "react";
import { FileDownload, InsertDriveFile } from "@mui/icons-material";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { getGraduationDataByEthnicity } from "./CampusServices";
import { getFiscalYearForSelection } from "../../../services/services";
import { useSelector } from "react-redux";

const GraduationByEthnicity = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [selectedFaculty, setSelectedFaculty] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [anchorEl, setAnchorEl] = useState(null);
    const [apiData, setApiData] = useState([]);

    const [data, setData] = React.useState([]);
    const [selectedYear, setSelectedYear] = React.useState("");
    const [selectedFiscalYearId, setSelectedFiscalYearId] = React.useState(0);
    const campusId = currentUser?.institution?.id;


    useEffect(() => {
        const fetchData = async () => {
            const response = await getGraduationDataByEthnicity({ fiscalId: selectedFiscalYearId, campusId })
            if (response) {
                setApiData(response)
            } else {
                setApiData([])
            }
        }
        fetchData()
    }, [selectedFiscalYearId, campusId])



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

    const rows = apiData?.map((item, index) => ({
        level: item.level,
        faculty: item.faculty,
        program: item.program,
        total: item.total,
        chhetri: item?.ethnicityCounts?.Chhetri,
        brahman: item?.ethnicityCounts?.Brahman,
        madhesi: item?.ethnicityCounts?.Madhesi,
        dalit: item?.ethnicityCounts?.Dalit,
        muslim: item?.ethnicityCounts?.Muslim,
        tharu: item?.ethnicityCounts?.Tharu,
        janajati: item?.ethnicityCounts?.Janajati,
        others: item?.ethnicityCounts?.Others,
    }))
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
            acc.chhetri += curr.chhetri;
            acc.brahman += curr.brahman;
            acc.janajati += curr.janajati;
            acc.madhesi += curr.madhesi;
            acc.muslim += curr.muslim;
            acc.tharu += curr.tharu;
            acc.dalit += curr.dalit;
            acc.total += curr.total;
            return acc;
        },
        {
            chhetri: 0,
            brahman: 0,
            janajati: 0,
            madhesi: 0,
            muslim: 0,
            tharu: 0,
            dalit: 0,
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
        const worksheet = XLSX.utils.aoa_to_sheet([]);
        const header = [
            [
                "S.No.",
                "Program",
                "Chhetri",
                "Brahman",
                "Janajati",
                "Muslim",
                "Madhesi",
                "Dalit",
                "Tharu",
                "Total",
            ],
        ];
        XLSX.utils.sheet_add_aoa(worksheet, header, { origin: "A1" });
        rows.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.program,
                row.chhetri || 0,
                row.brahman || 0,
                row.janajati || 0,
                row.muslim || 0,
                row.madhesi || 0,
                row.dalit || 0,
                row.tharu || 0,
                row.total || 0,
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 2}` });
        });

        const totalsRow = [
            "",
            "Total",
            totals.chhetri || 0,
            totals.brahman || 0,
            totals.janajati || 0,
            totals.muslim || 0,
            totals.madhesi || 0,
            totals.dalit || 0,
            totals.tharu || 0,
            totals.total || 0,
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
                                colSpan={8}
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
                                Chhetri
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Brahman
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Janajati
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Muslim
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Madhesi
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Dalit
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #ddd",
                                    color: "#ffffff",
                                    padding: "4px",
                                    textAlign: "center",
                                }}
                            >
                                Tharu
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
                                    {item.chhetri}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.brahman}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.janajati}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.muslim}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.madhesi}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.dalit}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #c2c2c2",
                                        padding: "4px",
                                        textAlign: 'right',
                                    }}
                                >
                                    {item.tharu}
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
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: 'right',
                                }}
                            >
                                {totals.chhetri}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: 'right',
                                }}
                            >
                                {totals.brahman}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: 'right',
                                }}
                            >
                                {totals.janajati}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: 'right',
                                }}
                            >
                                {totals.muslim}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: 'right',
                                }}
                            >
                                {totals.madhesi}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: 'right',
                                }}
                            >
                                {totals.dalit}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: 'right',
                                }}
                            >
                                {totals.tharu}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #c2c2c2",
                                    padding: "4px",
                                    textAlign: 'right',
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

export default GraduationByEthnicity;


