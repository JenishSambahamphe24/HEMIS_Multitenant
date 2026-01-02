import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";
import axios from "axios";
import { LoadingOverlay } from "@mantine/core";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';
  const backendUrl = config.VITE_BACKEND_URL;

const columns = [
  { name: "no", label: "S.No.", options: { sort: false, filter: false } },
  {
    name: "fullName",
    label: "Full Name",
    options: { filter: false, sort: false },
  },
  {
    name: "email",
    label: "Email",
    options: { filter: false, sort: false },
  },
  {
    name: "phoneNumber",
    label: "Phone No.",
    options: { filter: false, sort: false },
  },
  {
    name: "ethnicity",
    label: "Ethnicity",
    options: { filter: false, sort: false },
  },
  {
    name: "pProvince",
    label: "Province",
    options: { filter: false, sort: false },
  },
  {
    name: "pDistrict",
    label: "District",
    options: { filter: false, sort: false },
  },
  {
    name: "localLevel",
    label: "Palika-ward",
    options: { filter: false, sort: false },
  },
  {
    name: "wardNo",
    label: "Ward No.",
    options: { filter: false, sort: false },
  },
  {
    name: "admissionYear",
    label: "Batch",
    options: { filter: true, sort: false },
  },
  {
    name: "facultyName",
    label: "Faculty",
    options: { filter: true, sort: false },
  },
  { name: "levelName", label: "Level", options: { filter: true, sort: false } },
  {
    name: "programName",
    label: "Program",
    options: { filter: true, sort: false },
  },
  {
    name: "majorSubjectName",
    label: "Major Subject",
    options: { filter: true, sort: false },
  },
  {
    name: "section",
    label: "Section",
    options: { filter: true, sort: false },
  },
];

const getMuiTheme = () =>
  createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#2b6eb5",
            color: "whitesmoke",
            textTransform: "capitalize",
            padding: "6px",
            fontSize: "14px",
            border: "2px solid #C2C2C2",
          },
          body: {
            fontSize: "14px",
            padding: "6px",
            border: "1px solid #C2C2C2",
          },
        },
      },
    },
  });

const CustomHeader = () => {
  const headerStyles = {
    padding: "8px",
    border: "1px solid #c2c2c2",
    backgroundColor: "#2b6eb5",
    color: "#FFFFFF",
    fontSize: "14px",
  };

  const headerLabels = [
    "S.No.",
    "Full Name",
    "Email",
    "Phone No.",
    "Ethnicity",
    "Province",
    "District",
    "Municipality",
    "Ward No.",
    "Batch Year",
    "Faculty",
    "Level",
    "Program",
    "Major subject",
    "Section"
  ];

  return (
    <thead>
      <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
        {headerLabels.map((label, index) => (
          <th key={index} style={headerStyles}>
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const fetchStudentData = async (fiscalYear) => {
  const config = getAuthConfigSafe();

  const response = await axios.get(
    `${backendUrl}/Student/GetStudentByFilter`,
    config
  );

    let studentArray = response.data;
 // Check if data is nested in common response structures
  if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    // Try common response patterns
    if (response.data.data && Array.isArray(response.data.data)) {
      studentArray = response.data.data;
    } else if (response.data.students && Array.isArray(response.data.students)) {
      studentArray = response.data.students;
    } else if (response.data.result && Array.isArray(response.data.result)) {
      studentArray = response.data.result;
    } else if (response.data.items && Array.isArray(response.data.items)) {
      studentArray = response.data.items;
    } else {
      // If it's an object but not an array, try to convert it
      studentArray = Object.values(response.data);
    }
  }

  // If still not an array, return empty array
  if (!Array.isArray(studentArray)) {
    console.warn("Expected array but got:", typeof studentArray);
    return [];
  }

  const updatedData = studentArray.map((student, index) => {
    const modifiedStudent = {
      ...student,
      fullName: `${student.firstName || ""} ${student.middleName || ""} ${
        student.lastName || ""
      }`.trim(),
      no: `${index + 1}`,
      levelName: student.levelName,
      facultyName: student.facultyName,
      ethnicity: student.ethnicity,
      programName: student.programShortName,
      localLevel: `${student.pLocalLevel}`,
      wardNo: student.pWardNo,
      phoneNumber: student.phoneNumber || "",
      gender: capitalize(student.gender) || "",
      pProvince: student.pProvince || "",
      pDistrict: student.pDistrict || "",
      email: student.email || "",
      admissionYear: student.admissionYear || "",
      section: student.section || "",
    };
    return modifiedStudent;
  });

  const sortedData = updatedData.sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  );

  const finalData = sortedData.map((item, index) => ({
    ...item,
    no: index + 1,
  }));

  return finalData;
};

const StudentInfoDetail = () => {

  const [fiscalYear, setFiscalYear] = useState("All");
  const [displayData, setDisplayData] = useState([]);

  const {
    data: studentData = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["students", fiscalYear],
    queryFn: () => fetchStudentData(fiscalYear),
    staleTime: 2 * 60 * 60 * 1000,
    cacheTime: 2 * 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    onSuccess: (data) => {
      setDisplayData(data);
    },
    onError: (error) => {
      console.error("Error fetching student data:", error);
    },
  });

  const getFilteredTableData = useMemo(() => {
    return (tableState) => {
      let filteredData = [...studentData];

      tableState.filterList.forEach((filter, index) => {
        if (filter && filter.length > 0) {
          const columnName = columns[index].name;
          filteredData = filteredData.filter((row) =>
            filter.includes(String(row[columnName]))
          );
        }
      });

      if (tableState.searchText) {
        filteredData = filteredData.filter((row) => {
          return Object.keys(row).some((key) => {
            return String(row[key])
              .toLowerCase()
              .includes(tableState.searchText.toLowerCase());
          });
        });
      }

      return filteredData;
    };
  }, [studentData]);

  const options = {
    filterType: "dropdown",
    selectableRows: "none",
    responsive: "standard",
    elevation: 0,
    pagination: true,
    search: true,
    searchPlaceholder: "Search...",
    rowsPerPage: 15,
    header: true,
    print: true,
    download: true,
    downloadOptions: {
      filename: "students.csv",
      separator: ",",
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },
    viewColumns: false,
    title: "Student Information Details",
    onTableChange: (action, tableState) => {
      if (action === "filterChange") {
        const fiscalYearColumnIndex = columns.findIndex(
          (col) => col.name === "fiscalYear"
        );

        if (fiscalYearColumnIndex !== -1) {
          const fiscalYearFilter = tableState.filterList[fiscalYearColumnIndex];
          const newFiscalYear =
            fiscalYearFilter.length > 0 ? fiscalYearFilter[0] : "0";

          if (newFiscalYear !== fiscalYear) {
            setFiscalYear(newFiscalYear);
          }
        }

        const filteredData = getFilteredTableData(tableState);
        setDisplayData(filteredData);
      } else if (action === "search") {
        const filteredData = getFilteredTableData(tableState);
        setDisplayData(filteredData);
      }
    },
    customToolbar: () => {
      return null;
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      const csvData = data;
      const head = buildHead(columns);
      const body = buildBody(csvData);
      return `${head}\n${body}`;
    },
  };

  // Error handling
  if (isError) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Typography color="error" variant="h6">
          Error loading student data
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          {error?.message || "Something went wrong"}
        </Typography>
        <button
          onClick={() => refetch()}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay
        visible={isLoading || isFetching}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "#2b6eb5", type: "bars" }}
      />

      <ThemeProvider theme={getMuiTheme()}>
        <div style={{ position: "relative" }}>
          <MUIDataTable
            title={
              <Typography
                style={{
                  color: "#2b6eb5",
                  fontSize: "20px",
                  padding: "5px",
                  textAlign: "right",
                }}
              >
                Student Information Details 
              </Typography>
            }
            data={studentData}
            columns={columns}
            options={options}
            components={{
              TableHead: CustomHeader,
            }}
          />
        </div>
      </ThemeProvider>
    </>
  );
};

export default StudentInfoDetail;
