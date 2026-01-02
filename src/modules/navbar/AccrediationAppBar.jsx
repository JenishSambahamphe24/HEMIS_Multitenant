import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {config} from '@config';

function AccrediationAppBar() {
  const baseUrl=config.VITE_BASE_URL;
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElAccreditation, setAnchorElAccreditation] =
    React.useState(null);
  const [anchorElAccreditationReports, setAnchorElAccreditationReports] =
    React.useState(null);
  const { currentUser } = useSelector((state) => state.user);

  let logos;
  let instituteNames;
  let localLevels;
  let districts;
  const roleName = currentUser?.listUser[0]?.roleName;

  if (currentUser && currentUser.listUser && currentUser.listUser.length > 0) {
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

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenAccreditationMenu = (event) => {
    setAnchorElAccreditation(event.currentTarget);
  };

  const handleOpenAccreditationReportsMenu = (event) => {
    setAnchorElAccreditationReports(event.currentTarget);
  };

  const handleCloseAccreditationMenu = () => {
    setAnchorElAccreditation(null);
  };
  const handleCloseAccreditationReportMenu = () => {
    setAnchorElAccreditationReports(null);
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
          <Toolbar disableGutters>
            <Link to="/" variant="body1" nowrap="true" component="a" href="/">
              <img
                src={
                  currentUser?.institution?.logo ? `${baseUrl}/${logos}` : logos
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
        </Container>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-30%, -50%)",
            zIndex: (theme) => theme.zIndex.drawer + 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="#2b6eb5" fontWeight="bold">
            Integrated Higher Education Management Information System
          </Typography>
          <Typography variant="h6" color="#2b6eb5" fontWeight="bold">
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
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                size="small"
                component={Link}
                to="/home"
                sx={{
                  "&:hover": {
                    bgcolor: "#1976d2",
                  },
                }}
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
                        bgcolor: "#1976d2",
                      },
                    }}
                  >
                    Home
                  </Button>
                  {currentUser && roleName === "Admin" && (
                    <>
                      <Button
                        variant="body2"
                        size="small"
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          textTransform: "capitalize",
                          "&:hover": {
                            bgcolor: "#1976d2",
                          },
                        }}
                        onClick={handleOpenAccreditationMenu}
                        endIcon={<KeyboardArrowDownIcon />}
                      >
                        Accreditation
                      </Button>
                      <Menu
                        anchorEl={anchorElAccreditation}
                        open={Boolean(anchorElAccreditation)}
                        onClose={handleCloseAccreditationMenu}
                      >
                        {[

                          {
                            title: "Campus List",
                            link: "/accrediation/campus-list",
                          },

                          {
                            title: "Accreditation List",
                            link: "/accrediation/accreditation-list",
                          },
                        ].map((item, index) => (
                          <MenuItem
                            key={index}
                            component={Link}
                            to={item.link}
                            onClick={handleCloseAccreditationMenu}
                          >
                            {item.title}
                          </MenuItem>
                        ))}
                      </Menu>
                      <Button
                        variant="body2"
                        size="small"
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          textTransform: "capitalize",
                          "&:hover": { bgcolor: "#1976d2" },
                        }}
                        onClick={handleOpenAccreditationReportsMenu}
                        endIcon={<KeyboardArrowDownIcon />}
                      >
                        Accreditation Reports
                      </Button>
                      <Menu
                        anchorEl={anchorElAccreditationReports}
                        open={Boolean(anchorElAccreditationReports)}
                        onClose={handleCloseAccreditationReportMenu}
                      >
                        {[
                          {
                            title: "Total QAA HEI (campus) Report",
                            link: "/accrediation/total-qaa-hei-campus-report",
                          },
                          {
                            title: "Total QAA HEI (province) Report",
                            link: "/accrediation/total-qaa-hei-province-report",
                          },
                          {
                            /* {
                            title: "Accreditation Expiry (campus) Report",
                            link: "/accrediation/accreditation-expiry-campus-report",
                          }, */
                          },
                        ].map((item, index) => (
                          <MenuItem
                            key={index}
                            component={Link}
                            to={item.link}
                            onClick={handleCloseAccreditationMenu}
                          >
                            {item.title}
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  )}
                </>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {currentUser && (
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
              )}
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

                {!currentUser && (
                  <Button
                    component={Link}
                    to="/login"
                    variant="standard"
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                      "&:hover": {
                        bgcolor: "#1976d2",
                      },
                    }}
                  >
                    Login
                  </Button>
                )}
              </Box>
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

export default AccrediationAppBar;
