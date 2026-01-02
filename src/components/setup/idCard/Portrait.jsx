import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const Portrait = ({
  student,
  baseUrl,
  logo,
  campusName,
  uniName,
  localLevel,
  district,
  phoneNo,
  uploadURL,
  campusId,
  stdPhoto,
  firstSignature,
  error_img,
  componentRef
}) => {
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Paper
      ref={componentRef}
      className='w-[54mm]  border-[1px] border-[#2b6eb5] py-[2px]'
    >
      <div
        className='w-14 h-14 mx-auto'
      >
        <img
          src={`${baseUrl}/${logo}`}
          alt="Logo"
          className='w-full h-full'
        />
      </div>
      <h1
        className='text-center text-[11px] font-medium mt-[-5px]'
      >
        Affiliated to {uniName}
      </h1>
      <h1
        className='block  text-center tracking-wider text-sm font-bold text-[#2B6EB5] mt-[-5px]'
      >
        {campusName}
      </h1>
      <h1
        className='text-center text-[#ff0000] font-medium text-xs mt-[-3px]'
      >
        STUDENT IDENTITY CARD
      </h1>
      <Box sx={{ textAlign: "center", position: 'relative', mt: '2px' }}>
        <div
          className="w-16 h-16 border border-black mx-auto flex items-center justify-center bg-white relative"
        >
          {stdPhoto ? (
            <img
              alt="Student Photo"
              src={`${uploadURL}/${stdPhoto}`}
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
        <h1
          className='text-[10px] mb-[2px]'
        >
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
              mb:'2px'
            }}
          >
            <h1 className="text-[10px] block mt-[-3px]">
              <strong>Name:</strong> {student.firstName}{" "}
              {student.middleName ? student.middleName + " " : ""}
              {student.lastName}
            </h1>

            <h1 className="text-[10px] block mt-[-3px]">
              <strong>Gender:</strong>{" "}
              {student?.gender ? capitalize(student?.gender) : ""}
            </h1>

            <h1 className="text-[10px] block mt-[-3px]">
              <strong>Level:</strong> {student?.levelName}
            </h1>

            <h1 className="text-[10px] block mt-[-3px] truncate">
              <strong className="mr-1">Program:</strong>
              {student.programShortName},
              <span className="ml-1">
                {student.programType === 'annual'
                  ? `${student.year} Year`
                  : `${student.semester} Semester`}
              </span>
            </h1>

            <h1 className="text-[10px] block mt-[-3px]">
              <strong>Student ID:</strong> {student?.id}
            </h1>

            <h1 className="text-[10px] block mt-[-3px]">
              <strong>Phone No.:</strong> {student?.phoneNumber}
            </h1>

            <h1 className="text-[10px] block mt-[-3px]">
              <strong>Validity:</strong> {student?.validDateNep?.slice(0, 10)}
            </h1>
          </Box>

          <Box
            className='w-full border-t-[1px] border-[#2b6eb5]'
          >
            <h1
              variant="caption"
              className='block text-[10px] font-medium tracking-tighter text-center'
            >
              {`${localLevel}, ${district}`}
            </h1>
            <h1
             className='block text-[10px] mt-[-3px] font-medium tracking-tighter text-center'
            >
              Phone: {phoneNo}
            </h1>
          </Box>
        </Box>
      ) : (
        <h1
          className='text-sm font-bold'
        >
          Loading student data...
        </h1>
      )}
    </Paper>
  );
};

export default Portrait;