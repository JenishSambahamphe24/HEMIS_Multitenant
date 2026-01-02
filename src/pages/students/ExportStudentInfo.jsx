import { useState, useRef, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { getStudentById } from '../../services/employeeService';
import { getStdDocById } from '../../components/report/CampusReport/CampusServices';
import { useSelector } from 'react-redux';
import { getDateOnADForm, getDateOnly } from '../../utils/dateUtils';
import jsPDF from 'jspdf';
import { addNepaliFont } from '../../utils/otherUtils';
import {config} from '@config';

const ExportStudentInfo = ({ id }) => {
  const uploadURL = config.VITE_UPLOAD_URL;
  const { currentUser } = useSelector((state) => state.user);
  const instData = ({
    collegeId: currentUser.institution.id,
    collegeName: currentUser.institution.campusName,
    collegeAddress: `${currentUser.institution.district}, ${currentUser.institution.province}`,
    uniId: currentUser.institution.universityId || 0,
    uniName: currentUser.institution.universityName,
    uniLogo: currentUser?.university?.logo || '',
    collegeLogo: currentUser?.institution.logo
  })

  const uniLogo = `${uploadURL}/${instData.collegeLogo}`
  const [studentData, setStudentData] = useState({})
  const [ppSize, setPpSize] = useState('')
  const { studentId } = useParams()
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef();


  const fetchImageData = async () => {
    try {
      const imageResponse = await getStdDocById(studentId)
      setPpSize(`${uploadURL}/StudentProfile/${instData.collegeId}/Student/ppsizePhoto/${imageResponse.ppSizePhoto}`)
    } catch (error) {
    }
  }
  const fetchStudentData = async () => {
    try {
      const response = await getStudentById(studentId)
      setStudentData({
        uniRegNo: response.universityRegdNo,
        dobAD: response.doBAD,
        doBBS: getDateOnly(response.doBBS),
        // ppSizePhoto: imageResponse.ppSizePhoto,
        firstName: response.firstName,
        middleName: response.middleName,
        lastName: response.lastName,
        nepaliName: response.nepaliName || '',
        gender: response.gender,
        ethnicity: response.ethnicity,
        nationality: response.nationality,
        fatherName: response.fatherName,
        motherName: response.motherName,
        facultyName: response.facultyName,
        levelName: response.levelName,
        pLocalLevel: response.pLocalLevel,
        pDistrict: response.pDistrict,
        pProvince: response.pProvince,
        pWardNo: response.pWardNo || '',
      });

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchStudentData()
    fetchImageData()
  }, [])

  const handleDownloadPDF = async (uniLogo, ppSize) => {
    setIsLoading(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      addNepaliFont(doc);
      const pageWidth = 210;
      const pageHeight = 297;
      let y = 10;

      const addVerticalSpace = (space) => {
        y += space;
      };

      const loadImageAsBase64 = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataURL);
          };
          img.onerror = reject;
          img.src = url;
        });
      };

      let uniLogoBase64, ppSizeBase64;
      try {
        uniLogoBase64 = await loadImageAsBase64(uniLogo);
        ppSizeBase64 = await loadImageAsBase64(ppSize);
      } catch (imageError) {
        console.error('Error loading images:', imageError);
        uniLogoBase64 = null;
        ppSizeBase64 = null;
      }

      const renderHeader = () => {
        if (uniLogoBase64) {
          try {
            doc.addImage(uniLogoBase64, 'JPEG', 10, y, 25, 25);
          } catch (logoError) {
            console.error('Error adding university logo:', logoError);
          }
        }

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(instData.uniName, 105, y + 8, { align: 'center' });
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(instData.collegeName, 105, y + 14, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(instData.collegeAddress, 105, y + 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text("Application form for the Registration", 105, y + 26, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("Admission Batch: 2081 - 2082", 105, y + 32, { align: 'center' });

        // Add student photo if available
        if (ppSizeBase64) {
          try {
            doc.addImage(ppSizeBase64, 'JPEG', 175, y, 25, 30);
          } catch (photoError) {
            console.error('Error adding student photo:', photoError);
          }
        }

        y += 40;
      };

      const renderRegistrationInfo = () => {
        doc.setDrawColor(0);
        doc.rect(10, y, 70, 6);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text("Registration Number:", 12, y + 4);
        doc.setFont(undefined, 'normal');
        doc.text(studentData.uniRegNo, 45, y + 4);

        y += 10;
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text("Institute:", 10, y);
        doc.setFont(undefined, 'normal');
        doc.text(studentData.facultyName, 25, y);
        doc.setFont(undefined, 'bold');
        doc.text("Level:", 100, y);
        doc.setFont(undefined, 'normal');
        doc.text(studentData.levelName, 110, y);
        doc.setFont(undefined, 'bold');
        doc.text("Campus:", 150, y);
        doc.setFont(undefined, 'normal');
        doc.text(instData.collegeName, 165, y);
        y += 5;
      };

      const renderStudentName = () => {
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text("Full name (In Block Letter)", 12, y + 6);

        doc.rect(10, y, pageWidth - 20, 10);
        doc.line(55, y, 55, y + 10);
        doc.line(70, y, 70, y + 10);
        doc.line(85, y, 85, y + 10);

        doc.setFont(undefined, 'normal');
        doc.text(studentData.gender === 'male' ? 'Mr.' : studentData.gender === 'female' ? 'Mrs.' : '', 72, y + 6);

        const name = `${studentData.firstName} ${studentData.middleName} ${studentData.lastName}`;
        const chars = name.split('').map(c => c.toUpperCase());

        for (let i = 0; i < Math.min(chars.length, 15); i++) {
          const x = 85 + i * 8;
          doc.rect(x, y, 8, 10);
          if (chars[i] !== ' ') {
            doc.text(chars[i], x + 4, y + 6, { align: 'center' });
          }
        }
        y += 10;
        doc.rect(10, y, pageWidth - 20, 8);
        doc.line(55, y, 55, y + 8);
        doc.line(70, y, 70, y + 8);
        doc.setFont('nirmala', 'normal');
        // doc.setFont(undefined, 'bold');
        doc.text("देवनागरीमा", 15, y + 5);
        doc.setFont(undefined, 'normal');
        doc.text(studentData.gender === 'male' ? 'श्री' : studentData.gender === 'female' ? 'श्रीमती' : '', 72, y + 5);
        doc.text(studentData.nepaliName, 87, y + 5);
        y += 15;
      };

      const renderPersonalInfo = () => {
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text("Date of birth (BS):", 10, y);
        doc.setFont(undefined, 'normal');
        doc.text(studentData.doBBS, 40, y);

        doc.setFont(undefined, 'bold');
        doc.text("Date of birth (AD):", 80, y);
        doc.setFont(undefined, 'normal');
        doc.text(getDateOnADForm(studentData.dobAD), 110, y);

        y += 5;

        doc.setFont(undefined, 'bold');
        doc.text("Nationality:", 10, y);
        doc.setFont(undefined, 'normal');
        doc.text("Nepali", 30, y);

        doc.setFont(undefined, 'bold');
        doc.text("Religion:", 80, y);
        y += 5;
      };

      const renderParentNames = () => {
        doc.rect(10, y, pageWidth - 20, 10);
        doc.line(55, y, 55, y + 10);
        doc.line(70, y, 70, y + 10);
        doc.line(85, y, 85, y + 10);

        doc.setFont(undefined, 'bold');
        doc.text("Father's Name", 13, y + 6);

        doc.setFont(undefined, 'normal');
        doc.text("Mr.", 72, y + 6);

        const fatherChars = (studentData.fatherName || '').split('').map(c => c.toUpperCase());
        for (let i = 0; i < Math.min(fatherChars.length, 15); i++) {
          const x = 85 + i * 8;
          doc.rect(x, y, 8, 10);
          if (fatherChars[i] !== ' ') {
            doc.text(fatherChars[i], x + 4, y + 6, { align: 'center' });
          }
        }
        y += 10;
        doc.rect(10, y, pageWidth - 20, 10);
        doc.line(55, y, 55, y + 10);
        doc.line(70, y, 70, y + 10);
        doc.line(85, y, 85, y + 10);
        doc.setFont(undefined, 'bold');
        doc.text("Mother's Name", 13, y + 6);
        doc.setFont(undefined, 'normal');
        doc.text("Mrs.", 72, y + 6);

        const motherChars = (studentData.motherName || '').split('').map(c => c.toUpperCase());
        for (let i = 0; i < Math.min(motherChars.length, 15); i++) {
          const x = 85 + i * 8;
          doc.rect(x, y, 8, 10);
          if (motherChars[i] !== ' ') {
            doc.text(motherChars[i], x + 4, y + 6, { align: 'center' });
          }
        }
        y += 15;
      };

      const renderAddress = () => {
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text("Permanent Address:", 10, y);
        doc.setFont(undefined, 'normal');
        doc.text(`${studentData.pLocalLevel}, ${studentData.pDistrict}`, 60, y);

        doc.setFont(undefined, 'bold');
        doc.text("Ward No:", 90, y);
        doc.setFont(undefined, 'normal');
        doc.text(studentData.pWardNo, 110, y);

        doc.setFont(undefined, 'bold');
        doc.text("District:", 120, y);
        doc.setFont(undefined, 'normal');
        doc.text(studentData.pDistrict, 135, y);

        doc.setFont(undefined, 'bold');
        doc.text("Province:", 150, y);
        doc.setFont(undefined, 'normal');
        doc.text(studentData.pProvince, 165, y);
        y += 8;
      };

      const renderExaminationTable = () => {
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("Examination Passed", 10, y);
        y += 3;

        const tableY = y;
        const rowHeight = 6;
        const usableWidth = pageWidth - 20;

        const colWidths = [55, 30, 15, 40, 25, 25];
        const totalWidth = usableWidth;

        doc.rect(10, tableY, totalWidth, rowHeight * 5);
        const headers = [
          "Examination passed",
          "Board/University",
          "Year",
          "Marks/Percentage/CGPA",
          "Symbol No.",
          "Division"
        ];

        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');

        let currentX = 10;
        for (let i = 0; i < headers.length; i++) {
          if (i > 0) {
            doc.line(currentX, tableY, currentX, tableY + rowHeight * 5);
          }
          doc.text(headers[i], currentX + 2, tableY + 4);
          currentX += colWidths[i];
        }

        const examinations = [
          "S.L.C. or Secondary",
          "Intermediate/Higher Secondary",
          "Bachelor's",
          "Others"
        ];

        doc.setFont(undefined, 'normal');
        for (let row = 0; row < examinations.length; row++) {
          const rowY = tableY + (row + 1) * rowHeight;
          doc.line(10, rowY, 10 + totalWidth, rowY);
          doc.text(examinations[row], 12, rowY + 4);
        }

        y = tableY + rowHeight * 5 + 8;
      };

      const renderDeclaration = () => {
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(
          "I declare that the particulars given above are correct. If found false any action to be taken against me by the controller of the ",
          10,
          y
        );
        y += 4;
        doc.text(
          "examination against me by the controller of the examination center shall be acceptable.",
          10,
          y
        );
        y += 10;
        const leftX = 10;
        const rightX = 150;
        const lineWidth = 50;

        doc.line(leftX, y, leftX + lineWidth, y);
        doc.line(rightX, y, rightX + lineWidth, y);

        y += 5;

        doc.setFont(undefined, 'normal');
        doc.text("Parent/guardian's Signature", leftX, y, { align: 'left' });
        doc.text("Full signature of Applicant", rightX, y, { align: 'left' });

        y += 6;
        doc.setFont(undefined, 'normal');
        doc.text("Date:", leftX, y);
        doc.text("Date:", rightX, y);
        y += 6;
      };

      const renderCampusOfficeSection = () => {
        doc.line(10, y, 200, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text("TO BE FILLED BY THE CAMPUS OFFICE", 10, y);
        y += 6;

        doc.setFont(undefined, 'normal');
        doc.text(
          "This application is accepted by this campus only after checking the original Certificates and Mark sheets obtained from the student.",
          10,
          y
        );
        y += 4;
        doc.text(
          "I certify that the documents produced by the student have been properly verified and the particulars furnished are accurate to the",
          10,
          y
        );
        y += 4;
        doc.text(
          "best of my knowledge.",
          10,
          y
        );

        y += 10;

        doc.line(10, y, 70, y);
        doc.text("Checked By", 10, y + 5);
        doc.text("Date:", 10, y + 10);

        doc.line(95, y, 135, y);
        doc.text("Office Seal", 95, y + 5);
        doc.text("Date:", 95, y + 10);

        doc.line(160, y, 200, y);
        doc.text("Campus Chief", 160, y + 5);
        doc.text("Date:", 160, y + 10);

        y += 15;
      };

      const renderPrivateStudentSection = () => {
        doc.line(10, y, 200, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text("IN CASE OF PRIVATE STUDENTS", 10, y);
        y += 6;

        doc.setFont(undefined, 'normal');
        doc.text("I CERTIFY THAT THE ABOVE PARTICULARS ARE CORRECT", 10, y);

        y += 10;
        const leftSigX = 10;
        const rightSigX = 160;
        const lineWidth = 40;

        doc.line(leftSigX, y, leftSigX + lineWidth, y);
        doc.line(rightSigX, y, rightSigX + lineWidth, y);
        y += 5;
        doc.text("Office seal", 10, y);
        doc.text("Signature of Gazetted Officer", rightSigX, y);

        y += 6;
        doc.text("Date:", leftSigX, y);
        doc.text("Name:", rightSigX, y);

        y += 5;
        doc.text("Post:", rightSigX, y);
        y += 15;
      };

      // Render all sections
      renderHeader();
      renderRegistrationInfo();
      renderStudentName();
      renderPersonalInfo();
      renderParentNames();
      renderAddress();
      renderExaminationTable();
      renderDeclaration();
      renderCampusOfficeSection();
      renderPrivateStudentSection();

      doc.save('student-registration-form.pdf');

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const renderNameBoxes = (name) => {
    const chars = name.split('');
    return chars.map((char, index) => (
      <div key={index} className="w-8   border-r border-[#c2c2c2] flex items-center justify-center text-xs">
        {char === ' ' ? '' : char.toUpperCase()}
      </div>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-0 bg-white">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => handleDownloadPDF(uniLogo, ppSize)}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-sm text-white px-2 py-1 rounded-lg font-medium transition-colors"
        >
          <FaDownload size={12} />
          {isLoading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div ref={contentRef} className="bg-white px-6 py-2 border border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={uniLogo}
              alt="TU Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 text-center mx-6">
            <h1 className="text-md font-semibold uppercase">{instData.uniName}</h1>
            <h2 className="text-md font-semibold  uppercase">{instData.collegeName}</h2>
            <p className="text-md uppercase">{instData.collegeAddress}</p>
            <h3 className="text-sm font-medium">Application form for the Registration</h3>
            <div className="flex items-center justify-center gap-2">
              <span className="text-md font-semibold">Admission Batch:</span>
              <span className="border-b border-dotted border-black px-3 ">2081</span>
              <span>-</span>
              <span className="border-b border-dotted border-black px-3 ">2082</span>
            </div>
          </div>

          <div className="w-24 h-24 flex-shrink-0">
            <img
              // src={`${uploadURL}/StudentProfile/${instData.collegeId}/Student/ppsizePhoto/${studentData.ppSizePhoto}`}
              src={ppSize}
              alt="PPSize photo"
              className="w-full h-full object-cover rounded"
            />
          </div>
        </div>

        {/* Registration Number */}
        <div className="mb-4">
          <div className="border border-black px-2 inline-block">
            <span className="text-sm font-medium">Registration Number:</span> <span className='font-normal '> {studentData.uniRegNo} </span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-md">
            <span className='text-sm font-medium'>Faculty/Institute: <span className="border-b border-dotted border-black px-3 py-1 text-sm font-normal">{studentData.facultyName}</span></span>
            <span className='text-sm font-medium'>Level: <span className="border-b border-dotted border-black px-3 py-1 text-sm font-normal">{studentData.levelName}</span></span>
            <span className='text-sm font-medium'>Campus: <span className="border-b border-dotted border-black px-3 py-1 text-sm font-normal">{instData.collegeName}</span></span>
          </div>
        </div>

        {/* Student Name Section */}
        <div className="mb-4">
          <div className="border border-gray-400">
            <div className="flex">
              <div className="border-r border-gray-400  px-2 bg-gray-50">
                <span className="text-sm font-medium">Full name (In Block Letter)</span>
              </div>
              <div className=" border-r border-gray-400  flex items-center justify-center bg-gray-50">
                <span className="text-sm px-1">
                  {studentData.gender === 'male' ? 'Mr.' : studentData.gender === 'female' ? 'Mrs.' : ''}
                </span>
              </div>
              <div className="flex-1 flex">
                {renderNameBoxes(`${studentData.firstName} ${studentData.middleName} ${studentData.lastName}`)}
              </div>
            </div>

            {/* Nepali Name Row */}
            <div className="flex border-t border-gray-400">
              <div className="w-1/4 border-r border-gray-400 bg-gray-50">
                <span className="text-sm px-2 font-medium">देवनागरीमा</span>
              </div>
              <div className=" border-r border-gray-400 px-1 flex items-center justify-center bg-gray-50">
                <span className="text-sm">
                  {studentData.gender === 'male' ? 'श्री' : studentData.gender === 'female' ? 'श्रीमती' : ''}
                </span>
              </div>
              <div className="flex-1 p-1 flex items-center">
                <span className="text-sm">{studentData.nepaliName}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-1">
          <div className="border border-gray-400 flex">
            <div className="w-1/4 border-r border-gray-400 px-3 bg-gray-50">
              <span className="text-sm font-medium">Father's Name</span>
            </div>
            <div className="flex-1 flex">
              {renderNameBoxes(studentData.fatherName || '')}
            </div>
          </div>
          <div className="border mt-2 border-gray-400 flex">
            <div className="w-1/4 border-r border-gray-400 px-3 bg-gray-50">
              <span className="text-sm font-medium">Mother's Name</span>
            </div>
            <div className="flex-1 flex">
              {renderNameBoxes(studentData.motherName || '')}
            </div>
          </div>
        </div>
        <div className="mb-2 mt-2  gap-6">
          <div className='flex'>
            <div className="text-sm font-medium">
              <span>Date of birth (BS):</span>
              <span className='ml-2 text-sm font-normal'>{studentData.doBBS}</span>

            </div>
            <div className="text-sm ml-6 font-medium">
              <span>Date of birth (AD)</span>
              <span className='ml-2 text-sm font-normal reverse'>{getDateOnADForm(studentData.dobAD)}</span>
            </div>
          </div>
          <div className="flex-1 mt-1 flex items-center gap-6">
            <span className='text-sm font-medium'>Ethnicity: <span className="border-b border-dotted border-black px-3 font-normal text-sm">Nepali</span></span>
            <span className='text-sm font-medium'>Nationality: <span className="border-b border-dotted border-black px-3 font-normal text-sm">Nepali</span></span>
            <span className='text-sm font-medium '>Religion: <span className="border-b border-dotted border-black px-3 py-1 w-24 inline-block font-normal text-sm"></span></span>
          </div>
          <div className="mb-2">
            <div className="text-sm flex flex-wrap items-center gap-6">
              <span className='text-sm font-medium'>Mailing Address: <span className="border-b border-dotted border-black px-3 font-normal text-sm">{studentData.pLocalLevel}, {studentData.pDistrict}</span></span>
              <span className='text-sm font-medium'>Ward No: <span className="border-b border-dotted border-black px-1 font-normal text-sm">{studentData.pWardNo}</span></span>
              <span className='text-sm font-medium'>District: <span className="border-b border-dotted border-black px-1 font-normal text-sm">{studentData.pDistrict}</span></span>
              <span className='text-sm font-medium'>Province: <span className="border-b border-dotted border-black px-1 font-normal text-sm">{studentData.pProvince}</span></span>
            </div>
          </div>
        </div>

        <div className="mb-2  border-b border-black">
          <h3 className="text-sm font-bold mb-1">Examination Passed</h3>
          <div className="border border-gray-400">
            <div className="flex bg-gray-50 font-medium">
              <div className="w-2/6 border-r border-gray-400 px-1">Examination passed</div>
              <div className="w-1/4 border-r border-gray-400 px-1 text-sm">Board/University</div>
              <div className="w-16 border-r border-gray-400 px-1 text-sm">Year</div>
              <div className="w-1/6 border-r border-gray-400 px-1 text-sm">Percentage/CGPA</div>
              <div className="w-1/6 border-r border-gray-400 px-1 text-sm">Symbol No.</div>
              <div className="w-1/6 px-1 text-sm">Division</div>
            </div>

            {['S.L.C. or Secondary', 'Intermediate/Higher Secondary', "Bachelor's", 'Others'].map((exam, index) => (
              <div key={index} className="flex border-t border-gray-400">
                <div className="w-2/6 border-r border-gray-400 px-1">{exam}</div>
                <div className="w-1/4 border-r border-gray-400 px-1"></div>
                <div className="w-16 border-r border-gray-400 px-1"></div>
                <div className="w-1/6 border-r border-gray-400 px-1"></div>
                <div className="w-1/6 border-r border-gray-400 px-1"></div>
                <div className="w-1/6 px-1"></div>
              </div>
            ))}
          </div>

          <div className="mt-4 pb-1">
            <p className="text-sm font-medium mb-2">
              I declare that the particulars given above are correct. If found false any action to be taken against me by the controller of the examination center shall be acceptable.
            </p>

            <div className="flex justify-between mt-8">
              <div className="text-center">
                <div className="border-t border-black pt-2 px-8">
                  <p className="text-sm font-medium">Parent/guardian's Signature</p>
                  <p className="text-sm mt-2">Date:</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-black pt-2 px-8">
                  <p className="text-sm font-medium">Full signature of Applicant</p>
                  <p className="text-sm mt-2">Date:</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-2 pb-2 border-b border-black">
          <h3 className="text-sm font-medium inline-block mb-2">TO BE FILLED BY THE CAMPUS OFFICE</h3>
          <p className="text-sm mb-4">
            This application is accepted by this campus only after checking the original Certificates and Mark sheets obtained from the student. I certify that the documents produced by the student have been properly verified and the particulars furnished are accurate to the best of my knowledge.
          </p>

          <div className="flex justify-between mt-2">
            {['Checked By', 'Office Seal', 'Campus Chief'].map((title, index) => (
              <div key={index} className="text-center">
                <div className="border-t border-black px-4">
                  <p className="text-sm font-normal">{title}</p>
                  <p className="text-sm">Date:</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium  inline-block mb-2">IN CASE OF PRIVATE STUDENTS</h3>
          <p className="text-sm font-normal mb-1">I CERTIFY THAT THE ABOVE PARTICULARS ARE CORRECT</p>

          <div className="flex justify-between mt-6">
            <div className="text-center">
              <div className="border-t border-black pt-2 px-6">
                <p className="text-sm font-medium">Office seal</p>
                <p className="text-sm mt-2">Date:</p>
              </div>
            </div>

            <div className="text-center">
              <div className="border-t border-black pt-2 px-6">
                <p className="text-sm font-medium">Signature of Gazetted Officer</p>
                <div className="mt-1 space-y-1">
                  <div className='text-sm'>Name: <span className="border-b border-dotted border-black px-12 py-1 inline-block"></span></div>
                  <div className='text-sm'>Post: <span className="border-b border-dotted border-black px-12 py-1 inline-block"></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportStudentInfo
