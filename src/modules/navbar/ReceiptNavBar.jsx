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
  Menu,
  MenuItem,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import SettingsMenu from "../../components/appBar/SettingsMenu";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import defaultTuLogo from "../../assets/defaultLogo.jpeg";
import profile from "../../assets/profile.png";
import {config} from '@config';

function ReceiptNavBar() {
  const baseUrl = config.VITE_BASE_URL;
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElFeeType, setAnchorElFeeType] = React.useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;


  // Define institution info if available
  const logos = currentUser?.institution?.logo || defaultTuLogo;
  const instituteNames =
    currentUser?.institution?.campusName ||
    currentUser?.institution?.name ||
    "विश्वविद्यालय अनुदान आयोग";
  const localLevels =
    currentUser?.institution?.localLevel ||
    currentUser?.institution?.palika ||
    "";
  const districts = currentUser?.institution?.district || "";

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenFeeTypeMenu = (event) => {
    setAnchorElFeeType(event.currentTarget);
  };

  const handleCloseFeeTypeMenu = () => {
    setAnchorElFeeType(null);
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
                alt="Institution Logo"
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
                    bgcolor: "#1976d2",
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
                        bgcolor: "#1976d2",
                      },
                    }}
                  >
                    Home
                  </Button>
                  {/*  */}
                  {currentUser && (
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
                      onClick={handleOpenFeeTypeMenu}
                      endIcon={<KeyboardArrowDownIcon />}
                    >
                      Fee Type Setup
                    </Button>
                  )}

                  <Menu
                    anchorEl={anchorElFeeType}
                    open={Boolean(anchorElFeeType)}
                    onClose={handleCloseFeeTypeMenu}
                  >
                    {currentUser && (
                      <>
                        {[
                          {
                            title: "General Fee",
                            link: "/receipt-management/general-fee-type",
                          },
                          {
                            title: "Course-specific Fee",
                            link: "/receipt-management/fee-type",
                          },
                        ].map((item, index) => (
                          <MenuItem
                            key={index}
                            component={Link}
                            to={item.link}
                            onClick={handleCloseFeeTypeMenu}
                          >
                            {item.title}
                          </MenuItem>
                        ))}
                      </>
                    )}
                  </Menu>

                  <NavLink
                    to="/receipt-management"
                    end
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "white" : "inherit",
                      backgroundColor: isActive ? "#1976d2" : "transparent",
                      borderRadius: "4px",
                      display: "inline-block",
                    })}
                  >
                    <Button
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
                      Receipt
                    </Button>
                  </NavLink>

                  <NavLink
                    to="/receipt-management/receipt-list"
                    end
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      color: isActive ? "white" : "inherit",
                      backgroundColor: isActive ? "#1976d2" : "transparent",
                      borderRadius: "4px",
                      display: "inline-block",
                    })}
                  >
                    <Button
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
                      Receipt List
                    </Button>
                  </NavLink>
                </>
              )}
            </Box>
            
            <Box sx={{ flexGrow: 0 }}>
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

export default ReceiptNavBar;
