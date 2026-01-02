import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Checkbox,
  Chip,
  Grid,
  FormHelperText,
} from "@mui/material";
import { grey, blue, lightBlue } from "@mui/material/colors";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const PermissionManagement = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const [institutionType, setInstitutionType] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [uniModule, setUniModule] = useState([]);
  const [collegeModule, setCollegeModule] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [institutionTypeError, setInstitutionTypeError] = useState(false);
  const [selectedInstitutionError, setSelectedInstitutionError] =
    useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const handleInstitutionTypeChange = (event) => {
    setInstitutionType(event.target.value);
    setSelectedInstitution("");
    setInstitutionTypeError(false);
    setSelectedInstitutionError(false);
    setSelectedModules([]);
  };
  const handleInstitutionSelectChange = (event) => {
    setSelectedInstitution(event.target.value);
    setSelectedInstitutionError(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthconfigSafe()()
        const uniResponse = await axios.get(
          `${backendUrl}/Moodule/GetModulesForUni`,
          config
        );
        const collegeResponse = await axios.get(
          `${backendUrl}/ModuleCollegeAccess`,
          config
        );
        setUniModule(uniResponse.data);
        setCollegeModule(collegeResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthconfigSafe()()
        const collegeResponse = await axios.get(
          `${backendUrl}/Campus/GetAllCampuses`,
          config
        );
        const uniResponse = await axios.get(
          `${backendUrl}/University/GetAllUniversities`,
          config
        );
        setUniversities(uniResponse.data);
        setColleges(collegeResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!institutionType) {
      setInstitutionTypeError(true);
      return;
    }
    if (!selectedInstitution) {
      setSelectedInstitutionError(true);
      return;
    }
    if (selectedModules.length === 0) {
      toast.error("Please select at least one module.");
      return;
    }

    try {
      const config = getAuthConfigSafe()
      const requestData = {
        campusId: institutionType === "college" ? selectedInstitution : 0,
        universityId:
          institutionType === "university" ? selectedInstitution : null,
        MooduleId: selectedModules,
        isActive: true,
      };

      const response = await axios.post(
        `${backendUrl}/CollegeModule`,
        requestData,
        config
      );

      if (response.status === 200) {
        toast.success("Permissions assigned successfully!");
      } else {
        toast.error("Failed to assign permissions");
      }
    } catch (error) {
      toast.error("Error posting data:", error);
    }
  };

  return (
    <div>
      <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
        <Typography
          variant="h6"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: "semibold", color: blue[700] }}
        >
          Module Access Management
        </Typography>

        <Grid container spacing={2} mb={1}>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small" error={institutionTypeError}>
              <InputLabel
                id="institution-select-label"
                sx={{ fontWeight: "semibold", color: blue[700] }}
              >
                Select Institution Type
              </InputLabel>
              <Select
                labelId="institution-select-label"
                id="institution-select"
                size="small"
                label="Select Institution Type"
                value={institutionType}
                onChange={handleInstitutionTypeChange}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  borderColor: "#c2c2c2",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#c2c2c2",
                    },
                    "&:hover fieldset": {
                      borderColor: blue[500],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: blue[700],
                      boxShadow: `0 0 0 2px ${blue[100]}`,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "1rem",
                  },
                  "& .MuiSelect-icon": {
                    color: blue[700],
                  },
                }}
              >
                <MenuItem value="university">University</MenuItem>
                <MenuItem value="college">College</MenuItem>
              </Select>
              {institutionTypeError && (
                <FormHelperText>Institution type is required</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {institutionType && (
              <FormControl
                fullWidth
                size="small"
                error={selectedInstitutionError}
              >
                <InputLabel
                  id="specific-institution-select-label"
                  sx={{ fontWeight: "semibold", color: blue[700] }}
                >
                  Select{" "}
                  {institutionType === "university" ? "University" : "College"}
                </InputLabel>
                <Select
                  labelId="specific-institution-select-label"
                  id="specific-institution-select"
                  size="small"
                  label={`Select ${institutionType === "university" ? "University" : "College"
                    }`}
                  value={selectedInstitution}
                  onChange={handleInstitutionSelectChange}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    borderColor: "#c2c2c2",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#c2c2c2",
                      },
                      "&:hover fieldset": {
                        borderColor: blue[500],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: blue[700],
                        boxShadow: `0 0 0 2px ${blue[100]}`,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "1rem",
                    },
                    "& .MuiSelect-icon": {
                      color: blue[700],
                    },
                  }}
                >
                  {(institutionType === "university"
                    ? universities
                    : colleges
                  ).map((institution) => (
                    <MenuItem key={institution.id} value={institution.id}>
                      {institutionType === "university"
                        ? institution?.name
                        : institution?.campusName}
                    </MenuItem>
                  ))}
                </Select>
                {selectedInstitutionError && (
                  <FormHelperText>Institution is required</FormHelperText>
                )}
              </FormControl>
            )}
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="module-management-table">
            <TableHead sx={{ backgroundColor: blue[600] }}>
              <TableRow sx={{ height: 35 }}>
                <TableCell
                  sx={{
                    fontWeight: "semibold",
                    fontSize: "1rem",
                    textAlign: "center",
                    color: "white",
                    border: `1px solid #c2c2c2`,
                    padding: "6px 10px",
                  }}
                >
                  Module Name
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "semibold",
                    fontSize: "1rem",
                    color: "white",
                    border: `1px solid #c2c2c2`,
                    padding: "6px 10px",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "semibold",
                    fontSize: "1rem",
                    color: "white",
                    textAlign: "center",
                    border: `1px solid #c2c2c2`,
                    padding: "6px 10px",
                  }}
                >
                  Remarks
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Show message when no institution is selected */}
            {!institutionType ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                  <Typography variant="body1" color={grey[700]}>
                    Please select Institution Type
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // Render modules based on institution type
              (institutionType === "university"
                ? uniModule
                : collegeModule
              ).map((module, index) => {
                const isInactive = module.status === "Inactive";
                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: isInactive ? grey[100] : "white",
                      cursor: isInactive ? "not-allowed" : "pointer",
                      opacity: isInactive ? 0.6 : 1,
                      "&:hover": {
                        backgroundColor: isInactive ? grey[100] : lightBlue[50],
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: `1px solid #c2c2c2`,
                        padding: "6px 10px",
                      }}
                    >
                      <Checkbox
                        disabled={isInactive}
                        sx={{ padding: 0 }}
                        checked={selectedModules.includes(module.id)}
                        onChange={(e) => {
                          // Add or remove the module from the selected modules list
                          if (e.target.checked) {
                            setSelectedModules((prev) => [...prev, module.id]);
                          } else {
                            setSelectedModules((prev) =>
                              prev.filter((id) => id !== module.id)
                            );
                          }
                        }}
                      />
                      {module.displayName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        border: `1px solid #c2c2c2`,
                        padding: "6px 10px",
                      }}
                    >
                      <Chip
                        label={module.isActive ? "Active" : "Inactive"}
                        color={module.isActive ? "success" : "error"}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: `1px solid #c2c2c2`,
                        padding: "6px 10px",
                      }}
                    >
                      {module.description}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Assign Permissions
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default PermissionManagement;
