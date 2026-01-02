import {
  Box,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
  DialogContent, IconButton
} from "@mui/material";
import  { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditStudentGeneralInfo, { EditStudentInfoProvider } from "./EditGeneralInfo";
import EditStudentAddressInfo, { EditStudentAddressProvider } from "./EditStudentAddressInfo";
import EditStudentGuardianInfo, { EditStudentGuardianProvider } from "./EditGuardianInfo";
import EditStudentRegistrationInfo, { EditStudentRegProvider } from "./EditStudentRegistration";
import EditReviewDetails from "./EditReviewStudentInfo";

const steps = [
  "General Info",
  "Address Info",
  "Guardian Info",
  "Registration",
  "Review all",
];

export default function EditStudentRegister({ id, onClose, onUpdate, handleEditDialogClose, isTransferredIn }) {

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const handleRegisterSuccess = (id) => {
    handleNext();
  };
  return (
    <EditStudentInfoProvider>
      <EditStudentAddressProvider>
        <EditStudentGuardianProvider>
          <EditStudentRegProvider>
            <DialogContent sx={{ padding: '0px' }}>
              <Grid container paddingX='10px' >
                <Grid
                  item
                  xs={12}
                >
                  <Box sx={{ maxWidth: '100%', mx: "auto" }}>
                    <Box display="flex" justifyContent="flex-end" mb={1}>
                      <IconButton onClick={onClose}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="h6"
                      textAlign="center"
                      sx={{ color: "#2A629A", mt: '-15px' }}
                    >
                      Edit student Info - {steps[activeStep]}
                    </Typography>
                    <Stepper activeStep={activeStep} alternativeLabel>
                      {steps.map((label, index) => (
                        <Step key={label}>
                          <StepLabel>
                            <span
                              style={{
                                color: index <= activeStep ? "#2b6eb5" : "inherit",
                              }}
                            >
                              {label}
                            </span>
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    <Box mt={2} mx={0}>
                      {activeStep === 0 && (<EditStudentGeneralInfo
                        handleNext={handleNext}
                        handleBack={handleBack}
                        id={id}
                      />
                      )}
                      {activeStep === 1 && (<EditStudentAddressInfo
                        handleNext={handleNext}
                        handleBack={handleBack}
                        id={id}
                      />
                      )}
                      {activeStep === 2 && (<EditStudentGuardianInfo
                        handleNext={handleNext}
                        handleBack={handleBack}
                        id={id} />)}

                      {activeStep === 3 && (
                        <EditStudentRegistrationInfo
                          isTransferredIn={isTransferredIn}
                          handleNext={handleNext}
                          handleBack={handleBack}
                          id={id}
                        />)}
                      {activeStep === 4 && <EditReviewDetails handleBack={handleBack} id={id} handleEditDialogClose={handleEditDialogClose} isTransferredIn={isTransferredIn} onUpdate={onUpdate}
                        onRegisterSuccess={handleRegisterSuccess}
                      />}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={false} md={2} />
              </Grid>
            </DialogContent>
          </EditStudentRegProvider>
        </EditStudentGuardianProvider>
      </EditStudentAddressProvider>
    </EditStudentInfoProvider>
  );
}
