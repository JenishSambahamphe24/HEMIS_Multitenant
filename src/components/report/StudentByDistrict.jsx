
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const getDynamicColumns = (ethnicGroups) => {
  const ethnicityColumns = ethnicGroups.map((ethnicity) => ({
    name: `ethnicity_${ethnicity.name.toLowerCase().replace(/\s+/g, "")}`,
    label: ethnicity.name,
    options: { filter: false, sort: false },
  }));

  const staticColumns = [
    { name: "no", label: "S.No.", options: { sort: false, filter: false } },
    {
      name: "district",
      label: "District",
      options: { filter: true, sort: false },
    },
    { name: "male", label: "Male", options: { filter: false, sort: false } },
    {
      name: "female",
      label: "Female",
      options: { filter: false, sort: false },
    },
    { name: "other", label: "Other", options: { filter: false, sort: false } },
    {
      name: "totalGender",
      label: "Total Gender",
      options: { filter: false, sort: false },
    },
    { name: "edj", label: "EDG", options: { filter: false, sort: false } },
  ];
  return [...staticColumns, ...ethnicityColumns];
};

const CustomHeader = ({ ethnicGroups }) => (
  <thead>
    <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
      <th rowSpan="2" style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>
        S.No.
      </th>
      <th rowSpan="2" style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>
        District
      </th>
      <th colSpan="4" style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>
        Gender
      </th>
      <th rowSpan="2" style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>
        EDJ
      </th>
      <th
        colSpan={ethnicGroups.length}
        style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}
      >
        Caste Ethnicity
      </th>
    </tr>
    <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
      <th style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>Male</th>
      <th style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>Female</th>
      <th style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>Other</th>
      <th style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>Total</th>
      {ethnicGroups.map((ethnicity, index) => (
        <th
          key={`ethnic-header-${index}`}
          style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}
        >
          {ethnicity.name}
        </th>
      ))}
    </tr>
  </thead>
);


const StudentByDistrict = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const [data, setData] = useState([]);
  const [ethnicGroups, setEthnicGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfigSafe()
        const response = await axios.get(
          `${backendUrl}/Student/Report/GetStudentByDistrict`,
          config
        );
        const groups = response.data.length > 0 ? response.data[0].ethnicGroup : [];
        setEthnicGroups(groups);
        const updatedData = response.data.map((student, index) => {
          const ethnicityData = {};
          if (student.ethnicGroup && Array.isArray(student.ethnicGroup)) {
            student.ethnicGroup.forEach(group => {
              const key = `ethnicity_${group.name.toLowerCase().replace(/\s+/g, "")}`;
              ethnicityData[key] = group.count || 0;
            });
          }
          return {
            ...student,
            ...ethnicityData,
          };
        });
        const sortedData = updatedData.sort(function (a, b) {
          if (a.district < b.district) {
            return -1;
          }
          if (a.district > b.district) {
            return 1;
          }
          return 0;
        });
        setData(
          sortedData.map((item, index) => ({
            ...item,
            no: index + 1,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  return (
    <>
      <ThemeProvider
        theme={createTheme({
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
          },
        })}
      >
        {loading ? (
          <Typography
            variant="body1"
            style={{ color: "#2b6eb5", padding: "5px", textAlign: "center" }}
          >
            Loading...
          </Typography>
        ) : (
          <MUIDataTable
            title={
              <Typography
                variant="body1"
                style={{ color: "#2b6eb5", padding: "5px", textAlign: "right" }}
              >
                Student By District
              </Typography>
            }
            data={data.length === 0 ? [["No data available"]] : data}
            columns={getDynamicColumns(ethnicGroups)}
            options={{
              filterType: "",
              selectableRows: false,
              responsive: "standard",
              elevation: 0,
              pagination: true,
              search: true,
              searchPlaceholder: "Search...",
              rowsPerPage: 15,
              textLabels: {
                body: {
                  noMatch: "No data available",
                },
              },
              setCellProps: (cellValue, columnIndex, rowIndex) => {
                if (rowIndex === data.length - 1) {
                  return {
                    style: {
                      backgroundColor: '#f0f0f0',
                      fontWeight: 'bold',
                    }
                  };
                }
                return {};
              },
              customSort: (data, colIndex, order) => {
                const totalRowData = data[data.length - 1];
                const sortedData = data.slice(0, -1).sort((a, b) => {
                  return (a.data[colIndex] < b.data[colIndex] ? -1 : 1) * (order === 'desc' ? 1 : -1);
                });
                return [...sortedData, totalRowData];
              },
            }}
            components={{
              TableHead: () => <CustomHeader ethnicGroups={ethnicGroups} />,
            }}
          />
        )}
      </ThemeProvider>
    </>
  );
};

export default StudentByDistrict;