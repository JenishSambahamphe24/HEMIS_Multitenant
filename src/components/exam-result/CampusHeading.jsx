import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';
import {config} from '@config';


const CampusHeading = ({moduleData} ) => {
const baseUrl=config.VITE_BASE_URL;

  const { currentUser } = useSelector((state) => state.user);
    const campusName = currentUser?.institution?.campusName;
    const logo = currentUser?.institution?.logo;
    const localLevel = currentUser?.institution?.localLevel;
    const wardNo = currentUser?.institution?.wardNo;
    const district = currentUser?.institution?.district;
    const province = currentUser?.institution?.province;
    const uni = currentUser?.institution?.university?.name;
    const yearOfEstd = currentUser?.institution?.yearOfEstd;
  return (
    <Box sx={{ textAlign: "center", mt: 2 }} className="compact-spacing">
          <Grid container justifyContent="center" sx={{ mb: 1 }}>
            <img
              src={`${baseUrl}/${logo}`}
              style={{ height: "80px", maxHeight: "80px" }}
              alt="Institution Logo"
            />
          </Grid>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontSize: { xs: "12px", print: "14px" },
              mb: 0.5,
              lineHeight: 1.2,
              fontStyle: "italic",
            }}
          >
            A QAA Certified Institution
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "16px", print: "14px" },
              fontWeight: "bold",
              mb: 0.5,
              lineHeight: 1.2,
            }}
          >
            {campusName}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "10px", print: "14px" },
              mb: 0.5,
              lineHeight: 1.2,
            }}
          >
            Affiliated to {uni}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "12px", print: "12px" },
              mb: 0.5,
              lineHeight: 1.1,
              minWidth: "100px",
            }}
          >
            {localLevel}-{wardNo}, {district}, {province}, Nepal
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "10px", print: "10px" },
              mb: 0.5,
              lineHeight: 1.1,
            }}
          >
            Estd: {yearOfEstd}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "14px", print: "12px" },
              fontWeight: "bold",
              mt: 1,
            }}
          >
            PROVISIONAL STATEMENT OF MARKS
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "12px", print: "12px" },
              fontWeight: "bold",
              textDecoration: "underline",
              mt: 0.5,
            }}
          >
            {moduleData?.examNameManual}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "14px", print: "12px" },
              fontWeight: "bold",
              mt: 0.5,
              mb: 1,
            }}
          >
            2081/082
          </Typography>
        </Box>
  )
}

export default CampusHeading