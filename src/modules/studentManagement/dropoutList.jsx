import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { blue } from "@mui/material/colors";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate } from "react-router-dom";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const DropOutList = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [dropoutData, setDropoutData] = useState([]);
  const [filteredGraduationData, setFilteredGraduationData] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const fetchGraduationData = async () => {
    try {
      const config = getAuthConfigSafe()
      const fiscalYearResponse = await axios.get(`${backendUrl}/Batch`, config);
      const response = await axios.get(`${backendUrl}/DropOut`, config);
      setDropoutData(response.data);
      setFiscalYears(fiscalYearResponse.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchGraduationData();
  }, []);

  const handleFiscalYearChange = (event) => {
    const fiscalYearId = event.target.value;
    setSelectedFiscalYear(fiscalYearId);
    fetchGraduationData(fiscalYearId);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
  };

  useEffect(() => {
    const filteredData = dropoutData.filter((data) => {
      const isFiscalYearMatch =
        !selectedFiscalYear || data?.batch == selectedFiscalYear;
      const isSearchMatch =
        !searchTerm ||
        (data.studentName &&
          data.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
      return isFiscalYearMatch && isSearchMatch;
    });
    setFilteredGraduationData(filteredData);
  }, [dropoutData, selectedFiscalYear, searchTerm]);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };
  const handleGenerateClick = (id) => {
    navigate(`/dropout-management/recommendation-letter/${id}`);
  };

  const handleDeleteConfirm = async () => {
    try {
      const config = getAuthConfigSafe()
      await axios.delete(`${backendUrl}/DropOut/${selectedId}`, config);
      setOpenDeleteDialog(false);
      fetchGraduationData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant={"h6"} textAlign={"center"} color={blue[700]}>
            Dropout Student List
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="fiscalYearId-label">Batch Year</InputLabel>
                <Select
                  id="fiscalYearId"
                  labelId="fiscalYearId-label"
                  value={selectedFiscalYear}
                  onChange={handleFiscalYearChange}
                  label="Batch Year"
                  sx={{ borderRadius: 2, backgroundColor: "white" }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {fiscalYears.map((fy) => (
                    <MenuItem key={fy.id} value={fy.batchNepali}>
                      {fy.batchNepali}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Search by Name"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ borderRadius: 2, backgroundColor: "white" }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table
              style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
            >
              <TableHead style={{ backgroundColor: "#2A629A" }}>
                <TableRow>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    S.N
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Student Name (English)
                  </TableCell>

                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Batch(BS)
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Date Of Birth(BS)
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Drop Out Date
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Roll No.
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Semester/Year
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Level
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Program
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Drop Out Reason
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "4px",
                      height: "24px",
                      textAlign: "center",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody sx={{ bgcolor: "white" }}>
                {filteredGraduationData.length > 0 ? (
                  filteredGraduationData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data?.studentName}
                      </TableCell>

                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.batch}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.doBBS}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.dateOfEntry}
                      </TableCell>

                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data?.rollNoManual}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          textAlign: "left",
                          padding: "2px",
                        }}
                      >
                        {data.year
                          ? `${data.year} year`
                          : `${data.semester} semester`}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.levelName}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.programName}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                          textAlign: "left",
                        }}
                      >
                        {data.reason}
                      </TableCell>
                      <TableCell
                        style={{
                          border: "1px solid #c2c2c2",
                          padding: "4px",
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <Button
                            onClick={() => handleDeleteClick(data.id)}
                            color="error"
                            size="small"
                            sx={{
                              borderRadius: 1,
                              minWidth: "auto",
                              px: 1, // horizontal padding
                              py: 0.5, // vertical padding
                              fontSize: "0.75rem",
                            }}
                          >
                            Revert
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleGenerateClick(data.id)}
                            sx={{
                              borderRadius: 1,
                              minWidth: "auto",
                              px: 1,
                              py: 0.5,
                              fontSize: "0.75rem",
                              marginLeft: 1,
                            }}
                          >
                            <MailOutlineIcon
                              fontSize="small"
                              sx={{ mr: 0.5 }}
                            />
                            Generate
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} style={{ textAlign: "center" }}>
                      <Typography variant="h6" color="textSecondary">
                        No Data Available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to Revert this dropout record?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleDeleteConfirm}
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DropOutList;
