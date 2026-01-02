import { Card, CardContent, Typography, Grid,  Alert } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { Box, styled } from "@mui/material";
import {
  Male,
  Female,
  Face,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import {
  getCampusByType,
  getEmployeeByGender,
  getStudentByGender,
} from "../dashboard/services/service";

const IconBox = styled(Box)(({ color }) => ({
  display: "flex",
  alignItems: "center",
  "& svg": {
    marginRight: 4,
    color: color || "#F5F5F5",
    fontSize: "1rem",
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(0.5),
}));


const DashboardCard = ({
  title,
  male,
  female,
  others,
  total,
  color,
}) => {

  return (
    <Card
      sx={{
        backgroundColor: "#F5F5F5",
        backdropFilter: "blur(10px)",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
        height: "100%",
      }}
    >
      <CardContent sx={{ padding: "16px", flexGrow: 1 }}>
        <StatBox>
          <IconBox color={color}>
            <Male />
            <Typography variant="body2" fontSize="0.8rem">
              Male: {male}
            </Typography>
          </IconBox>
          <IconBox color={color}>
            <Female />
            <Typography variant="body2" fontSize="0.8rem">
              Female: {female}
            </Typography>
          </IconBox>
          <IconBox color={color}>
            <Face />
            <Typography variant="body2" fontSize="0.8rem">
              Others: {others}
            </Typography>
          </IconBox>
        </StatBox>
        <Typography
          textAlign="center"
          variant="body1"
          color={color}
          style={{
            marginTop: "5px",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          Total: {total}
        </Typography>
      </CardContent>
      <CardContent
        sx={{
          backgroundColor: color,
          color: "#F5F5F5",
          padding: "16px",
          borderRadius: "0 0 8px 8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "30px",
        }}
      >
        <Typography
          variant="body2"
          component="div"
          sx={{ width: "100%", textAlign: "center", fontSize: "0.875rem" }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = ({ authToken, roleName }) => {
  const { currentUser } = useSelector((state) => state.user);
  const collegeId = currentUser.institution.id
  const queries = useQueries({
    queries: [
      {
        queryKey: ["students", authToken],
        queryFn: () => getStudentByGender(authToken),
        enabled: !!authToken,
        staleTime: 60 * 60 * 1000,
        cacheTime: 60 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: false,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      {
        queryKey: ["employees", authToken, collegeId],
        queryFn: () => getEmployeeByGender(authToken, collegeId),
        enabled: !!authToken && !!collegeId,
        staleTime: 60 * 60 * 1000,
        cacheTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      {
        queryKey: ["campus", authToken],
        queryFn: () => getCampusByType(authToken),
        enabled: !!authToken,
        staleTime: 60 * 60 * 1000,
        cacheTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    ],
  });
  const [
    { data: students = {}, isLoading: studentsLoading, error: studentsError },
    { data: employeeData = [], isLoading: employeeLoading, error: employeeError },
    { data: campusData = {}, isLoading: campusLoading, error: campusError },
  ] = queries;

  const isLoading = studentsLoading || employeeLoading || campusLoading;

  const hasError = studentsError || employeeError || campusError;

  const teachingStaff = employeeData.filter((item) => item.type === "Teaching");
  const noTeaching = employeeData
    .filter((item) => item.type === "Nonteaching")
    .reduce(
      (acc, curr) => {
        acc.male += curr.male;
        acc.female += curr.female;
        acc.other += curr.other;
        acc.totalEmployees += curr.totalEmployees;
        return acc;
      },
      { male: 0, female: 0, other: 0, totalEmployees: 0 }
    );


  if (isLoading) {
    return (
      <LoadingOverlay
        visible={isLoading}
        zIndex={100}
        overlayProps={{ radius: "sm", blur: 1 }}
        loaderProps={{ color: "#1976d2", type: "bars" }}
      />
    );
  }

  if (hasError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading dashboard data. Please try again.
        {studentsError && <div>Students: {studentsError.message}</div>}
        {employeeError && <div>Employees: {employeeError.message}</div>}
        {campusError && <div>Campus: {campusError.message}</div>}
      </Alert>
    );
  }

  return (
    <Grid container spacing={2}>
      {/* Students Card */}
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <DashboardCard
          title="Students"
          male={students.male || 0}
          female={students.female || 0}
          others={students.other || 0}
          total={students.total || 0}
          color="#1976d2"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <DashboardCard
          title="Teaching Staff "
          male={teachingStaff[0]?.male || 0}
          female={teachingStaff[0]?.female || 0}
          others={teachingStaff[0]?.other || 0}
          total={teachingStaff[0]?.totalEmployees || 0}
          color="#84A54E"
        />
      </Grid>

      {/* Non-Teaching Staff Card */}
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <DashboardCard
          title="Non-Teaching Staff"
          male={noTeaching.male || 0}
          female={noTeaching.female || 0}
          others={noTeaching.other || 0}
          total={noTeaching.totalEmployees || 0}
          color="#9E9E9E"
        />
      </Grid>

    </Grid>
  );
};

export default Dashboard;