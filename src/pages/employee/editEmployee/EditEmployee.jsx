import React, { useState } from "react";
import {
  Box,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditAcademyGeneralInfo from "../../../components/employeeRegister/edit/EditAcademyGeneralInfo";
import EditEmployeeAddressGeneralInfo, {
  EditAddressInfoProvider,
} from "../../../components/employeeRegister/edit/EditEmployeeAddressGeneralInfo";
import EditWorkGeneralInfo, {
  EditWorkInfoProvider,
} from "../../../components/employeeRegister/edit/EditWorkInfo";
import { EditAcademyInfoProvider } from "../../../components/employeeRegister/edit/EditAcademyGeneralInfo";
import EditEmployeeGeneralInfo, {
  EditEmployeeInfoProvider,
} from "../../../components/employeeRegister/edit/EditEmployeeGeneralInfo";
import EditBankInfo, {
  EditBankInfoProvider,
} from "../../../components/employeeRegister/edit/EditBankInfo";
import EditDetailsReview from "../../../components/employeeRegister/edit/EditDetailReview";
import { useLocation } from "react-router-dom";
const steps = [
  "General Info",
  "Address Info",
  "Work Info",
  "Academic Info",
  "Bank Info",
  "Review all",
];
export default function EditEmployeeRegister({
  id,
  setOpenEditDialog,

  handleFetch,
}) {
  const location = useLocation();
  const title = location.pathname.includes("teaching-staff")
    ? "teaching"
    : "administrator";
  const employeeType = location.pathname.includes("teaching-staff")
    ? "teaching"
    : "administrator";
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const handleClose = () => {
    setOpenEditDialog(false);
  };
  return (
    <EditEmployeeInfoProvider>
      <EditAddressInfoProvider>
        <EditWorkInfoProvider>
          <EditAcademyInfoProvider>
            <EditBankInfoProvider>
              <DialogContent sx={{ padding: "0px" }}>
                <Grid container paddingX="10px">
                  <Grid item xs={12}>
                    <Box sx={{ maxWidth: "100%", mx: "auto" }}>
                      <Box display="flex" justifyContent="flex-end" mb={1}>
                        <IconButton onClick={handleClose}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <Typography
                        textAlign="center"
                        sx={{ color: "#2A629A", mt: "-15px" }}
                      >
                        {`Edit ${title} - ${steps[activeStep]}`}
                      </Typography>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                          <Step key={label}>
                            <StepLabel>
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  color:
                                    index <= activeStep ? "#007aff" : "inherit",
                                }}
                              >
                                {label}
                              </span>
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>

                      <Box mt={2} mx={3}>
                        {activeStep === 0 && (
                          <EditEmployeeGeneralInfo
                            handleNext={handleNext}
                            handleBack={handleBack}
                            id={id}
                          />
                        )}
                        {activeStep === 1 && (
                          <EditEmployeeAddressGeneralInfo
                            handleNext={handleNext}
                            handleBack={handleBack}
                            id={id}
                          />
                        )}
                        {activeStep === 2 && (
                          <EditWorkGeneralInfo
                            handleNext={handleNext}
                            handleBack={handleBack}
                            id={id}
                            employeeType={employeeType}
                          />
                        )}
                        {activeStep === 3 && (
                          <EditAcademyGeneralInfo
                            handleNext={handleNext}
                            handleBack={handleBack}
                            id={id}
                            employeeType={employeeType}
                          />
                        )}
                        {activeStep === 4 && (
                          <EditBankInfo
                            handleNext={handleNext}
                            handleBack={handleBack}
                            id={id}
                            handleFetch={handleFetch}
                          />
                        )}
                        {activeStep === 5 && (
                          <EditDetailsReview
                            handleClose={setOpenEditDialog}
                            handleBack={handleBack}
                            id={id}
                            handleFetch={handleFetch}
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
            </EditBankInfoProvider>
          </EditAcademyInfoProvider>
        </EditWorkInfoProvider>
      </EditAddressInfoProvider>
    </EditEmployeeInfoProvider>
  );
}
