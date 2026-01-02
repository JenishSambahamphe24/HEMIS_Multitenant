import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material';
import { Typography } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { getAuthConfigSafe } from '../../utils/dateUtils';
import { config as appConfig } from "@config";


const fetchStudentSummary = async () => {
  const authConfig = getAuthConfigSafe();
  const backendUrl = appConfig.VITE_BACKEND_URL
  const response = await axios.get(`${backendUrl}/Student/Report/GetStudentSummary`, authConfig);
  return response.data;
};

const processStudentData = (rawData) => {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return { processedData: [], ethnicGroups: [] };
  }
  const ethnicKeys = Object.keys(rawData[0]).filter(key =>
    ["Brahman", "Chhetri", "Madhesi", "Dalit", "Janajati", "muslim", "Tharu", "Others", "None"].includes(key)
  );
  const ethnicGroups = ethnicKeys.map(name => ({ name }));
  const processedData = rawData.map((student, index) => {
    const ethnicityData = {};
    ethnicKeys.forEach(key => {
      ethnicityData[key] = student[key] || 0;
    });

    const edj = ethnicKeys.reduce((total, key) => {
      if (!["Brahman", "Chhetri", "Others"].includes(key)) {
        return total + (student[key] || 0);
      }
      return total;
    }, 0);

    return {
      no: index + 1,
      campus: student.campus || '',
      level: student.level || '',
      faculty: student.faculty || '',
      program: student.program || '',
      male: student.male || 0,
      female: student.female || 0,
      other: student.other || 0,
      totalGender: student.totalGender || 0,
      ...ethnicityData,
      edj,
    };
  });

  const sortedData = processedData.sort((a, b) =>
    (a.campus || '').localeCompare(b.campus || '')
  );
  return { processedData: sortedData, ethnicGroups };
};

const StudentSummary = () => {
  const backendUrl = appConfig.VITE_BACKEND_URL;
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [ethnicGroups, setEthnicGroups] = useState([]);


  const {
    data: rawData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['studentSummary'],
    queryFn: () => fetchStudentSummary(),
    staleTime: 2 * 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  useEffect(() => {
    if (rawData) {
      console.log('Raw data received:', rawData);
      try {
        const { processedData, ethnicGroups: groups } = processStudentData(rawData);
        setData(processedData);
        setEthnicGroups(groups);
      } catch (processingError) {
        console.error('Error processing data:', processingError);
      }
    }
  }, [rawData]);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching student summary:", error);
    }
  }, [isError, error]);

  const getColumns = () => {
    const staticColumns = [
      { name: "no", label: "S.No.", options: { filter: false, sort: false, setCellProps: () => ({ style: { textAlign: "center" } }) } },
      { name: "campus", label: "Campus Name", options: { filter: true, sort: true } },
      { name: "level", label: "Level", options: { filter: true, sort: false } },
      { name: "faculty", label: "Faculty", options: { filter: true, sort: false } },
      { name: "program", label: "Program", options: { filter: true, sort: false } },
      { name: "male", label: "Male", options: { filter: false, sort: false, setCellProps: () => ({ style: { textAlign: "center" } }) } },
      { name: "female", label: "Female", options: { filter: false, sort: false, setCellProps: () => ({ style: { textAlign: "center" } }) } },
      { name: "other", label: "Other", options: { filter: false, sort: false, setCellProps: () => ({ style: { textAlign: "center" } }) } },
      { name: "totalGender", label: "Total Gender", options: { filter: false, sort: false, setCellProps: () => ({ style: { textAlign: "center" } }) } },
      { name: "edj", label: "EDG", options: { filter: false, sort: false, setCellProps: () => ({ style: { textAlign: "center" } }) } },
    ];

    const ethnicityColumns = ethnicGroups.map((ethnicity) => ({
      name: ethnicity.name,
      label: ethnicity.name,
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({ style: { textAlign: "center" } })
      }
    }));

    return [...staticColumns, ...ethnicityColumns];
  };

  const CustomHeader = ({ columns }) => {
    return (
      <thead>
        <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
          <th rowSpan="2" style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>S.No.</th>
          <th rowSpan="2" style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Campus Name</th>
          <th rowSpan="2" style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Level</th>
          <th rowSpan="2" style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Faculty</th>
          <th rowSpan="2" style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Program</th>
          <th colSpan="4" style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Gender</th>
          <th rowSpan="2" style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>EDG</th>
          <th colSpan={ethnicGroups.length} style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Caste Ethnicity</th>
        </tr>
        <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
          <th style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Male</th>
          <th style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Female</th>
          <th style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Other</th>
          <th style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>Total</th>
          {ethnicGroups.map((ethnicity, index) => (
            <th key={index} style={{ border: "1px solid #c2c2c2", fontSize: "14px", textAlign: "center" }}>
              {ethnicity.name}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const getMuiTheme = () => createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#2b6eb5",
            color: "whitesmoke",
            textTransform: "capitalize",
            padding: "6px",
            fontSize: "12px",
            border: "1px solid #C2C2C2",
          },
          body: {
            fontSize: "12px",
            padding: "6px",
            border: "1px solid #C2C2C2",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:nth-of-type(odd)": {
              backgroundColor: "#f5f5f5",
            },
          },
        },
      },
    },
  });

  if (isError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error loading student summary: {error?.message || 'Unknown error'}
        </Typography>
        <button onClick={() => refetch()} style={{ marginTop: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={<h1 className='text-xl font-medium text-[#2b6eb5] text-right'>Student Summary</h1>}
        data={data}
        columns={getColumns()}
        options={{
          filterType: "dropdown",
          selectableRows: "none",
          responsive: "standard",
          elevation: 0,
          pagination: true,
          search: true,
          searchPlaceholder: "Search...",
          rowsPerPage: 15,
          rowsPerPageOptions: [10, 15, 25, 50],
          print: false,
          download: true,
          viewColumns: true,
          textLabels: {
            body: {
              noMatch: isLoading ? "Loading data..." : "No matching records found",
            },
          },
        }}
        components={{
          TableHead: props => <CustomHeader {...props} />,
        }}
      />
    </ThemeProvider>
  );
};

export default StudentSummary;