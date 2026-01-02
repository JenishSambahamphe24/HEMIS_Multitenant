import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  Pagination,
  Checkbox,
  Chip,
  TextField,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { getIdCardInfoByBatchId, getSignaturedEmpById } from "../../../services/services";
import { useBulkIdPrint } from "../../report/CampusReport/statisticalReport/components/pdfHelpers";
import error_img from "../../../assets/error_img.png";
import { config } from '@config';


import { Landscape, Portrait, OriginalJMC } from "./IdComponent";

const GeneratedIdCards = () => {
  const { id } = useParams();
  const backendUrl = config.VITE_BACKEND_URL;
  const uploadURL = config.VITE_UPLOAD_URL;
  const baseUrl = config.VITE_BASE_URL;
  const { currentUser } = useSelector((state) => state.user);
  const componentRef = useRef(null);

  // Add print styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-container, .print-container * {
          visibility: visible;
        }
        .print-container {
          // position: absolute;
          position: static;
          left: 0;
          top: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Institution data
  const phoneNo = `${currentUser?.institution?.contactNo1 || ""}`;
  const campusName = currentUser?.institution?.campusName;
  const [collegeFirstName, ...collegeRemaining] =
    currentUser?.institution?.campusName.split(" ");
  const collegeSecond = collegeRemaining.join(" ");
  const localLevel = currentUser?.institution?.localLevel;
  const district = currentUser?.institution?.district;
  const logo = currentUser?.institution?.logo;
  const uniName = currentUser?.institution?.university?.name;
  const collegeAddress = currentUser?.institution.locality;

  // State
  const [idCardData, setIdCardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSignature, setFirstSignature] = useState([]);
  const [orientation, setOrientation] = useState("landscape");
  const [cardMode, setCardMode] = useState("standard");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedStudents, setSelectedStudents] = useState([]);

  //Filter by search
  const [search, setSearch] = useState("");


  const filteredData = idCardData.filter((item) => {
    const fullName = `${item.studentFirstName} ${item.studentLastName}`.toLowerCase();
    const studentId = String(item.studentId);
    return (
      fullName.includes(search.toLowerCase()) || studentId.includes(search)
    );
  });

  // Fetch signatures
  useEffect(() => {
    const fetchSignatures = async () => {
      const response = await getSignaturedEmpById();
      setFirstSignature(response.find((item) => item.index === 1));
    };
    fetchSignatures();
  }, []);

  // Fetch ID card data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getIdCardInfoByBatchId(id);
        const sortedData = Array.isArray(res?.data)
          ? res.data.sort((a, b) => a.studentId - b.studentId)
          : [];
        setIdCardData(sortedData);
      } catch (err) {
        console.error("Error fetching ID card data:", err);
        setIdCardData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Common props for ID cards
  const getCommonProps = () => ({
    baseUrl,
    logo,
    uniName,
    campusName,
    localLevel,
    district,
    phoneNo,
    uploadURL,
    campusId: currentUser?.institution?.id,
    stdPhoto: null,
    firstSignature,
    error_img,
    collegeFirstName,
    collegeSecond,
    collegeAddress,
  });

  // Pagination
  // const totalPages = Math.ceil(idCardData.length / rowsPerPage);
  // const paginatedData = idCardData.slice(
  //   (page - 1) * rowsPerPage,
  //   page * rowsPerPage
  // );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage

  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  const toggleCardMode = () => {
    setCardMode(cardMode === "standard" ? "compact" : "standard");
  };

  // Selection handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allStudentIds = paginatedData.map((data) => data.studentId);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    selectedStudents.length === paginatedData.length;
  const isIndeterminate =
    selectedStudents.length > 0 &&
    selectedStudents.length < paginatedData.length;

  // Print handler
  const handlePrint = useBulkIdPrint({ orientation, componentRef });

  // Render individual card
  const renderCard = (data) => {
    const commonProps = {
      ...getCommonProps(),
      stdPhoto: data?.studentProfile?.ppSizePhoto || null,
    };

    //student address
    const studentAddress = [
      data?.pLocalLevel,
      data?.pWardNo && `-${data.pWardNo}`,
      data?.pDistrict && `, ${data.pDistrict}`,
    ].filter(Boolean).join("");


    // Transform data to match student structure expected by card components
    const studentData = {
      id: data.studentId,
      firstName: data.studentFirstName,
      lastName: data.studentLastName,
      levelName: data.levelName,
      email: data.studentEmail,
      phoneNumber: data.phoneNumber,
      doBBS: data.doBBS,
      programName: data.programName,
      programShortName: data.shortName,
      semester: data.semester,
      year: data.year,
      batchNepali: data.batchNepali,
      validDate: data.validityDateNep,
      issueDateNep: data.issueDateNep,
      address: studentAddress,
      studentProfile: {
        ppSizePhoto: data.studentProfile?.ppSizePhoto || null,
      },
    };

    const isSelected = selectedStudents.includes(data.studentId);

    return (
      <Box key={data.id} sx={{ position: "relative" }}>
        <Checkbox
          checked={isSelected}
          size="small"
          onChange={() => handleSelectStudent(data.studentId)}
          sx={{
            position: "absolute",
            top: 4,
            right: 1,
            zIndex: 10,
            bgcolor: "white",
            borderRadius: 1,
            "&:hover": { bgcolor: "white" },
          }}
          className="no-print"
        />
        {orientation === "landscape" && (
          <Landscape student={studentData} {...commonProps} />
        )}
        {orientation === "portrait" && (
          <Portrait student={studentData} {...commonProps} />
        )}
        {orientation === "jmcOriginal" && (
          <OriginalJMC student={studentData} {...commonProps} />
        )}
      </Box>
    );
  };

  return (
    <Card sx={{ mb: 2, overflow: "visible" }}>
      <CardContent>
        <Typography
          variant="h5"
          sx={{ mb: 1, fontWeight: 500, color: "#0046b5" }}
          className="no-print"
        >
          Generated ID Cards
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 3, color: "text.secondary" }}
          className="no-print"
        >
          {/* ID cards generated with generation ID: {id} */}
        </Typography>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="no-print"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Orientation</InputLabel>
              <Select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                label="Orientation"
              >
                <MenuItem value="landscape">Landscape</MenuItem>
                <MenuItem value="portrait">Portrait</MenuItem>
                <MenuItem value="jmcOriginal">JMC</MenuItem>
              </Select>
            </FormControl>

            <Tooltip
              title={
                cardMode === "standard"
                  ? "Switch to compact view"
                  : "Switch to standard view"
              }
            >
              <IconButton onClick={toggleCardMode} color="primary">
                {cardMode === "standard" ? (
                  <ViewCompactIcon />
                ) : (
                  <ViewModuleIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>


          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              bgcolor: "#0046b5",
              "&:hover": { bgcolor: "#003694" },
            }}
          >
            Print ID Cards
          </Button>
        </Box>
        {/* search field  */}
        <TextField
          size="small"
          placeholder="Search the student by Name or Student ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ mb: 3, width: "350px" }}
          className="no-print"
        />

        <Divider sx={{ mb: 3 }} className="no-print" />

        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", my: 4 }}
            className="no-print"
          >
            <CircularProgress />
          </Box>
        ) : idCardData.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }} className="no-print">
            <Typography variant="body1" color="text.secondary">
              No ID cards found for this generation
            </Typography>
          </Box>
        ) : filteredData.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }} className="no-print">
            <Typography variant="body1" color="text.secondary">
              No ID cards match your search criteria
            </Typography>
          </Box>
        ) :
          (
            <>
              <Box
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}
                className="no-print"
              >
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                />
                <Typography variant="body2" color="text.secondary">
                  Select All
                </Typography>
                <Chip
                  label={`${selectedStudents.length} selected | Showing ${paginatedData.length} of ${idCardData.length} cards`}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Grid
                container
                spacing={2.5}
                ref={componentRef}
                className="print-container"
              >
                {paginatedData.map((data) => (
                  <Grid item key={data.id}>
                    {renderCard(data)}
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{ display: "flex", justifyContent: "right", mt: 3 }}
                className="no-print"
              >
                <Box>
                  <FormControl size="small" fullWidth>
                    <Select
                      variant="standard"
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      displayEmpty
                      sx={{
                        backgroundColor: "whitesmoke",
                        borderColor: "lightgray",
                        borderRadius: 1,
                        width: "150px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "lightgray",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "blue",
                        },
                        "& .MuiSelect-select": {
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                        },
                        "& .MuiSelect-icon": {
                          fontSize: "1rem",
                        },
                      }}
                    >
                      <MenuItem value={25}>
                        <em>rows per page</em>
                      </MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={200}>200</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  sx={{ ml: "40px" }}
                />
              </Box>
            </>
          )}
      </CardContent>
    </Card>
  );
};

export default GeneratedIdCards;