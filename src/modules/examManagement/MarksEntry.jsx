import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  InputAdornment,
  TableHead,
  TableRow,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { LoadingOverlay } from "@mantine/core";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAllStdsForMarksEntryByEId } from "../../components/dashboard/services/service";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const CompactTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "28px",
    fontSize: "0.875rem",
  },
  "& .MuiInputBase-input": {
    padding: "4px 8px",
  },

  "& .MuiInputLabel-root": {
    transform: "translate(14px, 6px) scale(1)",
    fontSize: "0.875rem",
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
    },
  },

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "4px",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderWidth: "2px",
    },
  },

  "&.MuiTextField-root .MuiInputBase-multiline": {
    padding: 0,

    "& .MuiInputBase-input": {
      padding: "4px 8px",
      minHeight: "unset",
    },
  },
  "& .MuiFormHelperText-root": {
    marginTop: "2px",
    fontSize: "0.75rem",
  },

  "& .MuiInputBase-root.Mui-disabled": {
    backgroundColor: theme.palette.action.disabled,
    opacity: 0.6,
  },
}));

CompactTextField.defaultProps = {
  fullWidth: true,
  size: "small",
  variant: "outlined",
};

const MarksEntry = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [examAppearData, setExamAppearData] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [existingMarksData, setExistingMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const totalPages = Math.ceil(totalStudents / rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const onSubmit = async (data) => {
    if (!data.subjects || examAppearData.length === 0) {
      toast.error("No data available to submit");
      return;
    }
    const validationError = examAppearData.find((_, index) => {
      const theoreticalMarks = +(data.subjects?.[index]?.theoreticalMarks || 0);
      const practicalMarks = +(data.subjects?.[index]?.practicalMarks || 0);
      const theoreticalFullMarks = subjectInfo?.theoreticalFullMarks || 0;
      const practicalFullMarks = subjectInfo?.practicalFullMark || 0;

      if (theoreticalMarks > theoreticalFullMarks) {
        toast.error(
          `Student ${
            index + 1
          }: Theoretical marks (${theoreticalMarks}) cannot exceed full marks (${theoreticalFullMarks})`
        );
        return true;
      }
      if (practicalMarks > practicalFullMarks) {
        toast.error(
          `Student ${
            index + 1
          }: Practical marks (${practicalMarks}) cannot exceed full marks (${practicalFullMarks})`
        );
        return true;
      }
      if (theoreticalMarks < 0 || practicalMarks < 0) {
        toast.error(`Student ${index + 1}: Marks cannot be negative`);
        return true;
      }
      return false;
    });
    if (validationError) return;
    setLoading(true);
    const requestData = examAppearData.map((student, index) => {
      const theoreticalMarks = +(data.subjects?.[index]?.theoreticalMarks || 0);
      const practicalMarks = +(data.subjects?.[index]?.practicalMarks || 0);

      return {
        subjectExamScheduleId: id,
        achieveScored: theoreticalMarks + practicalMarks,
        studentID: student.studentId,
        theoreticalMarks,
        practicalMarks,
        remarks: data.subjects?.[index]?.remarks || "",
      };
    });

    try {
      const authConfig = getAuthConfigSafe();
      if (!authConfig) {
        toast.error("Authentication failed. Please login again.");
        return;
      }
      await axios.post(`${backendUrl}/MarksEntry`, requestData, authConfig);
      toast.success("Marks updated successfully!");
      fetchMarksData();
    } catch (error) {
      console.error("Error submitting marks:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while submitting marks"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchExamAppearData = async () => {
    if (!id) {
      toast.error("Subject exam schedule ID is missing");
      return;
    }
    try {
      setLoading(true);
      const response = await getAllStdsForMarksEntryByEId({
        examscheduleId: id,
        pageSize: rowsPerPage,
        studentPage: page,
        studentPageSize: rowsPerPage,
        name: debouncedSearchTerm,
      });
      if (response && response.length > 0) {
        const subjectData = response[0];
        setTotalRecords(subjectData.studentTotalRecords);
        setTotalStudents(subjectData.studentTotalRecords);
        setSubjectInfo(subjectData);
        setExamAppearData(subjectData.studentExamRecords || []);
      } else {
        setExamAppearData([]);
        setSubjectInfo(null);
        setTotalRecords(0);
        setTotalStudents(0);
        toast.info("No exam data found for this subject");
      }
    } catch (err) {
      console.error("Error fetching exam appear data:", err);
      setExamAppearData([]);
      setSubjectInfo(null);
      setTotalRecords(0);
      setTotalStudents(0);
      toast.error("Failed to fetch exam data");
    } finally {
      setLoading(false);
    }
  };
  const fetchMarksData = async () => {
    try {
      const config = getAuthConfigSafe();
      const response = await axios.get(
        `${backendUrl}/MarksEntry/FilterByExam?subjectExamScheduleId=${id}`,
        config
      );
      setExistingMarksData(response.data.data || []);
    } catch (err) {
      console.log("Error fetching marks data:", err);
      setExistingMarksData([]);
    }
  };
  const populateFormWithExistingMarks = () => {
    if (examAppearData.length > 0) {
      examAppearData.forEach((student, index) => {
        const existingMark = existingMarksData.find(
          (mark) => mark.studentID === student.studentId
        );

        if (existingMark) {
          setValue(
            `subjects[${index}].theoreticalMarks`,
            existingMark.theoreticalMarks || ""
          );
          setValue(
            `subjects[${index}].practicalMarks`,
            existingMark.practicalMarks || ""
          );
          setValue(`subjects[${index}].remarks`, existingMark.remarks || "");
        } else {
          setValue(`subjects[${index}].theoreticalMarks`, "");
          setValue(`subjects[${index}].practicalMarks`, "");
          setValue(`subjects[${index}].remarks`, "");
        }
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMarksData();
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    fetchExamAppearData();
  }, [id, page, rowsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    if (examAppearData.length > 0) {
      populateFormWithExistingMarks();
    }
  }, [examAppearData, existingMarksData]);
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
        <Box sx={{ padding: 2 }}>
          <Grid container justifyContent="center">
            <Grid item sm={12} display="flex">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by Students..."
                value={searchTerm}
                sx={{ bgcolor: "whitesmoke", width: "300px" }}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ color: "#2b6eb5" }} />
                    </InputAdornment>
                  ),
                  style: {
                    height: "30px",
                    padding: "0 10px",
                    fontSize: "13px",
                  },
                }}
                fullWidth
              />
              <h1 className="text-md flex-1 text-center font-medium text-[#0263b0]">
                Marks Entry for{" "}
                <span style={{ fontWeight: 700 }}>
                  {subjectInfo?.subjectName || "N/A"}
                </span>{" "}
                Subject ({totalStudents} students)
              </h1>
            </Grid>
            <Grid item xs={12}>
              {examAppearData.length === 0 ? (
                <Typography textAlign="center" sx={{ mt: 4 }}>
                  No exam data available for marks entry.
                </Typography>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Paper elevation={3} sx={{ marginTop: 2 }}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead style={{ backgroundColor: "#2A629A" }}>
                          <TableRow>
                            <TableCell
                              style={{
                                color: "#FFFFFF",
                                border: "1px solid #ddd",
                                padding: "4px",
                                fontWeight: "300",
                                textAlign: "center",
                              }}
                              rowSpan={2}
                            >
                              S.No.
                            </TableCell>
                            <TableCell
                              style={{
                                color: "#FFFFFF",
                                border: "1px solid #ddd",
                                padding: "4px",
                                fontWeight: "300",
                                textAlign: "center",
                              }}
                              rowSpan={2}
                            >
                              Student Name
                            </TableCell>
                            <TableCell
                              style={{
                                color: "#FFFFFF",
                                border: "1px solid #ddd",
                                padding: "4px",
                                fontWeight: "300",
                                textAlign: "center",
                              }}
                              rowSpan={2}
                            >
                              Subject
                            </TableCell>
                            <TableCell
                              style={{
                                color: "#FFFFFF",
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "center",
                                fontWeight: "300",
                              }}
                              colSpan={3}
                            >
                              Theory
                            </TableCell>
                            <TableCell
                              style={{
                                color: "#FFFFFF",
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "center",
                                fontWeight: "300",
                              }}
                              colSpan={3}
                            >
                              Practical
                            </TableCell>
                            <TableCell
                              style={{
                                color: "#FFFFFF",
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "center",
                                fontWeight: "300",
                              }}
                              rowSpan={2}
                            >
                              Total Obtained
                            </TableCell>
                            <TableCell
                              style={{
                                color: "#FFFFFF",
                                border: "1px solid #ddd",
                                padding: "4px",
                                textAlign: "center",
                                fontWeight: "300",
                                width: "15%",
                              }}
                              rowSpan={2}
                            >
                              Marks obtained
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: "#ffffff",
                                border: "1px solid #ddd",
                                fontWeight: "300",
                                padding: "4px",
                                textAlign: "center",
                              }}
                            >
                              <h1 className="text-xs">Full Marks</h1>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#ffffff",
                                border: "1px solid #ddd",
                                fontWeight: "300",
                                textAlign: "center",
                                padding: "4px",
                              }}
                            >
                              <h1 className="text-xs">Pass Marks</h1>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#ffffff",
                                border: "1px solid #ddd",
                                fontWeight: "300",
                                textAlign: "center",
                                padding: "4px",
                              }}
                            >
                              <h1 className="text-xs">Remarks</h1>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#ffffff",
                                border: "1px solid #ddd",
                                fontWeight: "300",
                                textAlign: "center",
                                padding: "4px",
                              }}
                            >
                              <h1 className="text-xs">Full Marks</h1>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#ffffff",
                                border: "1px solid #ddd",
                                fontWeight: "300",
                                textAlign: "center",
                                padding: "4px",
                              }}
                            >
                              <h1 className="text-xs">Pass marks</h1>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#ffffff",
                                border: "1px solid #ddd",
                                fontWeight: "300",
                                textAlign: "center",
                                padding: "4px",
                              }}
                            >
                              <h1 className="text-xs">Marks Obtained</h1>
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {examAppearData.map((student, index) => {
                            const existingMark = existingMarksData.find(
                              (mark) => mark.studentID === student.studentId
                            );

                            const theoreticalFullMarks =
                              subjectInfo?.theoreticalFullMarks ||
                              existingMark?.theoriticalFullMark ||
                              0;
                            const practicalFullMarks =
                              subjectInfo?.practicalFullMark ||
                              existingMark?.practicalFullMark ||
                              0;

                            return (
                              <TableRow key={index}>
                                {/* Static cells remain the same */}
                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                  }}
                                >
                                  <h1 className="text-xs">
                                    {(page - 1) * rowsPerPage + index + 1}
                                  </h1>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                  }}
                                >
                                  <h1 className="text-xs">
                                    {student?.firstName || "N/A"}
                                  </h1>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                  }}
                                >
                                  <h1 className="text-xs">
                                    {subjectInfo?.subjectName || "N/A"}
                                  </h1>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                    padding: "4px",
                                  }}
                                >
                                  <h1 className="text-xs">
                                    {theoreticalFullMarks}
                                  </h1>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                    padding: "4px",
                                  }}
                                >
                                  <h1 className="text-xs">
                                    {subjectInfo?.theoreticalPassMarks ||
                                      existingMark?.theoriticalPassMark ||
                                      0}
                                  </h1>
                                </TableCell>

                                {/* Theoretical Marks - Using styled component */}
                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                  }}
                                >
                                  <Controller
                                    name={`subjects[${index}].theoreticalMarks`}
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                      min: {
                                        value: 0,
                                        message: "Marks must be 0 or more",
                                      },
                                      max: {
                                        value: theoreticalFullMarks,
                                        message: `Marks cannot exceed ${theoreticalFullMarks}`,
                                      },
                                      validate: (value) => {
                                        const numValue = parseFloat(value);
                                        if (isNaN(numValue)) return true;
                                        if (numValue > theoreticalFullMarks)
                                          return `Marks cannot exceed ${theoreticalFullMarks}`;
                                        if (numValue < 0)
                                          return "Marks cannot be negative";
                                        return true;
                                      },
                                    }}
                                    render={({ field }) => (
                                      <CompactTextField
                                        {...field}
                                        type="number"
                                        placeholder="Enter marks"
                                        disabled={
                                          subjectInfo?.isTheoretical === false
                                        }
                                        inputProps={{
                                          min: 0,
                                          max: theoreticalFullMarks,
                                          step: "0.01",
                                        }}
                                        onChange={(e) => {
                                          const value = parseFloat(
                                            e.target.value
                                          );
                                          if (
                                            !isNaN(value) &&
                                            value > theoreticalFullMarks
                                          ) {
                                            toast.error(
                                              `Theoretical marks cannot exceed ${theoreticalFullMarks}`
                                            );
                                            return;
                                          }
                                          field.onChange(e);
                                        }}
                                        error={
                                          !!errors?.subjects?.[index]
                                            ?.theoreticalMarks
                                        }
                                        helperText={
                                          errors?.subjects?.[index]
                                            ?.theoreticalMarks?.message
                                        }
                                      />
                                    )}
                                  />
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                    padding: "4px",
                                  }}
                                >
                                  <h1 className="text-xs">
                                    {practicalFullMarks}
                                  </h1>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                    padding: "4px",
                                  }}
                                >
                                  <h1 className="text-xs">
                                    {subjectInfo?.practicalPassMark ||
                                      existingMark?.practicalPassMark ||
                                      0}
                                  </h1>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                  }}
                                >
                                  <Controller
                                    name={`subjects[${index}].practicalMarks`}
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                      min: {
                                        value: 0,
                                        message: "Marks must be 0 or more",
                                      },
                                      max: {
                                        value: practicalFullMarks,
                                        message: `Marks cannot exceed ${practicalFullMarks}`,
                                      },
                                      validate: (value) => {
                                        const numValue = parseFloat(value);
                                        if (isNaN(numValue)) return true;
                                        if (numValue > practicalFullMarks)
                                          return `Marks cannot exceed ${practicalFullMarks}`;
                                        if (numValue < 0)
                                          return "Marks cannot be negative";
                                        return true;
                                      },
                                    }}
                                    render={({ field }) => (
                                      <CompactTextField
                                        {...field}
                                        type="number"
                                        placeholder="Enter marks"
                                        disabled={
                                          subjectInfo?.isPractical === false
                                        }
                                        inputProps={{
                                          min: 0,
                                          max: practicalFullMarks,
                                          step: "0.01",
                                        }}
                                        onChange={(e) => {
                                          const value = parseFloat(
                                            e.target.value
                                          );
                                          if (
                                            !isNaN(value) &&
                                            value > practicalFullMarks
                                          ) {
                                            toast.error(
                                              `Practical marks cannot exceed ${practicalFullMarks}`
                                            );
                                            return;
                                          }
                                          field.onChange(e);
                                        }}
                                        error={
                                          !!errors?.subjects?.[index]
                                            ?.practicalMarks
                                        }
                                        helperText={
                                          errors?.subjects?.[index]
                                            ?.practicalMarks?.message
                                        }
                                      />
                                    )}
                                  />
                                </TableCell>

                                {/* Total marks cell */}
                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                    padding: "4px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {(
                                    +(
                                      watch(
                                        `subjects[${index}].theoreticalMarks`
                                      ) || 0
                                    ) +
                                    +(
                                      watch(
                                        `subjects[${index}].practicalMarks`
                                      ) || 0
                                    )
                                  ).toFixed(2)}
                                </TableCell>

                                {/* Remarks - Using styled component */}
                                <TableCell
                                  sx={{
                                    color: "#000000",
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                  }}
                                >
                                  <Controller
                                    name={`subjects[${index}].remarks`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <CompactTextField
                                        {...field}
                                        placeholder="Enter remarks"
                                        multiline
                                        rows={1}
                                      />
                                    )}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>

                  {/* Modified footer section */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {/* Empty box on the left for balance */}
                    <Box sx={{ flex: 1 }} />

                    {/* Submit button centered */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flex: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                        size="medium"
                        sx={{ minWidth: 150 }}
                      >
                        {loading
                          ? "Submitting..."
                          : existingMarksData.length > 0
                          ? "Update Marks"
                          : "Submit Marks"}
                      </Button>
                    </Box>

                    {/* Pagination controls on the right */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        flex: 1,
                      }}
                    >
                      <FormControl size="small" sx={{ mr: 2, minWidth: 100 }}>
                        <Select
                          variant="standard"
                          value={rowsPerPage}
                          onChange={handleRowsPerPageChange}
                        >
                          <MenuItem value={25}>25 rows</MenuItem>
                          <MenuItem value={50}>50 rows</MenuItem>
                          <MenuItem value={100}>100 rows</MenuItem>
                          <MenuItem value={200}>200 rows</MenuItem>
                          <MenuItem value={150}>300 rows</MenuItem>
                        </Select>
                      </FormControl>
                      <Pagination
                        count={totalPages}
                        page={page}
                        shape="rounded"
                        onChange={handlePageChange}
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  </Box>
                </form>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default MarksEntry;
