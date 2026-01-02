import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { IoIosArrowDown } from "react-icons/io";
import toast from "react-hot-toast";
import { useAlumni } from "../../../../../context/AlumniContext";

export default function Admin() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

const setAlumniData = (data) => {
  setEmail(data.email);
  // set other context values as needed
};

  const { email } = useAlumni();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {/* Trigger button with Person + Arrow */}
      <IconButton
        onClick={handleClick}
        sx={{ display: "flex", alignItems: "center", color: "white" }}
      >
        <PersonIcon />
        <IoIosArrowDown style={{ fontSize: "20px", marginLeft: "4px" }} />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { borderRadius: "12px", minWidth: 200, p: 1 },
        }}
      >
        <Box display="flex" alignItems="center" p={1}>
          <Avatar sx={{ bgcolor: "#1976d2", mr: 1 }}>A</Avatar>
          <Box>
            <Typography fontWeight={600}>AlumniAdmin</Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem component={Link} to="user-profile" onClick={handleClose}>
          Profile
        </MenuItem>
         <MenuItem
          component={Link}
          to="/alumni-admin/password-change"
          onClick={handleClose}
        >
          Change Password
        </MenuItem>
        <MenuItem
          component={Link}
          to="/alumni"
          onClick={() => {
            localStorage.clear();
            toast.success("Logged out successfully!");
          }}
          
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
