import ReactECharts from "echarts-for-react";
import { Grid, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoadingOverlay } from "@mantine/core";
import {config} from '@config';

const StudentByEthnicity = ({ authToken }) => {
  const backendUrl = config.VITE_BACKEND_URL;
  const fetchEthnicityData = async () => {
    const response = await axios.get(`${backendUrl}/Dashboard/GetStudentByEthnicity`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  };

  const {
    isLoading,
    data: studentsData = [],
    error,
  } = useQuery({
    queryKey: ["ethnicTrend", authToken],
    queryFn: fetchEthnicityData,
    enabled: !!authToken,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    onError: (err) => {
      console.error("Failed to fetch student data by ethnicity:", err);
    },
  });

  const generateChartOption = () => {
    if (!studentsData || studentsData.length === 0) {
      return {};
    }

    // Filter out items where total is zero
    const filteredData = studentsData.filter((item) => item.total > 0);

    const categories = filteredData.map((item) => item.title);
    const seriesData = [
      {
        name: "Total Students",
        type: "bar",
        barWidth: 35,
        data: filteredData.map((item) => item.total || 0),
        itemStyle: { color: "#1976d2" },
        label: { show: true, position: "top", color: "#000" },
      },
    ];

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: seriesData.map((series) => series.name),
        textStyle: { color: "#2E294E" },
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { color: "#333", rotate: 15 },
        name: "Ethnicity",
        nameLocation: "middle",
        nameGap: 35,
      },
      yAxis: {
        type: "value",
        axisLine: { show: true },
        name: "No. of Students",
        nameLocation: "middle",
        nameGap: 35,
        axisLabel: { color: "#333" },
      },
      series: seriesData,
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
      <Grid container justifyContent="center">
        <Paper elevation={3} sx={{ width: "100%", padding: "1rem" }}>
          <Typography color="error" align="center">
            Failed to load chart data.
          </Typography>
        </Paper>
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center" alignItems="flex-start">
      <Grid item xs={12}>
        <Paper elevation={5} sx={{ padding: "0px", backgroundColor: "#F5F5F5" }}>
          <Typography
            variant="body1"
            align="center"
            fontWeight={900}
            style={{ padding: "1rem", color: "#1976d2" }}
          >
            Students by Ethnicity
          </Typography>

          <ReactECharts
            option={generateChartOption()}
            style={{ height: "400px" }}
            opts={{ renderer: "canvas" }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StudentByEthnicity;