import { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Pagination,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getIdCardBatches } from "../../../services/services";

const cellStyle = {
  border: "1px solid #c2c2c2",
  padding: "8px",
  textAlign: "left",
};

const IdcardWithBatches = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]); // raw data
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedBatch, setSelectedBatch] = useState(""); // for filtering
  const [selectedProgram, setSelectedProgram] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getIdCardBatches();
        const data = Array.isArray(res) ? res : [res];
        setBatches(data);
        setFilteredBatches(data);
      } catch (err) {
        console.error("Error fetching batches:", err);
      }
    };
    fetchData();
  }, []);

  // Apply filters whenever selections or raw data change
  useEffect(() => {
    let result = [...batches];

    if (selectedBatch) {
      result = result.filter((batch) => batch.batchName === selectedBatch);
    }

    if (selectedProgram) {
      result = result.filter((batch) => batch.programName === selectedProgram);
    }

    setFilteredBatches(result);
    setPage(1); // reset to first page on filter
  }, [batches, selectedBatch, selectedProgram]);

  // Pagination
  const paginatedData = filteredBatches.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Unique filter options
  const batchOptions = [...new Set(batches.map((b) => b.batchName))];
  const programOptions = [...new Set(batches.map((b) => b.programName))];

  return (
    <>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <h1 className="text-lg font-medium mb-5 text-[#2b6eb5]">
          Generated ID Cards for Batches
        </h1>
      </Grid>

      {/* Filter Controls */}
      <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="batch-filter-label">Batch</InputLabel>
            <Select
              labelId="batch-filter-label"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              label="Batch"
            >
              <MenuItem value="">All Batches</MenuItem>
              {batchOptions.map((batch) => (
                <MenuItem key={batch} value={batch}>
                  {batch}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="program-filter-label">Program</InputLabel>
            <Select
              labelId="program-filter-label"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              label="Program"
            >
              <MenuItem value="">All Programs</MenuItem>
              {programOptions.map((prog) => (
                <MenuItem key={prog} value={prog}>
                  {prog}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead style={{ backgroundColor: "#2A629A" }}>
            <TableRow>
              {[
                "S.No.",
                "Generation Id No.", // Assuming batchNo is used
                "Validity Date (B.S.)",
                "Batch",
                "Level",
                "Program",
                "Action",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  style={{
                    color: "#ffffff",
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <span className="text-sm font-medium">{header}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody sx={{ bgcolor: "white" }}>
            {paginatedData.length > 0 ? (
              paginatedData.map((batch, index) => (
                <TableRow key={batch.batchNo}>
                  <TableCell style={cellStyle} align="center">
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell style={cellStyle}>{batch.batchNo}</TableCell>
                  <TableCell style={cellStyle}>{batch.validityDateNep}</TableCell>
                  <TableCell style={cellStyle}>{batch.batchName}</TableCell>
                  <TableCell style={cellStyle}>{batch.levelName}</TableCell>
                  <TableCell style={cellStyle}>{batch.programName}</TableCell>
                  <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        navigate(
                          `/student-management/generated-id-cards/${batch.batchNo}`
                        )
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell style={cellStyle} colSpan={7} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Footer */}
      <div className="flex items-center justify-end h-16 px-4">
        <Box>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              sx={{
                backgroundColor: "whitesmoke",
                borderRadius: 1,
                fontSize: "0.875rem",
              }}
            >
              <MenuItem value={25}>25 per page</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Pagination
          sx={{ ml: "20px" }}
          count={Math.ceil(filteredBatches.length / rowsPerPage)}
          page={page}
          shape="rounded"
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default IdcardWithBatches;