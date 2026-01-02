import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import Admin from "../../pages/students/AlumniEmployee/AlumniPages/Admin/Admin";
import { config as appConfig } from "@config";
import axios from "axios";

const UserNavbar = () => {
  const campusId = appConfig.VITE_CAMPUSID;
    const backendUrl = appConfig.VITE_BACKEND_URL;
    const baseUrl = appConfig.VITE_BASE_URL;
  
    const [campusData, setCampusData] = useState({
      campusName: "",
      campusAddress: "",
      logo: "",
    });
  
    useEffect(() => {
      const fetchCampus = async () => {
        try {
          const response = await axios.get(`${backendUrl}/Campus/${campusId}`);
          setCampusData({
            campusName: response.data.campusName,
            campusAddress: `${response.data.localLevel}, ${response.data.district}`,
            logo: response.data.logo,
          });
        } catch (error) {
          console.error("Error fetching campus:", error);
        }
      };
      fetchCampus();
    }, [campusId]);
  
    const { campusName, campusAddress, logo } = campusData;
  
  return (
    <>
      <Grid>
        {/* Header part  */}
        <Box>
          <div className="flex flex-wrap items-center justify-between w-full px-6 py-1">
            {/* Left Side: Logo + Campus address */}
            <div className="flex items-center">
             <div className="logo w-32">
                <img
                  src={`${baseUrl}/${logo}`}
                  className="h-27 w-27 pr-3 object-contain"
                  alt="Campus Logo"
                />
              </div>
              <div className="text-sky-700">
                <h1 className="font-bold text-lg">{campusName}</h1>
                <p className="text-md">
                {campusAddress}
                </p>
              </div>
            </div>

            <div className="text-sky-700">
              <h2 className="font-bold text-lg">
                {" "}
                Alumni Management System (AMS)
              </h2>
            </div>
          </div>
        </Box>
      </Grid>
      {/* Navigation */}
      <Grid
        container
        alignItems="center"
        sx={{
          //   position: "fixed",
          background: "#2B6EB5",
          color: "white",
          width: "100%",
          boxShadow: 1,
          pl: 4,
          py: 1,
          pr: 2,
          zIndex: 1000,
        }}
      >
        <Grid item sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Link to="/alumni-admin">
            <HomeIcon sx={{ fontSize: 28 }} />
          </Link>
          {/* <Link to="user-notice">
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.125rem",
                cursor: "pointer",
                "&:hover": { color: "#e5e5e5" },
                transition: "color 0.3s",
              }}
            >
              Notice
            </Typography>
          </Link> */}
          <Link to="work-list">
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.125rem",
                cursor: "pointer",
                "&:hover": { color: "#e5e5e5" },
                transition: "color 0.3s",
              }}
            >
              Add Work
            </Typography>
          </Link>
          <Link to="user-profile">
            <Typography
              variant="h6"
              sx={{
                // fontWeight: "bold",
                fontSize: "1.125rem",
                cursor: "pointer",
                "&:hover": { color: "#e5e5e5" },
                transition: "color 0.3s",
              }}
            >
              Your Profile
            </Typography>
          </Link>
        </Grid>
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section: Login Button */}
        <Grid item>
          <Admin />
        </Grid>
      </Grid>
    </>
  );
};

export default UserNavbar;
