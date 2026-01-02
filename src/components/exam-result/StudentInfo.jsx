import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'

const StudentInfo = ({ moduleData }) => {
  return (
    <Box
          sx={{
            border: "1px solid #c2c2c2",
            mb: 1,
            p: 1,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={6} spacing={3}>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    minWidth: "80px",
                    fontWeight: "500",
                  }}
                >
                  Student's Name:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    ml: 1,
                    fontWeight: "bold",
                  }}
                >
                  {moduleData?.studentName}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    minWidth: "80px",
                    fontWeight: "500",
                  }}
                >
                  Section/Roll No:
                </Typography>
                <Typography
                  variant="body2"
                  fontFamily="monospace"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    ml: 1,
                    fontWeight: "bold",
                  }}
                >
                {moduleData?.section || "-"}/
                  {moduleData?.rollNoManual}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    minWidth: "60px",
                    fontWeight: "500",
                  }}
                >
                  Year/Sem.:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    ml: 1,
                    fontWeight: "bold",
                  }}
                >
                  {moduleData.year
                    ? `${moduleData.year} Year`
                    : `${moduleData.semester} Semester`}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    minWidth: "60px",
                    fontWeight: "500",
                  }}
                >
                  Batch:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    ml: 1,
                    fontWeight: "bold",
                  }}
                >
                  {moduleData.batchNepali}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} spacing={3}>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    minWidth: "90px",
                    fontWeight: "500",
                  }}
                >
                  Institute/Faculty:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    ml: 1,
                    fontWeight: "bold",
                  }}
                >
                  {moduleData.facultyName}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    minWidth: "60px",
                    fontWeight: "500",
                  }}
                >
                  Program:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    ml: 1,
                    fontWeight: "bold",
                  }}
                >
                  {moduleData.programName} ({moduleData.shortName})
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "12px", print: "12px" },
                    minWidth: "60px",
                    fontWeight: "500",
                  }}
                >
                  Registration No.:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "12px", print: "10px" },
                    ml: 1,
                    fontWeight: "bold",
                  }}
                >
                  {moduleData.registrationNo}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
  )
}

export default StudentInfo