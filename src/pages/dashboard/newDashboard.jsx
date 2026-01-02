import { useSelector } from "react-redux";
import { Grid, Typography } from "@mui/material";
import DashboardCard from "../../components/newDashboard/DashboardCard.jsx";
import FacultyLevelChart from "../../components/newDashboard/FacultyLevelChart.jsx";
import StudentByEthnicity from "../../components/newDashboard/StudentByEthnicity.jsx";
import TeachingStaffPieChart from "../../components/newDashboard/TeachingStaffPieChart.jsx";
import NonTeachingStaffPieChart from "../../components/newDashboard/NonTeachingStaffPieChart.jsx";
import CampusProgram from "../../components/dashboard/CampusProgram.jsx";
import StudentEnrollmentTrend from "../../components/newDashboard/StudentEnrollmentTrend.jsx";
import StudentGraduationTrend from "../../components/newDashboard/StudentGraduation.jsx";
import LevelChart from "../../components/newDashboard/LevelWiseDashboard.jsx";


const NewDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;
  console.log(currentUser)
  if (!currentUser) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DashboardCard
            authToken={currentUser?.tokenString}
            roleName={roleName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StudentEnrollmentTrend authToken={currentUser?.tokenString} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StudentGraduationTrend authToken={currentUser?.tokenString} />
        </Grid>
        <Grid item xs={12} md={6} >
          <FacultyLevelChart authToken={currentUser?.tokenString} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LevelChart authToken={currentUser?.tokenString} />
        </Grid>
          <Grid item xs={12} md={6}>
            <CampusProgram authToken={currentUser?.tokenString} />
          </Grid>
        <Grid item xs={12} md={6}>
          <StudentByEthnicity authToken={currentUser?.tokenString} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TeachingStaffPieChart authToken={currentUser?.tokenString} />
        </Grid>
        <Grid item xs={12} md={8}>
          <NonTeachingStaffPieChart authToken={currentUser?.tokenString} />
        </Grid>
      </Grid>

    </div>
  );
};

export default NewDashboard;