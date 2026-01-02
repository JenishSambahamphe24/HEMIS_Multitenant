import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const columns1 = [
  { name: "position", label: "Position", options: { sort: false, filter: false } },
  { name: "permanentMale", label: "Male", options: { filter: false, sort: false } },
  { name: "permanentFemale", label: "Female", options: { filter: false, sort: false } },
  { name: "permanentOther", label: "Other", options: { filter: false, sort: false } },
  {
    name: "permanentTotal",
    label: " Gender",
    options: { filter: false, sort: false },
  },

  { name: "temporaryMale", label: "Male", options: { filter: false, sort: false } },
  { name: "temporaryFemale", label: "Female", options: { filter: false, sort: false } },
  { name: "temporaryOther", label: "Other", options: { filter: false, sort: false } },
  {
    name: "temporaryTotal",
    label: " Gender",
    options: { filter: false, sort: false },
  },

  { name: "contractMale", label: "Male", options: { filter: false, sort: false } },
  { name: "contractFemale", label: "Female", options: { filter: false, sort: false } },
  { name: "contractOther", label: "Other", options: { filter: false, sort: false } },
  {
    name: "contractTotal",
    label: " Gender",
    options: { filter: false, sort: false },
  },

  { name: "partTimeMale", label: "Male", options: { filter: false, sort: false } },
  { name: "partTimeFemale", label: "Female", options: { filter: false, sort: false } },
  { name: "partTimeOther", label: "Other", options: { filter: false, sort: false } },
  {
    name: "partTimeTotal",
    label: " Gender",
    options: { filter: false, sort: false },
  },

  {
    name: "grandTotal",
    label: "Grand Total",
    options: { sort: false, filter: false },
  },
];
const columns2 = [
  {
    name: "ethnicity",
    label: "Ethnicity",
    options: { sort: false, filter: false },
  },
  { name: "permanentMale", label: "Male", options: { filter: false, sort: false } },
  { name: "permanentFemale", label: "Female", options: { filter: false, sort: false } },
  { name: "permanentOther", label: "Other", options: { filter: false, sort: false } },
  {
    name: "permanentTotal",
    label: " Gender",
    options: { filter: false, sort: false },
  },

  { name: "temporaryMale", label: "Male", options: { filter: false, sort: false } },
  { name: "temporaryFemale", label: "Female", options: { filter: false, sort: false } },
  { name: "temporaryOther", label: "Other", options: { filter: false, sort: false } },
  {
    name: "temporaryTotal",
    label: " Gender",
    options: { filter: false, sort: false },
  },

  { name: "contractMale", label: "Male", options: { filter: false, sort: false } },
  { name: "contractFemale", label: "Female", options: { filter: false, sort: false } },
  { name: "contractOther", label: "Other", options: { filter: false, sort: false } },
  {
    name: "contractTotal",
    label: " Gender",
    options: { filter: false, sort: false },
  },

  { name: "partTimeMale", label: "Male", options: { filter: false, sort: false } },
  { name: "partTimeFemale", label: "Female", options: { filter: false, sort: false } },
  { name: "partTimeOther", label: "Other", options: { filter: false, sort: false } },
  {
    name: "partTimeTotal",
    label: " Gender",
    options: { filter: false, sort: false },
  },

  {
    name: "grandTotal",
    label: "Grand Total",
    options: { sort: false, filter: false },
  },
];

const options = {
  filterType: "",
  selectableRows: false,
  responsive: "tandard",
  elevation: 0,
  pagination: true,
  search: true,
  searchPlaceholder: "Search...",
  searchProps: {
    style: {
      fontSize: 14,
      padding: 4,
      borderRadius: 4,
      // border: '1px solid #ccc',
      width: 6,
    },
    inputProps: {
      placeholder: "Search...",
      style: {
        fontSize: 14,
        padding: 4,
      },
    },
  },
  print: true,
  download: true,
  viewColumns: false,
  title: "Teaching Staff", // Add title here
  rowsPerPage: 15,
};

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
            border: "1px solid #C2C2C2",
          },
          body: {
            fontSize: "14px",
            padding: "6px",
            border: "1px solid #C2C2C2",
          },
          root: {
            justifyContent: "center",
            "& input": {
              textAlign: "center",
            },
            padding: "0px",
          },
        },
      },
    },
  });

const CustomHeader1 = () => {
  return (
    <thead>
      <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
        <th
          rowSpan="2"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
            padding: "5px",
          }}
        >
          Position
        </th>
        <th
          colSpan="4"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Permanent
        </th>
        <th
          colSpan="4"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Temporary
        </th>
        <th
          colSpan="4"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Contract
        </th>
        <th
          colSpan="4"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Part-Time
        </th>
        <th
          rowSpan="2"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Grand Total
        </th>
      </tr>
      <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Male
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Female
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Other
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Total
        </th>

        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Male
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Female
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Other
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Total
        </th>

        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Male
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Female
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Other
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Total
        </th>

        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Male
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Female
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Other
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Total
        </th>
      </tr>
    </thead>
  );
};
const CustomHeader2 = () => {
  return (
    <thead>
      <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
        <th
          rowSpan="2"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Ethnicity
        </th>
        <th
          colSpan="4"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Permanent
        </th>
        <th
          colSpan="4"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Temporary
        </th>
        <th
          colSpan="4"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Contract
        </th>
        <th
          colSpan="4"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Part-Time
        </th>
        <th
          rowSpan="2"
          style={{
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Grand Total
        </th>
      </tr>

      <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Male
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Female
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Other
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Total
        </th>

        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Male
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Female
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Other
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Total
        </th>

        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Male
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Female
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Other
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Total
        </th>

        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Male
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Female
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Other
        </th>
        <th
          style={{
            border: "1px solid #c2c2c2",
            padding: "4px",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Total
        </th>
      </tr>
    </thead>
  );
};

const NonTeachingStaffSummary = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/Employee/Report/GetNonTeachingStaffByPostSummary`,
          config
        );
        const response1 = await axios.get(
          `${backendUrl}/Employee/Report/GetNonTeachingStaffByEthnicity`,
          config
        );
        const updatedData = response.data.map((employee, index) => ({
          ...employee,
          no: index + 1,
        }));
        const updatedData1 = response1.data.map((employee, index) => ({
          ...employee,
          no: index + 1,
        }));
        setData1(updatedData);
        setData2(updatedData1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <ThemeProvider theme={getMuiTheme()}>
        <Box >
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
                Non-Teaching Staff Summary by Gender
              </Typography>
            }
            data={data1}
            columns={columns1}
            options={options}
            components={{
              TableHead: CustomHeader1,
            }}
          />
        </Box>
        <Box marginTop="20px">
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
                Non-Teaching Staff Summary by Ethnicity
              </Typography>
            }
            data={data2}
            columns={columns2}
            options={options}
            components={{
              TableHead: CustomHeader2,
            }}
          />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default NonTeachingStaffSummary;
