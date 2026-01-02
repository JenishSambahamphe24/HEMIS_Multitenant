import { Grid, Typography } from '@mui/material'
import React from 'react'

const SignatureField = () => {
  return (
    <Grid container padding={2} marginTop={16}>
          <Grid item xs={4} color="#000">
            <Typography sx={{ fontSize: { xs: "12px", print: "12px" } }}>
              ............................
            </Typography>
            <Typography sx={{ fontSize: { xs: "12px", print: "12px" } }}>
              Head of Faculty
            </Typography>
          </Grid>
          <Grid item xs={4} color="#000">
            <Typography
              sx={{ fontSize: { xs: "12px", print: "12px" } }}
              textAlign={"center"}
            >
              ...........................
            </Typography>
            <Typography
              sx={{ fontSize: { xs: "12px", print: "12px" } }}
              textAlign={"center"}
            >
              Asst. Campus Chief
            </Typography>
          </Grid>
          <Grid item xs={4} color="#000">
            <Typography
              sx={{ fontSize: { xs: "12px", print: "12px" } }}
              textAlign={"right"}
            >
              ........................
            </Typography>
            <Typography
              sx={{ fontSize: { xs: "12px", print: "12px" } }}
              textAlign={"right"}
            >
              Campus Chief
            </Typography>
          </Grid>
        </Grid>
  )
}

export default SignatureField