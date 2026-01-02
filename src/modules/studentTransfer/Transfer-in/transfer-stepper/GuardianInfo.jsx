import React from "react";
import { Grid, TextField, Box, Button } from "@mui/material";
import { createContext, useContext, useState } from "react";

import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
const GuardianInfoContext = createContext();

const GuardianInfoProvider = ({ children }) => {
  const methods = useForm();
  const [guardianInfo, setGuardianInfo] = useState({
    fatherName: "",
    fatherOccupation: "",
    fatherPhoneNo: "",
    fatherEmail: "",
    motherName: "",
    motherOccupation: "",
    motherPhoneNo: "",
    motherEmail: "",
    guardianName: "",
    guardianOccupation: "",
    guardianPhone: "",
    address: "",
    guardianEmail: "",
  });
  const onChange = (name, value) => {
    setGuardianInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <GuardianInfoContext.Provider
      value={{ ...methods, guardianInfo, onChange }}
    >
      {children}
    </GuardianInfoContext.Provider>
  );
};
const ValidationTextField = styled(TextField)({
  "& input:valid + fieldset": {
    borderColor: "#c2c2c2",
    borderWidth: 1,
  },

  "& input:valid:focus + fieldset": {
    borderLeftWidth: 4,
    padding: "4px !important", 
  },
});
const GuardianInfo = ({ handleNext, handleBack }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useContext(GuardianInfoContext);
  const { onChange } = useContext(GuardianInfoContext);
  const onSubmit = (data) => {
    onChange("fatherName", data.fatherName);
    onChange("fatherOccupation", data.fatherOccupation);
    onChange("fatherPhoneNo", data.fatherPhoneNo);
    onChange("fatherEmail", data.fatherEmail);
    onChange("motherName", data.motherName);
    onChange("motherOccupation", data.motherOccupation);
    onChange("motherPhoneNo", data.motherPhoneNo);
    onChange("motherEmail", data.motherEmail);
    onChange("guardianName", data.guardianName);
    onChange("guardianOccupation", data.guardianOccupation);
    onChange("guardianPhone", data.guardianPhone);
    onChange("address", data.address);
    onChange("guardianEmail", data.guardianEmail);

    handleNext();
  };
  const onBack = (data) => {
    handleBack(data); 
  };

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      onReset={() => {
        onBack();
      }}
    >
      <Grid container>
        <Grid mt='.5rem' container spacing={1}>
          <Grid item xs={12} sm={3}>
            <Controller
              name="fatherName"
              control={control}
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="fatherName"
                  size="small"
                  name="fatherName"
                  label="Father Name"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="fatherOccupation"
              control={control}
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="fatherOccupation"
                  size="small"
                  name="fatherOccupation"
                  label="Father Occupation"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="fatherPhoneNo"
              control={control}
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="fatherPhoneNo"
                  type="text"
                  name="fatherPhoneNo"
                  label="Father Phone Number"
                  InputProps={{
                    placeholder: "98XXXXXXXX",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    onInput: (e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                    },
                  }}
                  fullWidth
                  autoComplete="phone number"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="fatherEmail"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  id="fatherEmail"
                  size="small"
                  name="fatherEmail"
                  label="Father Email"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="motherName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="motherName"
                  size="small"
                  name="motherName"
                  label="Mother Name"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="motherOccupation"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="motherOccupation"
                  size="small"
                  name="motherOccupation"
                  label="Mother Occupation"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="motherPhoneNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="motherPhoneNo"
                  type="text"
                  name="motherPhoneNo"
                  label="Mother Phone Number"
                  InputProps={{
                    placeholder: "98XXXXXXXX",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    onInput: (e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                    },
                  }}
                  fullWidth
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="motherEmail"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="motherEmail"
                  name="motherEmail"
                  type="email"
                  size="small"
                  label="Mother Email"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="guardianName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  required
                  id="guardianName"
                  size="small"
                  name="guardianName"
                  label="Guardian Name"
                  fullWidth

                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="guardianOccupation"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="guardianOccupation"
                  size="small"
                  name="guardianOccupation"
                  label="Guardain Occupation"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="guardianPhone"
              control={control}
              rules={{
                validate: (value) => {
                  const isValidPhone = /^[\d-]{7,15}$/.test(value); // Adjusted validation
                  return isValidPhone || "Invalid phone number";
                },
              }}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  required
                  id="guardianPhone"
                  type="text"
                  name="guardianPhone"
                  label="Guardian Phone"
                  InputProps={{
                    inputMode: "numeric", // Numeric keyboard for mobile
                    pattern: "[0-9\\-]*", // Updated to allow numbers and hyphens
                  }}
                  fullWidth
                  size="small"
                  error={!!errors.guardianPhone}
                  helperText={
                    errors.guardianPhone ? errors.guardianPhone.message : ""
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="guardianEmail"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="guardianEmail"
                  name="guardianEmail"
                  type="email"
                  size="small"
                  label="Email"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  required
                  id="address"
                  size="small"
                  name="address"
                  label="Address"
                  fullWidth

                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="flex-start">
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onBack}
              sx={{

              }}
              startIcon={<ChevronLeftRoundedIcon />}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              size="small"
              type="submit"
              sx={{
                marginLeft: "10px",
              }}
              endIcon={<ChevronRightRoundedIcon />}
            >
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};
export { GuardianInfoProvider, GuardianInfoContext };
export default GuardianInfo;
