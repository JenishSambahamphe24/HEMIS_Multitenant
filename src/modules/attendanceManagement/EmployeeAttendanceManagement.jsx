import { Box, Typography } from "@mui/material";
import React from "react";
import { Grid } from "rsuite";
import { blue } from "@mui/material/colors";
import EmployeeAttendance from "../../pages/home/EmployeeAttendance";

const EmployeeAttendanceManagement = () => {
  return (
    <div>
      <Grid container sx={{ height: "100vh", width: "100%" }}>
        <Grid item xs={12} sm={12} md={12}>
          <Box sx={{ p: 2 }}>
            <Typography textAlign="center" fontSize={"1.5em"} color={blue[700]}>
             Employee Attendance Management
            </Typography>
          </Box>
          <EmployeeAttendance/>
        </Grid>
      </Grid>
    </div>
  );
};

export default EmployeeAttendanceManagement;
