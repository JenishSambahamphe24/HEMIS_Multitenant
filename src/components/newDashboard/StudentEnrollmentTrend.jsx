
import { useEffect } from "react";
import * as echarts from "echarts";
import { Typography, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "@mantine/core";
import {config} from '@config';

const backendUrl = config.VITE_BACKEND_URL;

const fetchEnrollmentData = async (authToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${backendUrl}/Dashboard/Trend-summary`, config);
  if (!response.ok) throw new Error("Network response was not ok");

  const resData = await response.json();
  if (!Array.isArray(resData)) throw new Error("Invalid response format");

  const axisData = resData.map((item) => item.fiscalYear);
  const maleData = resData.map((item) => item.maleStudents);
  const femaleData = resData.map((item) => item.femaleStudents);
  const totalData = maleData.map((male, index) => male + femaleData[index]);
  const dateRange = {
    from: resData[0].fiscalYear,
    to: resData[resData.length - 1].fiscalYear,
  };

  return {
    axisData,
    maleData,
    femaleData,
    totalData,
    dateRange,
  };
};

const StudentEnrollmentTrend = ({ authToken }) => {
  const {
    isLoading,
    error,
    data,
  } = useQuery({
    queryKey: ['enrollmentTrend', authToken],
    queryFn: () => fetchEnrollmentData(authToken),
    enabled: !!authToken,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnMount: false
  });

  useEffect(() => {
    if (!data || !data.axisData?.length) return;
    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Total", "Male", "Female"],
        textStyle: {
          color: "#1976d2",
        },
      },
      grid: {
        containLabel: false,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: data.axisData,
          name: "Fiscal Years",
          nameLocation: "middle",
          nameGap: 35,
        },
      ],
      yAxis: {
        type: "value",
        name: "No Of Students",
        nameLocation: "middle",
        nameGap: 35,
      },
      series: [
        {
          name: "Male",
          type: "line",
          data: data.maleData,
          color: "#1976d2",
          symbolSize: 10,
          symbol: "circle",
          label: {
            show: true,
            position: "top",
            color: "#1976d2",
            fontSize: 12,
          },
        },
        {
          name: "Female",
          type: "line",
          data: data.femaleData,
          color: "#E94E77",
          symbolSize: 10,
          symbol: "circle",
          label: {
            show: true,
            position: "top",
            color: "#E94E77",
            fontSize: 12,
          },
        },
        {
          name: "Total",
          type: "line",
          data: data.totalData,
          color: "#9E9E9E",
          symbolSize: 10,
          symbol: "circle",
          label: {
            show: true,
            position: "top",
            color: "#9E9E9E",
            fontSize: 12,
          },
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      if (myChart) {
        myChart.dispose();
      }
    };
  }, [data]);

  if (isLoading) {
    return (
      <LoadingOverlay
        visible={isLoading}
        zIndex={100}
        overlayProps={{ radius: "sm", blur: 1 }}
        loaderProps={{ color: "#4A90E2", type: "bars" }}
      />
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="body1" align="center" gutterBottom color="error">
          Error: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        style={{
          backgroundColor: "#F5F5F5",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
        }}
      >
        <Typography
          variant="body1"
          align="center"
          gutterBottom
          color="#1976d2"
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Student Enrollment Trend From {data.dateRange.from} to {data.dateRange.to}
        </Typography>
        <div id="main" style={{ height: "400px" }}></div>
      </Box>
    </Box>
  );
};

export default StudentEnrollmentTrend;