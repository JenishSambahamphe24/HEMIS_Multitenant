import React, { useState } from "react";
import { Box, Grid, Step, StepLabel, Paper, Stepper } from "@mui/material";

import EmployeeGeneralInfo, {
  EmployeeInfoProvider,
} from "./employeeGeneralInfo";
import AcademyGeneralInfo from "./AcademyGeneralInfo";
import { WorkInfoProvider } from "./Worknfo";
import { AddressInfoProvider } from "./EmployeeAdressGeneralInfo";
import { BankInfoProvider } from "./BankInfo";

import DetailsReview from "./DetailsReview";
import { AcademyInfoProvider } from "./AcademyGeneralInfo";
import EmployeeAddressGeneralInfo from "./EmployeeAdressGeneralInfo";
import WorkGeneralInfo from "./Worknfo";
import { useSearchParams } from "react-router-dom";
import BankInfo from "./BankInfo";

const steps = [
  "General Info",
  "Address Info",
  "Work Info",
  "Academic Info",
  "Bank Info",
  "Review all",
];
export default function EmployeeRegister() {
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams] = useSearchParams();
  const employeeType = searchParams.get("employeeType");

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  return (
    <>
      <EmployeeInfoProvider>
        <AddressInfoProvider>
          <WorkInfoProvider>
            <AcademyInfoProvider>
              <BankInfoProvider>
                <Grid
                  sm={12}
                  md={10}
                  lg={9}
                  direction="column"
                  container
                  sx={{ mx: "auto" }}
                >
                  {employeeType === "administrator" ? (
                    <h1 className="mt-4 mb-2 text-3xl tracking-tight text-center">
                      Non-teaching staff registration
                    </h1>
                  ) : employeeType === "ugcadmin" ? (
                    <h1 className="mt-4 mb-2 text-3xl tracking-tight text-center">
                      UGC Employee registration
                    </h1>
                  ) : (
                    <h1 className="mt-4 mb-2 text-3xl tracking-tight text-center">
                      Teaching staff registration
                    </h1>
                  )}

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
                              color: index <= activeStep ? "#003285" : "inherit",
                            }}
                          >
                            {label}
                          </span>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  <Box
                    component={Paper}
                    elevation={1}
                    padding="25px 20px"
                    mt={2}
                    mb={3}
                  >
                    {activeStep === 0 && (
                      <EmployeeGeneralInfo
                        handleNext={handleNext}
                        handleBack={handleBack}
                        employeeType={employeeType}
                      />
                    )}
                    {activeStep === 1 && (
                      <EmployeeAddressGeneralInfo
                        handleNext={handleNext}
                        handleBack={handleBack}
                      />
                    )}
                    {activeStep === 2 && (
                      <WorkGeneralInfo
                        handleNext={handleNext}
                        handleBack={handleBack}
                        employeeType={employeeType}
                      />
                    )}
                    {activeStep === 3 && (
                      <AcademyGeneralInfo
                        handleNext={handleNext}
                        handleBack={handleBack}
                        employeeType={employeeType}
                      />
                    )}
                    {activeStep === 4 && (
                      <BankInfo
                        handleNext={handleNext}
                        handleBack={handleBack}
                      />
                    )}
                    {activeStep === 5 && (
                      <DetailsReview
                        handleBack={handleBack}
                        employeeType={employeeType}
                      />
                    )}
                  </Box>
                  <Grid item xs={false} md={2} />
                </Grid>
              </BankInfoProvider>
            </AcademyInfoProvider>
          </WorkInfoProvider>
        </AddressInfoProvider>
      </EmployeeInfoProvider>
    </>
  );
}
