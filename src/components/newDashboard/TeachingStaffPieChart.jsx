import React from "react";
import ReactECharts from "echarts-for-react";
import { Paper, Typography, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getJoiningTypeByEmployeeType } from "../dashboard/services/service";
import { LoadingOverlay } from "@mantine/core";
const TeachingStaffPieChart = ({ authToken }) => {
  const {
    isLoading,
    data: employeeData = [],
    error,
  } = useQuery({
    queryKey: ["teachingStaff", authToken],
    queryFn: async () => {
      const data = await getJoiningTypeByEmployeeType(authToken);
      return data;
    },
    enabled: !!authToken,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: true,
  });

  // Extract teaching data
  const teachingData = employeeData.find((item) => item.title === "Teaching") || {};

  // Prepare chart data
  const chartData = [
    { value: teachingData.permanent || 0, name: "Permanent" },
    { value: teachingData.temporary || 0, name: "Temporary" },
    { value: teachingData.contract || 0, name: "Contract" },
    { value: teachingData.partTime || 0, name: "Part-Time" },
  ].filter((item) => item.value > 0);

  const totalValue = chartData.reduce((acc, item) => acc + item.value, 0);
  const colors = ["#1976d2", "#E94E77", "#9E9E9E", "rgb(94, 94, 94)"];

  const option =
    totalValue > 0
      ? {
          tooltip: {
            trigger: "item",
          },
          legend: {
            top: "5%",
            left: "center",
          },
          toolbox: {
            show: true,
            feature: {
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
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
                  color: "#fff",
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
        }
      : {
          title: {
            text: "No Teaching staff data",
            left: "center",
            top: "center",
          },
        };

   if (isLoading) {
    return (
      <LoadingOverlay
        visible={isLoading}
        zIndex={100}
        overlayProps={{ radius: "sm", blur: 1 }}
        loaderProps={{ color:"#1976d2", type: "bars" }}
      />
    );
  }

  if (error) {
    return (
      <Grid item xs={12} md={12}>
        <Paper elevation={5} sx={{ padding: "20px" }}>
          <Typography color="error" align="center">
            Error loading data.
          </Typography>
        </Paper>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} md={12}>
      <Paper elevation={5} sx={{ padding: "20px", backgroundColor: "#F5F5F5" }}>
        <Typography
          variant="body1"
          align="center"
          fontWeight={600}
          style={{ padding: "1rem", color: "#1976d2" }}
        >
          Teaching Staff By Type
        </Typography>
        {totalValue > 0 ? (
          <ReactECharts key={totalValue} option={option} style={{ height: "400px" }} />
        ) : (
          <Typography align="center">No data available</Typography>
        )}
      </Paper>
    </Grid>
  );
};

export default TeachingStaffPieChart;