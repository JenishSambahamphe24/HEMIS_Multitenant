import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Typography,
  TextField,
  MenuItem,
  Box,
  Autocomplete,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { blue } from "@mui/material/colors";
import { Link, useSearchParams } from "react-router-dom";
import EditRoutineSchedule from "./EditRoutineSchedule";
import { useBatches } from "../../hooks/useGlobalData";
import { getAllSubjectExamRoutine } from "../../components/dashboard/services/service";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

const headerStyle = {
  color: "#FFFFFF",
  border: "1px solid #ddd",
  padding: "4px",
};

const cellStyle = {
  border: "1px solid #ddd",
  padding: "4px",
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RoutineList() {
  const [moduleData, setModuleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueExamNames, setUniqueExamNames] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [programId, setProgramId] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: batches } = useBatches();
  const [selectedBatch, setSelectedBatch] = useState(
    parseInt(searchParams.get('batch')) || 0
  );
  const [examNameFilter, setExamNameFilter] = useState(
    searchParams.get('examFilter') || ''
  );
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 0);
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(searchParams.get('rowsPerPage')) || 50
  );

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleMenuClick = (event, rowData) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowData(rowData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowData(null);
  };

  // Update URL parameters
  const updateURLParams = (newParams) => {
    const currentParams = Object.fromEntries(searchParams);
    const updatedParams = { ...currentParams, ...newParams };

    if (updatedParams.examFilter === '' || updatedParams.examFilter === 'all') {
      delete updatedParams.examFilter;
    }
    if (updatedParams.page === '0') delete updatedParams.page;
    if (updatedParams.rowsPerPage === '50') delete updatedParams.rowsPerPage;
    if (updatedParams.batch === '0') delete updatedParams.batch;

    setSearchParams(updatedParams);
  };

  const handleClickOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
    handleMenuClose();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    updateURLParams({ page: newPage.toString() });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    updateURLParams({
      rowsPerPage: newRowsPerPage.toString(),
      page: '0',
    });
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    const value = filterValue === 'all' ? '' : filterValue;
    setExamNameFilter(value);
    setPage(0);
    updateURLParams({
      examFilter: value || '',
      page: '0',
    });
  };

  const fetchData = async (pageNumber = 1, pageSize = 50) => {
    setLoading(true);
    try {
      const response = await getAllSubjectExamRoutine({
        batchId: selectedBatch,
        pageNumber,
        pageSize,
      });

      const data = response.data || [];
      setModuleData(data);

      const examNames = [...new Set(data.map((item) => item.examName).filter(Boolean))];
      setUniqueExamNames(examNames.sort());
    } catch (err) {
      console.error('Error fetching exam routine:', err);
      setModuleData([]);
      setUniqueExamNames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = moduleData;

    if (examNameFilter) {
      filtered = moduleData.filter((item) =>
        item.examName ? item.examName === examNameFilter : false
      );
    }

    setFilteredData(filtered);
    setPage(0);
  }, [moduleData, examNameFilter]);

  useEffect(() => {
    fetchData(page + 1, rowsPerPage);
  }, [selectedBatch, page, rowsPerPage]);

  useEffect(() => {
    updateURLParams({ batch: selectedBatch });
  }, [selectedBatch]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const filteredTotalRecords = filteredData.length;
  // console.log(filteredData)
  
  return (
    <>
      {loading ? (
        <Grid container alignItems="center" justifyContent="center" padding={3}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Grid container alignItems="center" justifyContent="space-between" padding={1}>
            <Grid item xs>
              <Typography variant="body1" color={blue[700]} textAlign="center">
                These are the Scheduled Exams Routines
              </Typography>
            </Grid>
          </Grid>

          <div className="flex flex-row gap-2 mb-2">
            <Box
              sx={{
                width: { xs: '180px', md: '200px' },
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel>Select batch</InputLabel>
                <Select
                  label="Select batch"
                  value={selectedBatch}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setSelectedBatch(value);
                    setPage(0);
                    updateURLParams({ batch: value, page: '0' });
                  }}
                >
                  <MenuItem value={0}>All Batches</MenuItem>
                  {batches?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.batchNepali}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{
              pb: 1,
              width: { xs: '280px', md: '300px' },
            }}>
              <Autocomplete
                size="small"
                options={['All Exams', ...uniqueExamNames]}
                value={examNameFilter ? examNameFilter : 'All Exams'}
                onChange={(event, newValue) => {
                  handleFilterChange({
                    target: { value: newValue === 'All Exams' ? 'all' : newValue },
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Filter by Exam Name" variant="outlined" />
                )}
                isOptionEqualToValue={(option, value) => option === value}
                sx={{ width: '100%' }}
              />
            </Box>
          </div>

          <Grid container justifyContent="center">
            <Grid item xs={12} md={12}>
              <TableContainer sx={{ borderRadius: 2 }}>
                <Table style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                  <TableHead style={{ backgroundColor: '#2A629A' }}>
                    <TableRow>
                      <TableCell rowSpan={2} align="center" style={headerStyle} width='2%'>
                        S.No
                      </TableCell>
                      <TableCell rowSpan={2} align="center" style={headerStyle} >
                        Exam Name
                      </TableCell>
                      <TableCell rowSpan={2} align="center" style={headerStyle} >
                        Subject Name
                      </TableCell>
                      <TableCell rowSpan={2} align="center" style={headerStyle}>
                        Semester/Year
                      </TableCell>
                      <TableCell rowSpan={2} align="center" style={headerStyle}>
                        Type
                      </TableCell>
                      <TableCell rowSpan={2} align="center" style={headerStyle} width='7%'>
                        Exam Date
                      </TableCell>
                      <TableCell align="center" colSpan={2} style={headerStyle}>
                        Theoretical
                      </TableCell>
                      <TableCell align="center" colSpan={2} style={headerStyle}>
                        Practical
                      </TableCell>
                      <TableCell rowSpan={2} align="center" style={headerStyle}>
                        Status
                      </TableCell>
                      <TableCell rowSpan={2} align="center" style={headerStyle} width='5%'>
                        Action
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" style={headerStyle}>
                        Full Marks
                      </TableCell>
                      <TableCell align="center" style={headerStyle}>
                        Pass Marks
                      </TableCell>
                      <TableCell align="center" style={headerStyle}>
                        Full Marks
                      </TableCell>
                      <TableCell align="center" style={headerStyle}>
                        Pass Marks
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ bgcolor: 'white' }}>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((data, index) => {
                        const today = new Date();
                        const startDate = new Date(data.examDate);
                        let status;
                        if (!data.examDate) {
                          status = 'Not Scheduled';
                        } else if (today < startDate) {
                          status = 'Active';
                        } else if (today.toDateString() === startDate.toDateString()) {
                          status = 'Running';
                        } else {
                          status = 'Finished';
                        }

                        return (
                          <TableRow key={data.id}>
                            <TableCell style={cellStyle}>
                              {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell style={cellStyle}>{data?.examName || 'N/A'}</TableCell>
                            <TableCell style={cellStyle}>
                              {data.subjectName || 'N/A'}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {data?.year
                                ? `${data.year} Year`
                                : `${data.semester || '-'} Semester`}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {data?.isTheoretical && data?.isPractical ? (
                                <Tooltip title="Theoretical, Practical" arrow>
                                  <span>Th, Pr</span>
                                </Tooltip>
                              ) : data?.isTheoretical ? (
                                <Tooltip title="Theoretical" arrow>
                                  <span>Th</span>
                                </Tooltip>
                              ) : data?.isPractical ? (
                                <Tooltip title="Practical" arrow>
                                  <span>Pr</span>
                                </Tooltip>
                              ) : (
                                'N/A'
                              )}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {data?.examDate ? data.examDate.slice(0, 10) : 'N/A'}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {data.theoreticalFullMarks || '-'}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {data.theoreticalPassMarks || '-'}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {data.practicalFullMark || '-'}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              {data.practicalPassMark || '-'}
                            </TableCell>
                            <TableCell style={cellStyle}>
                              <span
                                style={{
                                  color:
                                    status === 'Active'
                                      ? 'green'
                                      : status === 'Running'
                                        ? 'orange'
                                        : 'gray',
                                }}
                              >
                                {status}
                              </span>
                            </TableCell>
                            <TableCell style={cellStyle} sx={{textAlign:'center'}}>
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuClick(e, data)}
                                sx={{
                                  color: '#1976d2',
                                  '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                  },
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} align="center" style={cellStyle}>
                          No data found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {/* Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                minWidth: 180,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              onClick={() => {
                if (selectedRowData) {
                  handleClickOpen(selectedRowData.id);
                  setProgramId(selectedRowData.programId);
                }
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              component={Link}
              to={`/exam-management/exam-appear?examroutine=${selectedRowData?.id}`}
              onClick={handleMenuClose}
            >
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Manage attendance</ListItemText>
            </MenuItem>
            
            <MenuItem
              component={Link}
              to={`/exam-management/exam-attendees/${selectedRowData?.examScheduleId}`}
              onClick={handleMenuClose}
            >
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View attendees</ListItemText>
            </MenuItem>
            
            
          </Menu>
        </>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth="lg"
        aria-describedby="alert-dialog-slide-description"
      >
        <EditRoutineSchedule
          Id={selectedId}
          programId={programId}
          onClose={handleClose}
          onUpdate={() => fetchData(page + 1, rowsPerPage)}
        />
      </Dialog>

      <TablePagination
        rowsPerPageOptions={[50, 100, 150, 200]}
        component="div"
        count={filteredTotalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}