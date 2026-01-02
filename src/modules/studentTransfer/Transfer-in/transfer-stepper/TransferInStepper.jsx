import {
  Box,
  Paper,
  Step,
  Grid,
  StepLabel,
  Stepper,
} from "@mui/material";
import GeneralInfo, { GeneralInfoProvider } from './GeneralInfo';
import AddressInfo, { AddressProvider } from './AddressInfo';
import GuardianInfo, { GuardianInfoProvider } from './GuardianInfo';
import RegistrationInfo, { RegistrationInfoProvider } from './RegistrationInfo';
import FinalTransferReview from './FinalTransferReview';
import { useState } from 'react';

const steps = [
  "General Information",
  "Address Information",
  "Guardian Information",
  "Program Registration",
  "Review all",
];

function TransferInStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  return (
        <>
          <GeneralInfoProvider>
            <AddressProvider>
              <GuardianInfoProvider>
                <RegistrationInfoProvider>
                  <Grid
                    sm={12}
                    lg={9}
                    direction="column"
                    container
                    sx={{ mx: "auto" }}
                  >
                    <h1 className="mt-4 mb-2 text-3xl tracking-tight text-center">
                      Student transfer-in
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
                        <GeneralInfo
                          handleNext={handleNext}
                          handleBack={handleBack}
                        />
                      )}
                      {activeStep === 1 && (
                        <AddressInfo
                          handleNext={handleNext}
                          handleBack={handleBack}
                        />
                      )}
                      {activeStep === 2 && (
                        <GuardianInfo
                          handleNext={handleNext}
                          handleBack={handleBack}
                        />
                      )}
                      {activeStep === 3 && (
                        <RegistrationInfo
                          handleNext={handleNext}
                          handleBack={handleBack}
                        />
                      )}
                      {activeStep === 4 && (
                        <FinalTransferReview
                          handleBack={handleBack}
                          handleNext={handleNext}
                        />
                      )}
                    </Box>
                  </Grid>
                </RegistrationInfoProvider>
              </GuardianInfoProvider>
            </AddressProvider>
          </GeneralInfoProvider>
        </>
  )
}

export default TransferInStepper