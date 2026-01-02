import  { useEffect } from "react";
import {
  Grid,
  TextField,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { createContext, useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import  {  BSToAD } from "bikram-sambat-js";
import useAddressData from "../../../../components/address/address";
import { getEthnicGroup } from "../../../../services/services";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import BikramSambatDateInput from "../../../../components/DateField/DateInputField";
const GeneralInfoContext = createContext();

const GeneralInfoProvider = ({ children }) => {
  const methods = useForm();
  const [studentInfo, setStudentInfo] = useState({
    nepaliName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: 0,
    dobBs: "",
    dobAd: "",
    gender: "",
    ethnicity: "",
    edg: false,
    isMuktaKamaiya: false,
    nationality: "",
    disabilityStatus: "",
    disabilityType: "",
    email: "",
    religion: "",
    citizenshipNo: "",
    issuedDist: "",
    citizenFront: "",
    citizenBack: "",
    nidNo: "",
    nidPic: "",
    ppSizePhoto: "",
    isFromMartyrFamily: false,
    digitalSignature: "",
  });

  const getLogoURL = () => {
    return studentInfo.ppSizePhoto
      ? URL.createObjectURL(studentInfo.ppSizePhoto)
      : "";
  };
  const onChange = (event, name, value) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0];
      setStudentInfo((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setStudentInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  return (
    <GeneralInfoContext.Provider
      value={{ ...methods, studentInfo, onChange, getLogoURL }}
    >
      {children}
    </GeneralInfoContext.Provider>
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
  datePicker: {
    "& .MuiTextField-root": {
      width: 20,
    },
  },
});
const GeneralInfo = ({ handleNext, handleBack }) => {
  const { address } = useAddressData();
  const [ethnicGroup, setEthnicGroup] = useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useContext(GeneralInfoContext);
  const { studentInfo, onChange } = useContext(GeneralInfoContext);
  const disabilityStatus = watch("disabilityStatus");

  const onSubmit = (data) => {
    handleSubmit((formData) => {
      Object.keys(formData).forEach((key) => {
        onChange(null, key, formData[key]);
      });
      handleNext();
    })(data);
  };

  const onBack = () => {
    handleBack();
  };
  const fetchData = async () => {
    try {
      const response = await getEthnicGroup();
      setEthnicGroup(response);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  // const handleDobBsChange = (newValue) => {
  //   const convertedDate = BSToAD(newValue);
  //   onChange("", "dobBs", newValue);
  //   onChange("", "dobAd", convertedDate);
  // };

  
    const handleDobBsChange = (newValue) => {
      onChange(null, "dobBs", newValue);
  
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
      <Grid container>
        <Grid mt=".5rem" container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Controller
              name="nepaliName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  required
                  {...field}
                  id="nepaliName"
                  size="small"
                  name="nepaliName"
                  label="विद्यार्थीको नाम देवनागरीमा (unicode)"
                  fullWidth
                />
              )}
            />
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
                  label="First Name (Eng)"
                  fullWidth
                  inputProps={{ style: { textTransform: "uppercase" } }}
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
                  inputProps={{ style: { textTransform: "uppercase" } }}
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
                  label="Last Name (Eng)"
                  fullWidth
                  inputProps={{ style: { textTransform: "uppercase" } }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="phone"
              control={control}
              // rules={{
              //   validate: (value) => {
              //     if (!value) return true;

              //     const isValidPhone = /^[9]\d{9}$/.test(value);
              //     return isValidPhone || "invalid phone umber";
              //   },
              // }}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="phone"
                  type="text"
                  name="phone"
                  label="Mobile Number"
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
                  autoComplete="Mobile number"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="email"
              control={control}
              // rules={{
              //   pattern: {
              //     value: /\S+@\S+\.\S+/,
              //     message: "Email format not matched",
              //   },
              // }}
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

          <Grid
            display="flex"
            justifyContent="space-between"
            item
            xs={12}
            sm={2.5}
          >
            <Controller
              name="dobBs"
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
                  name="dobBs"
                  format={"YYYY/MM/DD"}
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
              value={studentInfo?.dobAd || ""}
              InputProps={{ readOnly: true }}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel sx={{ borderColor: "blue" }} id="gender" required>
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
              <InputLabel sx={{ borderColor: "blue" }} id="type">
                Nationality
              </InputLabel>
              <Controller
                name="nationality"
                control={control}
                rules={{ required: "Required" }}
                defaultValue="nepali"
                render={({ field }) => (
                  <ValidationSelect
                    {...field}
                    labelId="nationality"
                    id="nationality"
                    name="nationality"
                    label="Nationality"
                    fullWidth
                    error={!!errors.nationality}
                    helperText={
                      errors.nationality ? errors.nationality.message : ""
                    }
                  >
                    <MenuItem value="" disabled>
                      Select Nationality{" "}
                    </MenuItem>
                    <MenuItem value="nepali">Nepali</MenuItem>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel
                sx={{ borderColor: "blue" }}
                id="disabilityStatusLabel"
                required
              >
                Disability Status
              </InputLabel>
              <Controller
                name="disabilityStatus"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    required
                    labelId="disabilityStatusLabel"
                    id="disabilityStatus"
                    fullWidth
                    label="Dissability Status"
                  >
                    <MenuItem value="" disabled>
                      Select Disability Status{" "}
                    </MenuItem>
                    <MenuItem value="able">Able</MenuItem>
                    <MenuItem value="differentlyable">
                      Differently-Able
                    </MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl sx={{ borderColor: "blue" }} size="small" fullWidth>
              <InputLabel
                sx={{ borderColor: "blue" }}
                id="disabilityType"
                required
              >
                Disability Type
              </InputLabel>
              <Controller
                name="disabilityType"
                control={control}
                defaultValue=""
                disabled={disabilityStatus === "able"}
                render={({ field }) => (
                  <Select
                    {...field}
                    required = {disabilityStatus === "differentlyable"}
                    labelId="disabilityType"
                    id="disabilityType"
                    fullWidth
                    label="Dissability Type"
                  >
                    <MenuItem value="" disabled>
                      अपाङ्गता प्रकार{" "}
                    </MenuItem>
                    <MenuItem value="A">क</MenuItem>
                    <MenuItem value="B">ख</MenuItem>
                    <MenuItem value="C">ग</MenuItem>
                    <MenuItem value="D">घ</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="citizenshipNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ValidationTextField
                  {...field}
                  id="citizenshipNo"
                  size="small"
                  name="citizenshipNo"
                  label="Citizenship No"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="issuedDist"
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
          <Grid item xs={12} sm={4}>
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
                  label="NID No."
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item sm={3}>
            <FormGroup>
              <Controller
                name="edg"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Belong to EDG?"
                    sx={{
                      color: "#5a5b5d",
                      "& .MuiFormControlLabel-label": {
                        color: "#5a5b5d",
                      },
                    }}
                  />
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item sm={4}>
            <FormGroup>
              <Controller
                name="isMuktaKamaiya"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Belong To Mukta Kamaiya?"
                    sx={{
                      color: "#5a5b5d",
                      "& .MuiFormControlLabel-label": {
                        color: "#5a5b5d",
                      },
                    }}
                  />
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item sm={5}>
            <FormGroup>
              <Controller
                name="isFromMartyrFamily"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Belong to Martyr's/conflict affetcted Family?"
                    sx={{
                      color: "#5a5b5d",
                      "& .MuiFormControlLabel-label": {
                        color: "#5a5b5d",
                      },
                    }}
                  />
                )}
              />
            </FormGroup>
          </Grid>
        </Grid>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="error"
            size="small"
            type="submit"
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
    </Grid>
  );
};
export { GeneralInfoProvider, GeneralInfoContext };
export default GeneralInfo;
