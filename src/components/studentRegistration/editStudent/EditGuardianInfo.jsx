import React, { useEffect } from "react";
import { Grid, Typography, TextField, Box, Button } from "@mui/material";
import { createContext, useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getStudentById } from "../../../services/employeeService";
const EditStudentGuardianContext = createContext();

const EditStudentGuardianProvider = ({ children }) => {
  const methods = useForm();
  const [editGuardianInfo, setEditGuardianInfo] = useState({
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
    setEditGuardianInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <EditStudentGuardianContext.Provider
      value={{ ...methods, editGuardianInfo, onChange }}
    >
      {children}
    </EditStudentGuardianContext.Provider>
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
const EditStudentGuardianInfo = ({ handleNext, handleBack, id }) => {
  const { control, handleSubmit, setValue } = useContext(
    EditStudentGuardianContext
  );
  const { onChange } = useContext(EditStudentGuardianContext);
  const fetchData = async () => {
    try {
      const getStudentData = await getStudentById(id);
      setValue(
        "fatherName",
        getStudentData.fatherName === "undefined" ||
          getStudentData.fatherName === "null"
          ? ""
          : getStudentData.fatherName
      );
      setValue(
        "fatherOccupation",
        getStudentData.fOccupation === "undefined" ||
          getStudentData.fOccupation === "null"
          ? ""
          : getStudentData.fOccupation
      );
      setValue(
        "fatherPhoneNo",
        getStudentData.fatherPhoneNo === "undefined" ||
          getStudentData.fatherPhoneNo === "null"
          ? ""
          : getStudentData.fatherPhoneNo
      );
      setValue(
        "fatherEmail",
        getStudentData.fatherEmail === "undefined" ||
          getStudentData.fatherEmail === "null"
          ? ""
          : getStudentData.fatherEmail
      );
      setValue(
        "motherName",
        getStudentData.motherName === "undefined" ||
          getStudentData.motherName === "null"
          ? ""
          : getStudentData.motherName
      );
      setValue(
        "motherOccupation",
        getStudentData.mOccupation === "undefined" ||
          getStudentData.mOccupation === "null"
          ? ""
          : getStudentData.mOccupation
      );
      setValue(
        "motherPhoneNo",
        getStudentData.motherPhoneNo === "undefined" ||
          getStudentData.motherPhoneNo === "null"
          ? ""
          : getStudentData.motherPhoneNo
      );
      setValue(
        "motherEmail",
        getStudentData.motherEmail === "undefined" ||
          getStudentData.motherEmail === "null"
          ? ""
          : getStudentData.motherEmail
      );
      setValue("guardianName", getStudentData.guardianName);
      setValue(
        "guardianOccupation",
        getStudentData.guardianOccupation === "undefined" ||
          getStudentData.guardianOccupation === "null"
          ? ""
          : getStudentData.guardianOccupation
      );
      setValue("guardianPhone", getStudentData.guardianPhone);
      setValue("address", getStudentData.gAddress);
      setValue(
        "guardianEmail",
        getStudentData.gEmail === "undefined" ||
          getStudentData.gEmail === "null"
          ? ""
          : getStudentData.gEmail
      );
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const onSubmit = (data) => {
    onChange("fatherName", data.fatherName || "");
    onChange("fatherOccupation", data.fatherOccupation || "");
    onChange("fatherPhoneNo", data.fatherPhoneNo || "");
    onChange("fatherEmail", data.fatherEmail || "");
    onChange("motherName", data.motherName || "");
    onChange("motherOccupation", data.motherOccupation || "");
    onChange("motherPhoneNo", data.motherPhoneNo || "");
    onChange("motherEmail", data.motherEmail || "");
    onChange("guardianName", data.guardianName || "");
    onChange("guardianOccupation", data.guardianOccupation || "");
    onChange("guardianPhone", data.guardianPhone || "");
    onChange("address", data.address || "");
    onChange("guardianEmail", data.guardianEmail || "");
    handleNext();
  };
  const onBack = () => {
    handleBack();
  };

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      onReset={onBack}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography
            textAlign="center"
            variant="subtitle1"
            sx={{ textAlign: "center", color: "#636363" }}
            mb=".8rem"
          >
            Student Guardian Info
          </Typography>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}>
            <Controller
              name="fatherName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="fatherName"
                  size="small"
                  name="fatherName"
                  label="Father's Name"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <Controller
              name="fatherOccupation"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="fatherOccupation"
                  size="small"
                  name="fatherOccupation"
                  label="Father's Occupation"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Controller
              name="fatherPhoneNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="fatherPhoneNo"
                  type="text"
                  name="fatherPhoneNo"
                  label="Father's contact no"
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
          <Grid item xs={12} sm={2.5}>
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
                  label="Father's Email"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
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
                  label="Mother's Name"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
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
                  label="Mother's Occupation"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
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
                  label="Mother's contact no"
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
          <Grid item xs={12} sm={2.5}>
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
                  label="Mother's Email"
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
                  label="Guardian's Name"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2.5}>
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
                  label="Guardian's Occupation"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="guardianPhone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  required
                  id="guardianPhone"
                  type="text"
                  name="guardianPhone"
                  label="Guardian's contact no"
                  InputProps={{
                    placeholder: "98XXXXXXXX",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    onInput: (e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10); // Limit input to 10 characters
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
              name="guardianEmail"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="guardianEmail"
                  size="small"
                  name="guardianEmail"
                  label="Guardian's Email"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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

        <Grid container direction="column" alignItems="flex-end">
          <Box mt={1} mb={2} display="flex">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onBack}
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
export { EditStudentGuardianProvider, EditStudentGuardianContext };
export default EditStudentGuardianInfo;
