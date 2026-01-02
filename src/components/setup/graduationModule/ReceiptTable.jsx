import React, { useState, useEffect } from "react";
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
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  TablePagination,
  Typography,
  TableSortLabel, // Import TableSortLabel
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { SaveAlt as ExportIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditReceiptMgmt from "./EditReceiptMgmt";
import { blue } from "@mui/material/colors";
import { LoadingOverlay } from "@mantine/core";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';

const backendUrl = config.VITE_BACKEND_URL;

const ReceiptTable = () => {
  const [receiptData, setReceiptData] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const navigate = useNavigate();
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    fetchReceiptData();
  }, []);

  const fetchReceiptData = async () => {
    try {
      setLoading(true);
      const config = getAuthConfigSafe()
      const fiscalYearResponse = await axios.get(
        `${backendUrl}/FiscalYear/GetFiscalYearsForSelection`,
        config
      );
      const response = await axios.get(`${backendUrl}/Receipt`, config);

      setFiscalYears(fiscalYearResponse.data);
      setReceiptData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleFiscalYearChange = (event) => {
    setSelectedFiscalYear(event.target.value);
  };

  const filteredReceiptData = selectedFiscalYear
    ? receiptData.filter((data) => data.fiscalYear === selectedFiscalYear)
    : receiptData;

  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredReceiptData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredReceiptData, sortConfig]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = (id) => {
    navigate(`/receipt-management/receipt-details/${id}`);
  };

  const handleEditClick = (receiptId) => {
    setSelectedReceiptId(receiptId);
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    fetchReceiptData();
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      {loading ? (
        <LoadingOverlay
          visible={loading}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ color: "#1976d2", type: "bars" }}
        />
      ) : (
        <>
          <Grid
            container
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={2} mt={1} mb={1}>
              <FormControl fullWidth size="small">
                <InputLabel id="fiscalYearId-label">Fiscal Year</InputLabel>
                <Select
                  id="fiscalYearId"
                  labelId="fiscalYearId-label"
                  value={selectedFiscalYear}
                  onChange={handleFiscalYearChange}
                  label="Fiscal Year"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "white",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {fiscalYears.map((fy) => (
                    <MenuItem key={fy.id} value={fy.yearNepali}>
                      {fy.yearNepali}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6} mt={1} mb={1}>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  color: blue[700],
                }}
              >
                Generated Payment Receipt
              </Typography>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              <TableContainer sx={{ borderRadius: 2 }}>
                <Table
                  style={{
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                  }}
                >
                  <TableHead style={{ backgroundColor: "#2A629A" }}>
                    <TableRow>
                      <TableCell
                        style={{
                          color: "#ffffff",
                          fontSize: "14px",
                          border: "1px solid #ddd",
                          padding: "4px",
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
                          fontSize: "14px",

                          width: "10%",
                        }}
                      >
                        <TableSortLabel
                          active={sortConfig?.key === "receiptNo"}
                          direction={sortConfig?.direction}
                          onClick={() => requestSort("receiptNo")}
                        >
                          Receipt No.
                        </TableSortLabel>
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
                        <TableSortLabel
                          active={sortConfig?.key === "fullName"}
                          direction={sortConfig?.direction}
                          onClick={() => requestSort("fullName")}
                        >
                          Full Name
                        </TableSortLabel>
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
                          textAlign: "center",
                          width: "12%",
                        }}
                      >
                        <TableSortLabel
                          active={sortConfig?.key === "year"}
                          direction={sortConfig?.direction}
                          onClick={() => requestSort("year")}
                        >
                          Semester/Year
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#ffffff",
                          border: "1px solid #ddd",
                          padding: "4px",
                          height: "24px",
                          textAlign: "center",
                          width: "12%",
                        }}
                      >
                        <TableSortLabel
                          active={sortConfig?.key === "dateOfPayment"}
                          direction={sortConfig?.direction}
                          onClick={() => requestSort("dateOfPayment")}
                        >
                          Date of Payment
                        </TableSortLabel>
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
                        <TableSortLabel
                          active={sortConfig?.key === "fiscalYear"}
                          direction={sortConfig?.direction}
                          onClick={() => requestSort("fiscalYear")}
                        >
                          Fiscal Year
                        </TableSortLabel>
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
                  <TableBody sx={{ backgroundColor: "white" }}>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                              textAlign: "left",
                            }}
                          >
                            {index + 1 + page * rowsPerPage}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                              textAlign: "left",
                            }}
                          >
                            {data?.receiptNo}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                              textAlign: "left",
                            }}
                          >
                            {data?.fullName}
                          </TableCell>

                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                              textAlign: "left",
                            }}
                          >
                            {data?.programName}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                              textAlign: "left",
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
                            {data?.dateOfPayment?.slice(0, 10)}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                              textAlign: "left",
                            }}
                          >
                            {data.fiscalYear || "-"}
                          </TableCell>
                          <TableCell
                            style={{
                              border: "1px solid #c2c2c2",
                              padding: "4px",
                              width: "10%",
                            }}
                          >
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {/* <Button
                            onClick={() => handleEditClick(data.id)}
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontSize: "0.8rem",
                            }}
                          >
                            <EditNoteIcon /> Edit
                          </Button> */}
                              <Button
                                onClick={() => handleExport(data.id)}
                                variant="contained"
                                size="small"
                                startIcon={<ExportIcon />}
                                sx={{
                                  bgcolor: "#1976d2",
                                  color: "white",
                                  "&:hover": {
                                    bgcolor: "#1565c0",
                                  },
                                  borderRadius: 2,
                                  fontSize: "0.8rem",
                                }}
                              >
                                Generate
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} style={{ textAlign: "center" }}>
                          No Data Available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredReceiptData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[50, 100, 150, 200]}
              />
            </Grid>
            <Dialog
              open={openEditDialog}
              onClose={() => setOpenEditDialog(false)}
              maxWidth="md"
            >
              <EditReceiptMgmt
                id={selectedReceiptId}
                onClose={() => setOpenEditDialog(false)}
                onUpdate={handleUpdate}
              />
            </Dialog>
          </Grid>
        </>
      )}
    </>
  );
};

export default ReceiptTable;
