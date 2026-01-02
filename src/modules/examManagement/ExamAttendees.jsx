import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { 
  Typography, 
  Chip, 
  Box,
  CircularProgress,
  Alert
} from "@mui/material";

import { getExamDataByExamId, getAllApearedStudents  } from "../../components/dashboard/services/service";
const getStudentColumns = () => [
  {
    name: "no",
    label: "S.No.",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta) => {
        return tableMeta.rowIndex + 1;
      }
    }
  },
  {
    name: "fullName",
    label: "Student Name",
    options: {
      filter: true,
      sort: true,
      filterType: "textField"
    }
  },
  {
    name: "rollNo",
    label: "Roll No.",
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value) => value || "N/A"
    }
  },
  {
    name: "gender",
    label: "Gender",
    options: {
      filter: true,
      sort: true,
      filterType: "dropdown",
    }
  },
  {
    name: "batchYear",
    label: "Batch Year",
    options: {
      filter: true,
      sort: true,
      filterType: "dropdown"
    }
  },
  {
    name: "year",
    label: "Year",
    options: {
      filter: true,
      sort: true,
      filterType: "dropdown"
    }
  },
  {
    name: "semester",
    label: "Semester",
    options: {
      filter: true,
      sort: true,
      filterType: "dropdown",
      customBodyRender: (value) => value === 0 ? "N/A" : value
    }
  },
  {
    name: "programShortName",
    label: "Program",
    options: {
      filter: true,
      sort: true,
      filterType: "dropdown"
    }
  },
  {
    name: "facultyName",
    label: "Faculty",
    options: {
      filter: true,
      sort: true,
      filterType: "dropdown"
    }
  },
  {
    name: "phoneNo",
    label: "Phone",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => value || "N/A"
    }
  },
  {
    name: "doesAppear",
    label: "Appearance Status",
    options: {
      filter: true,
      sort: true,
      filterType: "dropdown",
      customBodyRender: (value) => (
        <Chip
          label={value ? "Appeared" : "Not Appeared"}
          size="small"
          color={value ? "success" : "error"}
          variant="filled"
        />
      )
    }
  },
  {
    name: "remarks",
    label: "Remarks",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => value || "N/A"
    }
  }
];

function ExamAttendees() {
  const [studentData, setStudentData] = useState([]);
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [examLoading, setExamLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setExamLoading(true);
        setError(null);
        const response = await getExamDataByExamId(id);
        setExamData(response);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch exam data");
      } finally {
        setExamLoading(false);
      }
    };

    if (id) {
      fetchExamData();
    }
  }, [id]);

  const fetchAppearedStudents = async () => {
    if (!examData) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getAllApearedStudents({
        batchId: examData.batchId,
        programId: examData.programMgmtId,
        page: 1, // Get all data for client-side pagination
        limit: 1000, // Large limit to get all students
      });
      
      // Process the student data
      const processedData = response.data.map((student, index) => ({
        ...student,
        no: index + 1,
      }));
      
      setStudentData(processedData);
    } catch (err) {
      console.error("Error fetching appeared students:", err);
      setStudentData([]);
      setError("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examData) {
      fetchAppearedStudents();
    }
  }, [examData]);

  // Show loading state
  if (examLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading exam data...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiTableCell: {
              styleOverrides: {
                head: {
                  backgroundColor: "#2b6eb5",
                  color: "black",
                  textTransform: "capitalize",
                  padding: "8px",
                  fontSize: "13px",
                  border: "1px solid #C2C2C2",
                  fontWeight: "bold"
                },
                body: {
                  fontSize: "12px",
                  padding: "8px",
                  border: "1px solid #C2C2C2",
                },
              },
            },
            MuiTableHead: {
              styleOverrides: {
                root: {
                  backgroundColor: "#2b6eb5",
                }
              }
            }
          },
        })}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={30} />
            <Typography
              variant="body1"
              style={{ color: "#2b6eb5", padding: "5px", marginLeft: "10px" }}
            >
              Loading students...
            </Typography>
          </Box>
        ) : (
          <MUIDataTable
            title={
              <Box>
                <Typography
                  variant="h6"
                  style={{ 
                    color: "#2b6eb5", 
                    padding: "5px", 
                    textAlign: "left",
                    fontWeight: "bold"
                  }}
                >
                  Exam Attendees
                </Typography>
                {examData && (
                  <Typography
                    variant="body2"
                    style={{ 
                      color: "#666", 
                      padding: "2px 5px",
                      textAlign: "left"
                    }}
                  >
                    {examData.examName} - {examData.subjectName}
                  </Typography>
                )}
              </Box>
            }
            data={studentData.length === 0 ? [] : studentData}
            columns={getStudentColumns()}
            options={{
              filterType: "multiselect",
              selectableRows: "none",
              responsive: "standard",
              elevation: 2,
              pagination: true,
              search: true,
              searchPlaceholder: "Search students...",
              rowsPerPage: 50,
              rowsPerPageOptions: [10, 25, 50, 100, 500, 1000],
              downloadOptions: {
                filename: `exam_attendees_${examData?.examName || 'export'}.csv`,
                separator: ',',
              },
              print: true,
              viewColumns: true,
              filter: true,
              searchOpen: false,
              
              textLabels: {
                body: {
                  noMatch: studentData.length === 0 ? "No students found for this exam" : "No matching records found",
                  toolTip: "Sort",
                },
                pagination: {
                  next: "Next Page",
                  previous: "Previous Page",
                  rowsPerPage: "Rows per page:",
                  displayRows: "of",
                },
                toolbar: {
                  search: "Search",
                  downloadCsv: "Download CSV",
                  print: "Print",
                  viewColumns: "View Columns",
                  filterTable: "Filter Table",
                },
                filter: {
                  all: "All",
                  title: "FILTERS",
                  reset: "RESET",
                },
                viewColumns: {
                  title: "Show Columns",
                  titleAria: "Show/Hide Table Columns",
                },
              },
              customToolbar: () => (
                <Box sx={{ mr: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Total Students: {studentData.length}
                  </Typography>
                </Box>
              ),
            }}
          />
        )}
      </ThemeProvider>
    </Box>
  );
}

export default ExamAttendees;