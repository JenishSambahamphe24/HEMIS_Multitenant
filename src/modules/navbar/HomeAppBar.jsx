import React, { useState, useEffect, useCallback } from "react";
import { MainNavLinks } from "./NavModules";
import { IconButton } from "@mui/material";
import { FaUserTie } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import SettingsMenu from "../../components/appBar/SettingsMenu";
import HomeIcon from "@mui/icons-material/Home";
import defaultTuLogo from "../../assets/defaultLogo.jpeg";
import axios from "axios";
import DropdownMenu from "../../components/appBar/DropdownMenu";
import { Grid, Box, Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
import { useRef } from 'react';
import { config } from '@config';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const HomeAppBar = ({ navLinks = MainNavLinks }) => {
  const location = useLocation(); // Hook to get current path
  const baseUrl = config.VITE_BASE_URL;
  const backendUrl = config.VITE_BACKEND_URL;
  const id = config.VITE_CAMPUSID;
  const { userResponse } = useSelector((state) => state.module);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;
  const [defaultLogo, setDefaultLogo] = useState("");
  const [uniInfo, setUniInfo] = useState({});
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRefs = useRef({});
  const breadcrumbNameMap = {
    // Modules
    'exam-management': 'Exam Management',
    'student-management': 'Student Management',
    'employee-management': 'Employee Management',
    'program-setup': 'Program Setup',
    'scholarship': 'Scholarship Management',

    // Specific Pages
    'marks-entry': 'Marks Entry',
    'updateRollNo': 'Update Student Info.',
    'verified-students': 'Successfully Enrolled Students',
    'AssignSections': 'Assign Sections',
    'teacher-detail': 'Teaching Staff Details',
    'non-teaching-details': 'Non-Teaching Staff Details',
    'non-teaching-staff-summary': 'Non-Teaching Staff Summary',
    'major-subject': 'Major Subject Management',
    'routine-list': 'Scheduled Exams Routines',
    'exam-list': 'Scheduled Exams',
    'exam-appear': 'Exam Attendance Management',
    'old-students': 'Old Student Graduation',
    'graduation-list-enrolled': 'Graduated Enrolled Students',
    'graduation-list-old': 'Graduated Old Students',
    'add-department': 'Add Department (Teaching)',
    'add-section': 'Add Department (Non-Teaching)',
    'scholarshipStudent-list': 'Students with Scholarship',
    'discountStudent-list': 'Students with Discount',
    'finance-head': 'Income & Expense Head',
    'income-expense': 'Income & Expenditure Entry',

    // Sub-segments
    'students': 'Assign Scholarship/Discount',
  };

  const getBreadcrumbName = (name, index, allSegments) => {
    return breadcrumbNameMap[name] || name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const virtualHierarchy = {
    // Key: current segment in URL, Value: the logical parent segment
    'student-list-for-id': 'identity-card-home',
    'all-student-cards': 'identity-card-home',
    'generated-id-cards': 'identity-card-home',
    'exam-schedule': 'exam-list',
    'exam-routine': 'exam-list',
    'exam-appear': 'routine-list',
    'exam-attendees': 'routine-list',
    'marks-list': 'marks-entry',

  };


  const pathnames = location.pathname.split("/").filter((x) => x);

  const baseSegments = pathnames.filter(x =>
    x.toLowerCase() !== 'home' && x.toLowerCase() !== 'dashboard'
  );

  const searchParams = new URLSearchParams(location.search);

  const expandedPathnames = [];

  baseSegments.forEach((segment) => {
    // Checking for logical parents based on the segment & specific query params
    let logicalParent = virtualHierarchy[segment];

    // Checking query params when path alone didn't find a parent
    if (segment === 'employee-register') {
      const type = searchParams.get('employeeType');
      if (type === 'teaching') logicalParent = 'teaching-staff';
      if (type === 'administrator') logicalParent = 'non-technical-staff';
    }

    // Injecting parent when found and not already in the list
    if (logicalParent && !expandedPathnames.includes(logicalParent)) {
      expandedPathnames.push(logicalParent);
    }
    expandedPathnames.push(segment);
  });

  const modulePrefix = pathnames[0];

  const moduleEntryPoints = {
    'student-management': '/student-management/home', // The "Home" for Student module
    'exam-management': '/exam-management/home',             // The "Home" for Exam module
    'employee-management': '/employee-management/home',
    'program-setup': '/program-setup/home',
    'exam-attendees': '/exam-management/exam-attendees/home',
    'marks-list': 'exam-management/marks-list/home',
    'graduation-management': '/graduation-management/enrolled-students',
    'character-certificate-old': '/graduation-management/graduation-list-old',
    'character-certificate': '/graduation-management/graduation-list-enrolled',
    'infrastructure-management': '/infrastructure-management/home',
    'dropout-management': '/dropout-management/home',
    'pass-rate-management': '/pass-rate-management/exam-appeared',
    'user-management': '/user-management/home',
    'program-management': '/program-management/home',
    'receipt-management': '/receipt-management/student-list-enrolled',
    'other-setup': '/other-setup/home',
    'scholarship': '/scholarship/home',
    'Alumni': '/Alumni/home',
    'public-finance': '/public-finance/home'

  };
  let logos;
  let instituteNames;
  let localLevels;
  let districts;

  const isModuleAssigned = (moduleTitle) => {
    if (roleName === "CollegeAdmin") {
      return true;
    }
    if (!userResponse || !Array.isArray(userResponse)) {
      return false;
    }
    const assignedModules = userResponse.reduce((acc, module) => {
      if (module.isAssigned) {
        acc[module.name.toLowerCase()] = true;
      }
      return acc;
    }, {});
    const titleToModuleMapping = {
      'dashboard': 'dashboard',
      'program setup': 'program management',
      'setup': 'setup',
      'student': 'student management',
      'employee': 'employee management',
      'infrastructure': 'infrastructure management',
      'gps': 'infrastructure management',
      'fact sheet': 'fact sheet',
      'user': 'user management',
      'exam': 'exam management',
      'hemis reports': 'hemis report'
    };

    const normalizedTitle = moduleTitle.toLowerCase();
    const mappedModuleName = titleToModuleMapping[normalizedTitle];

    if (!mappedModuleName) {
      console.warn(`No mapping found for navigation title: "${moduleTitle}"`);
      return false;
    }
    const isAssigned = assignedModules[mappedModuleName] === true;
    return isAssigned;
  };

  const isMainNavigation = navLinks === MainNavLinks ||
    (Array.isArray(navLinks) && navLinks.some(link =>
      ['Dashboard', 'Student', 'Employee', 'Exam', 'Program Setup', 'Setup'].includes(link.title)
    ));

  const getFilteredNavLinks = () => {
    if (!isMainNavigation) {
      return navLinks;
    }

    return navLinks.filter(navLink => {
      return isModuleAssigned(navLink.title);
    });
  };

  useEffect(() => {
    const fetchData = async (id) => {
      if (!id) return;
      try {
        const response = await axios.get(`${backendUrl}/Campus/${id}`);
        const defaultLogo = response?.data?.logo;
        setUniInfo(response.data);
        setDefaultLogo(defaultLogo);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData(id);
  }, [id]);

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

  const handleOpenDropdownMenu = (index, event) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    dropdownRefs.current[index] = event.currentTarget;
  };

  const handleCloseDropdownMenu = () => {
    setOpenDropdownIndex(null);
  };

  const isDisabled = (module) => {
    return module.disabledRoles.includes(roleName || "");
  };

  const isPathActive = (navPath) => {
    const currentPath = location.pathname;
    const specialMappings = {
      '/exam-management/exam-routine': '/exam-management/exam-list',
      '/exam-management/exam-schedule': '/exam-management/exam-list',
      '/exam-management/exam-appear': '/exam-management/routine-list',
      '/exam-management/results': '/exam-management/results?resultType=all',
      '/student-management/student-list-for-id': '/student-management/identity-card-home',
      '/student-management/all-student-cards': '/student-management/identity-card-home',
      '/student-management/generated-id-cards': '/student-management/identity-card-home',
    };

    if (currentPath === navPath) {
      return true;
    }

    const pathWithoutQuery = currentPath.split('?')[0];
    const exactMatch = specialMappings[pathWithoutQuery];
    if (exactMatch === navPath) {
      return true;
    }

    for (const [childPath, parentPath] of Object.entries(specialMappings)) {
      if (pathWithoutQuery.startsWith(childPath) && parentPath === navPath) {
        return true;
      }
    }

    if (navPath === '/exam-management/results?resultType=individual' && pathWithoutQuery.startsWith('/exam-management/view-result/')) {
      return true;
    }
    if (navPath === '/exam-management/results?resultType=all' && pathWithoutQuery.startsWith('/exam-management/view-all-result/')) {
      return true;
    }
    if (navPath === '/employee-management/teaching-staff' && pathWithoutQuery.startsWith('/employee-management/documents/')) {
      return true;
    }
    if (navPath === '/student-management/identity-card-home' && pathWithoutQuery.startsWith('/student-management/student-card/')) {
      return true;
    }
    if (navPath === '/student-management/verified-students' && pathWithoutQuery.startsWith('/student-management/registration-form/')) {
      return true;
    }
    if (navPath === '/student-management/verified-students' && pathWithoutQuery.startsWith('/student-management/documents/')) {
      return true;
    }
    if (navPath === '/exam-management/marks-entry' && pathWithoutQuery.startsWith('/exam-management/marks-list/')) {
      return true;
    }
    if (navPath === '/exam-management/student-list-for-results' && pathWithoutQuery.startsWith('/exam-management/student-all-results/')) {
      return true;
    }

    return currentPath.startsWith(navPath);
  };

  const isDropdownActive = (dropdownItem) => {
    const currentPath = location.pathname;
    return dropdownItem.reports?.some(report => {
      return isPathActive(report.link);
    });
  };

  // Helper to check if current URL matches a given link (including query params)
  const isExactLinkActive = useCallback((link) => {
    const [path, queryString] = link.split('?');

    // Check pathname first
    if (location.pathname !== path) {
      return false;
    }

    // If no query, it's a match
    if (!queryString) return true;

    // Parse expected query from link
    const expectedParams = new URLSearchParams(queryString);
    const currentParams = new URLSearchParams(location.search);

    // Compare each expected param
    for (const [key, value] of expectedParams) {
      if (currentParams.get(key) !== value) {
        return false;
      }
    }

    return true;
  }, [location.pathname, location.search]);

  const isReportActive = isExactLinkActive;

  const filteredNavLinks = getFilteredNavLinks();
  return (
    <nav className="bg-white border-gray-200">
      <div className="flex flex-col flex-wrap items-center justify-between mx-auto">
        {/* Header Section */}
        {currentUser && (
          <Box className="flex flex-col md:flex-row justify-between w-full px-4 py-3">
            {/* Logo Section */}
            <Box className="flex items-center justify-center md:justify-start mb-3 md:mb-0">
              <Link
                to="/"
                className="flex items-center space-x-3 rtl:space-x-reverse"
              >
                <img
                  src={
                    currentUser?.institution?.logo
                      ? `${baseUrl}/${defaultLogo}`
                      : logos
                  }
                  alt="Logo"
                  style={{ marginRight: "8px", height: "75px" }}
                />
                <Box className="text-center md:text-left ">
                  <h1 className="text-xl font-semibold text-[#2b6eb5]">
                    {uniInfo.campusName}
                  </h1>
                  <h1 className="text-xs text-[#2b6eb5]">
                    {`${uniInfo.localLevel}, ${uniInfo.district}`}
                  </h1>
                </Box>
              </Link>
            </Box>

            {/* System Title */}
            <Box className="flex items-center justify-center">
              <h1 className="text-[#2b6eb5] text-lg font-semibold text-center">
                Higher Education Management Information System (HEMIS)
              </h1>
            </Box>
          </Box>
        )}

        {/* BREADCRUMBS SECTION */}
        {currentUser && pathnames.length > 0 && (
          <Box
            className="w-full px-6 py-2 bg-gray-50 border-b"
            sx={{ display: 'flex', alignItems: 'center', minHeight: '40px' }}
          >
            <Breadcrumbs
              sseparator={<NavigateNextIcon fontSize="small" sx={{ color: '#6b7280' }} />}
              aria-label="breadcrumb"
              sx={{ '& ol': { flexWrap: 'nowrap' } }}
            >
              {/* Dynamic Dashboard Crumb */}
              {(() => {
                const isOnDashboard = location.pathname === '/dashboard' || location.pathname === '/';
                const dashboardDisplayName = 'Dashboard';

                if (isOnDashboard) {
                  return (
                    <Typography
                      key="dashboard"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <NavigateNextIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                      {dashboardDisplayName}
                    </Typography>
                  );
                } else {
                  return (
                    <MuiLink
                      key="dashboard"
                      component={Link}
                      to="/dashboard"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#2b6eb5',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#1a4a7d',
                        },
                      }}
                    >
                      <NavigateNextIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                      {dashboardDisplayName}
                    </MuiLink>
                  );
                }
              })()}

              {expandedPathnames.map((value, index) => {
                const last = index === expandedPathnames.length - 1;

                const redirectUrl = moduleEntryPoints[value] || `/${modulePrefix}/${value}`;

                const displayName = getBreadcrumbName(value);

                if (last) {
                  return (
                    <Typography
                      key={`${value}-${index}`}
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1f2937',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayName}
                    </Typography>
                  );
                }

                return (
                  <MuiLink
                    key={`${value}-${index}`}
                    component={Link}
                    to={redirectUrl}
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#2b6eb5',
                      textDecoration: 'none',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#1a4a7d',
                      },
                    }}
                  >
                    {displayName}
                  </MuiLink>
                );
              })}

            </Breadcrumbs>
          </Box>
        )}

        {/* Non-logged in User View */}
        {!currentUser && (
          <Grid container className="w-full">
            <Grid item xs={12} sm={4} className="flex bg-[#2B6EB5]">
              <Box className="py-2 px-4 w-full">
                <Link
                  to="/"
                  className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                  <img
                    src={
                      !currentUser?.institution?.logo
                        ? `${baseUrl}/${defaultLogo}`
                        : defaultLogo
                    }
                    alt="Logo"
                    style={{ marginRight: "8px", height: "75px" }}
                  />
                  <Box className="flex-1">
                    <h1 className="text-lg text-white font-semibold">
                      {uniInfo.campusName}
                    </h1>
                    <h1 className="text-xs text-white">
                      {`${uniInfo.localLevel}, ${uniInfo.district}`}
                    </h1>
                  </Box>
                </Link>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={8}
              className="flex items-center justify-center p-4"
              style={{
                background: 'linear-gradient(97deg, rgba(43,110,181,1) 1%, rgba(156,191,221,1) 75%, rgba(195,219,235,1) 99%)'
              }}
            >
              <h1 className="uppercase text-white text-lg font-semibold text-center">
                Higher Education Management Information System (HEMIS)
              </h1>
            </Grid>
            <Box className="w-full h-[2px] bg-orange-700" />
          </Grid>
        )}

        {/* Mobile Menu Button - Similar positioning to AlumniLogin */}
        {currentUser && (
          <Box className="w-full flex justify-end md:hidden px-4 py-2">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </Box>
        )}

        {/* Navigation Menu - Responsive like AlumniLogin */}
        <Box
          className={`${isNavOpen ? "block" : "hidden"} w-full md:block md:w-full`}
        >
          {currentUser && (
            <Box className="flex flex-col font-medium bg-[#2b6eb5] md:flex-row md:items-center md:justify-start md:py-3 md:px-4">

              {/* Home Icon */}
              <Box className="border-b border-blue-400 md:border-none">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center p-3 md:p-1 ${isActive ? "bg-red-100 text-[#2b6eb5]" : "text-white"}`
                  }
                >
                  <IconButton color="inherit" size="small">
                    <HomeIcon fontSize="small" />
                  </IconButton>
                  <span className="ml-2 md:hidden">Home</span>
                </NavLink>
              </Box>

              {/* Regular Navigation Links */}
              {filteredNavLinks
                .filter((item) => item.type !== "dropdown" && item.type !== "dropdown1")
                .map((module, index) => {
                  const disabled = isDisabled(module);
                  return (
                    !disabled && (
                      <Box
                        key={index}
                        className="border-b border-blue-400 last:border-b-0 md:border-none"
                      >
                        <NavLink
                          to={module.link}
                          className={() => {
                            const isActive = isPathActive(module.link);
                            return `block p-3 text-md md:ml-4 md:tracking-tight lg:text-md md:p-0 ${isActive
                              ? "text-red-100 border-b-[1px] border-red-100 md:border-b-0"
                              : "text-white"
                              }`;
                          }}
                          onClick={() => setIsNavOpen(false)}
                        >
                          {module.title}
                        </NavLink>
                      </Box>
                    )
                  );
                })}

              {/* Dropdown Navigation Links */}
              {filteredNavLinks
                .filter((item) => item.type === "dropdown" || item.type === "dropdown1")
                .map((item, index) => {
                  const isDropdownItemActive = isDropdownActive(item);

                  return (
                    <Box
                      key={index}
                      className={`border-b border-blue-400 md:border-none ${isDropdownItemActive
                        ? "text-red-100 border-b-[1px] border-red-100 md:border-b-0"
                        : "text-white"
                        }`}
                    >
                      <button
                        onClick={(event) => handleOpenDropdownMenu(index, event)}
                        className="flex items-center justify-between w-full p-3 text-left md:w-auto md:p-0 md:ml-4"
                      >
                        <span>{item.title}</span>
                        <svg
                          className="w-2.5 h-2.5 ms-2.5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </button>

                      {/* Mobile Dropdown */}
                      <Box className={`md:hidden ${openDropdownIndex === index ? 'block' : 'hidden'} bg-blue-700`}>
                        {item.reports?.map((report, reportIndex) => (
                          <NavLink
                            key={reportIndex}
                            to={report.link}
                            className={({ isActive }) =>
                              `block p-3 pl-6 text-white hover:bg-blue-600 border-t border-blue-600 ${isActive ? 'bg-blue-800' : ''
                              }`
                            }
                            onClick={() => {
                              setIsNavOpen(false);
                              handleCloseDropdownMenu();
                            }}
                          >
                            {report.title}
                          </NavLink>
                        ))}
                      </Box>

                      <DropdownMenu
                        reports={item.reports}
                        isDropdownOpen={openDropdownIndex === index}
                        anchorEl={dropdownRefs.current[index]}
                        handleCloseDropdownMenu={handleCloseDropdownMenu}
                        isReportActive={isReportActive}
                      />
                    </Box>
                  );
                })}

              {/* User Menu */}
              <Box className="border-t border-blue-400 md:border-none md:ml-auto">
                <button
                  onClick={handleOpenUserMenu}
                  className="flex items-center justify-between w-full p-3 text-white md:p-0 md:w-auto"
                >
                  <Box className="flex items-center">
                    <FaUserTie className="w-6 h-6" />
                    <span className="ml-2 md:hidden">Profile</span>
                  </Box>
                  <svg
                    className="w-2.5 h-2.5 ms-2.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <SettingsMenu
                  anchorElUser={anchorElUser}
                  handleCloseUserMenu={handleCloseUserMenu}
                />
              </Box>
            </Box>
          )}
        </Box>
      </div>
    </nav>
  );
};

export default HomeAppBar;