import {
  Box,
  Button,
  Dialog,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import EditWork from "./EditWork";
import AddWork from "./AddWork";
import DeleteWork from "./DeleteWork";
import Batchmate from "../Profile/Batchmate";
import { useQuery } from "@tanstack/react-query";
import { useAlumni } from "../../../../context/AlumniContext";
import {
  AlumniEmployeeService,
  fetchGraduationData,
} from "../../../../services/AlumniServices";

const WorkList = () => {
  const { programId, campusId, enrolledYear } = useAlumni();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddWorkDialog, setOpenAddWorkDialog] = useState(false);
  const [id, setId] = useState(0);

  const authToken = localStorage.getItem("authToken");
  const { data: graduationData } = useQuery({
    queryKey: ["graduationData"],
    queryFn: () => fetchGraduationData(authToken),
  });
  const graduation = graduationData?.[0];
  const token = localStorage.getItem("authToken");
  const { data } = useQuery({
    queryKey: ["AlumniEmployee", { programId, campusId, enrolledYear }],
    queryFn: () =>
      AlumniEmployeeService.getByFilters({
        programId,
        campusId,
        enrollmentYear: enrolledYear,
        token,
      }).then((res) => res.data),
    enabled: !!programId && !!campusId && !!enrolledYear,
  });
  const handleEditClick = (id) => {
    setId(id);
    setOpenEditDialog(true);
  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  // for delete dialog
  const handleDeleteClick = (id) => {
    setId(id);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // for add work dialog
  const handleAddWorkClick = () => {
    setOpenAddWorkDialog(true);
  };
  const handleCloseAddWorkDialog = () => {
    setOpenAddWorkDialog(false);
  };

  return (
    <>
      <Grid container spacing={3} className="px-2">
        <Grid item xs={12} md={8}>
          <Typography
            variant="h5"
            gutterBottom
            style={{
              marginTop: "30px",
              color: "rgb(43, 110, 181)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            My working history
          </Typography>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<IoIosAdd />}
              onClick={handleAddWorkClick}
              sx={{
                color: "#fff",
                backgroundColor: "#2B6EB5",
                textTransform: "none",
                fontWeight: 500,
                paddingY: "4px",
                paddingX: "12px",
                marginBottom: "5px",
                "&:hover": {
                  backgroundColor: "#2B6EB5",
                },
              }}
            >
              Add Work
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "rgb(43, 110, 181)" }}>
                <TableRow>
                  {[
                    "S.NO.",
                    "Office Name",
                    "Office Address",
                    "Office Email",
                    "Working Position",
                    "Added By",
                    "Working Status",
                    "Action",
                  ].map((header, index) => (
                    <TableCell
                      key={index}
                      align="left"
                      sx={{
                        color: "white",
                        border: "1px solid  #c2c2c2",
                        padding: "4px",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map(
                  (
                    {
                      id,
                      organizationName,
                      officeAddress,
                      officeEmail,
                      designation,
                      createdBy,
                      workingStatus,
                    },
                    index
                  ) => (
                    <TableRow key={id ?? index}>
                      <TableCell
                        align="left"
                        sx={{ border: "1px solid #c2c2c2", padding: "3px" }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ border: "1px solid #c2c2c2", padding: "6px" }}
                      >
                        {organizationName}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ border: "1px solid #c2c2c2", padding: "6px" }}
                      >
                        {officeAddress}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ border: "1px solid #c2c2c2", padding: "6px" }}
                      >
                        {officeEmail}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ border: "1px solid #c2c2c2", padding: "4px" }}
                      >
                        {designation}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ border: "1px solid #c2c2c2", padding: "4px" }}
                      >
                        {createdBy}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ border: "1px solid #c2c2c2", padding: "4px" }}
                      >
                        {workingStatus}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          border: "1px solid #c2c2c2",
                          padding: "5px",
                          paddingX: "10px",
                        }}
                      >
                        <Box display="flex" justifyContent="center">
                          <Button
                            variant="outlined"
                            onClick={() => handleEditClick(id)}
                            sx={{
                              color: "#2B6EB5",
                              borderColor: "#2B6EB5",
                              textTransform: "none",
                              fontWeight: 500,
                              padding: "0.5px",
                            }}
                          >
                            edit
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => handleDeleteClick(id)}
                            sx={{
                              color: "#e13a27",
                              borderColor: "#e13a27",
                              textTransform: "none",
                              fontWeight: 500,
                              padding: "1px",
                              marginLeft: "5px",
                              "&:hover": {
                                borderColor: "#e13a27",
                                backgroundColor: "rgba(225, 58, 39, 0.04)",
                              },
                            }}
                          >
                            delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* add work dialog */}
          <Dialog
            open={openAddWorkDialog}
            onClose={handleCloseAddWorkDialog}
            fullWidth
            maxWidth="md"
          >
            <AddWork
              onClose={handleCloseAddWorkDialog}
              applicantName={graduation?.applicantNameEng}
              fullWidth
              maxWidth="xl"
            />
          </Dialog>

          {/* edit */}
          <Dialog
            open={openEditDialog}
            onClose={handleCloseEditDialog}
            fullWidth
            maxWidth="md"
          >
            <EditWork id={id} onClose={handleCloseEditDialog} />
          </Dialog>

          {/* delete */}
          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DeleteWork id={id} onClose={handleCloseDeleteDialog} />
          </Dialog>
        </Grid>

        <Grid item xs={12} md={4}>
          <Batchmate
            enrolledYear={enrolledYear}
            campusId={campusId}
            programId={programId}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default WorkList;
