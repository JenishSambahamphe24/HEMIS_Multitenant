import { Paper, Typography, Grid, Box, Divider } from '@mui/material';
import { capitaliseFirstLetter, getDateOnly } from '../../../utils/dateUtils';
import QRCode from "react-qr-code";
import staticSignature from '../../../assets/signature.png'

//for the program type annual and semester display
const getProgramLabel = (student) => {
  if (!student) return "";

  const program = student.shortName || student.programShortName || "";

  if (student.year) {
    return `${program}, ${student.year} Year`;
  }

  if (student.semester) {
    return `${program}, ${student.semester} Semester`;
  }

  return program;
};

export const Landscape = ({
    student,
    baseUrl,
    logo,
    uniName,
    campusName,
    localLevel,
    district,
    phoneNo,
    uploadURL,
    firstSignature,
    error_img,
}) => {
    
    return (
        <Paper
            sx={{
                width: "86mm",
                height: "54mm",
                borderRadius: "3mm",
                p: "5px",
                position: "relative",
                overflow: "hidden",
                border: "2px solid #2b6eb5",
                bgcolor:'#dee8f2'
            }}
            className='font-times id-card'
        >
            <section className='flex justify-between'>
                <div className='w-16 h-16'>
                    <img
                        src={`${baseUrl}/${logo}`}
                        alt="Logo"
                        className='w-full h-full object-contain'
                    />
                </div>

                <div className='flex flex-1 flex-col gap-0'>
                    <h1 className='text-center text-[11px] mt-[-2px]'>
                        Affiliated to {uniName}
                    </h1>
                    <h1 className='block text-center  text-sm font-bold text-[#2B6EB5] mt-[-2px]'>
                        {campusName}
                    </h1>
                    <h1 className='block text-center text-[11px] mt-[-2px]'>
                        {`${localLevel}, ${district}`}
                    </h1>
                    <h1 className='text-center block text-[11px] mt-[-2px]'>
                        Ph: {phoneNo} 
                    </h1>
                    <h1 className='text-center text-[#ff0000] font-medium underline text-[11px] mt-[-2px]'>
                        STUDENT IDENTITY CARD 
                    </h1>
                </div>
            </section>

            {student ? (
                <Grid container spacing={0.5} sx={{ mt: "1mm", px: "2mm" }}>
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.3mm",
                            }}
                        >
                            <Typography variant="caption" noWrap sx={{ fontSize: "2.3mm" }}>
                                <strong>Name:</strong> {student?.firstName}{" "}
                                {student.middleName ? student.middleName + " " : ""}
                                {student.lastName}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: "2.3mm" }}>
                                <strong>Student ID:</strong> {student?.id}
                            </Typography>
                            <Typography variant="caption" noWrap sx={{ fontSize: "2.3mm" }}>
                                <strong>Addess:</strong> {student?.address}
                            </Typography>
                            <Typography variant="caption" noWrap sx={{ fontSize: "2.3mm" }}>
                                <strong>Level:</strong> {student?.levelName}, {student?.batchNepali}
                                
                            </Typography>
                            <Typography variant="caption" noWrap sx={{ fontSize: "2.3mm" }}>
                                <strong style={{ marginRight: '5px' }}>Program:</strong>
                                {/* {student.programShortName}, */}
                                {/* <span className="ml-1">
                                    {`${student.programType === 'annual' ? `${student.year} Year` : `${student.semester} Semester`}`}
                                </span> */}
                                 {getProgramLabel(student)}
                            </Typography>
                            <Typography variant="caption" noWrap sx={{ fontSize: "2.3mm" }}>
                                <strong>Phone No.:</strong> {student?.phoneNumber}
                            </Typography>
                            <Typography variant="caption" noWrap sx={{ fontSize: "2.3mm" }}>
                                <strong>Valid Upto:</strong>{" "}
                                {getDateOnly(student?.validDate)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid position='relative' item xs={6}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "1mm",
                                marginLeft: "60px",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "25mm",
                                    height: "25mm",
                                    border: "1px solid #000",
                                    mx: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "#fff",
                                }}
                            >
                                {student?.studentProfile?.ppSizePhoto ? (
                                    <img
                                        src={`${uploadURL}/${student?.studentProfile?.ppSizePhoto}`}
                                        alt="Student Photo"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <>No Photo</>
                                )}
                            </Box>

                            <img
                                style={{
                                    width: '100px',
                                    height: '60px',
                                    marginTop: '-40px',
                                    marginLeft: '-10px',
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
                        </Box>
                    </Grid>
                    <h1 className='absolute bottom-1 right-3  text-[2.3mm] font-medium'>
                        Authorized Signature
                    </h1>
                </Grid>
            ) : (
                <Typography variant="caption" sx={{ textAlign: "center", fontSize: "3mm" }}>
                    Loading student data...
                </Typography>
            )}
        </Paper>
    );
};

export const Portrait = ({
    student,
    baseUrl,
    logo,
    uniName,
    campusName,
    localLevel,
    district,
    phoneNo,
    uploadURL,
    firstSignature,
    error_img,
}) => {
    return (
        <Paper
            className="id-card w-[54mm] h-[86mm] flex flex-col justify-between border-[1px]  border-[#2b6eb5] "
            sx={{
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box className='bg-blue-100'>
                <div className='w-12 h-12 mx-auto'>
                    <img
                        src={`${baseUrl}/${logo}`}
                        alt="Logo"
                        className='w-full h-full object-contain'
                    />
                </div>

                <h1 className='text-center text-[10px] font-medium mt-[-5px]'>
                    Affiliated to {uniName}
                </h1>

                <h1 className='block text-center tracking-wider text-sm font-bold text-[#2B6EB5] mt-[-5px]'>
                    {campusName}
                </h1>

                <h1 className='text-center underline text-[#ff0000] font-medium text-xs '>
                    STUDENT IDENTITY CARD  
                </h1> 

            </Box>

            <Box sx={{ textAlign: "center", position: 'relative', }}>
                <div className="w-[70px] h-[70px] border border-black mx-auto flex items-center justify-center bg-white relative">
                    {student?.studentProfile?.ppSizePhoto ? (
                        <img
                            src={`${uploadURL}/${student?.studentProfile?.ppSizePhoto}`}
                            alt="Student Photo"
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        "No Photo"
                    )}
                    {firstSignature?.uploadSignature && (
                        <img
                            style={{
                                width: '100px',
                                height: '60px',
                                position: 'absolute',
                                bottom: '-30px'
                            }}
                            src={`${uploadURL}/signatures/${firstSignature.uploadSignature}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = error_img;
                            }}
                            alt="Signature"
                        />
                    )}
                </div>

                <h1 className='text-[10px] mb-[2px] underline'>
                    Authorized Signature
                </h1>
            </Box>

            {student ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            width: "fit-content",
                            maxWidth: "90%",
                            textAlign: "left",
                            mb: '2px'
                        }}
                    >
                        <h1 className="text-xs block mt-[-1px]">
                            <strong>Name:</strong> {student.firstName}{" "}
                            {student.middleName ? student.middleName + " " : ""}
                            {student.lastName}
                        </h1>
                        <h1 className="text-xs block mt-[-1px]">
                            <strong>Student ID:</strong> {student?.id}
                        </h1>

                        <h1 className="text-xs block mt-[-1px]">
                            <strong>Level:</strong> {student?.levelName}, {student?.batchNepali}
                        </h1>

                        <h1 className="text-xs block mt-[-1px] truncate">
                            <strong className="mr-1">Program:</strong>
                            {/* {student.programShortName},
                            <span className="ml-1">
                                {student.programType === 'annual'
                                    ? `${student.year} Year`
                                    : `${student.semester} Semester`}
                            </span> */}
                            {getProgramLabel(student)}
                        </h1>



                        <h1 className="text-xs block mt-[-1px]">
                            <strong>Validity:</strong> {getDateOnly(student?.validDate)}
                        </h1>
                    </Box>

                    <Box className='w-full border-t-[1px] bg-blue-100  border-[#2b6eb5]'>
                        <h1 className='block text-[11px] font-regular tracking-tighter text-center'>
                            {`${localLevel}, ${district}`}
                        </h1>
                        <h1 className='block text-[11px] fotn-regular tracking-tighter text-center'>
                            Tel: {phoneNo}
                        </h1>
                    </Box>
                </Box>
            ) : (
                <h1 className='text-sm font-bold'>
                    Loading student data...
                </h1>
            )}
        </Paper>
    );
};

export function OriginalJMC({
    student,
    logo,
    uniName,
    campusName,
    localLevel,
    district,
    phoneNo,
    uploadURL,
    stdPhoto,
    firstSignature,
    error_img,
    collegeFirstName,
    collegeSecond
}) {
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
            dob: getDateOnly(student.doBBS) || "",
            validTill: student.ValidDateNep || "",
            campus: campusName || "",
            university: uniName || "",
        });
    };
    return (
        <Grid item xs={6} sm={4} lg={2} >
            <div className="id-card flex flex-col rounded-lg shadow-lg  bg-[#FDEEF4] overflow-hidden w-[54mm] h-[86mm]  border-2 border-[#2b6eb5]" >
                <section className='px-2 mt-1'>
                    <div className='flex'>
                        <img
                            src={`${uploadURL}/${logo}`}
                            alt="Logo"
                            className='w-12 object-contain'
                        />
                        <div className='flex-1 text-center text-[#2b6eb5]'>
                            <h1 className='uppercase text-lg font-bold tracking-wider font-times'>{collegeFirstName}</h1>
                            <h1 className='uppercase text-xs font-bold mt-[-4px] font-times'>{collegeSecond}</h1>
                        </div>

                    </div >

                </section>

                <section className='px-2'>
                    <h1 className='text-[10px] text-center font-times'>(Affiliated to {uniName})</h1>
                    <h1 className='text-[10px] text-center font-times my-[-2px]'>  {`${localLevel}, ${district}`}</h1>
                    <h1 className='text-[10px] text-center font-times my-[-2px]'><span>Tel. No.: {phoneNo}</span> </h1>
                </section>

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

                <section className='px-2 flex  flex-col mt-5'>
                    <h1 className='text-[10px]  font-times font-bold'> Name:
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
                    <h1 className='text-[10px]  font-times font-bold'> Address:
                        <span className='ml-[3px]'>
                            {capitaliseFirstLetter(student.pLocality)}
                        </span>
                    </h1>

                    <h1 className='text-[10px]  font-times font-bold'> Level:
                        <span className='ml-[3px]'>
                            {`${student.levelName}, ${student.batchNepali}`}
                        </span>
                    </h1>

                    <h1 className='text-[10px]  font-times font-bold'> Program:
                        <span className='tex-sm font-times font-bold ml-[2px]'>
                            {/* {student?.programShortName ? `${student.programShortName},` : ""} */}
                            {/* <span className="ml-1"> */}
                                {/* {student?.programType && student?.programType === 'annual'
                                    ? `${student?.year || ''} Year`
                                    : `${student?.semester || ''} Semester`} */}
                                {getProgramLabel(student)}
                            {/* </span> */}
                        </span> </h1>
                    <h1 className='text-[10px]  font-times font-bold'> DOB:
                        <span className='tex-sm font-times font-bold ml-[2px]'>
                            <span >
                                {student && student.doBBS ? getDateOnly(student.doBBS) : ""}
                            </span>
                        </span> </h1>
                    <h1 className='text-[10px]  font-times font-bold'> Valid Till:
                        <span className='tex-sm font-times font-bold ml-[2px]'>
                            <span className="ml-1">
                                {getDateOnly(student?.validDate)}
                            </span>
                        </span> </h1>
                </section>

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

                <section className='flex-1  h-full' >
                    <Divider style={{ backgroundColor: '#2b6eb5', height: '2px' }} />
                    <h1 className='text-xs   text-[#2b6eb5] font-bold uppercase text-center font-times'> Student Identity card</h1>
                </section>
            </div>
        </Grid>

    );
}

export function JmcIdDesign({
    student,
    logo,
    uniName,
    campusName,
    localLevel,
    district,
    phoneNo,
    uploadURL,
    stdPhoto,
    firstSignature,
    error_img,
}) {

    const stdAddress = student && `${student.pLocalLevel || ""} ${student.pDistrict || ""}`;
    const stdPhoneNo = student?.phoneNumber || phoneNo;

    const generateQRData = () => {
        if (!student) return "";
        return JSON.stringify({
            studentId: student.studentId,
            name: `${student.firstName || ""} ${student.middleName ? student.middleName + " " : ""}${student.lastName || ""}`.trim(),
            address: stdAddress || "",
            rollNo: student.rollNoManual || "",
            faculty: student.programShortName || "",
            level: student.programType === "annual" ? `${student.year || ""} Year` : `${student.semester || ""} Semester`,
            dob: getDateOnly(student.doBBS) || "",
            validTill: student.ValidDateNep || "",
            campus: campusName || "",
            university: uniName || "",
        });
    };

    return (
        <div className="id-card rounded-lg shadow-lg bg-white overflow-hidden w-[54mm] h-[86mm]" >
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white  ">
                <div className="flex items-center space-x-3">
                    <img
                        src={`${uploadURL}/${logo}`}
                        alt="Campus Logo"
                        className="w-14 h-14 bg-white rounded-full p-1"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = error_img;
                        }}
                    />
                    <div className="flex-1">
                        <h2 className="text-lg font-bold leading-tight">{uniName}</h2>
                        <h3 className="text-sm font-medium opacity-90">{campusName}</h3>
                        <p className="text-xs opacity-75">{`${localLevel}, ${district}`}</p>
                        <p className="text-xs opacity-75">Tel No: {stdPhoneNo}</p>
                    </div>
                </div>
            </div>

            <div className="p-2 bg-gray-50">
                <div className="flex justify-center mb-2">
                    <div className="relative">
                        <img
                            src={`${uploadURL}/photos/${stdPhoto}`}
                            alt="Student"
                            className="w-[100px] h-24 object-cover border-4 border-blue-200 rounded-full shadow-md"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = error_img;
                            }}
                        />
                    </div>
                </div>

                {/* Student Info */}
                {student && (
                    <div className="space-y-[1px] text-sm">
                        <div className="flex">
                            <span className="font-semibold text-gray-700 w-16 text-xs">Name:</span>
                            <span className="text-gray-900 text-xs font-medium">
                                {`${student.firstName} ${student.middleName || ""} ${student.lastName}`.trim()}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="font-semibold text-gray-700 w-16 text-xs">Phone:</span>
                            <span className="text-gray-900 text-xs">{stdPhoneNo}</span>
                        </div>
                        <div className="flex">
                            <span className="font-semibold text-gray-700 w-16 text-xs">Level:</span>
                            <span className="text-gray-900 text-xs">
                                {student.programType === "annual" ? `${student.year} Year` : `${student.semester} Semester`}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="font-semibold text-gray-700 w-16 text-xs">Roll No:</span>
                            <span className="text-gray-900 text-xs">{student.rollNoManual}</span>
                        </div>
                        <div className="flex">
                            <span className="font-semibold text-gray-700 w-16 text-xs">Program:</span>
                            <span className="text-gray-900 text-xs">{student.programShortName}</span>
                        </div>
                        <div className="flex">
                            <span className="font-semibold text-gray-700 w-16 text-xs">DOB:</span>
                            <span className="text-gray-900 text-xs">{ getDateOnly(student.doBBS)}</span>
                        </div>
                        <div className="flex">
                            <span className="font-semibold text-gray-700 w-16 text-xs">Valid Till:</span>
                            <span className="text-gray-900 text-xs">{getDateOnly(student?.validDate)}</span>
                        </div>
                    </div>
                )}

                <div className=" flex justify-between items-end">
                    <div className="flex flex-col items-center">
                        <QRCode value={generateQRData()} size={60} level="M" />
                    </div>
                    <div className="text-center">
                        <img
                            src={firstSignature || error_img}
                            alt="Signature"
                            className="w-20 h-12 object-contain mb-1"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = error_img;
                            }}
                        />
                        <div className="border-t border-gray-400 text-xs text-gray-600 pt-1">
                            Signature
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-blue-800 text-white text-center py-2">
                <p className="text-xs font-semibold">STUDENT IDENTITY CARD</p>
            </div>
        </div>
    );
}







