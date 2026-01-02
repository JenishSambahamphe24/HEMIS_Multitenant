import {
  Box,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import  { useState } from "react";
import { StudentInfoProvider } from "./StudentGeneralInfo";
import StudentGeneralInfo from "./StudentGeneralInfo";
import StudentAddressInfo, {
  StudentAddressProvider,
} from "./StudentAddressInfo";
import StudentGuardianInfo, {
  StudentGuardianProvider,
} from "./StudentGuardianInfo";
import ReviewDetails from "./ReviewStudentsInfo";
import StudentRegistration, { StudentRegProvider } from "./StudentRegstration";

const steps = [
  "General Information",
  "Address Information",
  "Guardian Information",
  "Program Registration",
  "Review all",
];

export default function StudentRegister() {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  
  return (
    <>
      <StudentInfoProvider>
        <StudentAddressProvider>
          <StudentGuardianProvider>
            <StudentRegProvider>
              <Grid
                sm={12}
                lg={9}
                direction="column"
                container
                sx={{ mx: "auto" }}
              >
                <h1 className="mt-4 mb-2 text-3xl tracking-tight text-center">
                  Student Registration
                </h1>
                <h1 className="text-lg text-center tracking-tight text-[#2b6eb5]">
                  {steps[activeStep]}
                </h1>
                <Stepper
                  style={{ marginTop: "10px", marginBottom: "-15px" }}
                  activeStep={activeStep}
                  alternativeLabel
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel>
                        <span
                          style={{
                            color: index <= activeStep ? "#2b6eb5" : "inherit",
                          }}
                        >
                          <h1 className="text-md">{label}</h1>
                        </span>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box
                  component={Paper}
                  elevation={1}
                  padding="10px 20px"
                  mt={2}
                  mb={3}
                >
                  {activeStep === 0 && (
                    <StudentGeneralInfo
                      handleNext={handleNext}
                      handleBack={handleBack}
                    />
                  )}
                  {activeStep === 1 && (
                    <StudentAddressInfo
                      handleNext={handleNext}
                      handleBack={handleBack}
                    />
                  )}
                  {activeStep === 2 && (
                    <StudentGuardianInfo
                      handleNext={handleNext}
                      handleBack={handleBack}
                    />
                  )}
                  {activeStep === 3 && (
                    <StudentRegistration
                      handleNext={handleNext}
                      handleBack={handleBack}
                    />
                  )}
                  {activeStep === 4 && (
                    <ReviewDetails
                      handleBack={handleBack}
                      handleNext={handleNext}
                    />
                  )}
                  {/* {activeStep === 5 && (
                    <StudentAcademicInfo
                      handleBack={handleBack}
                      studentId={studentId}
                    />
                  )} */}
                </Box>
              </Grid>
            </StudentRegProvider>
          </StudentGuardianProvider>
        </StudentAddressProvider>
      </StudentInfoProvider>
    </>
  );
}
