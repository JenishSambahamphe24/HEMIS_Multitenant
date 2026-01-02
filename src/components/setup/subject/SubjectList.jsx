import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  FormControl,
  TablePagination,
} from "@mui/material";
import { getCollegePrograms, getSubject } from "../../../services/services";
import axios from "axios";
import EditSubjectDialog from "./EditSubject";
import { getMajorSubsByProgramId } from "../../dashboard/services/service";
import EditGroups from "./EditGroups";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const SubjectList = ({ refreshTrigger }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [getSubjectData, setGetSubjectData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openGroupDialog, setopenGroupDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [semester, setSemester] = useState([]);
  const [year, setYear] = useState([]);
  const [programFilter, setProgramFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [programId, setProgramId] = useState(0);
  const [majorSubId, setMajorsubId] = useState("");
  const [groups, setGroups] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getSubject();
      setGetSubjectData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchAllprograms = async () => {
    try {
      const response = await getCollegePrograms();
      setProgramData(response);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSemesterYearData = async () => {
    try {
      const config = getAuthConfigSafe()
      const [semesterData, yearData] = await Promise.all([
        axios.get(`${backendUrl}/StudentUpgrade/Semesters`, config),
        axios.get(`${backendUrl}/StudentUpgrade/Years`, config),
      ]);
      setSemester(semesterData.data);
      setYear(yearData.data);
    } catch (err) {
      console.log(err);
    }
  };

  const selectedProgram = programFilter && programFilter.id;

  const fetchGroupsByProgramId = async () => {
    try {
      const response = await getMajorSubsByProgramId(selectedProgram);
      setGroups(response || []);
    } catch (err) {
      console.log(err);
      setGroups([]);
    }
  };

  useEffect(() => {
    if (selectedProgram) {
      fetchGroupsByProgramId();
    } else {
      setGroups([]);
    }
  }, [selectedProgram]);

  useEffect(() => {
    fetchAllprograms();
  }, []);

  useEffect(() => {
    fetchSemesterYearData();
  }, []);

  const handleEditClick = (subject) => {
    setSelectedSubject(subject);
    setOpenDialog(true);
    setProgramId();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedSubject(null);
  };

  const handleEDitGroupOpen = (subject) => {
    setSelectedSubject(subject);
    setopenGroupDialog(true);
  };

  const handleGroupDialogClose = () => {
    setopenGroupDialog(false);
    setSelectedSubject(null);
  };
  const handleUpdate = () => {
    fetchData();
  };
  const filteredData = getSubjectData.filter((subject) => {
    const matchesProgram = programFilter.id
      ? subject.program.id === programFilter.id
      : true;
    const matchesSemester = semesterFilter
      ? subject.semester === semesterFilter
      : true;
    const matchesYear = yearFilter ? subject.year === yearFilter : true;

    // Add major subject filtering
    const matchesMajorSubject = majorSubId
      ? subject.majorSubjectIds && subject.majorSubjectIds.includes(parseInt(majorSubId))
      : true;

    return matchesProgram && matchesSemester && matchesYear && matchesMajorSubject;
  });

  const sortedFilteredData= [...filteredData].sort((a,b) =>(a.code || "").localeCompare(b.code || "")
);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Grid margin="10px">
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", color: "#2A629A" }}
      >
        List of Subjects
      </Typography>

      <Grid container spacing={1} mb={1}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Program</InputLabel>
            <Select
              value={programFilter}
              onChange={(e) => {
                setProgramFilter(e.target.value);
                setSemesterFilter("");
                setYearFilter("");
                setMajorsubId("");
              }}
              label="Select Program"
              sx={{
                backgroundColor: "whitesmoke",
                borderColor: "lightgray",
                borderRadius: 1,
              }}
            >
              <MenuItem value="">All Programs</MenuItem>
              {programData.map((program) => (
                <MenuItem key={program.id} value={program}>
                  {program.programName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          {programFilter.programType === 'annual' ? (
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Year</InputLabel>
              <Select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                label="Filter by Year"
                sx={{
                  backgroundColor: "whitesmoke",
                  borderColor: "lightgray",
                  borderRadius: 1,
                }}
              >
                <MenuItem value="">All Years</MenuItem>
                {year.map((yr) => (
                  <MenuItem key={yr} value={yr}>
                    {yr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Semester</InputLabel>
              <Select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                label="Filter by Semester"
                sx={{
                  backgroundColor: "whitesmoke",
                  borderColor: "lightgray",
                  borderRadius: 1,
                }}
              >
                <MenuItem value="">Filter by Semester</MenuItem>
                {semester.map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>

        {programFilter && (
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Group/Major subjects</InputLabel>
              <Select
                value={majorSubId}
                onChange={(e) => {
                  setMajorsubId(e.target.value);
                }}
                label="Group/Major subject"
                sx={{
                  backgroundColor: "whitesmoke",
                  borderColor: "lightgray",
                  borderRadius: 1,
                }}
              >
                <MenuItem value="">All groups</MenuItem>
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.majorSubjectName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    N/A - No major subjects available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      <TableContainer>
        <Table
          style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
        >
          <TableHead style={{ backgroundColor: "#2A629A" }}>
            <TableRow>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                S.No:
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Program Name
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Semester/Year
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Subject Name
              </TableCell>
              {/* <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Subject Id
              </TableCell> */}
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Subject Type
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Short Name
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Code
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Alias
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Details
              </TableCell>
              <TableCell
                style={{
                  color: "#FFFFFF",
                  border: "1px solid #ddd",
                  padding: "4px",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "white" }}>
            {/* {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((data, index) => ( */}
              {sortedFilteredData.slice(page *rowsPerPage,page * rowsPerPage +rowsPerPage).map((data,index) =>(
                <TableRow key={data.id}>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {data.program.programName}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {data.year
                      ? `${data.year} year`
                      : `${data.semester} semester`}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {data.subjectName}
                  </TableCell>
                  {/* <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {data.id}
                  </TableCell> */}
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {data.subjectType}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {data.shortName}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {data.code}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {data.alias || "-"}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px" }}
                  >
                    {data?.remarks || "-"}
                  </TableCell>
                  <TableCell
                    style={{ border: "1px solid #ddd", padding: "4px", display: 'flex' }}
                  >
                    <Button
                      onClick={() => {
                        handleEditClick(data.id);
                        setProgramId(data.programId);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        handleEDitGroupOpen(data.id);
                        setProgramId(data.programId);
                      }}
                    >
                      Groups/Major
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[25, 50, 75]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <EditSubjectDialog
        open={openDialog}
        onClose={handleDialogClose}
        subjectId={selectedSubject}
        programData={programData}
        programId={programId}
        onUpdate={handleUpdate}
        semester={semester}
        year={year}
      />
      <EditGroups
        open={openGroupDialog}
        onClose={handleGroupDialogClose}
        subjectId={selectedSubject}
        programId={programId}
        onUpdate={handleUpdate}
      />
    </Grid>
  );
};

export default SubjectList;