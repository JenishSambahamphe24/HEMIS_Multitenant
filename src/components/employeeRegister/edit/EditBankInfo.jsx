import React, { createContext, useContext, useEffect, useState } from "react";
import { Grid, TextField, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getEmployeeById } from "../../../services/employeeService";

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
const EditBankInfoContext = createContext();

const EditBankInfoProvider = ({ children }) => {
  const methods = useForm();
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankAc: "",
    bankBranch: "",
    panNo: "",
  });
  const onChange = (event, name, value) => {
    setBankInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <EditBankInfoContext.Provider value={{ ...methods, bankInfo, onChange }}>
      {children}
    </EditBankInfoContext.Provider>
  );
};

function EditBankInfo({ handleNext, handleBack, id }) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useContext(EditBankInfoContext);
  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser.listUser[0].roleName;
  const { onChange } = useContext(EditBankInfoContext);

  const onSubmit = (data) => {
    handleSubmit((formData) => {
      Object.keys(formData).forEach((key) => {
        onChange("", key, formData[key]);
      });
      handleNext();
    })(data);
  };
  const fetchData = async () => {
    try {
      const employeeData = await getEmployeeById(id);
      setValue("bankName", employeeData.bankName || "");
      setValue("bankAc", employeeData.bankAc || "");
      setValue("bankBranch", employeeData.bankBranch || "");
      setValue("panNo", employeeData.panNo || "");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const onBack = (data) => {
    handleBack();
  };
  return (
    <Grid
      container
      component="form"
      margin={2}
      onSubmit={handleSubmit(onSubmit)}
      onReset={() => {
        onBack();
      }}
    >
      <Grid container spacing={1} >
        <Grid item xs={12} sm={6}>
          <Controller
            name="bankName"
            control={control}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="bankName"
                size="small"
                name="bankName"
                label="Bank Name"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="bankAc"
            control={control}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="bankAc"
                size="small"
                name="bankAc"
                label="Bank Account Number"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="bankBranch"
            control={control}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="bankBranch"
                size="small"
                name="bankBranch"
                label="Branch"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="panNo"
            control={control}
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="panNo"
                size="small"
                name="panNo"
                label="PAN Number"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container direction="column" alignItems="flex-end">
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onBack}
            sx={{}}
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
  );
}
export { EditBankInfoProvider, EditBankInfoContext };
export default EditBankInfo;
