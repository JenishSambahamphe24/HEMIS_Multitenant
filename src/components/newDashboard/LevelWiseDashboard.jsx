import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Paper, Typography, Grid } from "@mui/material";
import {
  getStudentByLevelDashboard,
} from "../dashboard/services/service";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "@mantine/core";

const LevelChart = ({ authToken }) => {

  const { isLoading, data: studentsByPrograms = [], error } = useQuery({
    queryKey: ['levelTrend', authToken],
    queryFn: () => getStudentByLevelDashboard(authToken),
    enabled: !!authToken,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    onError: (err) => {
      console.error("Failed to fetch student data by faculty:", err);
    },
  })

  useEffect(() => {
    if (!authToken) return;

    const fetchData = async () => {
      try {
        const byPrograms = await getStudentByLevelDashboard(authToken);
        setStudentsByPrograms(byPrograms);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [authToken]);

  const generateChartOption2 = () => {
    const categories = ["Male", "Female", "Other", "Total"];
    const colors = ["#1976d2", "#E94E77", "#5e5e5e", "#9E9E9E"];
    const programs = studentsByPrograms;

    // Filter out programs with only zero values in all categories
    const filteredPrograms = programs.filter((item) =>
      categories.some((category) => {
        switch (category) {
          case "Male":
            return item.male > 0;
          case "Female":
            return item.female > 0;
          case "Other":
            return item.other > 0;
          case "Total":
            return item.total > 0;
          default:
            return false;
        }
      })
    );

    // Map the series data based on filtered programs, only adding non-zero categories
    const seriesData = categories
      .map((category) => {
        const data = filteredPrograms.map((item) => {
          switch (category) {
            case "Male":
              return item.male;
            case "Female":
              return item.female;
            case "Other":
              return item.other;
            case "Total":
              return item.total;
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
              color: "#F5F5F5",
            },
            data: data,
          };
        }

        return null;
      })
      .filter((series) => series !== null);

    const xAxisData = filteredPrograms.map((item) => item.title);

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
          name: "Levels",
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
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
    >
      <Paper elevation={5} sx={{ width: "100%", backgroundColor: "#F5F5F5" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <Typography
              variant="body1"
              align="center"
              fontWeight={900}
              style={{ padding: "1rem", color: "#1976d2" }}
            >
              Students on the basis of Levels
            </Typography>
            <ReactECharts
              option={generateChartOption2()}
              style={{ height: "400px" }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default LevelChart;
