import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';

const Landscape = ({
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
  componentRef
}) => {

  return (
    <Paper
      ref={componentRef}
      sx={{
        width: "86mm",
        height: "54mm",
        borderRadius: "3mm",
        p: "5px",
        position: "relative",
        overflow: "hidden",
        border: "2px solid #2b6eb5",
      }}
    >
      <section className='flex justify-between'>
        <div
          className='w-16 h-16'
        >
          <img
            src={`${baseUrl}/${logo}`}
            // src='https://hemisapi.ugcnepal.edu.np/Uploads/a365b13a-c159-410a-b9ea-3701a96d3779_logo.png'
            alt="Logo"
            className='w-full h-full'
          />
        </div>

        <div className='flex flex-1  flex-col gap-0'>
          <h1
            className='text-center text-xs mt-[-2px]'
          >
            Affiliated to {uniName}
          </h1>
          <h1
            className='block  text-center tracking-widest text-sm font-medium text-[#2B6EB5] mt-[-2px]'
          >
            {campusName}
          </h1>
          <h1
            className='block text-center text-[10px] mt-[-2px]'
          >
            {`${localLevel}, ${district}`}
          </h1>
          <h1
            className='text-center block text-[10px] mt-[-2px]'
          >
            Ph: {phoneNo}
          </h1>
          <h1
            className='text-center text-[#ff0000] font-medium underline text-xs mt-[-2px]'
          >
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
              <Typography
                variant="caption"
                noWrap
                sx={{ fontSize: "2.3mm" }}
              >
                <strong>Name:</strong> {student?.firstName}{" "}
                {student.middleName ? student.middleName + " " : ""}
                {student.lastName}
              </Typography>

              <Typography
                variant="caption"
                noWrap
                sx={{ fontSize: "2.3mm" }}
              >
                <strong>Level:</strong> {student?.levelName}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ fontSize: "2.3mm" }}
              >
                <strong style={{ marginRight: '5px' }}>Program:</strong>
                {student.programShortName},
                <span className="ml-1">
                  {`${student.programType === 'annual' ? `${student.year} Year` : `${student.semester} Semester`}`}
                </span>
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ fontSize: "2.3mm" }}
              >
                <strong>Phone No.:</strong> {student?.phoneNumber}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: "2.3mm" }}
              >
                <strong>Student ID:</strong> {student?.id}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ fontSize: "2.3mm" }}
              >
                <strong>Valid Upto:</strong>{" "}
                {student?.validDateNep?.slice(0, 10)}
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
                {stdPhoto ? (
                  <img
                    src={`${uploadURL}/${stdPhoto}`}
                    alt="Student Photo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <>
                    No Photo
                  </>
                )}
              </Box>

              <Box>
                {firstSignature?.uploadSignature && (
                  <img
                    style={{
                      width: '100px',
                      height: '60px',
                      marginTop: '-40px',
                      marginLeft: '-10px'
                    }}
                    src={`${uploadURL}/signatures/${firstSignature.uploadSignature}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = error_img;
                    }}
                    alt="Signature"
                  />
                )}

              </Box>

            </Box>
            <h1
              className='absolute right-[-8px] text-[10px] text-center '
            >
              Authorized Signature
            </h1>
          </Grid>
        </Grid>
      ) : (
        <Typography
          variant="caption"
          sx={{ textAlign: "center", fontSize: "3mm" }}
        >
          Loading student data...
        </Typography>
      )}
    </Paper>
  );
};

export default Landscape;