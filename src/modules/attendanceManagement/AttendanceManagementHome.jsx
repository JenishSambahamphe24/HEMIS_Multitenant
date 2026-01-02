import { Box, Typography } from "@mui/material";
import React from "react";
import { Grid } from "rsuite";
import { blue } from "@mui/material/colors";
import StudentAttendance from "../../pages/home/StudentAttendance";

const AttendanceManagementHome = () => {
  return (
    <div>
      <Grid
        container
        sx={{ height: "100vh", width: "100%" }}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Box sx={{ p: 2 }}>
            <StudentAttendance/>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default AttendanceManagementHome;
