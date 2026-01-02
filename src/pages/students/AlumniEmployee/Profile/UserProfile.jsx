import { Box, Grid, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { MdHomeWork } from "react-icons/md";
import Graduation from "./Graduation";
import Batchmate from "./Batchmate";
import { useAlumni } from "../../../../context/AlumniContext";

const UserProfile = () => {
  const { programId, campusId, enrolledYear } = useAlumni();

  const email = localStorage.getItem("email");
  const applicantNameEng = localStorage.getItem("applicantNameEng");
  const studentAddress = localStorage.getItem("studentAddress");
  const contactNo = localStorage.getItem("contactNo");
  const role = localStorage.getItem("role");
  const ppSizePhoto = localStorage.getItem("uploadPPSizePhoto");

  return (
    <div className="p-8 min-h-screen mt-2 rounded-2xl shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center rounded-xl p-4 bg-gradient-to-br bg-gray-300">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          Profile Overview
        </h2>{" "}
      </div>

      <Grid container spacing={4} className="mt-4">
        {/* Left Section */}
        <Grid item xs={12} md={7.5}>
          <Box className="flex items-center p-4 gap-4">
            {/* <Box
              sx={{
                cursor: "pointer",
                "& img": {
                  height: 100,
                  width: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  "&:hover": { border: "2px solid #56aeff" },
                },
              }}
            >
              <img src="/lily.jpeg" alt="Profile" className="p-0.5" />
            </Box> */}
            <Box
              sx={{
                cursor: "pointer",
                "& img": {
                  height: 100,
                  width: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  "&:hover": { border: "2px solid #56aeff" },
                },
              }}
            >
              <img
                src={
                  ppSizePhoto && ppSizePhoto !== "" ? ppSizePhoto : "/image.png"
                }
                alt="Profile"
                className="p-0.5"
              />
            </Box>
            <Box>
              <Typography variant="h6" className="text-gray-800">
                {applicantNameEng || "N/A"}
              </Typography>
              <p className="text-gray-500">@{role || "user"}</p>
            </Box>
          </Box>

          {/* User Info Section */}
          <Box className="w-full mt-8 px-4">
            <Box className="flex items-center gap-4 mb-4">
              <Typography
                variant="h5"
                className="font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent"
              >
                Personal Info
              </Typography>

              <div className="flex-grow h-0.5 bg-gradient-to-br from-purple-400 to-indigo-400"></div>
            </Box>

            <Box className="flex flex-col gap-3 text-gray-700 text-base">
              <Box className="flex items-center gap-3">
                <LocalPhoneIcon className="text-purple-900" />
                <span>{contactNo || "N/A"}</span>
              </Box>

              <Box className="flex items-center gap-2">
                <EmailIcon className="text-purple-900" />
                <span>{email}</span>
              </Box>
              <Box className="flex items-center gap-2">
                <MdHomeWork
                  style={{ fontSize: "28px" }}
                  className="text-purple-900"
                />
                <span>{studentAddress}</span>
              </Box>
            </Box>

            {/* Graduation Section */}
            <Graduation />
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={4.5}>
          <Batchmate
            enrolledYear={enrolledYear}
            campusId={campusId}
            programId={programId}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default UserProfile;
