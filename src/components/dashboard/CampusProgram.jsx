import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Paper, Typography, Grid } from "@mui/material";
import { getStudentByPrograms } from "./services/service";
import { useQuery } from "@tanstack/react-query";

const CampusProgram = ({ authToken }) => {
  const { isLoading, data: studentsByPrograms = [], error } = useQuery({
    queryKey: ['programTrend', authToken],
    queryFn: () => getStudentByPrograms(authToken),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    onError: (err) => {
      console.error("Failed to fetch data:", err);
    },
  })


  const generateChartOption = () => {
    const categories = ["Male", "Female", "Other", "Total"];
    const colors = ["#1976d2", "#E94E77", "#5e5e5e", "#9E9E9E"];
    const programs = studentsByPrograms.map((item) => item.title);

    const seriesData = categories
      .map((category) => ({
        name: category,
        type: "bar",
        barWidth: 30,
        barGap: "10%",
        itemStyle: {
          color: colors[categories.indexOf(category)],
        },
        label: { show: true, position: "top", color: "#000" },
        data: studentsByPrograms.map((item) => {
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
        }),
      }))
      .filter((series) => series.data.some((value) => value > 0));
    const xAxisData = programs.filter((_, index) =>
      seriesData.some((series) => series.data[index] > 0)
    );

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
          name: "Programs",
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

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={5} sx={{ padding: "0px", backgroundColor: "#F5F5F5" }}>
          <Typography
            variant="body1"
            align="center"
            fontWeight={900}
            style={{ padding: "1rem", color: "#1976d2" }}
          >
            Students on the basis of Program
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

export default CampusProgram;
