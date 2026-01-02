import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/material";
import React from "react";

const ReportFooter = ({ moduleData, calculatePercentage }) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  return (
    <Box
      sx={{
        border: "1px solid #c2c2c2",
        p: 1,
        mb: 12,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", mb: 0.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "12px", print: "10px" },
                minWidth: "60px",
                fontWeight: "500",
              }}
            >
              Result:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "12px", print: "10px" },
                ml: 1,
                fontWeight: "bold",
                color:
                  moduleData?.overallStatus === "Pass"
                    ? "success.main"
                    : "error.main",
              }}
            >
              {moduleData?.overallStatus || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", mb: 0.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "12px", print: "10px" },
                minWidth: "60px",
                fontWeight: "500",
              }}
            >
              Issue Date:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "12px", print: "10px" },
                ml: 1,
              }}
            >
              {formattedDate}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", mb: 0.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "12px", print: "10px" },
                minWidth: "70px",
                fontWeight: "500",
              }}
            >
              Percentage:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "12px", print: "12px" },
                ml: 1,
                fontWeight: "bold",
              }}
            >
              {calculatePercentage()
                ? `${calculatePercentage()}%`
                : moduleData.percentage
                ? `${moduleData.percentage}%`
                : "N/A"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", mb: 0.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "12px", print: "10px" },
                minWidth: "60px",
                fontWeight: "500",
              }}
            >
              Remarks:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "12px", print: "10px" },
                ml: 1,
              }}
            >
              {moduleData.remarks || "N/A"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportFooter;
