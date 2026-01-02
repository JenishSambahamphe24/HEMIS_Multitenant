import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Divider,
  Button,
  Container,
} from "@mui/material";
import { Print as PrintIcon } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import StudentInfo from "../../components/exam-result/StudentInfo";
import CampusHeading from "../../components/exam-result/CampusHeading";
import MarksDetails from "../../components/exam-result/MarksDetails";
import ReportFooter from "../../components/exam-result/ReportFooter";
import SignatureField from "../../components/exam-result/SignatureField";
import { getAuthConfigSafe } from "../../utils/dateUtils";
import {config} from '@config';

const StudentReportCard = () => {
  const backendUrl = config.VITE_BACKEND_URL;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const examschedule = queryParams.get("examschedule");
  const studentid = queryParams.get("studentid");
  const [moduleData, setModuleData] = useState([]);

  const componentRef = useRef();

  const fetchData = async () => {
    try {
      const config = getAuthConfigSafe()
      const response = await axios.get(
        `${backendUrl}/MarksEntry/GetProgramResult?StudentId=${studentid}&ExamScheduleId=${examschedule}`,
        config
      );
      setModuleData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentid]);

  const calculatePercentage = () => {
    if (!moduleData?.subjectResults || moduleData.subjectResults.length === 0) {
      return null;
    }

    const totalFullMarks = moduleData.subjectResults.reduce(
      (total, subject) => {
        const theoreticalFull = parseInt(subject.theoreticalFullMarks) || 0;
        const practicalFull = parseInt(subject.practicalFullMarks) || 0;
        return total + theoreticalFull + practicalFull;
      },
      0
    );

    const totalMarksObtained = moduleData.subjectResults.reduce(
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
      }
    `,
  });

  return (
    <Container
      maxWidth="md"
      sx={{
        position: "relative",
        border: "1px solid blue",
        outline: "1px solid red",
        backgroundColor: "white",
      }}
      ref={componentRef}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
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
            Print Report Card
          </Button>
        </Box>

        {/* Compact Header Section */}
        <CampusHeading moduleData={moduleData} />

        <Divider sx={{ my: 1 }} />

        {/* Compact Student Information */}
        <StudentInfo moduleData={moduleData} />

        {/* Compact Subject Results Table */}
        <MarksDetails moduleData={moduleData} />

        {/* Compact Result Summary */}
        <ReportFooter
          moduleData={moduleData}
          calculatePercentage={calculatePercentage}
        />

        <SignatureField />
      </Box>
    </Container>
  );
};

export default StudentReportCard;
