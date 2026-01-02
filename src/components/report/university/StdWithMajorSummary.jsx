import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAuthConfigSafe } from "../../../utils/dateUtils";
import {config} from '@config';
  const backendUrl = config.VITE_BACKEND_URL;

const getStudentCountByProgramMajor = async () => {
  const authConfig = getAuthConfigSafe()
  const response = await axios.get(
    `${backendUrl}/Student/GetStudentCountByProgramMajor`,
    authConfig
  );
  return response.data;
};

const getColumns = () => [
  { name: "no", label: "S.No.", options: { sort: false, filter: false } },
  {
    name: "programName",
    label: "Program Name",
    options: { filter: true, sort: true },
  },
  {
    name: "majorSubjectName",
    label: "Program Major",
    options: { filter: true, sort: true },
  },
  { name: "male", label: "Male", options: { filter: false, sort: true } },
  { name: "female", label: "Female", options: { filter: false, sort: true } },
  { name: "others", label: "Other", options: { filter: false, sort: true } },
  { name: "total", label: "Total", options: { filter: false, sort: true } },
];

const CustomHeader = () => (
  <thead>
    <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
      <th rowSpan={2} style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>
        S.No.
      </th>
      <th rowSpan={2} style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>
        Program Name
      </th>
      <th rowSpan={2} style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>
        Program Major
      </th>
      <th colSpan={4} style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>
        Number of students
      </th>
    </tr>
    <tr style={{ backgroundColor: "#2b6eb5", color: "whitesmoke" }}>
      <th style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>Male</th>
      <th style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>Female</th>
      <th style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>Other</th>
      <th style={{ border: "1px solid #c2c2c2", fontSize: "14px" }}>Total</th>
    </tr>
  </thead>
);

const StdWithMajorSummary = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const {
    data: rawData = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["studentCountByProgramMajor"],
    queryFn: getStudentCountByProgramMajor,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  // Process data to add serial numbers and calculate totals
  const processedData = React.useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    // Add serial numbers
    const dataWithSerialNumbers = rawData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));

    // Calculate totals
    const totals = rawData.reduce(
      (acc, item) => ({
        male: acc.male + (item.male || 0),
        female: acc.female + (item.female || 0),
        others: acc.others + (item.others || 0),
        total: acc.total + (item.total || 0),
      }),
      { male: 0, female: 0, others: 0, total: 0 }
    );

    // Add total row
    const totalRow = {
      no: "",
      programName: "Total",
      majorSubjectName: "",
      male: totals.male,
      female: totals.female,
      others: totals.others,
      total: totals.total,
    };

    return [...dataWithSerialNumbers, totalRow];
  }, [rawData]);

  if (error) {
    console.error("Error fetching student count data:", error);
  }

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
              <h1
                className="text-xl text-[#2b6eb5] font-medium text-right"
              >
                Students according to their program major
              </h1>
            }
            data={processedData.length === 0 ? [["No data available"]] : processedData}
            columns={getColumns()}
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
                // Style the total row (last row)
                if (rowIndex === processedData.length - 1) {
                  return {
                    style: {
                      backgroundColor: "#f0f0f0",
                      fontWeight: "bold",
                    },
                  };
                }
                return {};
              },
              customSort: (data, colIndex, order) => {
                // Keep the total row at the bottom when sorting
                const totalRowData = data[data.length - 1];
                const sortedData = data.slice(0, -1).sort((a, b) => {
                  return (
                    (a.data[colIndex] < b.data[colIndex] ? -1 : 1) *
                    (order === "desc" ? 1 : -1)
                  );
                });
                return [...sortedData, totalRowData];
              },
            }}
            components={{
              TableHead: () => <CustomHeader />,
            }}
          />
        )}
      </ThemeProvider>
    </>
  );
};

export default StdWithMajorSummary;