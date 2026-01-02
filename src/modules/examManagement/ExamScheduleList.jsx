import {
  Box,
  Button,
  capitalize,
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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { blue } from "@mui/material/colors";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditExamSchedule from "./EditExamSchedule";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import DeleteDialog from "../../components/Delete/DeleteDialog";
import { deleteExamSchedule } from "../../components/dashboard/services/service";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ExamScheduleList() {
  const backendUrl = config.VITE_BACKEND_URL;
  const [moduleData, setModuleData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const fetchData = async (pageNumber = 0, pageSize = 10) => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/ExamSchedule?pageNumber=${pageNumber + 1
        }&pageSize=${pageSize}`,
        config
      );

      setModuleData(response.data.data);
      setTotalRecords(response.data.totalRecords);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleUpdate = async () => {
    await fetchData(page, rowsPerPage);
    setOpen(false);
  };
  const handleDeleteDialogOpen = (id) => {
    setSelectedId(id)
    setDeleteDialogOpen(true)
  }
  const handleDeleteClose = () => {
    setDeleteDialogOpen(false)
    fetchData()
  }
  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        padding={2}
      >
        <Grid item xs>
          <Typography variant="h6" color={blue[700]} textAlign="center">
            These are the Scheduled Exams
          </Typography>
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{
              bgcolor: "#1976d2",
              color: "white",
              "&:hover": { bgcolor: "#1565c0" },
              padding: "6px 12px",
              borderRadius: 2,
            }}
            startIcon={<AddIcon />}
            component={Link}
            to={"/exam-management/exam-schedule"}
          >
            Schedule Exam
          </Button>
        </Grid>
      </Grid>

      <Grid justifyContent={"center"}>
        <Grid item xs={12} md={8}>
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table
              style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
            >
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  {[
                    "S.No",
                    "Program Name",
                    "Exam Type",
                    "Exam Name",
                    "Exam Start Date",
                    "Exam End Date",
                    "Status",
                    "Action",
                  ].map((label, index) => (
                    <TableCell
                      key={index}
                      style={{
                        color: "#FFFFFF",
                        border: "1px solid #ddd",
                        padding: "8px",
                        width:
                          label === "S.No."
                            ? "2%"
                            : label === "Action"
                              ? "20%"
                              : "auto",
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ bgcolor: "white" }}>
                {moduleData.map((data, index) => {
                  const today = new Date();
                  const startDate = new Date(data.dateFromNepali);
                  const endDate = new Date(data.dateToNepali);

                  let status = "Finished";
                  if (today < startDate) status = "Active";
                  else if (today <= endDate) status = "Running";

                  const oneWeekBeforeEndDate = new Date(endDate);
                  oneWeekBeforeEndDate.setDate(endDate.getDate() - 7);
                  const isNew =
                    today >= oneWeekBeforeEndDate && today <= endDate;

                  return (
                    <TableRow key={data.id}>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {page * rowsPerPage + index + 1}
                        {isNew && (
                          <NewReleasesIcon
                            sx={{ fontSize: 16, color: "red", ml: 1 }}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data?.programName}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {capitalize(data?.examType || "")}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data.examName}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data?.dateFromNepali?.slice(0, 10)}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {data?.dateToNepali?.slice(0, 10)}
                      </TableCell>
                      <TableCell
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        <span
                          style={{
                            color:
                              status === "Active"
                                ? "green"
                                : status === "Running"
                                  ? "orange"
                                  : "gray",
                          }}
                        >
                          {status}
                        </span>
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #ddd",
                          padding: "4px",
                          display: "flex",
                          gap: "2px",
                          justifyContent: 'center'
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          sx={{
                            bgcolor: "#1976d2",
                            color: "white",
                            "&:hover": { bgcolor: "#1565c0" },
                            borderRadius: 2,
                            fontSize: "10px",
                          }}
                          component={Link}
                          to={`/exam-management/exam-routine?examschedule=${data.id}`}
                        >
                          Add Routine
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          sx={{ borderRadius: 2, fontSize: "10px" }}
                          onClick={() => handleEditClick(data.id)}
                          variant="outlined"
                          startIcon={<EditNoteIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          sx={{ borderRadius: 2, fontSize: "10px" }}
                          onClick={() => handleDeleteDialogOpen(data.id)}
                          variant="outlined"
                          color='error'
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth="lg"
      >
        {selectedId && (
          <EditExamSchedule
            selectedId={selectedId}
            onClose={handleClose}
            onUpdate={handleUpdate}
          />
        )}
      </Dialog>
      <Box>
        <DeleteDialog
          id={selectedId}
          open={deleteDialogOpen}
          handleClose={handleDeleteClose}
          deleteApi={deleteExamSchedule}
          content='Exam schedule'
        />
      </Box>

      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
