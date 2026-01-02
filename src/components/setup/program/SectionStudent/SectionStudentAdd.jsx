import React, { useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  Chip,
  Button,
  Paper,
  TablePagination,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Container,
  Table,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../../../utils/dateUtils";
import {config} from '@config';

const SectionForStudent = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [data, setData] = useState({
    sectionSymbol: "",
    status: true,
    remarks: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sectionData, setSectionData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editData, setEditData] = useState({
    sectionSymbol: "",
    status: true,
    remarks: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = await getAuthConfigSafe();
      const postData = {
        sectionSymbol: data.sectionSymbol,
        remarks: data.remarks,
        status: data.status,
        campusId: 12, // Fixed: Changed semicolon to comma
      };

      await axios.post(
        `${backendUrl}/SectionForStudent/create`,
        postData,
        config
      );

      setData({
        sectionSymbol: "",
        status: true,
        remarks: "",
      });
      fetchData();
      toast.success("Successfully Added");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Section Already Exists!!");
      } else {
        toast.error("Error adding section");
        console.error("Error during API call:", err);
      }
    }
  };

  const fetchData = async () => {
    try {
      const config = await getAuthConfigSafe();
      const response = await axios.get(
        `${backendUrl}/SectionForStudent/all`,
        config
      );
      setSectionData(response.data);
    } catch (err) {
      console.log("Error fetching sections:", err);
      toast.error("Error fetching sections");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEditClick = (section) => {
    setSelectedItemId(section.id);
    setEditData({
      sectionSymbol: section.sectionSymbol,
      status: section.status,
      remarks: section.remarks || "",
    });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      const config = await getAuthConfigSafe();
      const putData = {
        sectionSymbol: editData.sectionSymbol,
        remarks: editData.remarks,
        status: editData.status,
        campusId: 12, // Added campusId for update as well
      };

      await axios.put(
        `${backendUrl}/SectionForStudent/update/${selectedItemId}`,
        putData,
        config
      );

      setOpenEditDialog(false);
      fetchData();
      toast.success("Successfully Updated");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Section Already Exists!!");
      } else {
        toast.error("Error updating section");
        console.error("Error during API call:", err);
      }
    }
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          mx: "auto",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          maxWidth: "700px", // Reduced width
        }}
      >
        <Typography
          variant="h6"
          component="p"
          style={{
            color: blue[700],
            textAlign: "center",
            padding: "10px",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          Add Section for Student
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id="sectionSymbol"
                size="small"
                name="sectionSymbol"
                label="Section Symbol"
                fullWidth
                value={data.sectionSymbol}
                onChange={(e) =>
                  setData({ ...data, sectionSymbol: e.target.value })
                }
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  required
                  id="status"
                  name="status"
                  label="Status"
                  value={data.status}
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                >
                  <MenuItem value={true}>
                    <Chip label="Active" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value={false}>
                    <Chip label="Inactive" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="remarks"
                size="small"
                name="remarks"
                label="Remarks"
                fullWidth
                value={data.remarks}
                onChange={(e) => setData({ ...data, remarks: e.target.value })}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container justifyContent="center" marginTop={1}>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: blue[700],
                  color: "white",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: blue[800],
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Typography
          variant="body1"
          color="#2b6eb5"
          gutterBottom
          textAlign={"center"}
          padding={2}
          sx={{ fontSize: "1.5rem" }}
        >
          Student Section list
        </Typography>

        <TableContainer component={Paper}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: blue[700] }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontSize: "1rem",
                    textAlign: "",
                    py: 1,
                    borderRight: 1,
                    borderColor: "grey.300",
                  }}
                >
                  S.No.
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontSize: "1rem",
                    textAlign: "",
                    py: 1,
                    borderRight: 1,
                    borderColor: "grey.300",
                  }}
                >
                  Section Symbol
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontSize: "1rem",
                    textAlign: "",
                    py: 1,
                    borderRight: 1,
                    borderColor: "grey.300",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    textAlign: "",
                    fontSize: "1rem",
                    py: 1,
                    borderRight: 1,
                    borderColor: "grey.300",
                  }}
                >
                  Remarks
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    textAlign: "",
                    fontSize: "1rem",
                    py: 1,
                    borderRight: 1,
                    borderColor: "grey.300",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sectionData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell
                      sx={{
                        textAlign: "left",
                        py: 1,
                        fontSize: "1rem",
                        borderRight: 1,
                        borderColor: "grey.300",
                      }}
                    >
                      {index + 1 + page * rowsPerPage}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "left",
                        py: 1,
                        fontSize: "1rem",
                        borderRight: 1,
                        borderColor: "grey.300",
                      }}
                    >
                      {row.sectionSymbol}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "left",
                        py: 1,
                        fontSize: "1rem",
                        borderRight: 1,
                        borderColor: "grey.300",
                      }}
                    >
                      {row?.status ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip label="Inactive" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "left",
                        py: 1,
                        fontSize: "1rem",
                        borderRight: 1,
                        borderColor: "grey.300",
                      }}
                    >
                      {row.remarks}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "left",
                        py: 1,
                        fontSize: "1rem",
                        borderRight: 1,
                        borderColor: "grey.300",
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => handleEditClick(row)}
                        sx={{ color: blue[700] }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sectionData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography
            variant="h6"
            component="p"
            style={{
              color: blue[700],
              textAlign: "center",
              padding: "10px",
              textTransform: "uppercase",
            }}
          >
            Edit Section of Student
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                size="small"
                label="Section Symbol"
                fullWidth
                value={editData.sectionSymbol}
                onChange={(e) =>
                  setEditData({ ...editData, sectionSymbol: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  required
                  label="Status"
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Remarks"
                fullWidth
                value={editData.remarks}
                onChange={(e) =>
                  setEditData({ ...editData, remarks: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ mx: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            sx={{
              backgroundColor: blue[700],
              color: "white",
              "&:hover": {
                backgroundColor: blue[800],
              },
              mx: 1,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SectionForStudent;
