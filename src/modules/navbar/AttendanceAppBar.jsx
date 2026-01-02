import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SettingsMenu from "../../components/appBar/SettingsMenu";
import HomeIcon from "@mui/icons-material/Home";
import defaultTuLogo from "../../assets/defaultLogo.jpeg";
import profile from "../../assets/profile.png";
import {config} from '@config';


function AttendanceAppBar() {
const baseUrl=config.VITE_BASE_URL;

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;

  let logos;
  let instituteNames;
  let localLevels;
  let districts;

  if (currentUser && currentUser.listUser && currentUser.listUser.length > 0) {
    const roleName = currentUser.listUser[0].roleName;
    logos = currentUser?.institution?.logo || defaultTuLogo;
    instituteNames =
      currentUser.institution?.campusName ||
      currentUser.institution?.name ||
      "विश्वविद्यालय अनुदान आयोग";
    localLevels =
      currentUser.institution?.localLevel ||
      currentUser.institution?.palika ||
      "";
    districts = currentUser.institution?.district || "";

  }

  let user;
  if (currentUser && currentUser.listUser && currentUser.listUser.length > 0) {
    user = currentUser.listUser[0].roleName;
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box bgcolor="white">
      <Box
        position="fixed"
        sx={{
          width: "100%",
          top: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#01204E",
          height: "77px",
          bgcolor: "white",
        }}
      >
        <Container maxWidth="xl" sx={{ paddingBottom: "5px" }}>
          {currentUser && (
            <Toolbar disableGutters>
              <Link to="/" variant="body1" nowrap="true" component="a" href="/">
                <img
                  src={
                    currentUser?.institution?.logo
                      ? `${baseUrl}/${logos}`
                      : logos
                  }
                  alt="Logo"
                  style={{ marginRight: "8px", height: "75px" }}
                />
              </Link>

              <Box>
                <Typography color="#2b6eb5" variant="body1" fontWeight="bold">
                  {instituteNames}
                </Typography>
                {localLevels && districts ? (
                  <Typography variant="body2">
                    {localLevels}, {districts}
                  </Typography>
                ) : (
                  <Typography variant="body2" fontWeight="bold" color="#2b6eb5">
                    University Grants Commission
                  </Typography>
                )}
              </Box>
            </Toolbar>
          )}
          {!currentUser && (
            <Toolbar disableGutters>
              <IconButton sx={{ display: { xs: "none", md: "flex" }, mr: 5 }} />
              <Link
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0 rem",
                  color: "#01204E",
                  textDecoration: "none",
                  marginLeft: "4rem",
                }}
              >
                <img
                  src={defaultTuLogo}
                  alt="Logo"
                  style={{ marginRight: "8px", height: "75px", padding: "5px" }}
                />
              </Link>

              <Box>
                <Typography color="#2b6eb5" variant="body1">
                  {instituteNames}
                </Typography>

                <Typography variant="body1">
                  University Grants Commission
                </Typography>
                <Typography variant="body2">Sanothimi, Bhaktapur</Typography>
              </Box>
            </Toolbar>
          )}
        </Container>
        <Box
          sx={{
            position: "absolute", // Absolute positioning to place the text independently of the toolbar
            top: "50%", // Center it vertically in the viewport
            left: "50%", // Center it horizontally in the viewport
            transform: "translate(-30%, -50%)", // Adjust the position to make sure it's perfectly centered
            zIndex: (theme) => theme.zIndex.drawer + 2, // Ensure it’s above the other content
          }}
        >
          <Typography variant="h6" color="#2b6eb5" fontWeight="bold">
            Integrated Higher Education Management Information System
          </Typography>
          <Typography
            variant="h6"
            textAlign={"center"}
            color="#2b6eb5"
            fontWeight="bold"
          >
            (HEMIS)
          </Typography>
        </Box>
      </Box>
      <AppBar
        position="fixed"
        sx={{
          top: "76px",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#FFF",
          bgcolor: "#2B6EB5",
          height: "41px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1 }}>
              <IconButton
                color="inherit"
                size="small"
                sx={{
                  "&:hover": {
                    bgcolor: "#1976d2", // 80% dim color
                  },
                }}
                component={Link}
                to="/home"
              >
                <HomeIcon fontSize="small" />
              </IconButton>
              {currentUser && (
                <>
                  <Button
                    component={Link}
                    to="/home"
                    variant="body2"
                    size="small"
                    sx={{
                      mx: 0,
                      textDecoration: "none",
                      color: "inherit",
                      textTransform: "capitalize",
                      "&:hover": {
                        bgcolor: "#1976d2", // 80% dim color
                      },
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    component={Link}
                    to="/attendance-management"
                    variant="body2"
                    size="small"
                    sx={{
                      mx: 0,
                      textDecoration: "none",
                      color: "inherit",
                      textTransform: "capitalize",
                      "&:hover": {
                        bgcolor: "#1976d2", // 80% dim color
                      },
                    }}
                  >
                    Student Attendance
                  </Button>
                  <Button
                    component={Link}
                    to="/attendance-management"
                    variant="body2"
                    size="small"
                    sx={{
                      mx: 0,
                      textDecoration: "none",
                      color: "inherit",
                      textTransform: "capitalize",
                      "&:hover": {
                        bgcolor: "#1976d2", // 80% dim color
                      },
                    }}
                  >
                    Employee Attendance
                  </Button>
                  {roleName === "Student" && (
                    <Button
                      variant="body2"
                      sx={{
                        mx: 0,
                        textDecoration: "none",
                        color: "inherit",
                        textTransform: "capitalize",
                        "&:hover": {
                          bgcolor: "#1976d2", // 80% dim color
                        },
                      }}
                      size="small"
                    >
                      Payment
                    </Button>
                  )}
                </>
              )}
            </Box>

            <Box sx={{ flexGrow: 0 }} justifyContent="right" alignItems="right">
              <Button
                size="small"
                variant="body2"
                sx={{
                  mx: 0,
                  textDecoration: "none",
                  color: "inherit",
                  textTransform: "lowercase",
                  "&:hover": {
                    bgcolor: "#1976d2",
                  },
                }}
                target="blank"
              >
                {currentUser.email}
              </Button>
            </Box>
            <Box sx={{ flexGrow: 0 }} justifyContent="right" alignItems="right">
              {!currentUser && (
                <Button
                  component={Link}
                  to="/login"
                  variant="standard"
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                    "&:hover": {
                      bgcolor: "#1976d2", // 80% dim color
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {currentUser && (
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                    size="small"
                  >
                    <Avatar src={profile} alt="Profile" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <SettingsMenu
        anchorElUser={anchorElUser}
        handleCloseUserMenu={handleCloseUserMenu}
      />
    </Box>
  );
}

export default AttendanceAppBar;
