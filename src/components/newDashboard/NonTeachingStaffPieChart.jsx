import React from "react";
import ReactECharts from "echarts-for-react";
import { Paper, Typography, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getJoiningTypeByEmployeeType } from "../dashboard/services/service";
import { LoadingOverlay } from "@mantine/core";

const NonTechingStaffPieChart = ({ authToken }) => {
  const {
    isLoading,
     data: employeeData = [],
    error,
  } = useQuery({
    queryKey: ["nonTeachingStaff", authToken],
    queryFn: async () => {
      const data = await getJoiningTypeByEmployeeType(authToken);
      return data;
    },
    enabled: !!authToken,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: true,
  });

  // Extract Technical and Administrative staff
  const technical = employeeData.find((item) => item.title === "Technical") || {};
  const administrative =
    employeeData.find((item) => item.title === "Administrative") || {};

  // Prepare chart data for Technical
  const chartData = [
    { value: technical.permanent || 0, name: "Permanent" },
    { value: technical.temporary || 0, name: "Temporary" },
    { value: technical.contract || 0, name: "Contract" },
    { value: technical.partTime || 0, name: "Part-Time" },
  ].filter((item) => item.value > 0);

  const totalValue = chartData.reduce((acc, item) => acc + item.value, 0);

  // Prepare chart data for Administrative
  const chartData1 = [
    { value: administrative.permanent || 0, name: "Permanent" },
    { value: administrative.temporary || 0, name: "Temporary" },
    { value: administrative.contract || 0, name: "Contract" },
    { value: administrative.partTime || 0, name: "Part-Time" },
  ].filter((item) => item.value > 0);

  const totalValue1 = chartData1.reduce((acc, item) => acc + item.value, 0);

  const colors = ["#1976d2", "#E94E77", "#9E9E9E", "rgb(94, 94, 94)"];

  const generateChartOption = (chartData, totalValue, titleText) => {
    if (totalValue <= 0) {
      return {
        title: {
          text: titleText || "No data available",
          left: "center",
          top: "center",
        },
      };
    }

    return {
      tooltip: { trigger: "item" },
      legend: { top: "5%", left: "center" },
      toolbox: {
        show: true,
        feature: {
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: "Employee Type",
          type: "pie",
          radius: ["45%", "60%"],
          avoidLabelOverlap: false,
          emphasis: {
            label: {
              show: true,
              fontSize: 24,
              fontWeight: "bold",
            },
          },
          label: {
            show: true,
            position: "inside",
            formatter: "{c}",
            textStyle: {
              fontSize: 14,
              color: "#F5F5F5",
            },
          },
          labelLine: {
            show: false,
          },
          data: chartData.map((item, index) => ({
            ...item,
            itemStyle: { color: colors[index % colors.length] },
          })),
        },
      ],
      title: {
        text: totalValue.toString(),
        subtext: "Total",
        left: "center",
        top: "center",
        textStyle: {
          fontSize: 30,
          fontWeight: "bold",
          color: "#333",
        },
        subtextStyle: {
          fontSize: 16,
          color: "#666",
        },
      },
    };
  };

  if (isLoading) {
    return (
      <LoadingOverlay
        visible={isLoading}
        zIndex={100}
        overlayProps={{ radius: "sm", blur: 1 }}
        loaderProps={{ color: "#1976d2", type: "bars" }}
      />
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Typography color="error">Error loading chart data.</Typography>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={5} sx={{ padding: "20px", backgroundColor: "#F5F5F5" }}>
          <Typography
            variant="body1"
            align="center"
            fontWeight={600}
            style={{ padding: "1rem", color: "#1976d2" }}
          >
            Staff By Recruitment Type (Technical)
          </Typography>
          <ReactECharts
            option={generateChartOption(
              chartData,
              totalValue,
              "No Technical staff data"
            )}
            style={{ height: "400px" }}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={5} sx={{ padding: "20px", backgroundColor: "#F5F5F5" }}>
          <Typography
            variant="body1"
            align="center"
            fontWeight={600}
            style={{ padding: "1rem", color: "#1976d2" }}
          >
            Staff By Recruitment Type (Administrative)
          </Typography>
          <ReactECharts
            option={generateChartOption(
              chartData1,
              totalValue1,
              "No Administrative staff data"
            )}
            style={{ height: "400px" }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NonTechingStaffPieChart;