import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Container,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { Print as PrintIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import StudentInfo from "../../components/exam-result/StudentInfo";
import CampusHeading from "../../components/exam-result/CampusHeading";
import MarksDetails from "../../components/exam-result/MarksDetails";
import ReportFooter from "../../components/exam-result/ReportFooter";
import SignatureField from "../../components/exam-result/SignatureField";
import { blue } from "@mui/material/colors";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const BulkStudentReportCard = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const baseUrl = config.VITE_BASE_URL;
  const { id } = useParams();
  const examschedule = id;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1000);
  const [totalRecords, setTotalRecords] = useState(0);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const logo = currentUser?.institution?.logo;
  const componentRef = useRef();
  const fetchData = async () => {
    try {
      setLoading(true);
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/MarksEntry/GetProgramResultAll?ExamScheduleId=${examschedule}&page=${page}&pageSize=${rowsPerPage}`,
        config
      );
      const data = response.data.data;
      setTotalRecords(response.data.totalRecords);
      if (Array.isArray(data)) {
        setStudentsData(data);
      } else {
        setStudentsData([data]);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examschedule, page, rowsPerPage]);

  const calculatePercentage = (studentData) => {
    if (
      !studentData?.subjectResults ||
      studentData.subjectResults.length === 0
    ) {
      return null;
    }

    const totalFullMarks = studentData.subjectResults.reduce(
      (total, subject) => {
        const theoreticalFull = parseInt(subject.theoreticalFullMarks) || 0;
        const practicalFull = parseInt(subject.practicalFullMarks) || 0;
        return total + theoreticalFull + practicalFull;
      },
      0
    );

    const totalMarksObtained = studentData.subjectResults.reduce(
      (total, subject) => {
        const theoreticalMarks = parseInt(subject.theoreticalMarks) || 0;
        const practicalMarks = parseInt(subject.practicalMarks) || 0;
        return total + theoreticalMarks + practicalMarks;
      },
      0
    );

    if (totalFullMarks === 0) return null;

    const percentage = ((totalMarksObtained / totalFullMarks) * 100).toFixed(2);
    return percentage;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      @media print {
        body {
          margin: 0;
          font-size: 12px !important;
        }
        .MuiTypography-h6 {
          font-size: 14px !important;
          margin: 2px 0 !important;
        }
        .MuiTypography-body2 {
          font-size: 10px !important;
          margin: 1px 0 !important;
        }
        .MuiTableCell-root {
          padding: 4px !important;
          font-size: 10px !important;
        }
        .MuiContainer-root {
          padding: 8px !important;
        }
        .compact-spacing {
          margin: 4px 0 !important;
        }
        .watermark-container {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .watermark-bg::before {
          opacity: 0.05 !important;
        }
        
        /* Enhanced page break styles */
        .report-card-page {
          page-break-after: always;
          page-break-inside: avoid;
          min-height: 100vh;
          height: auto;
          display: block;
          break-after: page;
        }
        
        .report-card-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }
        
        /* Ensure content fits on one page */
        .report-content {
          max-height: calc(100vh - 40mm);
          overflow: hidden;
        }
        
        /* Additional print optimizations */
        * {
          box-sizing: border-box;
        }
        
        .no-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      }
    `,
  });

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!studentsData || studentsData.length === 0) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", py: 4 }}>
        <Typography>No student data found.</Typography>
      </Container>
    );
  }

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
            "@media print": { display: "none" },
          }}
        >
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            size="small"
            sx={{ fontSize: "12px", py: 0.5 }}
          >
            Print All Report Cards ({studentsData.length} students)
          </Button>
        </Box>
        <Typography variant="h6" color={blue[700]} textAlign="center">
          Student's Report Card for{" "}
          <span style={{ fontWeight: 600, fontSize: "16px" }}>
            {studentsData[0]?.examNameManual}
          </span>
        </Typography>

        {/* Container for all report cards */}
        <div ref={componentRef}>
          {studentsData.map((studentData, index) => (
            <div
              key={studentData.studentId || index}
              className="report-card-page"
            >
              <Container
                maxWidth="md"
                className="watermark-container"
                sx={{
                  position: "relative",
                  border: "1px solid #c2c2c2",
                  backgroundColor: "white",
                  height: "100%",
                  "@media print": {
                    border: "1px solid #c2c2c2",
                    margin: 0,
                    padding: 0,
                    maxWidth: "none",
                    width: "100%",
                  },
                }}
              >
                {/* Watermark Background */}
                <Box
                  className="watermark-bg"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${baseUrl}/${logo})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: 0.05,
                    zIndex: -1,
                    pointerEvents: "none",
                  }}
                />

                {/* Report Card Content */}
                <Box
                  className="report-content no-break"
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    p: 2,
                    "@media print": {
                      backgroundColor: "transparent",
                      padding: "8px",
                    },
                  }}
                >
                  {/* Campus Heading */}
                  <div className="no-break">
                    <CampusHeading moduleData={studentData} />
                  </div>

                  <Divider sx={{ my: 1 }} />

                  {/* Student Information */}
                  <div className="no-break">
                    <StudentInfo moduleData={studentData} />
                  </div>

                  {/* Subject Results Table */}
                  <div className="no-break">
                    <MarksDetails moduleData={studentData} />
                  </div>

                  {/* Result Summary */}
                  <div className="no-break">
                    <ReportFooter
                      moduleData={studentData}
                      calculatePercentage={() =>
                        calculatePercentage(studentData)
                      }
                    />
                  </div>

                  {/* Signature Field */}
                  <div className="no-break">
                    <SignatureField />
                  </div>
                </Box>
              </Container>
            </div>
          ))}
        </div>
      </Box>
      <TablePagination
        rowsPerPageOptions={[50, 75, 100, 200]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default BulkStudentReportCard;
