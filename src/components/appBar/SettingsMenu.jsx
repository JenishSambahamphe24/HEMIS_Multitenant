import {
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { signOut } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearModules } from "../../redux/moduleSlice";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

export default function SettingsMenu({ anchorElUser, handleCloseUserMenu }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;

  const email = currentUser?.email || "";
  const name = currentUser?.listUser?.[0]?.roleName || "";

  const handleLogout = () => {
    // Show success toast - CHANGED ONLY THIS LINE
    toast.success("Logout successful !", {
      // position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // Dispatch logout actions
    dispatch(signOut());
    dispatch(clearModules());
    
    // Navigate to home
    navigate("/");
    
    // Close the menu
    handleCloseUserMenu();
  };

  return (
    <Menu
      sx={{ mt: "45px" }}
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#1976d2",
            marginRight: "12px",
            width: 36,
            height: 36,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              color: "#333",
              mb: 0.5,
              fontSize: "14px",
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontSize: "12px",
            }}
          >
            {email}
          </Typography>
        </Box>
      </Box>
      <Divider />

      <MenuItem sx={{ padding: "0" }} onClick={handleCloseUserMenu}>
        <Typography
          component={Link}
          to="/profile"
          sx={{
            width: "100%",
            padding: "10px 16px",
            color: "inherit",
            textDecoration: "none",
            textAlign: "left",
            "&:hover": {
              bgcolor: "#1976d2",
              color: "whitesmoke",
            },
          }}
        >
          Profile
        </Typography>
      </MenuItem>
      <MenuItem sx={{ padding: "0" }} onClick={handleCloseUserMenu}>
        <Typography
          component={Link}
          to="/change-password"
          sx={{
            width: "100%",
            padding: "10px 16px",
            color: "inherit",
            textDecoration: "none",
            textAlign: "left",
            "&:hover": {
              bgcolor: "#1976d2",
              color: "whitesmoke",
            },
          }}
        >
          Change Password
        </Typography>
      </MenuItem>
      <MenuItem sx={{ padding: "0" }} onClick={handleCloseUserMenu}>
        <Typography
          onClick={handleLogout}
          sx={{
            width: "100%",
            padding: "10px 16px",
            color: "inherit",
            textDecoration: "none",
            textAlign: "left",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "red",
              color: "whitesmoke",
            },
          }}
        >
          Logout
        </Typography>
      </MenuItem>
    </Menu>
  );
}
