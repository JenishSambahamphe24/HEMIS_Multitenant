import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { grey, blue } from "@mui/material/colors";
import { getAdminProfile } from "../../components/dashboard/services/service";
import { Box, Button, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {config} from '@config';

const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  border: `1px solid rgba(255, 255, 255, 0.4)`,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: "50%",
  border: `4px solid ${blue[700]}`,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)({
  fontWeight: 600,
  color: blue[700],
  marginBottom: "0.5rem",
  fontSize: "1.25rem",
});

const InfoRow = styled(Grid)({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "0.5rem",
});

const Profile = ({ handleBack }) => {
const baseUrl=config.VITE_BASE_URL;

  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminProfile();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchData();
  }, []);

  if (!profileData) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }
  const {
    campusName,
    name,
    campusType,
    shortName,
    palika,
    type,
    locality,
    code,
    alias,
    shortCode,
    email,
    url,
    province,
    district,
    localLevel,
    wardNo,
    address,
    yearOfEstd,
    dateOfEstd,
    accreditation,
    logo,
    focalPersonName,
    principalName,
    principalPhoneNo,
    principalEmail,
    contactNo3,
    position,
    phoneNo,
    contactNo,
    contactEmail,
    bankName,
    branch,
    accountNo,
    longitude,
    latitude,
  } = profileData;
  return (
    <>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        mt={2}
        sx={{ minHeight: "100vh", backgroundColor: grey[100] }}
      >
        <Grid item xs={12} sm={10} md={8}>
          <GlassPaper elevation={3}>
            {/* Profile Image Section */}
            <Grid container direction="column" alignItems="center" mb={3}>
              <Grid item>
                <img
                  src={`${baseUrl}/${logo}`}
                  alt="Logo"
                  style={{ height: "85px", width: "85px", borderRadius: "50%" }}
                />
              </Grid>
              <Grid item>
                <Typography variant="h5" color={blue[700]} align="center">
                  {name || campusName}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  {email || "Email not available"}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2, borderColor: blue[700] }} />
            <SectionTitle>General Information</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Full Name:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {name || campusName || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Type:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {type || campusType || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Code:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {code || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Alias:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {alias || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Short Code:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {shortCode || shortName || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Email:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {email || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    URL:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {url || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Province:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {province || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    District:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {district || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Local Level:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {localLevel || palika || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Ward No:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {wardNo || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Address:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {address || locality || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Latitude:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {latitude || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Longitude:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {longitude || "-"}
                  </Typography>
                </InfoRow>
              </Grid>
              <Grid item xs={12} sm={6} mx="auto">
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Year Established:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {yearOfEstd || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Date Established:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {dateOfEstd || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Accreditation:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {accreditation || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Principal Name:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {focalPersonName || principalName || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Position:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {position || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Phone No:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {phoneNo || principalPhoneNo || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Contact No:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {contactNo || contactNo3 || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Contact Email:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {contactEmail || principalEmail || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Bank Name:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {bankName || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Branch:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {branch || "-"}
                  </Typography>
                </InfoRow>
                <InfoRow container>
                  <Typography variant="body2" color="textSecondary">
                    Account No:
                  </Typography>
                  <Typography variant="body2" color={blue[700]}>
                    {accountNo || "-"}
                  </Typography>
                </InfoRow>
              </Grid>
            </Grid>
          </GlassPaper>
        </Grid>
      </Grid>

      <Grid container sx={{ justifyContent: "center", padding: "10px" }}>
        <Button variant="contained" onClick={() => navigate("/add-location")}>
          Update Your Location
        </Button>
      </Grid>

    </>
  );
};

export default Profile;
