import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Select,
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Button,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { getEmployeeById } from "../../../services/employeeService";
import { getEthnicGroup } from "../../../services/services";
import useAddressData from "../../address/address";
import DateInputField from "../../DateField/DateInputField";
import BikramSambat, { ADToBS, BSToAD } from "bikram-sambat-js";

const EditEmployeeInfoContext = createContext();

const EditEmployeeInfoProvider = ({ children }) => {
  const methods = useForm();
  const [employeeInfo, setEmployeeInfo] = useState({
    salutation: "",
    employeeType: "",
    ethnicity: "",
    religion: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    citizenshipNo: "",
    dob: "",
    dobAd: "",
    citizenIssueDist: "",
    nidNo: "",
    maritalStatus: "",
    citizenFront: "",
    citizenBack: "",
    nidPic: "",
    pPsizePhoto: "",
  });
  const onChange = (event, name, value) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0];
      setEmployeeInfo((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setEmployeeInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <EditEmployeeInfoContext.Provider
      value={{ ...methods, employeeInfo, onChange }}
    >
      {children}
    </EditEmployeeInfoContext.Provider>
  );
};
const ValidationTextField = styled(TextField)({
  "& input:valid + fieldset": {
    borderColor: "#c2c2c2",
    borderWidth: 1,
  },

  "& input:valid:focus + fieldset": {
    borderLeftWidth: 4,
    padding: "4px !important", // override inline-style
  },
});
const ValidationSelect = styled(Select)({
  "& select:valid + fieldset": {
    borderColor: "#3572EF",
    borderWidth: 1,
  },
  "& select:invalid + fieldset": {
    borderColor: "#ff0000", // Custom invalid border color
    borderWidth: 1,
  },
  "& select:valid:focus + fieldset": {
    borderLeftWidth: 4,
    padding: "4px !important", // override inline-style
  },
});
const EditEmployeeGeneralInfo = ({ handleNext, handleBack, id }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useContext(EditEmployeeInfoContext);
  const [ethnicGroup, setEthnicGroup] = useState([]);
  const { onChange, employeeInfo } = useContext(EditEmployeeInfoContext);
  
  // Fetch employee data and set form values
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ethnicGroup = await getEthnicGroup();
        setEthnicGroup(ethnicGroup);
        const getEmployeeData = await getEmployeeById(id);
        
        // Extract BS and AD dates from API response
        const dobBsFromAPI = getEmployeeData.dateOFBirth?.slice(0, 10); // BS date
        const dobAdFromAPI = getEmployeeData.dateOFBirthAd?.slice(0, 10); // AD date
        
        // Set form values
        setValue("salutation", getEmployeeData.salutation);
        setValue("employeeType", getEmployeeData.employeeType);
        setValue("firstName", getEmployeeData.firstName);
        setValue("middleName", getEmployeeData.middleName);
        setValue("lastName", getEmployeeData.lastName);
        setValue("ethnicity", getEmployeeData.ethnicity);
        setValue("religion", getEmployeeData.religion);
        setValue("email", getEmployeeData.email);
        setValue("phone", getEmployeeData.phoneNumber);
        setValue("gender", getEmployeeData.gender);
        setValue("maritalStatus", getEmployeeData.maritalStatus);
        setValue("citizenshipNo", getEmployeeData.citizenshipNo);
        setValue("citizenIssueDist", getEmployeeData.ctzIssueDistrict);
        setValue("nidNo", getEmployeeData.nidNo);
        
        // Set BS date and convert to AD if needed
        if (dobBsFromAPI) {
          // Format BS date for DateInputField (YYYY-MM-DD format)
          const formattedBsDate = dobBsFromAPI;
          setValue("dob", formattedBsDate);
          onChange(null, "dob", formattedBsDate);
          
          // If AD date exists from API, use it, otherwise convert from BS
          if (dobAdFromAPI) {
            setValue("dobAd", dobAdFromAPI);
            onChange(null, "dobAd", dobAdFromAPI);
          } else {
            // Convert BS to AD
            try {
              const bsDateFormatted = dobBsFromAPI.replace(/-/g, '/');
              const convertedDate = BSToAD(bsDateFormatted);
              setValue("dobAd", convertedDate);
              onChange(null, "dobAd", convertedDate);
            } catch (error) {
              console.error("Failed to convert BS to AD during fetch:", error.message);
              setValue("dobAd", "");
              onChange(null, "dobAd", "");
            }
          }
        } else if (dobAdFromAPI) {
          // If only AD date exists, set it directly
          setValue("dobAd", dobAdFromAPI);
          onChange(null, "dobAd", dobAdFromAPI);
        }
        
      } catch (error) {
        console.log("Error fetching employee data:", error);
      }
    };
    fetchData();
  }, [id]);

  const { address } = useAddressData();

  const onSubmit = (data) => {
    handleSubmit((formData) => {
      Object.keys(formData).forEach((key) => {
        onChange("", key, formData[key]);
      });
      handleNext();
    })(data);
  };

  const onBack = (data) => {
    handleBack();
  };

  // Handle BS date change and convert to AD
  const handleDobBsChange = (newValue) => {
    onChange(null, "dob", newValue);
    setValue("dob", newValue);
    
    if (!newValue || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(newValue)) {
      onChange(null, "dobAd", "");
      setValue("dobAd", "");
      return;
    }
    
    try {
      const datePart = newValue.split('T')[0];
      const bsDateFormatted = datePart.replace(/-/g, '/');
      const convertedDate = BSToAD(bsDateFormatted);
      
      // Update both state and form value
      onChange(null, "dobAd", convertedDate);
      setValue("dobAd", convertedDate);
    } catch (error) {
      console.error("Failed to convert BS to AD:", error.message);
      onChange(null, "dobAd", "");
      setValue("dobAd", "");
    }
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
      <Grid container spacing={1}>
        <Grid item xs={12} sm={2}>
          <FormControl size="small" fullWidth>
            <InputLabel id="type" required>
              Salutation
            </InputLabel>
            <Controller
              name="salutation"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  required
                  labelId="salutation"
                  id="salutation"
                  name="salutation"
                  label="Salutation"
                  fullWidth
                >
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                  <MenuItem value="Miss">Miss.</MenuItem>
                  <MenuItem value="Profesor">Professor</MenuItem>
                  <MenuItem value="Profesor Dr.">Professor Dr.</MenuItem>
                  <MenuItem value="Dr.">Dr.</MenuItem>
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "Required" }}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="firstName"
                size="small"
                name="firstName"
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="middleName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="middleName"
                size="small"
                name="middleName"
                label="Middle Name"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Required" }}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="lastName"
                size="small"
                name="lastName"
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone Number is required",
              validate: (value) => {
                const isValidPhone = /^[9]\d{9}$/.test(value);
                return isValidPhone || "invalid phone umber";
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="phone"
                type="text"
                name="phone"
                label="Phone Number"
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
                error={!!errors.phone}
                helperText={errors.phone ? errors.phone.message : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email format not matched",
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="email"
                name="email"
                type="email"
                size="small"
                label="Email"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={1.5}>
          <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
            <InputLabel sx={{ borderColor: "blue" }} id="type">
              Gender
            </InputLabel>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              rules={{ required: "Required" }}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="gender"
                  id="gender"
                  name="gender"
                  label="Gender"
                  fullWidth
                >
                  <MenuItem value=""> </MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
            <InputLabel sx={{ borderColor: "blue" }} id="ethnicity" required>
              Ethnicity
            </InputLabel>
            <Controller
              name="ethnicity"
              control={control}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  required
                  labelId="ethnicity"
                  id="ethnicity"
                  name="ethnicity"
                  label="Ethnicity"
                  fullWidth
                  error={!!errors.ethnicity}
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value || ""}
                >
                  <MenuItem value="" disabled>
                    Select Ethnicity
                  </MenuItem>
                  {ethnicGroup &&
                    ethnicGroup.map((data) => (
                      <MenuItem key={data.id} value={data.name}>
                        {data.name}
                      </MenuItem>
                    ))}
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
            <InputLabel sx={{ borderColor: "blue" }} id="religion">
              Religion
            </InputLabel>
            <Controller
              name="religion"
              control={control}
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="religion"
                  id="religion"
                  name="religion"
                  label="Religion"
                  fullWidth
                  value={field.value || ""}
                >
                  <MenuItem value="" disabled>
                    Select Religion
                  </MenuItem>

                  <MenuItem value={"Hinduism"}>Hinduism</MenuItem>
                  <MenuItem value={"Buddhism"}>Buddhism</MenuItem>
                  <MenuItem value={"Islamic"}>Islamic</MenuItem>
                  <MenuItem value={"Sikhism"}>Sikhism</MenuItem>
                  <MenuItem value={"Kirat"}>Kirat</MenuItem>
                  <MenuItem value={"Christian"}>Christian</MenuItem>
                  <MenuItem value={"Others"}>Others</MenuItem>
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={1.5}>
          <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
            <InputLabel sx={{ borderColor: "blue" }} id="maritalStatus">
              Marital status
            </InputLabel>
            <Controller
              name="maritalStatus"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  labelId="maritalStatus"
                  id="maritalStatus"
                  name="maritalStatus"
                  label="Marital status"
                  fullWidth
                  value={field.value || ""}
                  size="small"
                >
                  <MenuItem value="" disabled>
                    Select marital status
                  </MenuItem>

                  <MenuItem value={"Married"}>Married</MenuItem>
                  <MenuItem value={"Unmarried"}>Unmarried</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="citizenshipNo"
            control={control}
            rules={{ required: "Required" }}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="citizenshipNo"
                size="small"
                name="citizenshipNo"
                label="Citizenship No"
                fullWidth
                error={!!errors.citizenshipNo}
                helperText={errors.citizenshipNo ? "Required" : ""}
              />
            )}
          />
        </Grid>
        <Grid
          display="flex"
          justifyContent="space-between"
          item
          xs={12}
          sm={2.5}
        >
          <Controller
            name="dob"
            control={control}
            defaultValue=""
            rules={{
              validate: (value) => {
                if (value) {
                  const date = new Date(value);
                  if (isNaN(date.getTime())) {
                    return "Invalid Date";
                  }
                }
                return true;
              },
            }}
            render={({ field }) => (
              <DateInputField
                {...field}
                label="Date of Birth (B.S)"
                name="dob"
                value={field.value || ""}
                onChange={(newValue) => {
                  field.onChange(newValue);
                  handleDobBsChange(newValue);
                }}
                format={"YYYY/MM/DD"}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2.5}>
          <TextField
            name="dobAd"
            size="small"
            label="Date of Birth (A.D)"
            value={employeeInfo?.dobAd || ""}
            InputProps={{ readOnly: true }}
            fullWidth
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Controller
            name="citizenIssueDist"
            control={control}
            defaultValue=""
            render={({ field }) => {
              // Extract unique districts
              const districtOptions =
                address &&
                Array.from(new Set(address.map((data) => data.district)));

              return (
                <Autocomplete
                  {...field}
                  options={districtOptions || []}
                  getOptionLabel={(option) => option || ""}
                  onChange={(_, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Issued District"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              );
            }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Controller
            name="nidNo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                id="nidNo"
                size="small"
                name="nidNo"
                label="Nid No"
                fullWidth
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end" mt={1} mb={2}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            disabled
            sx={{
              marginLeft: "10px",
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
  );
};

export { EditEmployeeInfoProvider, EditEmployeeInfoContext };
export default EditEmployeeGeneralInfo;
