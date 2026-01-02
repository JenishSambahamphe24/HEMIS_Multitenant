import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography, Grid } from "@mui/material";
import axios from "axios";
import { capitaliseFirstLetter, getAuthConfigSafe } from "../../../utils/dateUtils";
import { config } from '@config';

//chnaged
const columns = [
  { name: "no", label: "S.No.", options: { filter: false, sort: false } },
  {
    name: "fullName",
    label: "First Name",
    options: { filter: false, sort: false },
  },
  { name: "doB", label: "DoB", options: { filter: false, sort: false } },
  {
    name: "phone",
    label: "Phone No.",
    options: { filter: false, sort: false },
  },
  { name: "gender", label: "Gender", options: { filter: false, sort: false } },
  { name: "email", label: "Email", options: { filter: false, sort: false } },
  {
    name: "employeeType",
    label: "Employee Type",
    options: { filter: false, sort: false },
  },
  { name: "post", label: "Post", options: { filter: false, sort: false } },
  {
    name: "joiningType",
    label: "Joining Type",
    options: { filter: false, sort: false },
  },
  {
    name: "province",
    label: "Province",
    options: { filter: false, sort: false },
  },
  {
    name: "district",
    label: "District",
    options: { filter: false, sort: false },
  },
  {
    name: "localLevel",
    label: "Palika-Ward",
    options: { filter: false, sort: false },
  },
];

const options = {
  filterType: "",
  selectableRows: false,
  responsive: "standard", // Fixed typo: "tandard" → "standard"
  elevation: 0,
  pagination: true,
  search: true,
  searchPlaceholder: "Search...",
  searchProps: {
    style: {
      fontSize: 14,
      padding: 4,
      borderRadius: 4,
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
  title: "Student Information Details", 
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
            border: "2px solid #C2C2C2",
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

const CustomHeader = () => {
  return (
    <thead>
      <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          S.No.
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Full Name
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          DoB
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Phone No.
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Gender
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Email
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Staff Type
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Post
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Joining Type
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Province
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          District
        </th>
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Palika-Ward 
        </th>
      </tr>
    </thead>
  );
};

const NonTeachingDetails = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fixed: Use getAuthConfigSafe (note the correct capitalization)
        const authConfig = getAuthConfigSafe();
        
        const response = await axios.get(
          `${backendUrl}/Employee/Report/NonTeaching`,
          authConfig
        );
        
        const updatedData = response.data.map((employee, index) => {
          // Format the date similar to TeacherDetails
          let formattedDOB = "";
          if (employee.doB) {
            formattedDOB = employee.doB.split("T")[0];
          }
          
          return {
            ...employee,
            employeeType: capitaliseFirstLetter(employee.employeeType || ""),
            joiningType: capitaliseFirstLetter(employee.joiningType || ""),
            gender: capitaliseFirstLetter(employee.gender || ""),
            doB: formattedDOB, // Use formatted date
            no: `${index + 1}`,
            localLevel: `${employee.localLevel || ""}-${employee.ward || ""}`,
          };
        });
        
        setData(updatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // For better debugging
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
      }
    };

    fetchData();
  }, [backendUrl]); // Added backendUrl to dependency array

  return (
    <>
      <ThemeProvider theme={getMuiTheme()}>
        <Grid container sm={12}>
          <Grid item sm={12}>
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
                  Non-Teaching Staff Details
                </Typography>
              }
              data={data}
              columns={columns}
              options={options}
              components={{
                TableHead: CustomHeader,
              }}
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default NonTeachingDetails;

