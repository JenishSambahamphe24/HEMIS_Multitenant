import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import logo from "../../assets/logo.jpg";
import toast from "react-hot-toast";
import {
  signOut,
  clearErrors,
  resetLoadingState,
} from "../../redux/user/userSlice";
import {config} from '@config';

const NewPassword = () => {
  const backendUrl=config.VITE_BACKEND_URL;
  const { email, token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [defaultLogo, setDefaultLogo] = useState("");


  const [formData, setFormData] = useState({
    email: email || "",
    newPassword: token || "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true);
        const response = await axios.get(`${backendUrl}/Campus/${campusId}`);
        const logo = response?.data?.logo;
        setCollegeName(response.data.campusName)
        setDefaultLogo(logo || "");
      } catch (err) {
        console.error("Error fetching campus logo:", err);
        toast.error("Could not load campus logo", { id: "logo-error" });
      } finally {
        setLocalLoading(false);
      }
    };
    fetchData()
  }, [])
  
  useEffect(() => {
    if (email) {
      setFormData((prevState) => ({
        ...prevState,
        email,
      }));
    }
  }, [email]);

  useEffect(() => {
    if (token) {
      setFormData((prevState) => ({
        ...prevState,
        newPassword: token,
      }));
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const clearAuthState = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionExpiry");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("email");
    sessionStorage.clear();
    dispatch(signOut());
    dispatch(clearErrors());
    dispatch(resetLoadingState());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword.trim()) {
      toast.error("Password cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/User/ResetPassword`,
        {
          email: formData.email,
          newPassword: formData.newPassword,
          resetToken: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success(
          "Your password has been successfully reset. Redirecting to sign-in page...",
          {
            duration: 3000,
          }
        );

        setFormVisible(false);
        clearAuthState();
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An error occurred. Please check your input and try again.");
    }
  };

  const handleClickShowPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleNavigateToLogin = () => {
    clearAuthState();
    navigate("/login", { replace: true });
  };

  // Check if form is valid for submission
  const isFormValid = formData.newPassword.trim().length > 0;

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={5} sx={{ borderRadius: "15px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <img src={logo} alt="logo" style={{ height: "45px" }} />
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          {formVisible ? (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                label="Email Address"
                name="email"
                value={formData.email}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                type={showNewPassword ? "text" : "password"}
                label="Temporary Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!isFormValid}
                sx={{ width: "12rem", mx: "auto", mt: 2 }}
                size="small"
              >
                Reset Password
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body1">
                Your password has been successfully reset. Go to the sign-in
                page.{" "}
                <Link
                  to="/login"
                  onClick={handleNavigateToLogin}
                  style={{ cursor: "pointer" }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};
export default NewPassword;
