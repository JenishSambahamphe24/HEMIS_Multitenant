import React from "react";
import ReactECharts from "echarts-for-react";
import { Paper, Typography, Grid } from "@mui/material";
import { getStudentByFaculty } from "../dashboard/services/service";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "@mantine/core";

const FacultyLevelChart = ({ authToken }) => {
  const { isLoading, data: studentsByFaculty = [], error } = useQuery({
    queryKey: ["facultyStudents", authToken],
    queryFn: () => getStudentByFaculty(authToken),
    enabled: !!authToken,
    staleTime: 1000 * 60 * 60, 
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    onError: (err) => {
      console.error("Failed to fetch student data by faculty:", err);
    },
  });

  const generateChartOption = () => {
    if (!studentsByFaculty.length) return {};

    const categories = ["Male", "Female", "Others", "Total"];
    const colors = ["#1976d2", "#E94E77", "rgb(94, 94, 94)", "#9E9E9E"];

    // Filter out faculties where all values are zero
    const filteredFaculties = studentsByFaculty.filter((faculty) =>
      categories.some((category) => {
        switch (category) {
          case "Male":
            return faculty.male > 0;
          case "Female":
            return faculty.female > 0;
          case "Others":
            return faculty.other > 0;
          case "Total":
            return faculty.total > 0;
          default:
            return false;
        }
      })
    );

    const seriesData = categories
      .map((category) => {
        const data = filteredFaculties.map((faculty) => {
          switch (category) {
            case "Male":
              return faculty.male;
            case "Female":
              return faculty.female;
            case "Others":
              return faculty.other;
            case "Total":
              return faculty.total;
            default:
              return 0;
          }
        });

        if (data.some((value) => value > 0)) {
          return {
            name: category,
            type: "bar",
            barWidth: 35,
            itemStyle: {
              color: colors[categories.indexOf(category)],
            },
            label: {
              show: true,
              position: "top",
            },
            data: data,
          };
        }

        return null;
      })
      .filter((series) => series !== null);

    const xAxisData = filteredFaculties.map((faculty) => faculty.title);

    return {
      tooltip: { trigger: "axis" },
      legend: { data: seriesData.map((s) => s.name) },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: "category",
          data: xAxisData,
          axisLabel: { rotate: 15 },
          name: "Faculties",
          nameLocation: "middle",
          nameGap: 35,
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            show: true,
          },
          name: "No. of Students",
          nameLocation: "middle",
          nameGap: 35,
        },
      ],
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
      <Paper elevation={5} sx={{ width: "100%", p: 2 }}>
        <Typography color="error">Error loading chart data.</Typography>
      </Paper>
    );
  }

  return (
    <Grid container justifyContent="center" alignItems="flex-start">
      <Paper elevation={5} sx={{ width: "100%", backgroundColor: "#F5F5F5" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <Typography
              variant="body1"
              align="center"
              fontWeight={900}
              style={{ padding: "1rem", color: "#1976d2" }}
            >
              Students on the basis of Faculty
            </Typography>
            <ReactECharts
              option={generateChartOption()}
              style={{ height: "400px" }}
              notMerge={true}
              lazyUpdate={true}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default FacultyLevelChart;