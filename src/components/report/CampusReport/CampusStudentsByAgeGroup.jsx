
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
import { getGraduationDataByAgeGroup } from "./CampusServices";
import { getFacultyByUniId, getLevelByUniId, getProgramByCollegeId } from "../../../services/services";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";

const CampusStudentsByAgeGroup = ({ fiscalId }) => {
    const [loading, setLoading] = useState(false)
    const { currentUser } = useSelector((state) => state.user);
    const collegeId = currentUser.institution.id
    const uniId = currentUser.institution.universityId
    const [programId, setProgramId] = useState(0)
    const [levelId, setLevelId] = useState(0)
    const [facultyId, setFacultyId] = useState(0)

    const [allPrograms, setAllPrograms] = useState([])
    const [allFaculty, setAllFaculty] = useState([])
    const [allLevel, setAllLevel] = useState([])

    const [anchorEl, setAnchorEl] = useState(null);
    const [apiData, setApiData] = useState([]);

    useEffect(() => {
        const fetchFilterParams = async () => {
            const levelResponse = await getLevelByUniId(uniId)
            const facultyResponse = await getFacultyByUniId(uniId)
            const programResponse = await getProgramByCollegeId(collegeId)
            setAllLevel(levelResponse)
            setAllFaculty(facultyResponse)
            setAllPrograms(programResponse)
        };
        fetchFilterParams()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await getGraduationDataByAgeGroup({ fiscalId, levelId, facultyId, programId })
            if (response) {
                const ageOrder = ["Below 18", "18-22", "23-27","28-32","Above 32"]
                const sortedData = response
                    .filter(item => ageOrder.includes(item.ageGroup))
                    .sort((a, b) => ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup));
                setApiData(sortedData);
            } else {
                setApiData([])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    }
    useEffect(() => {
        fetchData();
    }, [fiscalId, levelId, facultyId, programId]);

    const totals = apiData.length > 0 && apiData.reduce(
        (acc, curr) => {
            acc.male += curr.male;
            acc.female += curr.female;
            acc.others += curr.others;
            acc.total += curr.total;
            return acc;
        },
        {
            male: 0,
            female: 0,
            others: 0,
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
        const exportData = apiData.map((row, index) => ({
            "S.No.": index + 1,
            "Age Group": row.ageGroup,
            "Program": row.program,
            "Male": row.male,
            "Female": row.female,
            "Others": row.others,
            "Total": row.total
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "student_by_age_group");
        XLSX.writeFile(workbook, "student_by_age_group.xlsx");
        handleClose();
    };
    const open = Boolean(anchorEl);
    const id = open ? "export-popover" : undefined;

    return (
        <div>
            <Box sx={{ marginBottom: "5px", display: "flex", gap: 2 }}>
                <FormControl fullWidth sx={{ maxWidth: "25%" }} size="small">
                    <InputLabel>Select Level</InputLabel>
                    <Select
                        size="small"
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 2,
                        }}
                        onChange={(e) => setLevelId(e.target.value)}
                        label="Select Level"
                    >
                        <MenuItem value=" ">All Levels</MenuItem>
                        {
                            allLevel.map((item, index) => (
                                <MenuItem key={item.id} value={item.id}>{item.levelName}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ maxWidth: "25%" }} size="small">
                    <InputLabel>Select Faculty</InputLabel>
                    <Select
                        size="small"
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 2,
                        }}
                        onChange={(e) => setFacultyId(e.target.value)}
                        label="Select Faculty"
                    >
                        <MenuItem value=" ">All Faculties</MenuItem>
                        {
                            allFaculty.map((item, index) => (
                                <MenuItem key={item.id} value={item.id}>{item.facultyName}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ maxWidth: "25%" }} size="small">
                    <InputLabel>Select Program</InputLabel>
                    <Select
                        size="small"
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 2,
                        }}
                        onChange={(e) => setProgramId(e.target.value)}
                        label="Select Program"
                    >
                        <MenuItem value=" ">All Programs</MenuItem>
                        {
                            allPrograms.map((item, index) => (
                                <MenuItem key={item.id} value={item.id}>{item.programName}</MenuItem>
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
                                    width: '30px',
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
                                Age Group
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
                                Total
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        loading ? (
                            <LoadingOverlay
                                visible={loading}
                                zIndex={100}
                                overlayProps={{ radius: "sm", blur: 1 }}
                                loaderProps={{ color: "#1976d2", type: "bars" }}
                            />
                        ) : (
                            <TableBody>
                                {apiData.length > 0 ? apiData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "left" }}>
                                            {item.ageGroup}
                                        </TableCell>
                                        <TableCell sx={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "right" }}>
                                            {item.male}
                                        </TableCell>
                                        <TableCell sx={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "right" }}>
                                            {item.female}
                                        </TableCell>
                                        <TableCell sx={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "right" }}>
                                            {item.others}
                                        </TableCell>
                                        <TableCell sx={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "right" }}>
                                            {item.total}
                                        </TableCell>
                                    </TableRow>
                                ))
                                    : (
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ border: "1px solid #c2c2c2", padding: "4px", textAlign: "center" }}>
                                                <h1 className="text-red-600">
                                                    No data available !!
                                                </h1>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
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
                                        {totals.others}
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
                        )
                    }
                </Table>
            </TableContainer>
        </div>
    );
};

export default CampusStudentsByAgeGroup;


