
export const MainNavLinks = [
  {
    title: "Dashboard",
    link: "/dashboard",
    disabledRoles: [],
  },
  {
    title: "Program Setup",
    link: "/program-management/home",
    disabledRoles: [],
  },
  {
    title: "Setup",
    link: "/other-setup/home",
    disabledRoles: [],
  },
  {
    title: "Student",
    link: "/student-management/home",
    disabledRoles: [],
  },
  {
    title: "Employee",
    link: "/employee-management/home",
    disabledRoles: [],
  },

  {
    title: "Infrastructure",
    link: "/infrastructure-management/home",
    disabledRoles: [],
  },
  {
    title: "GPS",
    link: "/add-location",
    disabledRoles: [],
  },
  {
    title: "Fact Sheet",
    link: "/fact-sheet",
    disabledRoles: [],
  },
  {
    title: "User",
    link: "/user-management/home",
    disabledRoles: [],
  },
  {
    title: "Exam",
    link: "/exam-management/home",
    disabledRoles: [],
  },
  {
    type: "dropdown",
    title: "HEMIS Reports",
    disabledRoles: [],
    reports: [
      {
        title: "Summary Report",
        link: "/college-report",
        disabledRoles: [],
      },
      {
        title: "Statistical Report",
        link: "/form-management/statisticalReport",
        disabledRoles: [],
      },
      {
        title: "Student-summary Report",
        link: "student-summary-detail",
        disabledRoles: [],
      },
      {
        title: "Teacing Staff Summary",
        link: "/teaching-staff-summary",
        disabledRoles: [],
      },
      {
        title: "Non-Teacing Staff Summary",
        link: "non-teaching-staff-summary",
        disabledRoles: [],
      },
    ],
  },
  //  {
  //   title: "Alumni",
  //   link: "/Alumni-home",
  //   disabledRoles: [],
  // },
];

export const StudentNavLinks = [
  {
    title: "Home",
    bgColor: "#1C375B",
    color: "#1C375B",
    link: "/student-management/home",
    disabledRoles: [],
  },
  {
    title: "Student Enrollment",
    link: "/student-management/verified-students",
    disabledRoles: [],
  },
  // {
  //   title: "Irregular Students",
  //   link: "/student-management/irregular-students",
  //   disabledRoles: ["Admin", ],
  // },
  {
    title: "Reg./symbol No.",
    link: "/student-management/updateRollNo",
    disabledRoles: [],
  },
  //Assign section to the students
  {
    title: "Assign Section",
    link: "/student-management/AssignSections",
    disabledRoles: [],
  },
  {
    title: "Upgrade",
    link: "/student-management/upgrade-academics",
    disabledRoles: [],
  },
  {
    title: "Identity Card",
    link: "/student-management/identity-card-home",
    disabledRoles: [],
  },

  {
    type: "dropdown1",
    title: "Transfer",
    disabledRoles: [],
    reports: [
      {
        title: "Transfer In ",
        link: "/student-management/student-transfer-in",
        disabledRoles: [],
      },
      {
        title: "Transfer Out",
        link: "/student-management/student-transfer-out",
        disabledRoles: [],
      },
    ],
  },
  {
    type: "dropdown",
    title: "Reports",
    disabledRoles: [],
    reports: [
      {
        title: "Student Detail",
        link: "/student-management/student-information-detail",
        disabledRoles: [],
      },
      {
        title: "Student By Districts",
        link: "/student-management/student-by-district",
        disabledRoles: [],
      },
      {
        title: "Student by Major",
        link: "/student-management/student-by-major",
        disabledRoles: [],
      },
      {
        title: "Student-summary Report",
        link: "/student-management/student-summary-detail",
        disabledRoles: [""],
      },
      {
        title: "Summary by program major",
        link: "/student-management/summary-by-major",
        disabledRoles: [],
      },
    ],
  },
];
export const EmployeeNavLinks = [
  {
    title: "Home",
    link: "/employee-management/home",
    disabledRoles: [],
  },

  {
    title: "Teaching Staffs",
    link: "/employee-management/teaching-staff",
    disabledRoles: [],
  },
  {
    title: "Non-teaching Staffs",
    link: "/employee-management/non-technical-staff",
    disabledRoles: [],
  },

  {
    type: "dropdown",
    title: "Reports",
    disabledRoles: [],
    reports: [
      {
        title: "Teaching Staff",
        link: "/employee-management/teacher-detail",
        disabledRoles: [],
      },
      {
        title: "Non-Teaching Staff",
        link: "/employee-management/non-teaching-details",
        disabledRoles: [],
      },
      {
        title: "Teaching Staff Summary",
        link: "/employee-management/teaching-staff-summary",
        disabledRoles: [],
      },
      {
        title: "Non-teaching Staff Summary",
        link: "/employee-management/non-teaching-staff-summary",
        disabledRoles: [],
      },
    ],
  },
];

export const ExamNavLinks = [
  {
    title: "Home",
    link: "/exam-management/home",
    disabledRoles: [],
  },
  {
    title: "Exam Schedule",
    link: "/exam-management/exam-list",
    disabledRoles: [],
  },
  {
    title: "Exam attendance",
    link: "/exam-management/routine-list",
    disabledRoles: [],
  },
  {
    title: "Marks Entry",
    link: "/exam-management/marks-entry",
    disabledRoles: [],
  },
  {
    type: "dropdown",
    title: "Results",
    disabledRoles: [],
    reports: [
      {
        title: "Program-wise result (Individual)",
        link: "/exam-management/results?resultType=individual",
        disabledRoles: [],
      },
      {
        title: "Program-wise result (All)",
        link: "/exam-management/results?resultType=all",
        disabledRoles: [],
      },
      {
        title: "Student result",
        link: "/exam-management/student-list-for-results",
        disabledRoles: [],
      },
    ],
  },
];
export const OtherSetupLinks = [
  {
    link: "/other-setup/home",
    title: "Home",
    disabledRoles: [],
  },
  {
    type: "dropdown",
    title: "Department Management",
    disabledRoles: [],
    reports: [
      {
        title: "For Teaching Staff",
        link: "/other-setup/add-department",
        disabledRoles: [],
      },
      {
        title: "For Non-Teaching Staff",
        link: "/other-setup/add-section",
        disabledRoles: [],
      },
    ],
  },
  {
    link: "/other-setup/student-section",
    title: "Section for Student",
    disabledRoles: [],
  },
];

export const ProgramSetUpNavLinks = [
  {
    link: "/program-management/home",
    title: "Program Management",
    disabledRoles: [],
  },
  {
    link: "/program-management/major-subject",
    title: "Group/Program major Management",
    disabledRoles: [],
  },
  {
    link: "/program-management/subject-management",
    title: "Subject Management",
    disabledRoles: [],
  },
];

export const AlumniNavLinks = [
  {
    link: "/Alumni/home",
    title: "Home",
    disabledRoles: [],
  },
  {
    link: "/Alumni/register",
    title: "Register Alumni",
    disabledRoles: [],
  },
  {
    link: "/Alumni/Alumni-list",
    title: "Our Alumni",
    disabledRoles: [],
  },
  {
    link: "/Alumni/verify-alumni",
    title: "Verify Alumni",
    disabledRoles: [],
  },
  {
    link: "/Alumni/Summary-reports",
    title: "Summary report",
    disabledRoles: [],
  },
];

export const InfrastrctureNavLinks = [
  { link: "/infrastructure-management/home", title: "Home", disabledRoles: [] },
  {
    link: "/infrastructure-management/land-management",
    title: "Land Mgmt",
    disabledRoles: [],
  },
  {
    link: "/infrastructure-management/building-management",
    title: "Building Mgmt",
    disabledRoles: [],
  },
  {
    link: "/infrastructure-management/lab-management",
    title: "Lab Mgmt",
    disabledRoles: [],
  },
  {
    link: "/infrastructure-management/hostel-management",
    title: "Hostel Mgmt",
    disabledRoles: [],
  },
  {
    link: "/infrastructure-management/facility-register",
    title: "Facility Mgmt",
    disabledRoles: [],
  },
  {
    link: "/infrastructure-management/library-management",
    title: "Library Mgmt",
    disabledRoles: [],
  },
  {
    link: "/infrastructure-management/equipment-management",
    title: "Equipment Mgmt",
    disabledRoles: [],
  },
];

export const GraduationNavLinks = [
  {
    link: "/graduation-management/enrolled-students",
    title: "Enrolled students",
    disabledRoles: [],
  },
  {
    link: "/graduation-management/old-students",
    title: "Old Student Graduation",
    disabledRoles: [],
  },
  {
    link: "/graduation-management/graduation-list-enrolled",
    title: "Graduated Enrolled Students",
    disabledRoles: [],
  },
  {
    link: "/graduation-management/graduation-list-old",
    title: "Graduated Old Students",
    disabledRoles: [],
  },

];


export const ReceiptNavLinks = [
  {
    title: "Setup Program Fee(For Account)",
    link: "/receipt-management/fee-type",
    disabledRoles: [],
  },
  {
    title: "Setup Fee Item for receipt",
    link: "/receipt-management/general-fee-type",
    disabledRoles: [],
  },
  {
    link: "/receipt-management/student-list-enrolled",
    title: "Receipt for enrolled students",
    disabledRoles: [],
  },
  {
    link: "/receipt-management/student-list-others",
    title: "Receipt for other students",
    disabledRoles: [],
  },
  {
    link: "/receipt-management/receipt-list",
    title: "Generated Receipt",
    disabledRoles: [],
  },
];

export const DropOutNavLinks = [
  {
    link: "/dropout-management/home",
    title: "Dropout Mgmt",
    disabledRoles: [],
  },
  // {
  //   link: "/dropout-management/dropout-list",
  //   title: "Dropout List",
  //   disabledRoles: [],
  // },
];

export const UserAppBar = [
  {
    link: "/user-management/home",
    title: "Home",
    disabledRoles: [],
  },

  {
    link: "/user-management/assign-permission-campus",
    title: "Assign Permission",
    disabledRoles: [],
  },
];

export const PassRateNav = [
  // {
  //   title: "Exam schedule",
  //   link: "/pass-rate-management/exam-schedule",
  //   disabledRoles: [],
  // },
  {
    title: "Manage Exam Appeared",
    link: "/pass-rate-management/exam-appeared",
    disabledRoles: [],
  },
  {
    title: "Appeared List",
    link: "/pass-rate-management/student-appeared",
    disabledRoles: [],
  },
  {
    title: "Pass List",
    link: "/pass-rate-management/student-passed",
    disabledRoles: [],
  },
];

export const PublicFinance = [
  {
    link: "/public-finance/home",
    title: "Home",
    disabledRoles: [],
  },
  {
    link: "/public-finance/finance-head",
    title: "Income & Expense Head",
    disabledRoles: [],
  },
  {
    link: "/public-finance/income-expense",
    title: "Income & Expense",
    disabledRoles: [],
  },
];
export const Scholarship = [
  {
    link: "/scholarship/home",
    title: "Home",
    disabledRoles: [],
  },
  {
    link: "/scholarship/students",
    title: "Assign Scholarship/Discount",
    disabledRoles: [],
  },
  {
    link: "/scholarship/scholarship-list",
    title: "Scholar Holder Students",
    disabledRoles: [],
  },
  {
    type: "dropdown",
    title: "Reports",
    disabledRoles: [],
    reports: [
      {
        title: "Scholarship Student Report",
        link: "/scholarship/scholarshipStudent-list",
        disabledRoles: [],
      },
      {
        title: "Discount Students Report",
        link: "/scholarship/discountStudent-list",
        disabledRoles: [],
      },
    ],
  },
];


