import React, { useEffect, useState, Suspense } from "react";
import Layout from "./Layout.jsx";
import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PrivateRoute from "./components/privateRoute/PrivateRoute.jsx";

import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import NotFound from "./pages/error/Noroute.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import { SubjectMgmt } from "./components/index.js";
import StudentListForResults from "./modules/examManagement/StudentsListForResults.jsx";
import EmployeeDocuments from "./pages/students/EmployeeDocuments.jsx";
import StudentSummary from "./components/report/StudentSummary.jsx";
import ProgramSetupHome from "./modules/programSetupManagement/ProgramSetupHome.jsx";
import OtherSetupHome from "./modules/otherSetupManagement/OtherSetupHome.jsx";
import AddCampusLocation from "./pages/campus/AddCampusLocation.jsx";
import CampusUserPermissionAssign from "./modules/userManagement/CampusUserPermissionAssign.jsx";

const NewDashboard = React.lazy(() =>
  import("./pages/dashboard/newDashboard.jsx")
);
const HomePage = React.lazy(() => import("./pages/home/HomePage.jsx"));
const StudentHome = React.lazy(() =>
  import("./components/student/StudentHome.jsx")
);
const StudentManagementHome = React.lazy(() =>
  import("./modules/studentManagement/studentManagementHome.jsx")
);
const AlumniHome = React.lazy(() =>
  import("./pages/students/Alumni/AlumniHome.jsx")
);

const EmployeeManagementHome = React.lazy(() =>
  import("./modules/employeeManagement/employeeManagementHome.jsx")
);

const StdByMajor = React.lazy(() =>
  import("./components/report/university/StdByMajor.jsx")
);
const InfrastructureManagement = React.lazy(() =>
  import("./modules/infrastructureManagement/infrastructureManagementHome.jsx")
);

const Profile = React.lazy(() => import("./pages/profile/Profile.jsx"));
const ChangePassword = React.lazy(() =>
  import("./components/common/ChangePassword.jsx")
);

const StudentList = React.lazy(() =>
  import("./pages/students/StudentList.jsx")
);
const StudentDocuments = React.lazy(() =>
  import("./pages/students/StudentDocuments.jsx")
);
const StudentStepper = React.lazy(() =>
  import("./components/studentRegistration/StudentStepper.jsx")
);
const StudentAcademicInfo = React.lazy(() =>
  import("./components/studentRegistration/StudentAcademicInfo.jsx")
);
const StudentsDetails = React.lazy(() =>
  import("./pages/students/ForVerificationStudents.jsx")
);
const VerifiedStudentList = React.lazy(() =>
  import("./pages/students/VerifiedStudentList.jsx")
);
const UpgradeAcademics = React.lazy(() =>
  import("./pages/students/UpgradeAcademics.jsx")
);
const ExportStudentInfo = React.lazy(() =>
  import("./pages/students/ExportStudentInfo.jsx")
);
const StudentListForDropout = React.lazy(() =>
  import("./modules/studentManagement/StudentListForDropoutMgmt.jsx")
);
const DropOutList = React.lazy(() =>
  import("./modules/studentManagement/dropoutList.jsx")
);
const InloadForm = React.lazy(() =>
  import("./modules/studentManagement/StudentBulkInload.jsx")
);
const RecommendationLetter = React.lazy(() =>
  import("./modules/studentManagement/RecommendationLetter.jsx")
);

const EmployeeList = React.lazy(() =>
  import("./pages/employee/EmployeeList.jsx")
);
const EmployeeRegister = React.lazy(() =>
  import("./components/employeeRegister/EmployeeRegister.jsx")
);
const TeachingStaff = React.lazy(() =>
  import("./pages/employee/TeachingStaff.jsx")
);
const NonTeachingDetails = React.lazy(() =>
  import("./components/report/university/NonTeachingDetails.jsx")
);
const TechnicalStaff = React.lazy(() =>
  import("./pages/employee/TechnicalStaff.jsx")
);
const NonTechnicalStaff = React.lazy(() =>
  import("./pages/employee/NonTechnicalStaff.jsx")
);
const TeacherDetails = React.lazy(() =>
  import("./components/report/university/TeacherDetails.jsx")
);
const LandMgmt = React.lazy(() =>
  import("./components/setup/land/LandMgmt.jsx")
);
const BuildingMgmt = React.lazy(() =>
  import("./components/setup/Building/BuildingMgmt.jsx")
);

const LabMgmt = React.lazy(() => import("./components/setup/lab/LabMgmt.jsx"));
const HostelMgmt = React.lazy(() =>
  import("./components/setup/Hostel/HostelMgmt.jsx")
);
const FacilityMgmt = React.lazy(() =>
  import("./components/setup/RegisterFacility/RegisterMgmt.jsx")
);
const LibraryMgmt = React.lazy(() =>
  import("./components/setup/library/LibraryMgmt.jsx")
);
const EquipMgmt = React.lazy(() =>
  import("./components/setup/Equipment/EquipmentMgmt.jsx")
);

// Report components
const StudentInfoDetail = React.lazy(() =>
  import("./components/report/university/StudentInfoDetail.jsx")
);

const StudentByDistrict = React.lazy(() =>
  import("./components/report/StudentByDistrict.jsx")
);
const TeachingStaffSummary = React.lazy(() =>
  import("./components/report/TeachingStaffSummary.jsx")
);
const NonTeachingStaffSummary = React.lazy(() =>
  import("./components/report/NonTeachingStaffSummary.jsx")
);
const CampusReportAccordion = React.lazy(() =>
  import("./components/report/CampusReport/CampusReportAccordion.jsx")
);

const AlumniSummary = React.lazy(() =>
  import("./pages/students/Alumni/SummaryRepot.jsx")
);
const MgmtForm = React.lazy(() =>
  import("./components/report/Research/MgmtForm.jsx")
);

const HolidayMgmt = React.lazy(() =>
  import("./components/setup/holidaySetup/HolidayMgmt.jsx")
);

const StudentAgeMgmt = React.lazy(() =>
  import("./components/setup/budgetDisburshment/StudentAgeMgmt.jsx")
);
const AddSections = React.lazy(() =>
  import("./components/setup/program/SectionAdd.jsx")
);
const DepartmentAdd = React.lazy(() =>
  import("./components/setup/program/DepartmentAdd.jsx")
);

const SectionForStudent = React.lazy(() =>
  import("./components/setup/program/SectionStudent/SectionStudentAdd.jsx")
);

// Fee and enrollment components
const EnrollmentForm = React.lazy(() =>
  import("./components/setup/enrollment/EnrollmentForm.jsx")
);
const FeeSetup = React.lazy(() =>
  import("./components/setup/feeSetup/FeeSetup.jsx")
);
const EnrollCourse = React.lazy(() =>
  import("./components/setup/enrollment/EnrollCourse.jsx")
);
const FeeType = React.lazy(() =>
  import("./components/setup/feeSetup/FeeType.jsx")
);
const GeneralFeeType = React.lazy(() =>
  import("./components/setup/feeSetup/GeneralFeeType.jsx")
);
const IncomeExpenseHead = React.lazy(() =>
  import("./components/setup/FinanceData/IncomeExpenseHead.jsx")
);
const IncomeExpenditureEntry = React.lazy(() =>
  import("./components/setup/FinanceData/IncomeExpenditureEntry.jsx")
);

const MajorSubject = React.lazy(() =>
  import("./components/addingComponents/MajorSubject.jsx")
);

// Attendance components
const AttendanceManagementHome = React.lazy(() =>
  import("./modules/attendanceManagement/AttendanceManagementHome.jsx")
);
const EmployeeAttendanceManagement = React.lazy(() =>
  import("./modules/attendanceManagement/EmployeeAttendanceManagement.jsx")
);

// Exam components
const ExamSetupHome = React.lazy(() =>
  import("./modules/examManagement/ExamSetupHome.jsx")
);
const ExamAppear = React.lazy(() =>
  import("./modules/examManagement/ExamAppear.jsx")
);
const ExamAttendees = React.lazy(() =>
  import("./modules/examManagement/ExamAttendees.jsx")
);
const ExamSchedule = React.lazy(() =>
  import("./modules/examManagement/ExamSchedule.jsx")
);
const ExamType = React.lazy(() =>
  import("./modules/examManagement/ExamType.jsx")
);
const RoutineSchedule = React.lazy(() =>
  import("./modules/examManagement/RoutineSchedule.jsx")
);
const ExamScheduleList = React.lazy(() =>
  import("./modules/examManagement/ExamScheduleList.jsx")
);
const RoutineList = React.lazy(() =>
  import("./modules/examManagement/RoutineList.jsx")
);
const MarksEntryList = React.lazy(() =>
  import("./modules/examManagement/MarksEntryList.jsx")
);
const MarksEntry = React.lazy(() =>
  import("./modules/examManagement/MarksEntry.jsx")
);
const ViewResults = React.lazy(() =>
  import("./modules/examManagement/ViewResults.jsx")
);
const ResultList = React.lazy(() =>
  import("./modules/examManagement/ResultList.jsx")
);
const ViewMarksList = React.lazy(() =>
  import("./modules/examManagement/ViewMarksList.jsx")
);
const FilterStudent = React.lazy(() =>
  import("./modules/examManagement/bulkExamAttend/FilterStudent.jsx")
);
const FilterAppearedList = React.lazy(() =>
  import("./modules/examManagement/passFailEntry/FilterAppearedList.jsx")
);
const ExternalExamScheduleList = React.lazy(() =>
  import("./modules/examManagement/bulkExamAttend/ExternalExamSchedule.jsx")
);
const FilterAppearedStudent = React.lazy(() =>
  import("./modules/examManagement/passFailList/FilterAppearedStudent.jsx")
);
const FilterPassedStudents = React.lazy(() =>
  import("./modules/examManagement/passFailList/FilterPassedStudents.jsx")
);
const ReportCard = React.lazy(() =>
  import("./modules/examManagement/StudentReportCard.jsx")
);

// Graduation components
const GraduationModule = React.lazy(() =>
  import("./components/setup/graduationModule/GraduationModule.jsx")
);
const GraduationForm = React.lazy(() =>
  import("./components/setup/graduationModule/GraduationForm.jsx")
);
const GraduationModuleTable = React.lazy(() =>
  import("./components/setup/graduationModule/GraduationModuleTable.jsx")
);
const ReceiptMgmt = React.lazy(() =>
  import("./components/setup/graduationModule/ReceiptMgmt.jsx")
);

const CharacterProveApplication = React.lazy(() =>
  import("./components/setup/graduationModule/CharacterProveAppication.jsx")
);
const ReceiptPdfExport = React.lazy(() =>
  import("./components/setup/graduationModule/ReceiptPdfExport.jsx")
);
const ReceiptTable = React.lazy(() =>
  import("./components/setup/graduationModule/ReceiptTable.jsx")
);
const ReceiptStudentList = React.lazy(() =>
  import("./components/setup/graduationModule/StudentListForReceipt.jsx")
);

const CharacterCertificate = React.lazy(() =>
  import("./components/setup/graduationModule/CharacterCertificate.jsx")
);
const CharacterCertificateForOld = React.lazy(() =>
  import("./components/setup/graduationModule/CharacterCertificateForOld.jsx")
);

// Accreditation components
const RenewAccreditation = React.lazy(() =>
  import("./components/setup/ accreditationSetup/RenewAccreditation.jsx")
);

const ExpiredAccreditedTable = React.lazy(() =>
  import("./components/setup/ accreditationSetup/ExpiredAccreditedTable.jsx")
);

const AccreditedList = React.lazy(() =>
  import("./components/setup/ accreditationSetup/AccreditedList.jsx")
);

// ID Card components
const IdentityCard = React.lazy(() =>
  import("./components/setup/idCard/IdentityCard.jsx")
);
const IdCardHome = React.lazy(() =>
  import("./components/setup/idCard/IdCardHome.jsx")
);
const IdCardForStudent = React.lazy(() =>
  import("./components/setup/idCard/IdCardForStudent.jsx")
);
const AllIdCards = React.lazy(() =>
  import("./components/setup/idCard/AllIdCards.jsx")
);
const GeneratedIdCards = React.lazy(() =>
  import("./components/setup/idCard/GeneratedIdCards.jsx")
);

// Campus fact check components
const CampusFactCheck = React.lazy(() =>
  import("./pages/campusFactCheck/CampusFactCheck.jsx")
);
const UserManagementHome = React.lazy(() =>
  import("./modules/userManagement/UserManagementHome.jsx")
);

// Statistical report components
const StatReportWrapper = React.lazy(() =>
  import(
    "./components/report/CampusReport/statisticalReport/StatReportWrapper.jsx"
  )
);
const CollegeStatReportAccordion = React.lazy(() =>
  import(
    "./components/report/CampusReport/statisticalReport/CollegeStatReportAccordion.jsx"
  )
);

const ImageUploader = React.lazy(() =>
  import("./components/Reusable-component/ImageUploader.jsx")
);
const UpdatingSoonPage = React.lazy(() =>
  import("./components/common/UpdatingSoon.jsx")
);

import {
  MainNavLinks,
  StudentNavLinks,
  EmployeeNavLinks,
  ExamNavLinks,
  OtherSetupLinks,
  ProgramSetUpNavLinks,
  InfrastrctureNavLinks,
  GraduationNavLinks,
  ReceiptNavLinks,
  DropOutNavLinks,
  UserAppBar,
  PassRateNav,
  PublicFinance,
  Scholarship,
  AlumniNavLinks,
} from "./modules/navbar/NavModules.js";
import PublicFinanceHome from "./components/setup/FinanceData/PublicFinance.jsx";
import StudentListForScholarship from "./modules/scholarship/StudentList.jsx";
import ScholarsList from "./modules/scholarship/ScholarsList.jsx";
import ScholarshipHome from "./modules/scholarship/ScholarshipHome.jsx";
import StudentResultHome from "./modules/examManagement/StudentResultHome.jsx";
import BulkStudentReportCard from "./modules/examManagement/BulkStudentReportCard.jsx";
import Signature from "./pages/Signature/Signature.jsx";
import SignatureList from "./pages/Signature/signatureList.jsx";
import StudentsAllResults from "./modules/examManagement/StudentsAllResults.jsx";
import Section from "./pages/section/Section.jsx";
import StudentUpdateRollNo from "./pages/students/StudentUpdateRollNo.jsx";
import TransferInStudent from "./modules/studentTransfer/Transfer-in/Home.jsx";
import TransferOut from "./modules/studentTransfer/Transfer-out/Home.jsx";
import TransferStudent from "./modules/studentTransfer/TransferToStudent.jsx";
import TransferInStepper from "./modules/studentTransfer/Transfer-in/transfer-stepper/TransferInStepper.jsx";
import AlumniList from "./pages/students/Alumni/AlumniList.jsx";
import VerifyAlumni from "./pages/students/Alumni/VerifyAlumni.jsx";
import StdWithMajorSummary from "./components/report/university/StdWithMajorSummary.jsx";
import PasswordReset from "./pages/auth/PasswordReset.jsx";
import StudentListForGraduation from "./components/setup/graduationModule/StudentListForGraduation.jsx";
import GraduationFormForOld from "./components/setup/graduationModule/GraduationFormForOld.jsx";
import GraduationTableOldStudent from "./components/setup/graduationModule/GraduationTableOldStudent.jsx";
import ReceiptForOthers from "./components/setup/graduationModule/ReceiptForOthers.jsx";
import AlumniRegister from "./pages/students/Alumni/AlumniRegister.jsx";
import MarksLedger from "./modules/examManagement/markSheetResult/marksLedger.jsx";
import SectionStudentAdd from "./components/setup/program/SectionStudent/SectionStudentAdd.jsx";
import Home from "./pages/students/AlumniEmployee/AlumniPages/Home.jsx";
import Notice from "./pages/students/AlumniEmployee/AlumniPages/Notice.jsx";
import AdminUser from "./pages/students/AlumniEmployee/AdminPanel/AdminUser.jsx";
import AdminNotice from "./pages/students/AlumniEmployee/AdminPanel/AdminNotice.jsx";
import UserProfile from "./pages/students/AlumniEmployee/Profile/UserProfile.jsx";
import WorkList from "./pages/students/AlumniEmployee/Work/WorkList.jsx";
import MainLayout from "./alumniLayout/MainLayout.jsx";
import UserLayout from "./alumniLayout/UserLayout.jsx";
import AlumniLogin from "./pages/students/AlumniEmployee/AlumniPages/UserAdmin/Login.jsx";
import AlumniPasswordChange from "./pages/students/AlumniEmployee/AlumniPages/UserAdmin/AlumniPasswordChange.jsx";

//import the report of the StudentScholarShip
import ScholarshipReport from "./modules/scholarship/scholarshipStudentList.jsx";
import DiscountReport from "./modules/scholarship/DiscountStudentList.jsx";
import AssignSections from "./pages/students/AssignSections.jsx";
import ResetPasswordPage from "./pages/students/AlumniEmployee/AlumniPages/UserAdmin/ResetPassword.jsx";
import AlumniOtpVerification from "./pages/students/AlumniEmployee/AlumniPages/UserAdmin/OtpVerificationPage.jsx";
import RegisterAlumni from "./pages/students/AlumniEmployee/AlumniPages/RegisterAlumni/RegisterAlumni.jsx";
import IdcardWithBatches from "./components/setup/idCard/IdcardwithBatch.jsx";


const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  const [navLinks, setNavLinks] = useState(MainNavLinks);
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;
  const adminRole = currentUser ? currentUser.type : "";
  const location = useLocation();

  useEffect(() => {
    const navigationEntries = [
      { path: "/other-setup", links: OtherSetupLinks },
      { path: "/employee-management", links: EmployeeNavLinks },
      { path: "/exam-management", links: ExamNavLinks },
      { path: "/student-management", links: StudentNavLinks },
      { path: "/Alumni", links: AlumniNavLinks },
      { path: "/program-management", links: ProgramSetUpNavLinks },
      { path: "/infrastructure-management", links: InfrastrctureNavLinks },
      { path: "/graduation-management", links: GraduationNavLinks },
      { path: "/receipt-management", links: ReceiptNavLinks },
      {
        path: "/dropout-management",
        links: DropOutNavLinks,
      },
      { path: "/user-management", links: UserAppBar },
      { path: "/pass-rate-management", links: PassRateNav },
      { path: "/public-finance", links: PublicFinance },
      { path: "/scholarship", links: Scholarship },
    ];

    const navigationLinks =
      navigationEntries.find((entry) =>
        location.pathname.startsWith(entry.path)
      )?.links || MainNavLinks;
    setNavLinks(navigationLinks);
  }, [location.pathname]);

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Durga Alumni */}
          <Route path="/alumni" element={<MainLayout />}>
            <Route  index element={<Home />} />
            <Route path="alumni-notice" element={<Notice />} />
            <Route path="alumni-login" element={<AlumniLogin />} />
            <Route path="reset-password/:email" element={<ResetPasswordPage />} />
            <Route path="register-alumni" element={<RegisterAlumni />} />
          </Route>
           <Route path="/alumni-admin/password-change/:email/:otp" element={<AlumniOtpVerification />} />
          {/* Alumni User  panel */}
          <Route path="/alumni-admin" element={<UserLayout />}>
            <Route index element={<AdminUser />} />
            <Route path="user-notice" element={<AdminNotice />} />
            <Route path="work-list" element={<WorkList />} />
            <Route path="user-profile" element={<UserProfile />} />
           <Route path="password-change" element={<AlumniPasswordChange/>}/> 
           
          </Route>
          <Route element={<Layout navLinks={navLinks} />}>
            <Route element={<PrivateRoute />}>
              {roleName === "Student" ? (
                <Route path="/" element={<StudentHome />}>
                  <Route path="student-home" element={<StudentHome />} />
                </Route>
              ) : (
                <>
                  {/* marks ledger of the students */}
                  <Route path="/MarksLedger" element={<MarksLedger />} />

                  {/* Add section for student */}
                  <Route
                    path="/SectionStudentAdd"
                    element={<SectionStudentAdd />}
                  />

                  <Route path="/signature" element={<Signature />} />
                  <Route path="/signatureList" element={<SignatureList />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/rough" element={<Signature />} />
                  <Route path="/dashboard" element={<NewDashboard />} />
                  <Route
                    path="/student-management/home"
                    element={<StudentManagementHome />}
                  />
                  <Route
                    path="/employee-management/home"
                    element={<EmployeeManagementHome />}
                  />
                  <Route
                    path="/infrastructure-management/home"
                    element={<InfrastructureManagement />}
                  />
                  <Route
                    path="/scholarship/home"
                    element={<ScholarshipHome />}
                  />
                  <Route
                    path="/scholarship/students"
                    element={<StudentListForScholarship />}
                  />
                  <Route
                    path="/scholarship/scholarship-list"
                    element={<ScholarsList />}
                  />
                  {/* scholarship Report added */}
                  <Route
                    path="/scholarship/scholarshipStudent-list"
                    element={<ScholarshipReport />}
                  />
                  <Route
                    path="/scholarship/discountStudent-list"
                    element={<DiscountReport />}
                  />

                  <Route path="/profile" element={<Profile />} />

                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route
                    path="/student-management/student-list"
                    element={<StudentList />}
                  />
                  {/* <Route
                    path="/student-management/irregular-students"
                    element={<IrregularStudents />}
                  /> */}
                  <Route
                    path="/pass-rate-management/student-appear"
                    element={<FilterStudent />}
                  />
                  <Route
                    path="/student-management/summary-by-major"
                    element={<StdWithMajorSummary />}
                  />
                  <Route
                    path="/exam-management/report-card"
                    element={<ReportCard />}
                  />
                  <Route
                    path="/pass-rate-management/student-passed"
                    element={<FilterPassedStudents />}
                  />
                  <Route
                    path="/pass-rate-management/student-appeared"
                    element={<FilterAppearedStudent />}
                  />
                  <Route
                    path="/pass-rate-management/exam-appeared"
                    element={<ExternalExamScheduleList />}
                  />
                  <Route
                    path="/pass-rate-management/exam-schedule"
                    element={<ExamSchedule />}
                  />
                  <Route
                    path="/pass-rate-management/student-result-entry"
                    element={<FilterAppearedList />}
                  />
                  <Route
                    path="/student-management/documents/:id"
                    element={<EmployeeDocuments />}
                  />
                  <Route
                    path="/student-management/student-by-major"
                    element={<StdByMajor />}
                  />
                  <Route
                    path="/employee-management/documents/:id"
                    element={<StudentDocuments />}
                  />
                  <Route
                    path="/dropout-management/home"
                    element={<StudentListForDropout />}
                  />
                  <Route
                    path="/dropout-management/dropout-list"
                    element={<DropOutList />}
                  />
                  <Route
                    path="/other-setup/home"
                    element={<OtherSetupHome />}
                  />

                  <Route
                    path="/employee-management/employee-list"
                    element={<EmployeeList />}
                  />
                  <Route
                    path="/form-management/statisticalReport"
                    element={<StatReportWrapper />}
                  />
                  <Route
                    path="/employee-management/teaching-staff"
                    element={<TeachingStaff />}
                  />
                  <Route
                    path="/employee-management/non-teaching-staff"
                    element={<NonTeachingDetails />}
                  />
                  <Route path="/image" element={<ImageUploader />} />
                  <Route
                    path="/employee-management/technical-staff"
                    element={<TechnicalStaff />}
                  />
                  <Route
                    path="/employee-management/non-technical-staff"
                    element={<NonTechnicalStaff />}
                  />

                  <Route
                    path="/academic-info/:id"
                    element={<StudentAcademicInfo />}
                  />
                  <Route
                    path="/infrastructure-management/land-management"
                    element={<LandMgmt />}
                  />
                  <Route
                    path="/infrastructure-management/building-management"
                    element={<BuildingMgmt />}
                  />
                  <Route
                    path="/infrastructure-management/lab-management"
                    element={<LabMgmt />}
                  />
                  <Route
                    path="/infrastructure-management/hostel-management"
                    element={<HostelMgmt />}
                  />
                  <Route
                    path="/infrastructure-management/land-management"
                    element={<LandMgmt />}
                  />
                  <Route
                    path="/infrastructure-management/facility-register"
                    element={<FacilityMgmt />}
                  />
                  <Route
                    path="/infrastructure-management/library-management"
                    element={<LibraryMgmt />}
                  />
                  <Route
                    path="/infrastructure-management/land-management"
                    element={<LandMgmt />}
                  />
                  <Route
                    path="/infrastructure-management/equipment-management"
                    element={<EquipMgmt />}
                  />
                  <Route
                    path="/student-management/student-information-detail"
                    element={<StudentInfoDetail />}
                  />
                  <Route
                    path="/Student-management/student-summary-detail"
                    element={<StudentSummary />}
                  />
                  <Route
                    path="/student-summary-detail"
                    element={<StudentSummary />}
                  />

                  <Route
                    path="/student-by-district"
                    element={<StudentByDistrict />}
                  />
                  <Route
                    path="/student-management/student-by-district"
                    element={<StudentByDistrict />}
                  />
                  <Route
                    path="/teaching-staff-summary"
                    element={<TeachingStaffSummary />}
                  />
                  <Route
                    path="/employee-management/teaching-staff-summary"
                    element={<TeachingStaffSummary />}
                  />
                  <Route
                    path="/college-report"
                    element={<CampusReportAccordion />}
                  />
                  <Route
                    path="non-teaching-staff-summary"
                    element={<NonTeachingStaffSummary />}
                  />
                  <Route
                    path="/employee-management/non-teaching-staff-summary"
                    element={<NonTeachingStaffSummary />}
                  />
                  <Route
                    path="/user-management/assign-permission-campus"
                    element={<CampusUserPermissionAssign />}
                  />
                  <Route
                    path="/employee-management/teacher-detail"
                    element={<TeacherDetails />}
                  />
                  <Route
                    path="/employee-management/non-teaching-details"
                    element={<NonTeachingDetails />}
                  />
                  <Route path="/holiday-setups" element={<HolidayMgmt />} />
                  <Route
                    path="/character-application"
                    element={<CharacterProveApplication />}
                  />

                  <Route path="/holiday-setups" element={<HolidayMgmt />} />

                  <Route
                    path="/studentagemgmt-setups"
                    element={<StudentAgeMgmt />}
                  />
                  <Route path="/research" element={<MgmtForm />} />
                  <Route
                    path="/graduation-management/graduation-form/:id"
                    element={<GraduationModule />}
                  />
                  <Route
                    path="/graduation-management/graduationForm"
                    element={<GraduationForm />}
                  />

                  <Route
                    path="/student-management/graduationtable-setups"
                    element={<GraduationModuleTable />}
                  />
                  <Route
                    path="/receipt-management/receipt-form/:id"
                    element={<ReceiptMgmt />}
                  />
                  <Route
                    path="/receipt-management/students"
                    element={<ReceiptStudentList />}
                  />

                  <Route path="/inload-form" element={<InloadForm />} />
                  <Route
                    path="/program-management/subject-management"
                    element={<SubjectMgmt />}
                  />
                  <Route
                    path="/program-management/major-subject"
                    element={<MajorSubject />}
                  />

                  <Route
                    path="/form-management/prabhat"
                    element={<CollegeStatReportAccordion />}
                  />
                  <Route path="Alumni/home" element={<AlumniHome />} />
                  <Route path="Alumni/register" element={<AlumniRegister />} />

                  <Route
                    path="/student-management/student-register"
                    element={<StudentStepper />}
                  />
                  <Route
                    path="/student-management/student-transfer-in/register"
                    element={<TransferInStepper />}
                  />

                  <Route 
                  path="/Alumni/Alumni-list"
                  element={<AlumniList />} 
                  />
                   <Route 
                  path="/Alumni/verify-alumni"
                  element={<VerifyAlumni />} 
                  />
                  <Route
                    path="/Alumni/summary-reports"
                    element={<AlumniSummary />}
                  />
                  <Route
                    path="/employee-management/employee-register"
                    element={<EmployeeRegister />}
                  />
                  <Route path="/enrollment/:id" element={<EnrollmentForm />} />
                  <Route path="/other-setup/fee-setup" element={<FeeSetup />} />
                  <Route
                    path="/receipt-management/fee-type"
                    element={<FeeType />}
                  />
                  <Route
                    path="/receipt-management/general-fee-type"
                    element={<GeneralFeeType />}
                  />
                  <Route
                    path="/accrediation/renew-accreditation"
                    element={<RenewAccreditation />}
                  />
                  <Route
                    path="/accrediation/accreditation-list"
                    element={<AccreditedList />}
                  />
                  <Route
                    path="/user-management/home"
                    element={<UserManagementHome />}
                  />

                  <Route
                    path="/accrediation/accreditation-expiry-campus-report"
                    element={<ExpiredAccreditedTable />}
                  />
                  <Route
                    path="/student-management/identity-card-home"
                    element={<IdCardHome />}
                  />
                  <Route
                    path="/student-management/student-card/:id"
                    element={<IdentityCard />}
                  />
                  <Route
                    path="/student-management/all-student-cards"
                    element={<AllIdCards />}
                  />
                    <Route
                    path="/student-management/generated-id-cards"
                    element={<IdcardWithBatches />}
                  />
                  <Route
                    path="/student-management/generated-id-cards/:id"
                    element={<GeneratedIdCards />}
                  />

                  <Route
                    path="/student-management/student-list-for-id"
                    element={<IdCardForStudent />}
                  />
                  <Route
                    path="/student-management/student-transfer-in"
                    element={<TransferInStudent />}
                  />
                  <Route
                    path="/student-management/student-transfer-out"
                    element={<TransferOut />}
                  />
                  {/* TransferStudent */}
                  <Route
                    path="/student-management/student-transfer-outForm"
                    element={<TransferStudent />}
                  />
                  <Route
                    path="/program-management/home"
                    element={<ProgramSetupHome />}
                  />
                  <Route
                    path="/student-management/upgrade-academics"
                    element={<UpgradeAcademics />}
                  />
                  <Route
                    path="/student-management/AssignSections"
                    element={<AssignSections />}
                  />
                  <Route
                    path="/student-management/verified-students"
                    element={<VerifiedStudentList />}
                  />
                  <Route
                    path="/student-management/registration-form/:studentId"
                    element={<ExportStudentInfo />}
                  />
                  {/* <Route
                    path="/student-management/exportToPdf"
                    element={<ExportStudentInfo />}
                  /> */}
                  <Route
                    path="/student-management/student-verification/:id"
                    element={<StudentsDetails />}
                  />
                  <Route
                    path="/other-setup/add-section"
                    element={<AddSections />}
                  />
                  <Route
                    path="other-setup/student-section"
                    element={<SectionForStudent />}
                  />
                  <Route
                    path="/other-setup/add-department"
                    element={<DepartmentAdd />}
                  />
                  <Route
                    path="/student-management/attendance"
                    element={<AttendanceManagementHome />}
                  />
                  <Route
                    path="/employee-management/attendance"
                    element={<EmployeeAttendanceManagement />}
                  />
                  <Route
                    path="/student-management/updateRollNo"
                    element={<StudentUpdateRollNo />}
                  />
                  <Route
                    path="/exam-management/home"
                    element={<ExamSetupHome />}
                  />
                  <Route
                    path="/exam-management/result-home"
                    element={<StudentResultHome />}
                  />
                  <Route
                    path="/exam-management/exam-appear"
                    element={<ExamAppear />}
                  />
                  <Route
                    path="/exam-management/exam-attendees/:id"
                    element={<ExamAttendees />}
                  />
                  <Route
                    path="/exam-management/exam-list"
                    element={<ExamScheduleList />}
                  />
                  <Route path="/add-location" element={<AddCampusLocation />} />
                  <Route path="/exam-schedule" element={<ExamSchedule />} />
                  <Route
                    path="/exam-management/exam-schedule"
                    element={<ExamSchedule />}
                  />
                  <Route
                    path="/exam-management/exam-type"
                    element={<ExamType />}
                  />

                  <Route
                    path="/exam-management/exam-routine"
                    element={<RoutineSchedule />}
                  />
                  <Route
                    path="/exam-management/routine-list"
                    element={<RoutineList />}
                  />
                  <Route
                    path="/exam-management/marks-entry"
                    element={<MarksEntryList />}
                  />
                  <Route
                    path="/exam-management/marks-entry/:id"
                    element={<MarksEntry />}
                  />
                  <Route path="/addSection" element={<Section />} />
                  <Route
                    path="/exam-management/view-result/:id"
                    element={<ViewResults />}
                  />
                  <Route
                    path="/exam-management/view-all-result/:id"
                    element={<BulkStudentReportCard />}
                  />
                  <Route
                    path="/exam-management/student-list-for-results"
                    element={<StudentListForResults />}
                  />
                  <Route
                    path="/exam-management/student-all-results/:id"
                    element={<StudentsAllResults />}
                  />
                  <Route
                    path="/public-finance/home"
                    element={<PublicFinanceHome />}
                  />
                  <Route
                    path="/public-finance/finance-head"
                    element={<IncomeExpenseHead />}
                  />
                  <Route
                    path="/public-finance/income-expense"
                    element={<IncomeExpenditureEntry />}
                  />
                  <Route
                    path="/graduation-management/receipt-details/:id"
                    element={<ReceiptPdfExport />}
                  />
                  <Route
                    path="/receipt-management/receipt-details/:id"
                    element={<ReceiptPdfExport />}
                  />
                  <Route
                    path="/receipt-management/student-list-enrolled"
                    element={<ReceiptStudentList />}
                  />
                  <Route
                    path="/receipt-management/student-list-others"
                    element={<ReceiptForOthers />}
                  />
                  <Route
                    path="/receipt-management/receipt-list"
                    element={<ReceiptTable />}
                  />
                  <Route
                    path="/other-setup/incomeexpensehead"
                    element={<IncomeExpenseHead />}
                  />
                  <Route
                    path="/other-setup/incomeexpense"
                    element={<IncomeExpenditureEntry />}
                  />
                  <Route
                    path="/exam-management/marks-entry"
                    element={<MarksEntryList />}
                  />
                  <Route
                    path="/exam-management/results"
                    element={<ResultList />}
                  />
                  <Route
                    path="/graduation-management/enrolled-students"
                    element={<StudentListForGraduation />}
                  />
                  <Route
                    path="/graduation-management/old-students"
                    element={<GraduationFormForOld />}
                  />
                  <Route
                    path="/graduation-management/graduation-list-enrolled"
                    element={<GraduationModuleTable />}
                  />
                  <Route
                    path="/graduation-management/graduation-list-old"
                    element={<GraduationTableOldStudent />}
                  />
                  <Route
                    path="/graduation-management/character-certificate/:id"
                    element={<CharacterCertificate />}
                  />
                  <Route
                    path="/graduation-management/character-certificate-old/:id"
                    element={<CharacterCertificateForOld />}
                  />
                  <Route path="/account" element={<UpdatingSoonPage />} />
                  <Route path="/payroll" element={<UpdatingSoonPage />} />
                  <Route path="/library" element={<UpdatingSoonPage />} />
                  <Route path="/coming-soon" element={<UpdatingSoonPage />} />
                  <Route
                    path="/dropout-management/recommendation-letter/:id"
                    element={<RecommendationLetter />}
                  />
                  <Route
                    path="/exam-management/marks-list/:id"
                    element={<ViewMarksList />}
                  />
                  <Route path="/fact-sheet" element={<CampusFactCheck />} />
                </>
              )}
            </Route>
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route
              path="/reset-passwordEmployee/:email/:token"
              element={<PasswordReset />}
            />
              <Route
              path="/forget-password/:email/:token"
              element={<PasswordReset />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/open-enroll" element={<EnrollCourse />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  );
}

export default App;
