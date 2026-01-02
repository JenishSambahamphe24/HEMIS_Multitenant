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
import ImageUploader from "../Reusable-component/ImageUploader";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import DateInputField from "../DateField/DateInputField";
import useAddressData from "../address/address";
// import { getEthnicGroup } from "../../services/services";
import { getEthnicGroup } from "../../services/employeeService";
import { useSelector } from "react-redux";
import useFileSizeLimit from "../../hooks/useFileSizeLimit";
import BikramSambat, { ADToBS, BSToAD } from "bikram-sambat-js";
import BikramSambatDateInput from "../DateField/DateInputField";

const EmployeeInfoContext = createContext();

const EmployeeInfoProvider = ({ children }) => {
  const methods = useForm();
  const [employeeInfo, setEmployeeInfo] = useState({
    salutation: "",
    employeeType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    citizenshipNo: "",
    dobBS: "",
    religion: "",
    dobAd: "",
    citizenIssueDist: "",
    nidNo: "",
    maritalStatus: "",
    citizenFront: "",
    citizenBack: "",
    nidPic: "",
    pPsizePhoto: "",
  });
  const getLogoURL = () => {
    return employeeInfo.pPsizePhoto
      ? URL.createObjectURL(employeeInfo.pPsizePhoto)
      : null;
  };
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
    <EmployeeInfoContext.Provider
      value={{ ...methods, employeeInfo, onChange, getLogoURL }}
    >
      {children}
    </EmployeeInfoContext.Provider>
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
const ValidationSelect = styled(Select)({
  "& select:valid + fieldset": {
    borderColor: "#3572EF",
    borderWidth: 1,
  },
  "& select:invalid + fieldset": {
    borderColor: "#ff0000",
    borderWidth: 1,
  },
  "& select:valid:focus + fieldset": {
    borderLeftWidth: 4,
    padding: "4px !important",
  },
});
const EmployeeGeneralInfo = ({ handleNext, handleBack, employeeType }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useContext(EmployeeInfoContext);

  const { currentUser } = useSelector((state) => state.user);
  const roleName = currentUser.listUser[0].roleName;
  const { onChange, employeeInfo } = useContext(EmployeeInfoContext);
  const { address } = useAddressData();
  const [ethnicGroup, setEthnicGroup] = useState([]);
  const { isValid, error, validateFileSize } = useFileSizeLimit(5);

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEthnicGroup();
        setEthnicGroup(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

   const handleDobBsChange = (newValue) => {
     onChange(null, "dobBS", newValue);
     if (!newValue || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(newValue)) {
       onChange(null, "dobAd", "");
       return;
     }
     try {
       const datePart = newValue.split('T')[0]; 
       const bsDateFormatted = datePart.replace(/-/g, '/'); 
       const convertedDate = BSToAD(bsDateFormatted);
       onChange(null, "dobAd", convertedDate);
     } catch (error) {
       console.error("Failed to convert BS to AD:", error.message);
       onChange(null, "dobAd", "");
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
        <Grid item xs={12} sm={3}>
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
                  <MenuItem value="Assoc Prof Dr.">Assoc Prof Dr.</MenuItem>
                </ValidationSelect>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                required
                {...field}
                id="firstName"
                size="small"
                name="firstName"
                label="First Name"
                fullWidth
                onChange={(e) => {
                  field.onChange(e.target.value.trim());
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
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
                onChange={(e) => {
                  field.onChange(e.target.value.trim());
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="lastName"
                size="small"
                name="lastName"
                label="Last Name"
                fullWidth
                onChange={(e) => {
                  field.onChange(e.target.value.trim());
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Invalid Phone Number",
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="phone"
                type="text"
                name="phone"
                label="Mobile Number"
                InputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*", 
                  onInput: (e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
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
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email format not matched",
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required
                id="email"
                name="email"
                type="email"
                size="small"
                label="Email"
                fullWidth
                onChange={(e) => {
                  field.onChange(e.target.value.trim());
                }}
                error={!!errors.email}
                helperText={errors.email && errors.email.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
            <InputLabel sx={{ borderColor: "blue" }} id="type" required>
              Gender
            </InputLabel>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationSelect
                  {...field}
                  required
                  labelId="gender"
                  id="gender"
                  name="gender"
                  label="Gender"
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select Gender
                  </MenuItem>
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
        <Grid
          display="flex"
          justifyContent="space-between"
          item
          xs={12}
          sm={2.5}
        >
          <Controller
            name="dobBS"
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
              <BikramSambatDateInput
                {...field}
                label="Date of Birth (B.S)"
                format={"YYYY/MM/DD"}
                name="dobBS"
                value={field.value || ""}
                onChange={(newValue) => {
                  field.onChange(newValue);
                  handleDobBsChange(newValue);
                }}
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
            defaultValue=""
            render={({ field }) => (
              <ValidationTextField
                {...field}
                required={roleName !== "Admin"}
                id="citizenshipNo"
                size="small"
                name="citizenshipNo"
                label="Citizenship No"
                fullWidth
                onChange={(e) => {
                  field.onChange(e.target.value.trim());
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
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

        <Grid item xs={12} sm={2}>
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
                label="NID No"
                fullWidth
              />
            )}
          />
        </Grid>
        {/*         
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl>
            <ImageUploader
              allowMultiple={false}
              onImagesChange={(newImages) => {
                if (newImages.length > 0) {
                  onChange(null, "pPsizePhoto", newImages[0]);
                } else {
                  onChange(null, "pPsizePhoto", null);
                }
              }}
              name="pPsizePhoto"
              placeholder="Passport size photo"
            />
            {error && <span>{error}</span>}
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl>
            <ImageUploader
              allowMultiple={false}
              onImagesChange={(newImages) => {
                if (newImages.length > 0) {
                  onChange(null, "citizenFront", newImages[0]);
                } else {
                  onChange(null, "citizenFront", null);
                }
              }}
              name="citizenFront"
              placeholder="Citizenship Front"
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl>
            <ImageUploader
              allowMultiple={false}
              onImagesChange={(newImages) => {
                if (newImages.length > 0) {
                  onChange(null, "citizenBack", newImages[0]);
                } else {
                  onChange(null, "citizenBack", null);
                }
              }}
              name="citizenBack"
              placeholder="Citizenship Back"
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl>
            <ImageUploader
              allowMultiple={false}
              onImagesChange={(newImages) => {
                if (newImages.length > 0) {
                  onChange(null, "nidPic", newImages[0]);
                } else {
                  onChange(null, "nidPic", null);
                }
              }}
              name="nidPic"
              placeholder="National Id Image"
            />
          </FormControl>
        </Grid> */}
      </Grid>
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          color="error"
          size="small"
          disabled
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
  );
};

export { EmployeeInfoProvider, EmployeeInfoContext };
export default EmployeeGeneralInfo;
