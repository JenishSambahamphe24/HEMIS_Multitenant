import { Box, Typography, Grid, Card, Divider } from "@mui/material";
import { capitaliseFirstLetter, getDateOnly } from '../../../utils/dateUtils';
import QRCode from "react-qr-code";
import error_img from "../../../assets/error_img.png";

function JmcIdDesign({
  student,
  baseUrl,
  logo,
  uniName,
  campusName,
  localLevel,
  district,
  phoneNo,
  uploadURL,
  campusId,
  stdPhoto,
  firstSignature,
  error_img,
  collegeAddress,
  componentRef
}) {

  // Campus name splitting logic inside the component
  const [collegeFirstName, ...collegeRemaining] = campusName ? campusName.split(" ") : ["", ""];
  const collegeSecond = collegeRemaining.join(" ");

  const stdAddress = student && `${student.pLocalLevel || ""} ${student.pDistrict || ""}`;

  const generateQRData = () => {
    if (!student) return "";
    return JSON.stringify({
      studentId: student.studentId,
      name: `${student.firstName || ""} ${student.middleName ? student.middleName + " " : ""}${student.lastName || ""}`.trim(),
      address: stdAddress || "",
      rollNo: student.rollNoManual || "",
      faculty: student.programShortName || "",
      level: student.programType === "annual" ? `${student.year || ""} Year` : `${student.semester || ""} Semester`,
      dob: student.doBBS || "",
      validTill: student.ValidDateNep || "",
      campus: campusName || "",
      university: uniName || "",
    });
  };

  if (!student) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Typography color="error">No student data found</Typography>
      </Box>
    );
  }
  return (
    <Grid item xs={6} sm={4} lg={2}>
      <div
        ref={componentRef}
        className="id-card flex flex-col rounded-lg shadow-lg bg-[#FDEEF4] overflow-hidden w-[54mm] h-[86mm] border-2 border-[#2b6eb5]"
      >
        {/* Header Section - EXACT COPY */}
        <section className='px-2 mt-1'>
          <div className='flex'>
            <img
              src={logo ? `${uploadURL}/${logo}` : error_img}
              alt="Logo"
              className='w-12 object-contain'
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = error_img;
              }}
            />
            <div className='flex-1 text-center text-[#2b6eb5]'>
              <h1 className='uppercase text-lg font-bold tracking-wider font-times'>{collegeFirstName}</h1>
              <h1 className='uppercase text-xs font-bold mt-[-4px] font-times'>{collegeSecond}</h1>
            </div>
          </div>
        </section>

        {/* University Affiliation - EXACT COPY */}
        <section className='px-2'>
          <h1 className='text-[10px] text-center font-times'>(Affiliated to {uniName})</h1>
          <h1 className='text-[10px] text-center font-times my-[-2px]'>  {`${localLevel}, ${district}`}</h1>
          <h1 className='text-[10px] text-center font-times my-[-2px]'><span>Tel. No.: {phoneNo}</span> </h1>
        </section>

        {/* Photo and Signature Section - EXACT COPY */}
        <section className='px-2 relative flex flex-column items-center justify-center pt-1'>
          <div className='w-[70px] h-[70px] '>
            {stdPhoto ? (
              <img
                src={`${uploadURL}/${stdPhoto}`}
                alt="Student"
                className="w-full h-full object-cover border-4 border-blue-200 rounded-full shadow-md"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = error_img;
                }}
              />
            ) : (
              <h1 className='text-sm text-center'>
                Student Photo
              </h1>
            )}
            <h1 className='absolute bottom-[-15px] left-12 text-[10px] text-[#2b6eb5]'>Authorized signature</h1>
          </div>
          <div>
            <img
              style={{
                position: 'absolute',
                width: '80px',
                height: '40px',
                right: '40%',
                zIndex: 100
              }}
              src={
                firstSignature?.uploadSignature
                  ? `${uploadURL}/signatures/${firstSignature.uploadSignature}`
                  : error_img
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = error_img;
              }}
              alt="Signature"
            />
          </div>
        </section>

        {/* Student Information Section - EXACT COPY */}
        <section className='px-2 flex flex-col mt-5'>
          <h1 className='text-[10px] font-times font-bold'> Name:
            <span className="text-[10px] font-times font-bold ml-[3px]">
              {capitaliseFirstLetter(student?.firstName)}{" "}
              {capitaliseFirstLetter(student?.middleName ? `${student.middleName} ` : "")}
              {capitaliseFirstLetter(student?.lastName)}
            </span>
          </h1>

          <h1 className='text-[10px] font-times font-bold'> Student ID:
            <span className='tex-sm font-times font-bold ml-[3px]'>
              {student && student.rollNoManual ? student.rollNoManual : ""}
            </span>
          </h1>

          <h1 className='text-[10px] font-times font-bold'> Address:
            <span className='ml-[3px]'>
              {capitaliseFirstLetter(student.pLocality)}
            </span>
          </h1>

          <h1 className='text-[10px] font-times font-bold'> Level:
            <span className='ml-[3px]'>
              {`${student.levelName},    Batch: ${student.batchNameNepali}`}
            </span>
          </h1>

          <h1 className='text-[10px] font-times font-bold'> Program:
            <span className='tex-sm font-times font-bold ml-[2px]'>
              {student?.programShortName ? `${student.programShortName},` : ""}
              <span className="ml-1">
                {student?.programType && student?.programType === 'annual'
                  ? `${student?.year || ''} Year`
                  : `${student?.semester || ''} Semester`}
              </span>
            </span>
          </h1>

          <h1 className='text-[10px] font-times font-bold'> DOB:
            <span className='tex-sm font-times font-bold ml-[2px]'>
              <span >
                {student && student.doBBS ? student.doBBS.split("T")[0] :""}
              </span>
            </span>
          </h1>

          <h1 className='text-[10px] font-times font-bold'> Valid Till:
            <span className='tex-sm font-times font-bold ml-[2px]'>
              <span className="ml-1">
                {student?.ValidDateNep || student?.validDateNep || "N/A"}
              </span>
            </span>
          </h1>
        </section>

        {/* QR Code Section - EXACT COPY */}
        <section className='flex justify-end mb-1 mt-[-45px]'>
          {student && (
            <div className='flex flex-col items-center mr-1'>
              <QRCode
                value={generateQRData()}
                size={50}
                level="M"
                includeMargin={false}
              />
            </div>
          )}
        </section>

        {/* Footer Section - EXACT COPY */}
        <section className='flex-1 h-full' >
          <Divider style={{ backgroundColor: '#2b6eb5', height: '2px' }} />
          <h1 className='text-xs text-[#2b6eb5] font-bold uppercase text-center font-times'> Student Identity card</h1>
        </section>
      </div>
    </Grid>
  );
}

export default JmcIdDesign;