import React, { useMemo, useEffect } from "react";
import { Tooltip } from "rsuite";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import axios from "axios";
import { LoadingOverlay } from "@mantine/core";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import { useDispatch } from "react-redux";
import { setModules } from "../../redux/moduleSlice";
import { config  as appConfig} from "@config";
const acLink = appConfig.VITE_AC_LINK;


const styles = {
  moduleBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    textAlign: "center",
    overflow: "hidden",
    marginLeft: "auto",
  },

  avatarContainer: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: "50%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
  },

  moduleTitle: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#ffffff",
    marginTop: "8px",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: "0.3px",
    lineHeight: "1.4",
  },
};
const moduleLinks = {
  "Payroll Module": "/payment",
  "Event Module": "/event-module",
  "User Management": "/user-management/home",
  "Student Management": "/student-management/home",
  "Employee Management": "/employee-management/home",
  "Dashboard": "/dashboard",
  "Budget Management": "/budget-management",
  "Infrastructure Management": "/infrastructure-management/home",
  "Campus Management": "/organization-management",
  "Graduation Management": "/graduation-management/enrolled-students",
  "Fee Management": "/receipt-management/student-list-enrolled",
  "Program Management": "/program-management/home",
  Setup: "/other-setup/home",
  "Exam Management": "/exam-management/home",
  "Drop Out Management": "/dropout-management/home",
  "Account Management": acLink,
  "Library Management": "/library",
  "Research Management": "/research",
  "Campus Fact Sheet": "/fact-sheet-list",
  "Fact Sheet": "/fact-sheet",
  "HEMIS Report": "/college-report",
  "Pass Rate Management": "/pass-rate-management/exam-appeared",
  "Public Financing": "/public-finance/home",
  "Scholarship Management": "/scholarship/home",
  "Alumni Management":"/Alumni/home"
};

const ModuleCard = React.memo(({ module, link, isDisabled }) => {
  const baseUrl = appConfig.VITE_BASE_URL;

  return (
    <div style={{ textDecoration: "none", width: '100%' }}>
      {isDisabled ? (
        <Tooltip title="Permission not given" arrow placement="top">
          <div
            className="moduleBox disabled"
            style={{
              ...styles.moduleBox,
              backgroundColor: "#1C375B",
              color: "#1C375B",
              cursor: "not-allowed",
              opacity: 0.8,
              transition: "none",
              transform: "none",
            }}
          >
            <div style={styles.avatarContainer}>
              <img
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "70px",
                }}
                alt="logo"
                src={`${baseUrl}/${module.icon}`}
              />
            </div>
            <p style={styles.moduleTitle}>
              {module.displayName}
            </p>
          </div>
        </Tooltip>
      ) : (
        <Link
          target={module.displayName === 'Account Management' ? '_blank' : ''}
          to={link} style={{ textDecoration: "none" }}
        >
          <div
            className="moduleBox"
            style={{
              ...styles.moduleBox,
              backgroundColor: "#1C375B",
              color: "#1C375B",
              cursor: "pointer",
              opacity: 1,
            }}
          >
            <div style={styles.avatarContainer}>
              <img
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "70px",
                }}
                alt="logo"
                src={`${baseUrl}/${module.icon}`}
              />
            </div>
            <p style={styles.moduleTitle}>
              {
                module.displayName
              }
            </p>
          </div>
        </Link>
      )}
    </div>
  );
});

const HomePage = () => {
  const backendUrl = appConfig.VITE_BACKEND_URL;
  const baseUrl = appConfig.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { moduleData, userResponse, linksMap, isLoading } = useSelector((state) => state.module);
  const roleName = currentUser?.listUser?.[0]?.roleName;
  const id = currentUser?.id;
  const config = getAuthConfigSafe();

useEffect(() => {
  const fetchData = async () => {
    try {
      // Check if config is available before making API calls
      if (!config) {
        console.warn('Auth config not available');
        dispatch(setModules({ isLoading: false }));
        return;
      }

      // Check if backendUrl is available
      if (!backendUrl) {
        console.error('Backend URL is not defined');
        dispatch(setModules({ isLoading: false }));
        return;
      }

      dispatch(setModules({ isLoading: true }));

      const modulesResponse = await axios.get(`${backendUrl}/ModuleCollegeAccess`, config);
      
      // Check if modules response is valid
      if (!modulesResponse?.data) {
        throw new Error('Invalid modules response');
      }

      const processedModules = modulesResponse.data
        .map((item) => {
          if (item.displayName === "Account Management") {
            return { ...item, link: moduleLinks["Account Management"] };
          }
          return item;
        })
        .filter((item) => item.displayName !== "Payroll Management");

      // Check if we have any modules after processing
      if (!processedModules.length) {
        console.warn('No modules available after processing');
      }

      const links = {};
      processedModules.forEach((module) => {
        links[module.displayName] = moduleLinks[module.displayName] || "/coming-soon";
      });

      let userPermissions = null;
      if (roleName !== "CollegeAdmin" && id) {
        // Additional checks for user permissions request
        if (!id) {
          console.warn('User ID not available for permissions request');
        } else {
          const userResponseData = await axios.get(
            `${backendUrl}/User/UserPermissionCollege/${id}`,
            config
          );
          userPermissions = userResponseData?.data || null;
        }
      }

      dispatch(setModules({
        moduleData: processedModules,
        userResponse: userPermissions, 
        linksMap: links,
        isLoading: false
      }));

    } catch (error) {
      console.error("Error fetching modules or permissions:", error);
      dispatch(setModules({ 
        isLoading: false,
        error: error.message 
      }));
    }
  };

  // Enhanced condition checks before fetching
  const shouldFetchData = 
    roleName && 
    config && 
    backendUrl &&
    (!moduleData?.length || !linksMap);

  if (shouldFetchData) {
    fetchData();
  } else if (!config || !backendUrl) {
    // If essential config is missing, set loading to false
    dispatch(setModules({ isLoading: false }));
  }
}, [roleName, id, dispatch, moduleData, linksMap, config, backendUrl]); // Added config and backendUrl to dependencies

  const assignedModuleIds = useMemo(() => {
    if (roleName === "CollegeAdmin") {
      return new Set(moduleData?.map(module => module.id) || []);
    }
    return new Set(
      (userResponse || [])
        .filter(perm => perm.isAssigned)
        .map(perm => perm.moduleId)
    );
  }, [roleName, userResponse, moduleData]);

  const isDisabled = (module) => {
    const hasValidLink =
      linksMap?.[module.displayName] &&
      linksMap[module.displayName] !== "/coming-soon";

    if (roleName === "CollegeAdmin") {
      return !hasValidLink;
    }
   
    if (userResponse === null) {
      return false; 
    }
    
    const hasPermission = assignedModuleIds.has(module.id);
    return !hasPermission || !hasValidLink;
  };

  // Fixed loading condition - more comprehensive check
  const showLoading = 
    isLoading ||
    !moduleData?.length ||
    !linksMap ||
    (roleName !== "CollegeAdmin" && userResponse === null);

  return (
    <>
      {showLoading ? (
        <LoadingOverlay
          visible={true}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ color: "#1976d2", type: "bars" }}
        />
      ) : (
        <Grid
          container
          spacing={2}
          sx={{
            px: { xs: "20px", md: "60px" },
            py: { xs: '20px' }
          }}
        >
          {moduleData.map((module, index) => {
            const link = linksMap[module.displayName] || "#";
            const disabled = isDisabled(module);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <ModuleCard
                  module={module}
                  link={link}
                  isDisabled={disabled}
                  roleName={roleName}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
};

export default HomePage;
