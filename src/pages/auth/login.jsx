import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab } from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MdBusinessCenter } from "react-icons/md";

import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  initializeSession,
  setupAuthListeners,
  clearErrors,
  resetLoadingState,
  signOut,
} from "../../redux/user/userSlice";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaSchool } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { config } from "@config";

const Login = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const campusId = config.VITE_CAMPUSID;
  const uniId = config.VITE_UNIVERSITYID;
  const ugc = config.VITE_ISUGC === "true";

  const baseUrl = config.VITE_BASE_URL;

  const [activeTab, setActiveTab] = useState("admin");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cOllegeId: campusId,
    uniId: uniId,
    isUgc: ugc,
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loading, currentUser, error, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const [defaultLogo, setDefaultLogo] = useState("");
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [localLoading, setLocalLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [collegeName, setCollegeName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email: urlEmail, token } = useParams();
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  const tabs = [
    { id: "admin", label: "Admin", icon: <IoPerson /> },
    { id: "student", label: "Student", icon: <FaSchool /> },
  ];

  const isEmployeeResetRoute = location.pathname.includes(
    "/reset-passwordEmployee/"
  );

  // Debug logging
  useEffect(() => {
    console.log("Login Debug:", {
      authInitialized,
      isAuthenticated,
      currentUser: !!currentUser,
      loading,
      localLoading,
      redirectPath,
    });
  }, [
    authInitialized,
    isAuthenticated,
    currentUser,
    loading,
    localLoading,
    redirectPath,
  ]);

  useEffect(() => {
    dispatch(clearErrors());
    dispatch(resetLoadingState());
  }, [dispatch]);

  useEffect(() => {
    if (isEmployeeResetRoute && urlEmail && token) {
      setFormData((prev) => ({
        ...prev,
        email: decodeURIComponent(urlEmail),
        password: token,
      }));
    }
  }, [isEmployeeResetRoute, urlEmail, token]);

  const recoverFromStuckState = useCallback(() => {
    dispatch(resetLoadingState());
    setLocalLoading(false);
    setAuthInitialized(true);
  }, [dispatch]);

  useEffect(() => {
    let timeoutId;
    if (loading || localLoading) {
      timeoutId = setTimeout(() => {
        console.warn("Loading timeout reached, recovering from stuck state");
        recoverFromStuckState();
        toast.error("Request timeout. Please try again.");
      }, 8000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, localLoading, recoverFromStuckState]);

  // Initialize auth - simplified
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        dispatch(initializeSession());

        // Set up auth listeners
        dispatch(setupAuthListeners());

        // Mark auth as initialized after a short delay
        setTimeout(() => {
          console.log("Auth initialization completed");
          setAuthInitialized(true);
        }, 500);
      } catch (err) {
        console.error("Auth initialization error:", err);
        setAuthInitialized(true); // Still mark as initialized even on error
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (authInitialized && isAuthenticated && currentUser) {
      console.log("Redirecting to:", redirectPath);
      // Use setTimeout to ensure the state is fully updated
      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [authInitialized, isAuthenticated, currentUser, navigate, redirectPath]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true);
        const response = await axios.get(`${backendUrl}/Campus/${campusId}`);
        const logo = response?.data?.logo;
        setCollegeName(response.data.campusName);
        setDefaultLogo(logo || "");
      } catch (err) {
        console.error("Error fetching campus logo:", err);
        toast.error("Could not load campus logo", { id: "logo-error" });
      } finally {
        setLocalLoading(false);
      }
    };

    fetchData();

    if (!isEmployeeResetRoute) {
      const savedRememberMe = localStorage.getItem("rememberMe") === "true";
      if (savedRememberMe) {
        const savedEmail = localStorage.getItem("email");
        if (savedEmail) {
          setFormData((prev) => ({
            ...prev,
            email: savedEmail,
          }));
          setRememberMe(true);
        }
      }
    }
  }, [isEmployeeResetRoute]);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    if (error) {
      toast.error(error);
    }
  }, [error, isInitialMount]);

  const handleTabChange = (tabId) => {
    if (isEmployeeResetRoute) {
      return;
    }

    setActiveTab(tabId);
    setFormData({
      email: "",
      password: "",
      cOllegeId: campusId,
      uniId: uniId,
      isUgc: true,
    });

    setRememberMe(false);
    dispatch(clearErrors());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedFormData = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      cOllegeId: campusId,
      uniId: uniId,
      isUgc: ugc,
    };

    if (!cleanedFormData.email || !cleanedFormData.password) {
      toast.error("Email and password are required.");
      return;
    }

    dispatch(signInStart());
    setLocalLoading(true);

    try {
      let apiEndpoint = `${backendUrl}/User/Login`;
      if (activeTab === "student" && !isEmployeeResetRoute) {
        apiEndpoint = `${backendUrl}/User/StudentLogin`;
      }

      console.log("Making login request to:", apiEndpoint);
      const response = await axios.post(apiEndpoint, {
        ...cleanedFormData,
      });

      console.log("Login response:", response.data);

      if (response.data) {
        const { name, value } = response.data;
        if (name === "verificationToken" && value) {
          navigate(`/reset-password/${cleanedFormData.email}/${value}`);
        } else {
          if (rememberMe && !isEmployeeResetRoute) {
            localStorage.setItem("email", cleanedFormData.email);
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("userType", activeTab);
          } else if (!isEmployeeResetRoute) {
            localStorage.removeItem("email");
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("userType");
          }

          // Dispatch success - navigation will be handled by useEffect
          dispatch(
            signInSuccess({
              user: response.data,
              rememberMe: !isEmployeeResetRoute ? rememberMe : false,
              userType: isEmployeeResetRoute ? "employee" : activeTab,
            })
          );

          toast.success("Login successful !");
        }
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          dispatch(
            signInFailure("Wrong Credentials. Email or Password is Wrong.")
          );
        } else {
          dispatch(
            signInFailure(
              `Login failed: ${
                err.response?.data?.message ||
                "An error occurred. Please try again later."
              }`
            )
          );
        }
      } else {
        dispatch(signInFailure("An unexpected error occurred."));
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getTabTitle = () => {
    if (isEmployeeResetRoute) {
      return "Admin Login";
    }

    switch (activeTab) {
      case "admin":
        return "Admin Portal";
      case "student":
        return "Student Portal";
      default:
        return "Sign In Portal";
    }
  };

  if (!authInitialized) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Initializing...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        flexDirection: { xs: "column", sm: "row", md: "row" }, 
        width: "100%",
      }}
      className="my-5"
    >
      {/* LEFT SECTION */}
      <Box
        sx={{
          background: "#2b6eb5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          width: { xs: "100%", sm: "100%", md: "auto" },
          minHeight: { xs: "280px", sm: "100%", md: "auto" },
        }}
        className="rounded-l-md"
      >
        <Box
          sx={{
            textAlign: "center",
            zIndex: 1,
            maxWidth: 400,
          }}
          className="p-4"
        >
          {defaultLogo && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={`${baseUrl}/${defaultLogo}`}
                alt="Campus logo"
                style={{
                  height: "80px",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            </Box>
          )}
          <h1 className="text-3xl font-bold my-2">
            Welcome To
            <div className="text-2xl font-bold">{collegeName}</div>
          </h1>
          <h1 className="tex-lg ">
            {isEmployeeResetRoute
              ? "Complete your login  to access the assigned modules."
              : "Sign in to access the dashboard and manage student and teacher data, including transfers, exam records, pass rate tracking, infrastructure details, and more"}
          </h1>
        </Box>
      </Box>

      {/* RIGHT SECTION */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          border: "1px solid #e0e0e0",
          width: { xs: "100%", md: "auto" }, 
          p: { xs: 2, md: 0 },
        }}
        className="rounded-r-md"
      >
        <Paper
          elevation={0}
          sx={{
            padding: 0,
            width: { xs: "100%", sm: 350, md: 400 },
            maxWidth: "100%",
            backgroundColor: "white",
            mx: "auto", 
          }}
        >
          {/* TABS */}
          {!isEmployeeResetRoute && (
            <Box
              sx={{
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#f8f9fa",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => handleTabChange(newValue)}
                variant="fullWidth"
                sx={{
                  "& .MuiTab-root": {
                    minHeight: 50,
                    color: "#666",
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    "&.Mui-selected": {
                      color: "#1e3c72",
                      fontWeight: 600,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#1e3c72",
                    height: 3,
                  },
                }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    value={tab.id}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {tab.icon}
                        {tab.label}
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </Box>
          )}

          {/* RIGHT INNER CONTENT */}
          <Box className="px-3 py-4">
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#1e3c72",
                  width: 54,
                  height: 54,
                  mb: 1,
                }}
              >
                {isEmployeeResetRoute ? (
                  <MdBusinessCenter />
                ) : (
                  tabs.find((tab) => tab.id === activeTab)?.icon
                )}
              </Avatar>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {getTabTitle()}
              </Typography>

              {isEmployeeResetRoute && (
                <h1 className="text-sm ">
                  Your email and password have been pre-filled. Click Sign In to
                  access assigned modules.
                </h1>
              )}
            </Box>

            {/* FORM */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: "100%" }}
            >
              {/* Email */}
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "#333" }}
              >
                Email Address
              </Typography>

              <TextField
                size="small"
                fullWidth
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || localLoading || isEmployeeResetRoute}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="12px" sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: isEmployeeResetRoute
                      ? "#f0f0f0"
                      : "#f8f9fa",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#1e3c72" },
                    "&.Mui-focused fieldset": { borderColor: "#1e3c72" },
                  },
                }}
              />

              {/* Password */}
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "#333" }}
              >
                {isEmployeeResetRoute ? "Reset Token" : "Password"}
              </Typography>

              <TextField
                size="small"
                fullWidth
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  isEmployeeResetRoute
                    ? "Reset token (pre-filled)"
                    : "Enter your password"
                }
                value={formData.password}
                onChange={handleChange}
                disabled={loading || localLoading || isEmployeeResetRoute}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="12px" sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: isEmployeeResetRoute
                      ? "#f0f0f0"
                      : "#f8f9fa",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#1e3c72" },
                    "&.Mui-focused fieldset": { borderColor: "#1e3c72" },
                  },
                }}
              />

              {/* Remember/Forgot */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                {!isEmployeeResetRoute && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                        sx={{
                          color: "#1e3c72",
                          "&.Mui-checked": { color: "#1e3c72" },
                        }}
                      />
                    }
                    label="Remember me"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                        color: "#666",
                      },
                    }}
                  />
                )}

                {!isEmployeeResetRoute && (
                  <Link
                    to="/forgot-password"
                    style={{
                      textDecoration: "none",
                      color: "#1e3c72",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    Forgot password?
                  </Link>
                )}
              </Box>

              {/* Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  disabled={loading || localLoading}
                  sx={{
                    width: "120px",
                    bgcolor: "#1e3c72",
                    "&:hover": { bgcolor: "#2b6eb5" },
                  }}
                >
                  {loading || localLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Link
                  to="/alumni/alumni-login"
                  style={{
                     textDecoration: "underline",
                    color: "#1e3c72",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  ALUMNI LOGIN/REGISTER
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
