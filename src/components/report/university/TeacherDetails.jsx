import React, { useCallback, useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography, Grid } from "@mui/material";
import axios from "axios";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import { config } from '@config';


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
  { name: "post", label: "Post", options: { filter: true, sort: false } },
  {
    name: "joiningType",
    label: "Joining Type",
    options: { filter: true, sort: false },
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
  {
    name: "citizenNo",
    label: "Citizen No.",
    options: { filter: false, sort: false },
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
          DOB
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
        <th
          style={{
            padding: "8px",
            border: "1px solid #c2c2c2",
            backgroundColor: "#2b6eb5",
            color: "#FFFFFF",
            fontSize: "14px",
          }}
        >
          Citizen No.
        </th>
      </tr>
    </thead>
  );
};

const TeacherDetails = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [data, setData] = useState([]);
  const [fiscalYear, setFiscalYear] = useState("All");
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
    viewColumns: false,
    title: "Student Information Details ",
    onTableChange: (action, tableState) => {
      if (action === "filterChange") {
        const fiscalYearColumnIndex = columns.findIndex(
          (col) => col.name === "fiscalYear"
        );
        if (fiscalYearColumnIndex !== -1) {
          const fiscalYearFilter = tableState.filterList[fiscalYearColumnIndex];
          setFiscalYear(
            fiscalYearFilter.length > 0 ? fiscalYearFilter[0] : "All"
          );
        }
      }
    },
  };
  
  const fetchData = useCallback(async () => {
    try {
      const config = getAuthConfigSafe();
      const response = await axios.get(
        `${backendUrl}/Employee/Report/Teaching`,
        config
      );

      const updatedData = response.data.map((employee, index) => {
        let formattedDOB = "";
        if (employee.doB) {
          formattedDOB = employee.doB.split("T")[0];
        }

        return {
          ...employee,
          no: index + 1,
          doB: formattedDOB,
          localLevel: `${employee.localLevel}-${employee.ward}`,
        };
      });

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);


  useEffect(() => {
    fetchData(fiscalYear);
  }, [fiscalYear, fetchData]);
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
                  Teaching Staff Details
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

export default TeacherDetails;
