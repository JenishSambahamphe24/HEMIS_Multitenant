
import { useState, useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { Box, Stack, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import RenderSemesterTables from './components/SemesterSystemTables';
import StudentExaminationStatus from "./components/StudentExaminationStatus";
import TeachingNonTeachingTable from "./components/TeachingNonTeachingTable";
import ResearchDetailsTable from "./components/ResearchDetailsTable";
import ResearchPublications from "./components/ResearchPublications";
import CampusPublications from "./components/CampusPublications";
import FinanceDetailsTable from "./components/FinanceDetailsTable";
import { useSelector } from 'react-redux';
import ReceiveFellowship from './components/ ReceiveFellowship';
import FinancialStatusTable from './components/ FinancialStatusTable ';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './style.css'
import RenderAnnualTables from './components/RenderAnnualTables';
import { getBuildingDetailsOfCampus, getEquipmentForCampus, getFacilityDataForCampus, getHostelDetailsOfCampus, getLabDetailsOfCampus, getLandDetailsOfCampus, getNonTeachingStaffByPostSummary, getPassRateForCampus, getResearchPubDetail, getStatReportForAnualProgram, getStatReportForSemesterProgram, getTeachingStaffByPostSummary, getFinanciDetailByFinanceHead } from '../CampusServices';

import { getFiscalYearForSelection } from '../../../../services/services';
import StatReportListByFiscalId from './StatReportListByFiscalId';
import SignedAuthority from './components/SignedAuthority';
import LandDetailsTable from './components/Infrastructure/LandDetailsTable';
import BuildingDetailsTable from './components/Infrastructure/BuildingDetailsTable';
import LabDetailsTable from './components/Infrastructure/LabDetailsTable';
import HostelDetailsTable from './components/Infrastructure/HostelDetailsTable';
import FacilityDetailsTable from './components/Infrastructure/FacilityDetailsTable';
import EquipDetailsTable from './components/Infrastructure/EquipDetailsTable';
import { toast } from 'react-toastify';
import { generateAnnualTablesPDF, generateSemesterTablesPDF, generateExaminationStatusPDF, generateTeachingStaffPDF, generateResearcherPDF,  transformAnnualData, transformSemesterData, generateNonTeachingStaffPDF, generatePublicationsPDF, generateCampusPubPDF, generateLandDetailsPDF, generateFellowshipPDF, generateBuildingDetailsPDF, generateLabDetailsPDF, generateFacilityDetailsPDF, generateHostelDetailsPDF, leftMargin, rightMargin, bottomMargin, topMargin, tableFontSize, generateActualFinancePDF } from './components/pdfHelpers';

function StatReportWrapper() {

  const { currentUser } = useSelector((state) => state.user) || {};
  const bankDetails = currentUser
    ? {
      name: currentUser?.institution.bankName,
      branch: currentUser?.institution.branch,
      accountNo: currentUser?.institution.accountNo,
    }
    : { name: '', branch: '', accountNo: '' };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [annualProgram, setAnnualProgram] = useState({});
  const [semesterProgram, setSemesterProgram] = useState({});

  const [passRateData, setPassRateData] = useState([]);

  const [teachingStaffs, setTeachingStaffs] = useState([])
  const [nonTeachingStaffs, setNonTeachingStaffs] = useState([])

  const [researchData, setResearchData] = useState([])
  const [researchPubData, setResearchPubData] = useState([])
  const [campusPubData, setCampusPubData] = useState([])
  const [fellowshipData, setFellowshipData] = useState([])


  const [landData, setLandData] = useState([])
  const [buildingData, setBuildingData] = useState([])
  const [labData, setLabData] = useState([])
  const [hostelData, setHosetlData] = useState([])
  const [facility, setFacility] = useState([])
  const [equipment, setEquipment] = useState([])

  const [income, setIncome] = useState([]);
  const [operatingExpenditure, setOperatingExpenditure] = useState([]);
  const [capitalExpenditure, setCapitalExpenditure] = useState([]);


  const [selectedYear, setSelectedYear] = useState("");
  const [activeFiscalYear, setActiveFiscalYear] = useState({});
  const [selectedFiscalYearId, setSelectedFiscalYearId] = useState(0);

  const fetchAnnualData = async () => {
    try {
      setLoading(true);
      const response = await getStatReportForAnualProgram(selectedFiscalYearId);
      setAnnualProgram(transformAnnualData(response));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesterData = async () => {
    setLoading(true);
    try {
      const response = await getStatReportForSemesterProgram(selectedFiscalYearId);
      setSemesterProgram(transformSemesterData(response));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPassRateData = async () => {
    const response = await getPassRateForCampus(selectedFiscalYearId)
    if (response) {
      const transformedData = response.programs.map(item => ({
        program: item.programName,
        totalAppeared: item.totalAppeared,
        totalPassed: item.totalPassed,

        maleAppeared: item.appearedMale,
        malePassed: item.passedMale,

        femaleAppeared: item.appearedFemale,
        femalePassed: item.passedFemale,

        otherGenderAppeared: item.appearedOthers,
        otherGenderPassed: item.appearedOthers,
      }))
      setPassRateData(transformedData)
    } else {
      setPassRateData([])
    }
  }

  const fetchEmployeeData = async () => {
    const teachingResponse = await getTeachingStaffByPostSummary()
    const nonTeachingResponse = await getNonTeachingStaffByPostSummary()
    if (teachingResponse) {
      setTeachingStaffs(teachingResponse)
    } else {
      setTeachingStaffs([])
    }
    nonTeachingResponse ? setNonTeachingStaffs(nonTeachingResponse) : setNonTeachingStaffs([])
  }

  const fetchResearchData = async () => {
    try {
      const response = await getResearchPubDetail()
      response ? setResearchData([response]) : setResearchData([])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchResearchPubData = async () => {
    try {
      const response = await getResearchPubDetail()
      response ? setResearchPubData([response]) : setResearchPubData([])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchLandDetails = async () => {
    try {
      const response = await getLandDetailsOfCampus()
      response ? setLandData(response) : setLandData([])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchLabDetails = async () => {
    try {
      const response = await getLabDetailsOfCampus()
      response ? setLabData(response) : setLabData([])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchBuildingData = async () => {
    try {
      const response = await getBuildingDetailsOfCampus()
      response ? setBuildingData(response) : setBuildingData([])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchHostelData = async () => {
    try {
      const response = await getHostelDetailsOfCampus()
      response ? setHosetlData(response) : setHosetlData([])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchFacilityData = async () => {
    try {
      const response = await getFacilityDataForCampus()
      response ? setFacility(response) : setFacility([])
    } catch (error) {
      console.log(error)
    }
  }
  const fetchEquipmentData = async () => {
    try {
      const response = await getEquipmentForCampus()
      response ? setEquipment(response) : setEquipment([])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchFinancialData = async () => {
    try {
      const response = await getFinanciDetailByFinanceHead(selectedFiscalYearId);
      console.log(response)
      const incomeData = await response.filter(
      (item) => item?.headName?.headType === 'Income'
    );
      setIncome(incomeData);
      const capitalExpData = await response.filter(item => item.headName.headType === 'Expenditure' && item.headName.expenditureType === 'Capital Expenditure')
      setCapitalExpenditure(capitalExpData);
      const operatingExp = await response.filter(item => item.headName.headType === 'Expenditure' && item.headName.expenditureType === 'Operating Expenditure')
      setOperatingExpenditure(operatingExp);
    } catch (error) {
      console.error('Error fetching financial details:', error);
    }
  }

  useEffect(() => {
    fetchAnnualData();
    fetchSemesterData();
    fetchPassRateData()
    fetchEmployeeData()
    fetchResearchData()
    fetchResearchPubData()
    fetchLandDetails()
    fetchLabDetails()
    fetchBuildingData()
    fetchHostelData()
    fetchFacilityData()
    fetchEquipmentData()
    fetchFinancialData()
  }, [selectedFiscalYearId]);

  useEffect(() => {
    const response = async () => {
      try {
        const fiscalYear = await getFiscalYearForSelection();
        const activeFiscalYear = fiscalYear.find(
          (item) => item.activeFiscalYear === true
        );
        setData(fiscalYear);
        if (activeFiscalYear) {
          setSelectedYear(activeFiscalYear.yearNepali);
          setSelectedFiscalYearId(activeFiscalYear.id);
          setActiveFiscalYear(activeFiscalYear);
        } else if (fiscalYear.length > 0) {
          setSelectedYear(fiscalYear[0].yearNepali);
          setSelectedFiscalYearId(fiscalYear[0].id);
        }
      } catch (err) {
        console.log(err);
      }
    };
    response();
    fetchAnnualData();
    fetchSemesterData();
  }, []);

  const handleYearChange = (event) => {
    const selectedYearValue = event.target.value;
    const selectedYearItem = data.find(
      (item) => item.yearNepali === selectedYearValue
    );
    setSelectedYear(selectedYearValue);
    setSelectedFiscalYearId(selectedYearItem ? selectedYearItem.id : "");
  };
  const startNewSection = (doc, title, pageIndex) => {
    if (pageIndex > 1) {
      doc.addPage();
    }
    doc.setFontSize(14);
    doc.setFontSize(12);
    doc.text(title, leftMargin, topMargin + 10);
    return topMargin + 14;
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'A4',
        margins: { top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin }
      });

      doc.setProperties({
        title: `Student Statistics Report - FY ${selectedYear}`,
        creator: 'Institution Management System'
      });

      let pageIndex = 1;

      // Section 1: Annual System
      if (annualProgram && Object.keys(annualProgram).length > 0) {
        startNewSection(doc, `${pageIndex}. Student Enrollment: Annual System`, pageIndex);
        await generateAnnualTablesPDF(doc, annualProgram, pageIndex);
        pageIndex++;
      }

      // Section 2: Semester System
      if (semesterProgram && Object.keys(semesterProgram).length > 0) {
        startNewSection(doc, `${pageIndex}. Student Enrollment: Semester System`, pageIndex);
        await generateSemesterTablesPDF(doc, semesterProgram, pageIndex);
        pageIndex++;
      }

      // Section 3: Examination Status
      if (passRateData && passRateData.length > 0) {
        startNewSection(doc, `${pageIndex}. Total students who appeared for the examination and students who successfully passed.`, pageIndex);
        await generateExaminationStatusPDF(doc, passRateData, pageIndex, selectedYear);
        pageIndex++;
      }
      // Section 4: Teaching and Non-Teaching Staff
      startNewSection(doc, `${pageIndex}. Teaching and Non-Teaching Staff`, pageIndex);
      let yPosition = topMargin + 10;
      yPosition = await generateTeachingStaffPDF(doc, pageIndex, yPosition, teachingStaffs);
      yPosition = await generateNonTeachingStaffPDF(doc, pageIndex, yPosition, nonTeachingStaffs);
      pageIndex++

      // // Section 5: Research, Publication, and Fellowship Activity
      startNewSection(doc, `${pageIndex}. Research, Publication, and Fellowship Activity in Last F.Y`, pageIndex);
      let yPositionForPub = await generateResearcherPDF(doc, pageIndex, researchData);
      yPositionForPub = await generatePublicationsPDF(doc, pageIndex, yPositionForPub, researchPubData);
      yPositionForPub = await generateCampusPubPDF(doc, pageIndex, yPositionForPub, campusPubData);
      yPositionForPub = await generateFellowshipPDF(doc, pageIndex, yPositionForPub, fellowshipData);
      pageIndex++;

      // // Section 6: Physical Infrastructures
      startNewSection(doc, `${pageIndex}. Physical Infrastructures`, pageIndex);
      let yPositionForInfra = await generateLandDetailsPDF(doc, pageIndex, landData);
      yPositionForInfra = await generateBuildingDetailsPDF(doc, pageIndex, yPositionForInfra, buildingData);
      yPositionForInfra = await generateLabDetailsPDF(doc, pageIndex, yPositionForInfra, labData);
      doc.addPage();
      yPositionForInfra = await generateHostelDetailsPDF(doc, pageIndex, hostelData);
      yPositionForInfra = await generateFacilityDetailsPDF(doc, pageIndex, yPositionForInfra, facility);
      pageIndex++;

      startNewSection(doc, `${pageIndex}. Financial details`, pageIndex);
      await generateActualFinancePDF(doc, {
        index: pageIndex,
        fiscalYear: selectedYear, // Make sure to pass this
        income,
        operatingExpenditure,
        capitalExpenditure,
        bankDetails
      });
      pageIndex++;

      // startNewSection(doc, `${pageIndex}. Contact Person Details`, pageIndex);
      // await generateSignedAuthorityPDF(doc, pageIndex);
      doc.save('Student_Statistics_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Unable to export! Please try again');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <LoadingOverlay
          visible={loading}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ color: "#1976d2", type: "bars" }}
        />
      ) : (
        <Box sx={{ width: '100%', padding: '1rem' }}>
          <Box sx={{ padding: '20px' }}>
            <div className='flex justify-end gap-x-4'>
              <FormControl fullWidth sx={{ maxWidth: "20%" }} size="small">
                <InputLabel>Select Fiscal Year</InputLabel>
                <Select
                  size="small"
                  label="Select Fiscal Year"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  <MenuItem disabled value="">
                    Select Fiscal Year
                  </MenuItem>
                  {data.map((item) => (
                    <MenuItem key={item.id} value={item.yearNepali}>
                      {item.yearNepali}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" size='small' color="primary" onClick={exportToPDF}>
                Export to PDF
              </Button>
            </div>
            <Stack direction='column' padding='2rem' gap='2rem'>
              {[
                annualProgram && Object.keys(annualProgram).length > 0 &&
                { title: 'Student Enrollment: Annual System', component: (index) => <RenderAnnualTables fiscalYear={selectedYear} data={annualProgram} index={index} /> },
                semesterProgram && Object.keys(semesterProgram).length > 0 &&
                { title: 'Student Enrollment: Semester System', component: (index) => <RenderSemesterTables fiscalYear={selectedYear} data={semesterProgram} index={index} /> },
                { title: 'Total students who appeared for the examination and students who successfully passed.', component: (index) => <StudentExaminationStatus fiscalYear={selectedFiscalYearId} rows={passRateData} year={selectedYear} index={index} /> },
                { title: 'Teaching and Non-Teaching Staff', component: (index) => <TeachingNonTeachingTable teachingData={teachingStaffs} nonTeachingData={nonTeachingStaffs} index={index} /> },
                {
                  component: (index) => {
                    let sNo = 1
                    return (
                      <>
                        <h1 className='heading'>{index}. Research, Publication, and Fellowship Activity in Last F.Y: ....................</h1>
                        <ResearchDetailsTable data={researchData} index={index} sNo={sNo++} />
                        <ResearchPublications data={researchPubData} index={index} sNo={sNo++} />
                        <CampusPublications data={campusPubData} index={index} sNo={sNo++} />
                        <ReceiveFellowship data={fellowshipData} index={index} sNo={sNo++} />
                      </>
                    )
                  }
                },
                {
                  component: (index) => {
                    let sNo = 1
                    return (
                      <>
                        <h1 className='heading'>{index} Physical Infrastrctures</h1>
                        <Stack direction='column' gap='25px'>
                          <LandDetailsTable landData={landData} index={index} sNo={sNo++} />
                          <BuildingDetailsTable buildingData={buildingData} index={index} sNo={sNo++} />
                          <LabDetailsTable labData={labData} index={index} sNo={sNo++} />
                          <HostelDetailsTable hostelData={hostelData} index={index} sNo={sNo++} />
                          <FacilityDetailsTable regFacilityData={facility} index={index} sNo={sNo++} />
                          <EquipDetailsTable equipData={equipment} index={index} sNo={sNo++} />
                        </Stack>
                      </>
                    )
                  }
                },
                {
                  component: (index) => {
                    let sNo = 1
                    return (
                      <>
                        <Stack direction='column' gap='25px'>
                          {/* <FinanceDetailsTable index={index} sNo={sNo++} /> */}
                          <FinancialStatusTable fiscalYear={selectedYear} index={index}  income={income} operatingExpenditure={operatingExpenditure} capitalExpenditure={capitalExpenditure} bankDetails={bankDetails} />
                        </Stack>
                      </>
                    )
                  }
                },
                { component: (index) => <SignedAuthority index={index} /> },
              ]
                .filter(Boolean)
                .map((item, index) => (
                  <Box key={index}>
                    {item.title && <h1 className='heading'>{index + 1}) {item.title}</h1>}
                    {item.component(index + 1)}
                  </Box>
                ))}
            </Stack>
          </Box>
          <StatReportListByFiscalId />
        </Box>
      )}
    </>
  );
}



export default StatReportWrapper;